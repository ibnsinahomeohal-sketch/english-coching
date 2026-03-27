import React, { useState, useEffect } from "react";
import { Trophy, CheckCircle, XCircle, FileQuestion, Calendar, ArrowRight, Award } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function StudentExams() {
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    const fetchExams = async () => {
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
        // Fetch exams for this student's course and batch (or all batches)
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
    };

    fetchExams();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 50) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <PageHero 
        title="My Exams & Quizzes"
        subtitle="View your exam results and performance"
        icon={FileQuestion}
        darkColor="#831843"
        badge="Exams"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="circles" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="3" fill="#fbcfe8" fillOpacity="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circles)" />
          </svg>
        }
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <FileQuestion className="h-6 w-6" />
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {exam.status || 'Completed'}
                  </span>
                </div>
                
                <h3 className="font-bold text-slate-900 text-xl leading-tight mb-2">{exam.title}</h3>
                
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-6">
                  <Calendar className="h-4 w-4" />
                  {exam.date || 'Recent'}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold mb-1">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xl">{exam.correct || 0}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correct</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-rose-600 font-bold mb-1">
                      <XCircle className="h-4 w-4" />
                      <span className="text-xl">{exam.wrong || 0}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wrong</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 p-6 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Final Score</p>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-black text-lg ${getScoreColor(exam.score || 0)}`}>
                    {exam.score || 0}%
                  </div>
                </div>
                <button className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50 transition-colors shadow-sm">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

          {exams.length === 0 && (
            <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Exams Taken Yet</h3>
              <p className="text-slate-500 max-w-md mx-auto">Your exam results will appear here once you complete them. Keep studying!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
