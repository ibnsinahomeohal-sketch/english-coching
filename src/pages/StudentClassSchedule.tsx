import React, { useState, useEffect } from "react";
import { Clock, Calendar, Video, MapPin, Users, BookOpen, Sparkles, Target, Activity, ChevronRight, Search, Filter, Timer } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export default function StudentClassSchedule() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
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
            .from("class_schedule")
            .select("*")
            .eq("course_id", studentData.course_id)
            .eq("batch_id", studentData.batch_id);

          if (error) {
            console.error("Error fetching schedule:", error);
            toast.error("Could not load schedule.");
          } else {
            setSchedules(data || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Premium Header Section */}
      <div className="relative bg-slate-900 pt-24 pb-40 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
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
                <Calendar className="h-4 w-4" />
                Timetable
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tight mb-4 leading-tight">
                Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-emerald-400 italic">Schedule</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-xl">
                Stay organized with your weekly class timings and access live sessions directly.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2.5rem] text-center min-w-[200px]"
            >
              <Clock className="h-8 w-8 text-primary-light mx-auto mb-4 animate-pulse" />
              <p className="text-4xl font-display font-black text-white mb-1">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Time</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        {/* Schedule Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/5">
                <Calendar className="h-6 w-6" />
              </div>
              Weekly Timetable
            </h3>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100">
                <Activity className="h-4 w-4" />
                Live Updates
              </div>
            </div>
          </div>
          
          <div className="p-10">
            {loading ? (
              <div className="space-y-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-8 animate-pulse">
                    <div className="md:w-40 h-12 bg-slate-100 rounded-2xl"></div>
                    <div className="flex-1 h-48 bg-slate-100 rounded-[2.5rem]"></div>
                  </div>
                ))}
              </div>
            ) : schedules.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="h-32 w-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-dashed border-slate-200">
                  <Calendar className="h-12 w-12 text-slate-300" />
                </div>
                <h3 className="text-3xl font-display font-black text-slate-900 mb-4 tracking-tight">No Classes Scheduled</h3>
                <p className="text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
                  You don't have any classes scheduled at the moment. Check back later or contact administration.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-12">
                {schedules.map((schedule, index) => (
                  <motion.div 
                    key={schedule.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                      {/* Time Column */}
                      <div className="md:w-40 shrink-0 flex md:flex-col items-center md:items-end md:text-right pt-4">
                        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl mb-2 md:mb-0 shadow-lg shadow-slate-900/10">
                          <span className="text-2xl font-display font-black tracking-tight">
                            {schedule.time?.split('-')[0]?.trim() || schedule.time}
                          </span>
                        </div>
                        {schedule.time?.includes('-') && (
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            to {schedule.time.split('-')[1]?.trim()}
                          </span>
                        )}
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500 group-hover:-translate-y-2 border-l-[6px] border-l-primary relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                          <div>
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                              <span className="bg-primary/5 text-primary text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest border border-primary/10 shadow-sm">
                                Batch {schedule.batch}
                              </span>
                              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest border border-emerald-100 shadow-sm">
                                Regular Class
                              </span>
                            </div>
                            <h4 className="text-3xl font-display font-black text-slate-900 mb-3 tracking-tight group-hover:text-primary transition-colors">
                              {schedule.course}
                            </h4>
                            <div className="flex items-center gap-4 text-slate-400 font-bold text-sm">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary/40" />
                                Main Curriculum
                              </div>
                              <div className="h-1 w-1 bg-slate-200 rounded-full"></div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary/40" />
                                Batch {schedule.batch}
                              </div>
                            </div>
                          </div>
                          
                          <div className="shrink-0">
                            {schedule.link ? (
                              <a 
                                href={schedule.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-4 bg-primary text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:translate-y-0 group/btn"
                              >
                                <Video className="h-6 w-6 animate-pulse" />
                                Join Live Class
                                <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                              </a>
                            ) : (
                              <div className="inline-flex items-center justify-center gap-4 bg-slate-50 text-slate-500 px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest border border-slate-200 shadow-sm">
                                <MapPin className="h-6 w-6" />
                                In-Person Session
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap items-center gap-8">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                              <Timer className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                              <p className="text-sm font-black text-slate-900">{schedule.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                              <Target className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                              <p className="text-sm font-black text-emerald-500">Active Session</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

