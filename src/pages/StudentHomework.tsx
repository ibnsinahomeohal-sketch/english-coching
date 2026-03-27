import React, { useState, useEffect } from "react";
import { BookOpen, FileText, Calendar, Clock, CheckCircle2, AlertCircle, Upload, ChevronRight, FileUp } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

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

        // Fetch student details
        const { data: studentData } = await supabase
          .from("students")
          .select("course_id, batch_id")
          .eq("student_id", studentId)
          .single();

        if (studentData) {
          // Fetch homework for this student's course and batch (or all batches)
          const { data, error } = await supabase
            .from("homework")
            .select("*")
            .eq("course_id", studentData.course_id)
            .or(`batch_id.eq.${studentData.batch_id},batch_id.is.null`);

          if (error) {
            console.error("Error fetching homework:", error);
            toast.error("Could not load homework.");
          } else {
            // Mocking some data if empty for demonstration purposes of the UI
            if (!data || data.length === 0) {
              setAssignments([
                {
                  id: '1',
                  title: 'Write an essay about your hometown',
                  course: 'Spoken English',
                  batch: 'Batch 101',
                  status: 'pending',
                  dueDate: '2026-04-01',
                  description: 'Write a 200-word essay describing your hometown, its famous places, and why you like it.'
                },
                {
                  id: '2',
                  title: 'Record a 2-minute introduction',
                  course: 'Spoken English',
                  batch: 'Batch 101',
                  status: 'completed',
                  dueDate: '2026-03-20',
                  description: 'Record yourself introducing yourself, your hobbies, and your goals.'
                },
                {
                  id: '3',
                  title: 'Complete grammar worksheet 5',
                  course: 'Spoken English',
                  batch: 'Batch 101',
                  status: 'overdue',
                  dueDate: '2026-03-15',
                  description: 'Fill in the blanks with the correct verb tenses.'
                }
              ]);
            } else {
              setAssignments(data);
            }
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
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className="h-4 w-4" />,
          label: 'Completed'
        };
      case 'overdue':
        return {
          color: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <AlertCircle className="h-4 w-4" />,
          label: 'Overdue'
        };
      case 'pending':
      default:
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Clock className="h-4 w-4" />,
          label: 'Pending'
        };
    }
  };

  const handleUpload = (id: string) => {
    toast.success("Upload dialog would open here.");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <PageHero 
        title="My Homework"
        subtitle="View and submit your assigned tasks"
        icon={BookOpen}
        darkColor="#c2410c" // orange-700
        badge="Assignments"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="books" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="5" y="5" width="10" height="12" fill="currentColor" className="text-orange-500/20" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#books)" />
          </svg>
        }
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-slate-900">
                {assignments.filter(a => a.status?.toLowerCase() === 'pending' || !a.status).length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <p className="text-2xl font-bold text-slate-900">
                {assignments.filter(a => a.status?.toLowerCase() === 'completed' || a.status?.toLowerCase() === 'submitted').length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Overdue</p>
              <p className="text-2xl font-bold text-slate-900">
                {assignments.filter(a => a.status?.toLowerCase() === 'overdue').length}
              </p>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-slate-500">Loading assignments...</p>
            </div>
          ) : assignments.length > 0 ? (
            assignments.map(assignment => {
              const status = getStatusConfig(assignment.status);
              const isCompleted = assignment.status?.toLowerCase() === 'completed' || assignment.status?.toLowerCase() === 'submitted';
              
              return (
                <div key={assignment.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                  <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                    
                    {/* Icon & Status (Mobile Top, Desktop Left) */}
                    <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-4 shrink-0 sm:w-48">
                      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 ${
                        isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        <BookOpen className="h-8 w-8" />
                      </div>
                      
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-md">{assignment.course}</span>
                        <span className="bg-slate-100 px-2.5 py-1 rounded-md">{assignment.batch}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {assignment.title}
                      </h3>
                      
                      {assignment.description && (
                        <p className="text-slate-600 mb-6 leading-relaxed">
                          {assignment.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 font-medium bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          Due: <span className="text-slate-900">{assignment.dueDate || 'No date set'}</span>
                        </div>
                        
                        {!isCompleted ? (
                          <button 
                            onClick={() => handleUpload(assignment.id)}
                            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm shadow-orange-600/20 hover:-translate-y-0.5"
                          >
                            <FileUp className="h-4 w-4" />
                            Submit Work
                          </button>
                        ) : (
                          <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl font-bold transition-colors border border-slate-200">
                            <FileText className="h-4 w-4 text-slate-400" />
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
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
              <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-200">
                <BookOpen className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No Homework Assigned</h3>
              <p className="text-slate-500 max-w-md mx-auto">You're all caught up! Check back later for new assignments from your instructors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
