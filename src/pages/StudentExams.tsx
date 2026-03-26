import React, { useState, useEffect } from "react";
import { Trophy, CheckCircle, XCircle, FileQuestion } from "lucide-react";
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
        // Fetch exams for this student's course and batch
        const { data, error } = await supabase
          .from("exams")
          .select("*")
          .eq("course_id", studentData.course_id)
          .eq("batch_id", studentData.batch_id);

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(26, 7, 20, 0.06)' }}>
      <PageHero 
        title="My Exams & Quizzes"
        subtitle="View your exam results and performance"
        icon={FileQuestion}
        darkColor="#1a0714"
        badge="Exams"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="circles" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="3" fill="#db2777" fillOpacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circles)" />
          </svg>
        }
      />
      <div className="max-w-4xl mx-auto pb-8 pt-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" /> 
              Exam Results
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Exam Title</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Score</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Correct</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Wrong</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{exam.title}</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">{exam.score}%</td>
                    <td className="px-6 py-4 text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> {exam.correct}
                    </td>
                    <td className="px-6 py-4 text-rose-600 flex items-center gap-1">
                      <XCircle className="h-4 w-4" /> {exam.wrong}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        {exam.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {exams.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No exam results available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
