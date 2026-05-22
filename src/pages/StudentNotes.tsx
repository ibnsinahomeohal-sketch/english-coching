import React, { useState, useEffect } from "react";
import { FileText, Image as ImageIcon, Download, Search, BookOpen, ExternalLink, Sparkles, Filter, ArrowRight, Clock, Calendar, Book, GraduationCap, ChevronRight } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export default function StudentNotes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAssignment, setActiveAssignment] = useState<any>(null);
  const [pdfConfig, setPdfConfig] = useState<any>(null);
  const [isFilteringPdf, setIsFilteringPdf] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const sessionStr = localStorage.getItem('studentSession');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      fetchStudentDetails(session.studentId);
    }
  }, []);

  const fetchStudentDetails = async (id: string) => {
    const { data } = await supabase.from('students').select('*, batches(name)').eq('student_id', id).single();
    if (data) {
      setStudentInfo(data);
      fetchAssignments(data.batches?.name);
    }
  };

  const fetchAssignments = async (batchName?: string) => {
    // Get Config
    const { data: config } = await supabase.from('pdf_config').select('*').single();
    if (config) setPdfConfig(config);

    // Get relevant assignment
    const { data: assignments } = await supabase
      .from('pdf_assignments')
      .select('*')
      .or(`batch_name.eq.${batchName},batch_name.eq.All`)
      .order('created_at', { ascending: false });

    if (assignments && assignments.length > 0) {
      const bestMatch = assignments[0];
      // Check if unlock expired
      if (bestMatch.is_unlocked && bestMatch.unlock_expires_at) {
        if (new Date() > new Date(bestMatch.unlock_expires_at)) {
          bestMatch.is_unlocked = false;
        }
      }
      setActiveAssignment(bestMatch);
    }
  };

  const handleSmartView = async () => {
    if (!pdfConfig?.file_url || !activeAssignment) {
      toast.error("Resource not available for your batch yet.");
      return;
    }

    setIsFilteringPdf(true);
    try {
      // 1. Log analytics
      await supabase.from('pdf_analytics').insert([{
        student_id: studentInfo?.student_id,
        student_name: studentInfo?.name,
        assignment_id: activeAssignment.id
      }]);

      // 2. Load PDF
      const { PDFDocument, rgb, StandardFonts, degrees } = await import('pdf-lib');
      const existingPdfBytes = await fetch(pdfConfig.file_url).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const newPdfDoc = await PDFDocument.create();
      
      const start = Math.max(1, activeAssignment.visible_pages_start);
      const end = activeAssignment.is_unlocked ? pdfDoc.getPageCount() : Math.min(pdfDoc.getPageCount(), activeAssignment.visible_pages_end);
      
      const pagesToCopy = Array.from({ length: (end - start + 1) }, (_, i) => start - 1 + i);
      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pagesToCopy);
      
      const fontBold = await newPdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await newPdfDoc.embedFont(StandardFonts.Helvetica);

      copiedPages.forEach((page, idx) => {
        const { width, height } = page.getSize();
        
        // --- 1. Replace Footer Branding ---
        // Draw white box over existing footer area
        page.drawRectangle({
          x: 0,
          y: 0,
          width: width,
          height: 45,
          color: rgb(1, 1, 1),
        });

        // Add user branding
        page.drawText(pdfConfig.coaching_name || 'English Therapy', {
          x: 40,
          y: 25,
          size: 14,
          font: fontBold,
          color: rgb(79/255, 70/255, 229/255), // Indigo
        });

        page.drawText(`${pdfConfig.teacher_name || 'Expert'} • ${pdfConfig.contact_number || ''}`, {
          x: 40,
          y: 12,
          size: 8,
          font: fontRegular,
          color: rgb(100/255, 116/255, 139/255),
        });

        // --- 2. Add Student Watermark ---
        const watermarkText = `${studentInfo?.name || 'STUDENT'} - ${studentInfo?.mobile || 'PRIVATE'}`;
        page.drawText(watermarkText, {
          x: 50,
          y: height - 100,
          size: 40,
          font: fontBold,
          color: rgb(0.8, 0.8, 0.8),
          opacity: 0.1,
          rotate: degrees(-45),
        });

        newPdfDoc.addPage(page);
      });
      
      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      toast.success(`Success! Custom PDF for ${studentInfo?.name} generated.`);
    } catch (error: any) {
      console.error(error);
      toast.error("PDF Processing failed. Ensure the source URL is accessible.");
    } finally {
      setIsFilteringPdf(false);
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const sessionStr = localStorage.getItem('studentSession');
        if (!sessionStr) {
          setLoading(false);
          return;
        }
        
        const session = JSON.parse(sessionStr);
        const studentId = session.studentId;

        const { data: studentData } = await supabase
          .from("students")
          .select("course_id, batch_id")
          .eq("student_id", studentId)
          .single();

        if (studentData) {
          const { data, error } = await supabase
            .from("notes")
            .select("*")
            .eq("course_id", studentData.course_id)
            .or(`batch_id.eq.${studentData.batch_id},batch_id.is.null`);

          if (error) {
            console.error("Error fetching notes:", error);
            toast.error("Could not load notes.");
          } else {
            setNotes(data || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || note.file_type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Premium Header Section */}
      <div className="relative bg-slate-900 pt-24 pb-40 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center md:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-primary-light text-sm font-bold mb-6 tracking-wider uppercase">
                <Sparkles className="h-4 w-4" />
                Study Materials
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tight mb-4 leading-tight">
                Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-accent italic">Notes</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-xl">
                Access all your study materials, lecture notes, and resources in one place.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2.5rem] text-center min-w-[180px]"
            >
              <p className="text-5xl font-display font-black text-primary-light mb-1">{notes.length}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Resources</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        {/* Special Spoken English Section */}
        {activeAssignment && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 p-1.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 rounded-[3rem] shadow-2xl overflow-hidden group"
          >
            <div className="bg-slate-950 rounded-[2.8rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                {activeAssignment.is_unlocked ? (
                  <span className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-slate-950 text-xs font-black rounded-full animate-bounce shadow-xl">
                    <Clock className="h-4 w-4" /> FULL ACCESS UNLOCKED (10M)
                  </span>
                ) : (
                  <span className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-indigo-300 text-xs font-black rounded-full border border-white/10 backdrop-blur-md">
                    <BookOpen className="h-4 w-4" /> PAGES {activeAssignment.visible_pages_start} - {activeAssignment.visible_pages_end}
                  </span>
                )}
              </div>

              <div className="flex-1 text-center md:text-left relative z-10">
                <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-4 tracking-tighter leading-tight">
                  {pdfConfig?.coaching_name || 'Spoken English'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 italic">Mastery</span>
                </h2>
                <p className="text-slate-400 text-lg font-medium max-w-lg mb-8 leading-relaxed">
                  Hi {studentInfo?.name}, here is your personal copy of <span className="text-white font-bold">{activeAssignment.title}</span>. Content is watermarked for your security.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-5">
                  <button 
                    onClick={handleSmartView}
                    disabled={isFilteringPdf}
                    className="px-10 py-5 bg-white text-slate-950 font-black rounded-[1.5rem] hover:bg-slate-100 transition-all flex items-center gap-4 active:scale-95 disabled:opacity-50 shadow-xl shadow-white/5 group/btn"
                  >
                    <Book className="h-6 w-6 text-indigo-600 group-hover/btn:rotate-12 transition-transform" />
                    {isFilteringPdf ? "PREPARING PREMIUM PDF..." : "GENERATE MY PDF"}
                  </button>
                </div>
              </div>
              
              <div className="hidden lg:flex w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-700">
                <FileText className="h-32 w-32 text-indigo-500/30" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Search and Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-4 shadow-xl border border-slate-200 mb-12 flex flex-col md:flex-row items-center gap-4"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-slate-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {["all", "pdf", "image", "doc"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap",
                  activeFilter === filter 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl animate-pulse">
                <div className="h-16 w-16 bg-slate-100 rounded-3xl mb-8"></div>
                <div className="h-6 bg-slate-100 rounded-full w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-100 rounded-full w-1/2 mb-8"></div>
                <div className="flex gap-4">
                  <div className="h-12 flex-1 bg-slate-100 rounded-2xl"></div>
                  <div className="h-12 flex-1 bg-slate-100 rounded-2xl"></div>
                </div>
              </div>
            ))
          ) : filteredNotes.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note, index) => (
                <motion.div 
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-2"
                >
                  <div className="p-8 flex-1">
                    <div className="flex justify-between items-start mb-8">
                      <div className={cn(
                        "h-16 w-16 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg",
                        note.file_type === 'pdf' ? 'bg-rose-50 text-rose-600 shadow-rose-100' : 'bg-blue-50 text-blue-600 shadow-blue-100'
                      )}>
                        {note.file_type === 'pdf' ? <FileText className="h-8 w-8" /> : <ImageIcon className="h-8 w-8" />}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-slate-100">
                          {note.file_type || 'Document'}
                        </span>
                        {note.is_new && (
                          <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest animate-pulse">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-display font-black text-slate-900 text-xl leading-tight mb-4 line-clamp-2 group-hover:text-primary transition-colors" title={note.title}>
                      {note.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="flex items-center gap-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border border-primary/10">
                        <Book className="h-3 w-3" />
                        {note.course}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border border-slate-100">
                        <Calendar className="h-3 w-3" />
                        {note.date || 'Recent'}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center gap-4">
                    <a 
                      href={note.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 hover:text-primary hover:border-primary/30 px-6 py-4 rounded-2xl transition-all text-xs font-black uppercase tracking-widest shadow-sm group/btn"
                    >
                      <ExternalLink className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      View
                    </a>
                    <a 
                      href={note.file_url} 
                      download
                      className="flex-1 flex items-center justify-center gap-3 bg-primary text-white hover:bg-primary-dark px-6 py-4 rounded-2xl transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 group/btn"
                    >
                      <Download className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      Get
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full bg-white rounded-[3rem] border border-slate-200 p-20 text-center shadow-xl"
            >
              <div className="h-32 w-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-dashed border-slate-200">
                <BookOpen className="h-12 w-12 text-slate-300" />
              </div>
              <h3 className="text-3xl font-display font-black text-slate-900 mb-4 tracking-tight">No Materials Found</h3>
              <p className="text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
                {searchQuery 
                  ? `We couldn't find any resources matching "${searchQuery}". Try a different search term.`
                  : "Study materials and notes will appear here once they are uploaded by your instructors."}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-8 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-3 mx-auto"
                >
                  Clear Search
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

