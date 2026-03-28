import React, { useState, useEffect } from "react";
import { Trophy, CheckCircle, XCircle, FileQuestion, Calendar, ArrowRight, Award, Sparkles, Target, Activity, Clock, ChevronRight, Search, Filter } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export default function StudentExams() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
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
            .from("exams")
            .select("*")
            .eq("course_id", studentData.course_id)
            .or(`batch_id.eq.${studentData.batch_id},batch_id.is.null`);

          if (error) {
            console.error("Error fetching exams:", error);
            toast.error("Could not load exams.");
          } else {
            setExams(data || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    if (score >= 70) return 'text-blue-500 bg-blue-50 border-blue-100';
    if (score >= 50) return 'text-amber-500 bg-amber-50 border-amber-100';
    return 'text-rose-500 bg-rose-50 border-rose-100';
  };

  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Premium Header Section */}
      <div className="relative bg-slate-900 pt-24 pb-40 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center md:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent text-sm font-bold mb-6 tracking-wider uppercase">
                <Trophy className="h-4 w-4" />
                Performance
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tight mb-4 leading-tight">
                Exams & <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-400 italic">Results</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-xl">
                Track your academic progress and review your performance across all assessments.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2.5rem] text-center min-w-[180px]"
            >
              <p className="text-5xl font-display font-black text-accent mb-1">{exams.length}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Exams</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-4 shadow-xl border border-slate-200 mb-12"
        >
          <div className="relative w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search exams by title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-slate-900 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
            />
          </div>
        </motion.div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl animate-pulse">
                <div className="h-16 w-16 bg-slate-100 rounded-3xl mb-8"></div>
                <div className="h-8 bg-slate-100 rounded-full w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-100 rounded-full w-1/2 mb-8"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-slate-100 rounded-3xl"></div>
                  <div className="h-20 bg-slate-100 rounded-3xl"></div>
                </div>
              </div>
            ))
          ) : filteredExams.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredExams.map((exam, index) => (
                <motion.div 
                  key={exam.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-2"
                >
                  <div className="p-8 flex-1">
                    <div className="flex justify-between items-start mb-8">
                      <div className="h-16 w-16 bg-accent/5 text-accent rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-accent/10">
                        <FileQuestion className="h-8 w-8" />
                      </div>
                      <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-slate-100">
                        {exam.status || 'Completed'}
                      </span>
                    </div>
                    
                    <h3 className="font-display font-black text-slate-900 text-2xl leading-tight mb-3 group-hover:text-accent transition-colors tracking-tight">
                      {exam.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">
                      <Calendar className="h-3.5 w-3.5" />
                      {exam.date || 'Recent'}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-5 text-center group-hover:bg-white transition-colors">
                        <div className="flex items-center justify-center gap-2 text-emerald-500 font-black mb-1">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-2xl font-display">{exam.correct || 0}</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct</p>
                      </div>
                      <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-5 text-center group-hover:bg-white transition-colors">
                        <div className="flex items-center justify-center gap-2 text-rose-500 font-black mb-1">
                          <XCircle className="h-4 w-4" />
                          <span className="text-2xl font-display">{exam.wrong || 0}</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wrong</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Final Score</p>
                      <div className={cn(
                        "inline-flex items-center gap-2 px-5 py-2 rounded-2xl font-display font-black text-xl border shadow-sm",
                        getScoreColor(exam.score || 0)
                      )}>
                        {exam.score || 0}%
                      </div>
                    </div>
                    <button className="h-14 w-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all shadow-sm group-hover:shadow-md group/btn">
                      <ArrowRight className="h-6 w-6 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
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
                <Award className="h-12 w-12 text-slate-300" />
              </div>
              <h3 className="text-3xl font-display font-black text-slate-900 mb-4 tracking-tight">No Exams Found</h3>
              <p className="text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
                {searchQuery 
                  ? `We couldn't find any results matching "${searchQuery}".`
                  : "Your exam results will appear here once you complete them. Keep studying and give your best!"}
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

