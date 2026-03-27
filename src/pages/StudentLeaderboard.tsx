import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award, Star, TrendingUp } from "lucide-react";
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

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-slate-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return <span className="font-bold text-slate-400 w-6 text-center">#{index + 1}</span>;
    }
  };

  const getRankBg = (index: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'bg-indigo-50 border-indigo-200 shadow-sm';
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 shadow-sm';
      case 1:
        return 'bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200';
      case 2:
        return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200';
      default:
        return 'bg-white border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <PageHero 
        title="Batch Leaderboard"
        subtitle={`See how you rank in ${student?.batch || 'your batch'}`}
        icon={Trophy}
        darkColor="#4c1d95"
        badge="Leaderboard"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="trophies" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 5 5 L 15 5 L 15 8 C 15 12 5 12 5 8 Z M 10 8 L 10 15 M 7 15 L 13 15" fill="none" stroke="#ddd6fe" strokeWidth="1" strokeOpacity="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#trophies)" />
          </svg>
        }
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Current Student Rank Card */}
        {student && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg mb-8 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <Trophy className="h-8 w-8 text-yellow-300" />
              </div>
              <div>
                <p className="text-indigo-100 font-medium mb-1">Your Current Rank</p>
                <div className="flex items-end gap-3">
                  <h2 className="text-4xl font-black">#{leaderboard.findIndex(s => s.student_id === student.student_id) + 1}</h2>
                  <span className="text-indigo-200 font-medium mb-1">out of {leaderboard.length}</span>
                </div>
              </div>
            </div>
            <div className="relative z-10 text-right hidden sm:block">
              <p className="text-indigo-100 font-medium mb-1">Total Points</p>
              <div className="flex items-center gap-2 justify-end">
                <Star className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                <span className="text-3xl font-black">{student.points || 0}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Top Performers in {student?.batch}
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {leaderboard.map((s, index) => {
              const isCurrentUser = s.student_id === student?.student_id;
              return (
                <div 
                  key={s.student_id} 
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.01] ${getRankBg(index, isCurrentUser)}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 flex justify-center">
                      {getRankIcon(index)}
                    </div>
                    <div className="relative">
                      <img 
                        src={s.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random`} 
                        alt={s.name} 
                        className={`w-12 h-12 rounded-full object-cover border-2 ${isCurrentUser ? 'border-indigo-500' : 'border-white shadow-sm'}`} 
                      />
                      {isCurrentUser && (
                        <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                          YOU
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-bold ${isCurrentUser ? 'text-indigo-900' : 'text-slate-900'} text-lg leading-tight`}>
                        {s.name}
                      </h4>
                      <p className="text-sm text-slate-500 font-medium mt-0.5">{s.exams_taken || 0} Exams Taken</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-xl border border-slate-100/50">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-black text-slate-900 text-lg">{s.points || 0}</span>
                    <span className="text-xs text-slate-400 font-bold uppercase">pts</span>
                  </div>
                </div>
              );
            })}
            {leaderboard.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">No data available</h3>
                <p className="text-slate-500">The leaderboard will update once students start earning points.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
