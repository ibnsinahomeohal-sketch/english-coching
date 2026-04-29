import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, BookOpen, Clock, Award, FileText, ArrowRight, 
  Calendar, TrendingUp, BrainCircuit, Sparkles, ChevronRight, 
  GraduationCap, Trophy, Activity 
} from "lucide-react";
import { PageHero } from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState({ homework: 0, exams: 0, notes: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const sessionStr = localStorage.getItem('studentSession');
      if (!sessionStr) return;
      
      const session = JSON.parse(sessionStr);
      const studentId = session.studentId;

      const { data: studentData } = await supabase
        .from("students")
        .select('*')
        .eq("student_id", studentId)
        .single();

      if (studentData) {
        let currentCourseId = studentData.course_id;
        let currentBatchId = studentData.batch_id;

        // Fallback: If IDs are missing but names exist, look them up
        if (!currentCourseId && studentData.course) {
          const { data: cData } = await supabase.from('courses').select('id').eq('name', studentData.course).single();
          if (cData) currentCourseId = cData.id;
        }
        if (!currentBatchId && studentData.batch) {
          const { data: bData } = await supabase.from('batches').select('id').eq('name', studentData.batch).single();
          if (bData) currentBatchId = bData.id;
        }

        setStudent({
          ...studentData,
          courseName: studentData.course,
          batchName: studentData.batch,
          course_id: currentCourseId,
          batch_id: currentBatchId
        });

        // Use resolved IDs for counts
        let homeworkCount = 0;
        let examCount = 0;
        let notesCount = 0;

        if (currentCourseId) {
          const { count: hCount } = await supabase
            .from("homework")
            .select("*", { count: 'exact', head: true })
            .eq("course_id", currentCourseId)
            .or(`batch_id.eq.${currentBatchId},batch_id.is.null`);
          homeworkCount = hCount || 0;

          const { count: eCount } = await supabase
            .from("exams")
            .select("*", { count: 'exact', head: true })
            .eq("course_id", currentCourseId)
            .or(`batch_id.eq.${currentBatchId},batch_id.is.null`);
          examCount = eCount || 0;

          const { count: nCount } = await supabase
            .from("notes")
            .select("*", { count: 'exact', head: true })
            .eq("course_id", currentCourseId)
            .or(`batch_id.eq.${currentBatchId},batch_id.is.null`);
          notesCount = nCount || 0;
        }

        setStats({
          homework: homeworkCount,
          exams: examCount,
          notes: notesCount
        });
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-12 pb-20 relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -ml-48 -mb-48 animate-pulse delay-1000 pointer-events-none" />

      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-[3.5rem] bg-primary p-12 md:p-16 text-white shadow-2xl shadow-primary/20 group">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-white/20 transition-colors duration-700" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] -ml-32 -mb-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 mb-8"
            >
              <Sparkles className="h-5 w-5 text-secondary animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-secondary-light">Welcome Back</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-black tracking-tight mb-6 leading-[1.1]"
            >
              Hello, <span className="italic text-secondary">{student?.name?.split(' ')[0] || 'Student'}!</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-primary-light/80 font-bold text-xl max-w-xl leading-relaxed mb-10"
            >
              You're making incredible progress. Ready to dive back into your <span className="text-white underline decoration-secondary/50 underline-offset-8">learning journey</span> today?
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4"
            >
              <Link to="/student/homework" className="px-10 py-5 bg-secondary text-primary font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-2xl shadow-secondary/30 hover:-translate-y-1 active:translate-y-0 flex items-center gap-3 group">
                Continue Learning
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/student/schedule" className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10">
                View Schedule
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="relative shrink-0"
          >
            <div className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-[4rem] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 p-8 flex flex-col items-center justify-center text-center shadow-2xl group-hover:rotate-3 transition-transform duration-700">
              <div className="h-24 w-24 bg-secondary rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-secondary/40 group-hover:scale-110 transition-transform duration-500">
                <GraduationCap className="h-12 w-12 text-primary" />
              </div>
              <p className="text-5xl font-display font-black text-white mb-2">85%</p>
              <p className="text-primary-light/60 font-black uppercase tracking-widest text-xs">Course Progress</p>
              <div className="w-full h-2 bg-white/10 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-secondary w-[85%] rounded-full shadow-[0_0_10px_rgba(255,193,7,0.5)]"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Daily Quiz Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="group relative overflow-hidden rounded-[3.5rem] bg-gradient-to-r from-secondary to-secondary-dark p-12 text-primary shadow-2xl shadow-secondary/20"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8 text-center lg:text-left flex-col lg:flex-row">
            <div className="h-24 w-24 bg-primary/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-primary/10 shadow-2xl animate-float">
              <BrainCircuit className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h2 className="text-4xl font-display font-black mb-3 tracking-tight">Daily Challenge</h2>
              <p className="text-primary/80 max-w-xl font-bold text-lg">
                Sharpen your skills with 50 fresh questions every day. Score 17+ to earn prestige points!
              </p>
            </div>
          </div>
          <Link 
            to="/student/daily-quiz" 
            className="w-full lg:w-auto px-12 py-6 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-primary-dark transition-all hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            Start Challenge <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { label: "Pending Homework", value: stats.homework, icon: Clock, color: "primary", link: "/student/homework", badge: "Action Required" },
          { label: "Exams Taken", value: stats.exams, icon: Award, color: "secondary", link: "/student/my-exams", badge: "Completed" },
          { label: "Study Notes", value: stats.notes, icon: FileText, color: "accent", link: "/student/notes", badge: "Available" }
        ].map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="group bg-white/80 backdrop-blur-xl p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="flex justify-between items-start mb-10">
              <div className={cn(
                "h-20 w-20 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg",
                stat.color === 'primary' ? "bg-primary/5 text-primary shadow-primary/10" :
                stat.color === 'secondary' ? "bg-secondary/5 text-secondary shadow-secondary/10" :
                "bg-accent/5 text-accent shadow-accent/10"
              )}>
                <stat.icon className="h-10 w-10" />
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full",
                stat.color === 'primary' ? "bg-primary/10 text-primary" :
                stat.color === 'secondary' ? "bg-secondary/10 text-secondary-dark" :
                "bg-accent/10 text-accent"
              )}>
                {stat.badge}
              </span>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-6xl font-display font-black text-slate-900 tracking-tighter">{stat.value}</h3>
              <Link to={stat.link} className={cn(
                "h-14 w-14 rounded-[1.5rem] flex items-center justify-center transition-all duration-300",
                stat.color === 'primary' ? "bg-primary/5 text-primary hover:bg-primary hover:text-white" :
                stat.color === 'secondary' ? "bg-secondary/5 text-secondary hover:bg-secondary hover:text-primary" :
                "bg-accent/5 text-accent hover:bg-accent hover:text-white"
              )}>
                <ArrowRight className="h-7 w-7" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-xl p-12 md:p-16 rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center gap-6 mb-12">
            <div className="p-4 bg-primary/10 text-primary rounded-[1.5rem]">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-display font-black text-slate-900 tracking-tight">Your Progress</h3>
          </div>
          
          <div className="space-y-12">
            {[
              { label: "Course Completion", value: 85, color: "bg-primary" },
              { label: "Attendance Rate", value: 94, color: "bg-secondary" },
              { label: "Average Score", value: 78, color: "bg-accent" }
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-5">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="text-slate-900">{item.value}%</span>
                </div>
                <div className="h-5 w-full bg-slate-50 rounded-full overflow-hidden p-1 border border-slate-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={cn("h-full rounded-full shadow-lg", item.color)} 
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-xl p-12 md:p-16 rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col"
        >
          <div className="flex items-center gap-6 mb-12">
            <div className="p-4 bg-accent/10 text-accent rounded-[1.5rem]">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-display font-black text-slate-900 tracking-tight">Recent Activity</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-4 border-dashed border-slate-50 rounded-[3rem]">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
              <FileText className="h-12 w-12 text-slate-300" />
            </div>
            <p className="text-slate-400 font-black text-xl italic mb-3">No activity yet</p>
            <p className="text-sm text-slate-300 font-bold max-w-[200px]">Activity from your classes and assignments will appear here.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
