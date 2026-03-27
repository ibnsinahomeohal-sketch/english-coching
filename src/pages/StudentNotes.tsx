import React, { useState, useEffect } from "react";
import { FileText, Image as ImageIcon, Download, Search, BookOpen, ExternalLink } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function StudentNotes() {
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const sessionStr = localStorage.getItem('studentSession');
      if (!sessionStr) return;
      
      const session = JSON.parse(sessionStr);
      const studentId = session.studentId;

      // Fetch student details
      const { data: studentData } = await supabase
        .from("students")
        .select("course_id, batch_id")
        .eq("student_id", studentId)
        .single();

      if (studentData) {
        // Fetch notes for this student's course and batch (or all batches)
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
    };

    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <PageHero 
        title="Course Notes"
        subtitle="View and download your study materials"
        icon={FileText}
        darkColor="#0f766e"
        badge="Notes"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="files" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 5 2 L 15 2 L 15 18 L 5 18 Z" fill="none" stroke="#99f6e4" strokeWidth="1" strokeOpacity="0.4" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#files)" />
          </svg>
        }
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <div key={note.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 ${note.file_type === 'pdf' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                    {note.file_type === 'pdf' ? <FileText className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {note.file_type || 'Document'}
                  </span>
                </div>
                
                <h3 className="font-bold text-slate-900 text-lg leading-tight mb-3 line-clamp-2" title={note.title}>{note.title}</h3>
                
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-4">
                  <span className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg border border-teal-100">{note.course}</span>
                  <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200">{note.date || 'Recent'}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex items-center justify-between gap-3">
                <a 
                  href={note.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50 px-4 py-2.5 rounded-xl transition-colors text-sm font-bold shadow-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  View
                </a>
                <a 
                  href={note.file_url} 
                  download
                  className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white hover:bg-teal-700 px-4 py-2.5 rounded-xl transition-colors text-sm font-bold shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Notes Available</h3>
              <p className="text-slate-500 max-w-md mx-auto">Study materials and notes will appear here once they are uploaded by your instructors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
