import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award, Star } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";

export default function StudentLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const sessionStr = localStorage.getItem('studentSession');
      if (!sessionStr) return;
      
      const session = JSON.parse(sessionStr);
      const studentId = session.studentId;

      const { data: studentData } = await supabase
        .from("students")
        .select("*")
        .eq("student_id", studentId)
        .single();

      if (studentData) {
        setStudent(studentData);

        // Fetch leaderboard for the same batch
        const { data: students } = await supabase
          .from("students")
          .select("*")
          .eq("batch_id", studentData.batch_id)
          .order("points", { ascending: false });

        setLeaderboard(students || []);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(15, 10, 30, 0.06)' }}>
      <PageHero 
        title="Batch Leaderboard"
        subtitle={`See how you rank in ${student?.batch || 'your batch'}`}
        icon={Trophy}
        darkColor="#0f0a1e"
        badge="Leaderboard"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="trophies" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 5 5 L 15 5 L 15 8 C 15 12 5 12 5 8 Z M 10 8 L 10 15 M 7 15 L 13 15" fill="none" stroke="#4c1d95" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#trophies)" />
          </svg>
        }
      />
      <div className="max-w-4xl mx-auto pb-8 pt-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="font-bold text-gray-900">Top Performers in {student?.batch}</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {leaderboard.map((s, index) => (
              <div key={s.student_id} className={`flex items-center justify-between p-4 ${s.student_id === student?.student_id ? 'bg-indigo-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center font-bold text-gray-400">
                    #{index + 1}
                  </div>
                  <img src={s.photo || "/default-avatar.png"} alt={s.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  <div>
                    <h4 className="font-bold text-gray-900">{s.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">{s.exams_taken || 0} Exams Taken</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-black text-gray-900">{s.points || 0}</span>
                  <span className="text-xs text-gray-500 font-medium">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
