import React, { useState, useEffect } from "react";
import { BookOpen, FileText, Calendar, Clock, CheckCircle2, AlertCircle, Upload, ChevronRight, FileUp } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { cn } from "../lib/utils";

export default function StudentHomework() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomework = async () => {
      setLoading(true);
      try {
        const sessionStr = localStorage.getItem('studentSession');
        if (!sessionStr) return;
        
        const session = JSON.parse(sessionStr);
        const studentId = session.studentId;

        const { data: studentData } = await supabase
          .from("students")
          .select("course_id, batch_id")
          .eq("student_id", studentId)
          .single();

        if (studentData) {
          const { data, error } = await supabase
            .from("homework")
            .select("*")
            .eq("course_id", studentData.course_id)
            .or(`batch_id.eq.${studentData.batch_id},batch_id.is.null`);

          if (error) {
            console.error("Error fetching homework:", error);
            toast.error("Could not load homework.");
          } else {
            setAssignments(data || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomework();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'submitted':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          icon: <CheckCircle2 className="h-4 w-4" />,
          label: 'Completed'
        };
      case 'overdue':
        return {
          color: 'bg-rose-50 text-rose-700 border-rose-100',
          icon: <AlertCircle className="h-4 w-4" />,
          label: 'Overdue'
        };
      case 'pending':
      default:
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-100',
          icon: <Clock className="h-4 w-4" />,
          label: 'Pending'
        };
    }
  };

  const handleUpload = (id: string) => {
    toast.success("Upload dialog would open here.");
  };

  return (
    <div className="min-h-screen bg-white/50 backdrop-blur-3xl rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -ml-48 -mb-48 animate-pulse delay-700 pointer-events-none" />

      {/* Header Section */}
      <div className="relative p-12 border-b border-slate-100 bg-white/80 backdrop-blur-xl z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/10 border border-primary/20">
              <BookOpen className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight mb-2">Homework & Tasks</h1>
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                  Academic Year 2024
                </span>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                <p className="text-slate-400 font-bold text-sm">Track and submit your assignments</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-2">
              <button className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
                All Tasks
              </button>
              <button className="px-6 py-3 text-slate-400 hover:text-primary rounded-xl text-sm font-black transition-all">
                Pending
              </button>
              <button className="px-6 py-3 text-slate-400 hover:text-primary rounded-xl text-sm font-black transition-all">
                Completed
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-12 relative z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:-translate-y-1 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="h-14 w-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20">
                <BookOpen className="h-7 w-7" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">Total</span>
            </div>
            <p className="text-4xl font-display font-black text-slate-900 mb-1 tracking-tight">{assignments.length}</p>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Assignments</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:-translate-y-1 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="h-14 w-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center border border-amber-500/20">
                <Clock className="h-7 w-7" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-500/5 px-3 py-1 rounded-full border border-amber-500/10">Pending</span>
            </div>
            <p className="text-4xl font-display font-black text-slate-900 mb-1 tracking-tight">
              {assignments.filter(a => a.status?.toLowerCase() === 'pending' || !a.status).length}
            </p>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">To Complete</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:-translate-y-1 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="h-14 w-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">Done</span>
            </div>
            <p className="text-4xl font-display font-black text-slate-900 mb-1 tracking-tight">
              {assignments.filter(a => a.status?.toLowerCase() === 'completed' || a.status?.toLowerCase() === 'submitted').length}
            </p>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Submitted</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:-translate-y-1 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="h-14 w-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-500/20">
                <AlertCircle className="h-7 w-7" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-500/5 px-3 py-1 rounded-full border border-rose-500/10">Late</span>
            </div>
            <p className="text-4xl font-display font-black text-slate-900 mb-1 tracking-tight">
              {assignments.filter(a => a.status?.toLowerCase() === 'overdue').length}
            </p>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Overdue</p>
          </div>
        </div>

        {/* Assignments List */}
        <div className="grid grid-cols-1 gap-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-xl">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-8" />
              <p className="text-slate-400 font-black uppercase tracking-widest animate-pulse">Fetching your assignments...</p>
            </div>
          ) : assignments.length > 0 ? (
            assignments.map(assignment => {
              const status = getStatusConfig(assignment.status);
              const isCompleted = assignment.status?.toLowerCase() === 'completed' || assignment.status?.toLowerCase() === 'submitted';
              
              return (
                <div key={assignment.id} className="group bg-white/80 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden">
                  <div className="p-10 flex flex-col lg:flex-row gap-10">
                    {/* Left Side: Icon & Status */}
                    <div className="flex lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-8 shrink-0 lg:w-56">
                      <div className={cn(
                        "h-24 w-24 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 border-4 border-white",
                        isCompleted ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100' : 'bg-primary/5 text-primary shadow-primary/5'
                      )}>
                        <BookOpen className="h-12 w-12" />
                      </div>
                      <div className={cn(
                        "inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                        status.color
                      )}>
                        {status.icon}
                        {status.label}
                      </div>
                    </div>
                    
                    {/* Middle: Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-xl border border-slate-100 shadow-sm">{assignment.course}</span>
                        <span className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-xl border border-slate-100 shadow-sm">{assignment.batch}</span>
                      </div>
                      
                      <h3 className="text-3xl font-display font-black text-slate-900 mb-4 group-hover:text-primary transition-colors tracking-tight">
                        {assignment.title}
                      </h3>
                      
                      {assignment.description && (
                        <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg group-hover:text-slate-700 transition-colors">
                          {assignment.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap items-center justify-between gap-8 pt-10 border-t border-slate-50">
                        <div className="flex items-center gap-4 text-slate-400 font-bold bg-slate-50/50 px-8 py-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
                          <Calendar className="h-6 w-6 text-primary/40" />
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-slate-400">Deadline</span>
                            <span className="text-slate-900 text-base">{assignment.dueDate || 'No date set'}</span>
                          </div>
                        </div>
                        
                        {!isCompleted ? (
                          <button 
                            onClick={() => handleUpload(assignment.id)}
                            className="flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0 group"
                          >
                            <FileUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
                            Submit Assignment
                          </button>
                        ) : (
                          <button className="flex items-center gap-4 bg-white text-slate-600 px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all border-2 border-slate-100 shadow-sm group">
                            <FileText className="h-6 w-6 text-slate-400 group-hover:scale-110 transition-transform" />
                            View Submission
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white/50 backdrop-blur-xl rounded-[3rem] border border-slate-100 p-24 text-center shadow-2xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
              <div className="h-40 w-40 bg-white rounded-[4rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-slate-200/50 border border-slate-100 relative group">
                <BookOpen className="h-16 w-16 text-primary/20 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute -bottom-4 -right-4 h-16 w-16 bg-accent rounded-[2rem] flex items-center justify-center shadow-xl shadow-accent/30 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-4xl font-display font-black text-slate-900 mb-6 tracking-tight">No Homework Assigned</h3>
              <p className="text-slate-400 font-bold max-w-md mx-auto leading-relaxed text-lg">
                You're all caught up! Take this time to review your previous lessons or explore new topics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
