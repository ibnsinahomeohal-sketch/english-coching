import React, { useState, useEffect } from "react";
import { Clock, Calendar, Video, MapPin, Users, BookOpen } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function StudentClassSchedule() {
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    const fetchSchedule = async () => {
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
        // Fetch schedule for this student's course and batch
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
    };

    fetchSchedule();
  }, []);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Group schedules by day (mock grouping since we don't have day in DB yet)
  // In a real app, you'd group by the 'day' column from the database
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <PageHero 
        title="My Class Schedule"
        subtitle="View your upcoming class timings and links"
        icon={Calendar}
        darkColor="#312e81"
        badge="Schedule"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="calendar" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="2" y="2" width="16" height="16" fill="none" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#calendar)" />
          </svg>
        }
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-indigo-600" />
                Weekly Timetable
              </h3>
              <p className="text-sm text-slate-500 mt-1">Your regular class schedule for the enrolled courses.</p>
            </div>
            <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 border border-indigo-100">
              <Clock className="h-4 w-4" />
              Current Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
            {schedules.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Classes Scheduled</h3>
                <p className="text-slate-500 max-w-md mx-auto">You don't have any classes scheduled at the moment. Check back later or contact administration.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {schedules.map((schedule, index) => (
                  <div key={schedule.id || index} className="relative pl-8 sm:pl-0">
                    {/* Timeline line for mobile */}
                    <div className="absolute left-[11px] top-2 bottom-[-24px] w-0.5 bg-slate-100 sm:hidden last:hidden"></div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 group">
                      {/* Time Column (Desktop) / Dot (Mobile) */}
                      <div className="sm:w-32 shrink-0 flex sm:flex-col items-center sm:items-end sm:text-right pt-1 relative">
                        <div className="absolute left-[-29px] sm:hidden h-6 w-6 rounded-full bg-indigo-100 border-4 border-white flex items-center justify-center z-10">
                          <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                        </div>
                        <span className="text-lg font-black text-slate-900">{schedule.time?.split('-')[0]?.trim() || schedule.time}</span>
                        {schedule.time?.includes('-') && (
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
                            to {schedule.time.split('-')[1]?.trim()}
                          </span>
                        )}
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group-hover:-translate-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-indigo-100">
                                {schedule.batch}
                              </span>
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-emerald-100">
                                Regular Class
                              </span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-1">{schedule.course}</h4>
                            <p className="text-sm text-slate-500 flex items-center gap-1.5">
                              <BookOpen className="h-4 w-4" />
                              Main Curriculum
                            </p>
                          </div>
                          
                          <div className="flex flex-col gap-2 shrink-0">
                            {schedule.link ? (
                              <a 
                                href={schedule.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                              >
                                <Video className="h-4 w-4" />
                                Join Class
                              </a>
                            ) : (
                              <div className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-sm font-bold">
                                <MapPin className="h-4 w-4" />
                                In Person
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:flex items-center gap-4 sm:gap-6 pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Users className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">Batch {schedule.batch}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">{schedule.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
