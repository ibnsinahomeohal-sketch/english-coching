import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award, Star, TrendingUp, Users, Crown, Target, Zap, ArrowUpRight } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence } from "motion/react";

export default function StudentLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const sessionStr = localStorage.getItem('studentSession');
      if (!sessionStr) {
        setLoading(false);
        return;
      }
      
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
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-8 w-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />;
      case 1:
        return <Medal className="h-7 w-7 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]" />;
      case 2:
        return <Medal className="h-7 w-7 text-amber-600 drop-shadow-[0_0_8px_rgba(180,83,9,0.5)]" />;
      default:
        return <span className="font-display font-black text-slate-400 w-8 text-center text-lg">#{index + 1}</span>;
    }
  };

  const getRankBg = (index: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'bg-primary/5 border-primary/20 ring-1 ring-primary/10';
    switch (index) {
      case 0:
        return 'bg-yellow-50/30 border-yellow-200/50';
      case 1:
        return 'bg-slate-50/30 border-slate-200/50';
      case 2:
        return 'bg-orange-50/30 border-orange-200/50';
      default:
        return 'bg-white/40 border-slate-200/40';
    }
  };

  const userRank = leaderboard.findIndex(s => s.student_id === student?.student_id) + 1;
  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Calculating rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Premium Header Section */}
      <div className="relative bg-slate-900 pt-24 pb-40 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-primary-light text-sm font-bold mb-6 tracking-wider uppercase">
              <Crown className="h-4 w-4" />
              Hall of Fame
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tight mb-6 leading-tight">
              Batch <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-accent italic">Leaderboard</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              Compete with your peers in <span className="text-white font-bold">{student?.batch || 'your batch'}</span> and climb to the top of the rankings.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
          {/* 2nd Place */}
          {topThree[1] && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="order-2 md:order-1"
            >
              <div className="glass-dark border-slate-700/50 p-6 rounded-[2.5rem] text-center relative group hover:border-slate-500/50 transition-all">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="h-12 w-12 rounded-2xl bg-slate-700 flex items-center justify-center border-2 border-slate-500 shadow-lg">
                    <Medal className="h-6 w-6 text-slate-300" />
                  </div>
                </div>
                <div className="mt-4 mb-4 relative inline-block">
                  <img 
                    src={topThree[1].photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[1].name)}&background=random`} 
                    alt={topThree[1].name}
                    className="h-20 w-20 rounded-3xl object-cover border-4 border-slate-700 shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-slate-700 border-2 border-slate-500 flex items-center justify-center text-white font-black text-xs">
                    2
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-1 truncate px-2">{topThree[1].name}</h3>
                <div className="flex items-center justify-center gap-2 text-slate-400 font-bold">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>{topThree[1].points || 0} pts</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="order-1 md:order-2"
            >
              <div className="bg-gradient-to-b from-primary/20 to-primary/5 backdrop-blur-xl border-2 border-primary/30 p-8 rounded-[3rem] text-center relative group hover:border-primary/50 transition-all transform hover:-translate-y-2">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="h-16 w-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center border-2 border-white/30 shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                  >
                    <Trophy className="h-8 w-8 text-white" />
                  </motion.div>
                </div>
                <div className="mt-6 mb-6 relative inline-block">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                  <img 
                    src={topThree[0].photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[0].name)}&background=random`} 
                    alt={topThree[0].name}
                    className="h-28 w-28 rounded-[2rem] object-cover border-4 border-primary shadow-2xl relative z-10"
                  />
                  <div className="absolute -bottom-3 -right-3 h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 border-4 border-slate-900 flex items-center justify-center text-white font-black text-sm relative z-20">
                    1
                  </div>
                </div>
                <h3 className="text-white font-black text-2xl mb-2 truncate px-2">{topThree[0].name}</h3>
                <div className="flex items-center justify-center gap-2 text-primary-light font-black text-lg">
                  <Star className="h-5 w-5 fill-primary-light" />
                  <span>{topThree[0].points || 0} pts</span>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-light text-[10px] font-black uppercase tracking-widest border border-primary/30">
                  Current Champion
                </div>
              </div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="order-3"
            >
              <div className="glass-dark border-slate-700/50 p-6 rounded-[2.5rem] text-center relative group hover:border-slate-500/50 transition-all">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="h-12 w-12 rounded-2xl bg-amber-900/50 flex items-center justify-center border-2 border-amber-700/50 shadow-lg">
                    <Medal className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4 mb-4 relative inline-block">
                  <img 
                    src={topThree[2].photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[2].name)}&background=random`} 
                    alt={topThree[2].name}
                    className="h-20 w-20 rounded-3xl object-cover border-4 border-amber-900/30 shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-amber-900 border-2 border-amber-700 flex items-center justify-center text-white font-black text-xs">
                    3
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-1 truncate px-2">{topThree[2].name}</h3>
                <div className="flex items-center justify-center gap-2 text-slate-400 font-bold">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>{topThree[2].points || 0} pts</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* User Stats Card */}
        {student && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl mb-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">Your Performance</p>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-4xl font-black text-slate-900">#{userRank}</span>
                    <span className="text-slate-400 font-bold ml-2">Rank</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200"></div>
                  <div>
                    <span className="text-4xl font-black text-slate-900">{student.points || 0}</span>
                    <span className="text-slate-400 font-bold ml-2">Points</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <div className="px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-center min-w-[120px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exams</p>
                <p className="text-xl font-black text-slate-900">{student.exams_taken || 0}</p>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-center min-w-[120px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Homework</p>
                <p className="text-xl font-black text-slate-900">{student.homework_completed || 0}</p>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-center min-w-[120px]">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Next Rank</p>
                <p className="text-xl font-black text-primary">-{leaderboard[userRank - 2] ? leaderboard[userRank - 2].points - student.points : 0} pts</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-display font-black text-slate-900 flex items-center gap-3 text-2xl tracking-tight">
                <TrendingUp className="h-6 w-6 text-primary" />
                Full Rankings
              </h3>
              <p className="text-slate-500 font-medium mt-1">Showing all students in your batch</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm">
              <Users className="h-4 w-4" />
              {leaderboard.length} Students
            </div>
          </div>

          <div className="p-4 sm:p-8">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {leaderboard.map((s, index) => {
                  const isCurrentUser = s.student_id === student?.student_id;
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={s.student_id} 
                      className={`flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 rounded-3xl border transition-all hover:shadow-md group ${getRankBg(index, isCurrentUser)}`}
                    >
                      <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto mb-4 sm:mb-0">
                        <div className="w-10 flex justify-center shrink-0">
                          {getRankIcon(index)}
                        </div>
                        <div className="relative shrink-0">
                          <img 
                            src={s.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random`} 
                            alt={s.name} 
                            className={`w-14 h-14 rounded-2xl object-cover border-2 transition-transform group-hover:scale-110 ${isCurrentUser ? 'border-primary' : 'border-white shadow-sm'}`} 
                          />
                          {isCurrentUser && (
                            <div className="absolute -top-2 -right-2 bg-primary text-white text-[8px] font-black px-2 py-1 rounded-full border-2 border-white shadow-sm uppercase tracking-tighter">
                              YOU
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className={`font-display font-black truncate ${isCurrentUser ? 'text-primary' : 'text-slate-900'} text-lg sm:text-xl tracking-tight`}>
                            {s.name}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                              <Zap className="h-3 w-3 text-primary" />
                              {s.exams_taken || 0} Exams
                            </span>
                            <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                              <Award className="h-3 w-3 text-accent" />
                              {s.homework_completed || 0} HW
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm group-hover:border-primary/30 transition-colors">
                            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                            <span className="font-display font-black text-slate-900 text-xl">{s.points || 0}</span>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">pts</span>
                          </div>
                        </div>
                        <button className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all group-hover:translate-x-1">
                          <ArrowUpRight className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {leaderboard.length === 0 && (
                <div className="text-center py-20">
                  <div className="h-24 w-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <Trophy className="h-12 w-12 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-display font-black text-slate-900 mb-2">No Rankings Yet</h3>
                  <p className="text-slate-500 font-medium max-w-xs mx-auto">The leaderboard will update once students start earning points from exams and homework.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

