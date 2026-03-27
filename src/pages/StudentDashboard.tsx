import React, { useState, useEffect } from "react";
import { LayoutDashboard, BookOpen, Clock, Award, FileText, ArrowRight, Calendar, TrendingUp, BrainCircuit } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState({ homework: 0, exams: 0, notes: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const sessionStr = localStorage.getItem('studentSession');
      if (!sessionStr) return;
      
      const session = JSON.parse(sessionStr);
      const studentId = session.studentId;

      // Fetch student details with course and batch names
      const { data: studentData } = await supabase
        .from("students")
        .select('*')
        .eq("student_id", studentId)
        .single();

      if (studentData) {
        setStudent({
          ...studentData,
          courseName: studentData.course,
          batchName: studentData.batch
        });

        // Fetch counts for dashboard using IDs
        const { count: homeworkCount } = await supabase
          .from("homework")
          .select("*", { count: 'exact', head: true })
          .eq("course_id", studentData.course_id)
          .or(`batch_id.eq.${studentData.batch_id},batch_id.is.null`);

        const { count: examCount } = await supabase
          .from("exams")
          .select("*", { count: 'exact', head: true })
          .eq("course_id", studentData.course_id)
          .or(`batch_id.eq.${studentData.batch_id},batch_id.is.null`);

        const { count: notesCount } = await supabase
          .from("notes")
          .select("*", { count: 'exact', head: true })
          .eq("course_id", studentData.course_id)
          .or(`batch_id.eq.${studentData.batch_id},batch_id.is.null`);

        setStats({
          homework: homeworkCount || 0,
          exams: examCount || 0,
          notes: notesCount || 0
        });
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <PageHero 
        title={`Hello, ${student?.name?.split(' ')[0] || 'Student'}! 👋`}
        subtitle={`Your dashboard for ${student?.courseName || 'your course'} - ${student?.batchName || 'your batch'}`}
        icon={LayoutDashboard}
        darkColor="#1e1b4b"
        badge="Dashboard"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="dashboard" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="2" y="2" width="16" height="16" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dashboard)" />
          </svg>
        }
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Daily Quiz Banner */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-pink-500/20 relative overflow-hidden mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl -ml-10 -mb-10"></div>
          
          <div className="relative z-10 flex items-center gap-6">
            <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0 border border-white/30">
              <BrainCircuit className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black mb-1">Daily 50 Quiz Challenge</h2>
              <p className="text-pink-100 max-w-xl text-sm sm:text-base">
                Test your English skills with 50 new questions every day. Pass with 17+ to earn points for your profile!
              </p>
            </div>
          </div>
          
          <div className="relative z-10 w-full sm:w-auto">
            <Link 
              to="/student/daily-quiz" 
              className="bg-white text-pink-600 px-8 py-3.5 rounded-xl font-bold hover:bg-pink-50 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Start Quiz <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl -ml-10 -mb-10"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Welcome back to class!</h2>
            <p className="text-indigo-100 max-w-2xl mb-6 text-lg">
              You're making great progress. Check your pending homework and upcoming exams to stay on track.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/student/homework" className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                View Homework
              </Link>
              <Link to="/student/schedule" className="bg-indigo-500/30 hover:bg-indigo-500/40 border border-indigo-400/30 text-white px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 backdrop-blur-sm">
                <Calendar className="h-5 w-5" />
                Class Schedule
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6" />
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">Active</span>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Homework</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-900">{stats.homework}</h3>
              <Link to="/student/homework" className="text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="h-6 w-6" />
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">Completed</span>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Exams Taken</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-900">{stats.exams}</h3>
              <Link to="/student/my-exams" className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1">
                Results <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">Available</span>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Study Notes</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-900">{stats.notes}</h3>
              <Link to="/student/notes" className="text-amber-600 hover:text-amber-700 text-sm font-bold flex items-center gap-1">
                Browse <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Your Progress</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-600">Course Completion</span>
                  <span className="text-indigo-600">65%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-600">Attendance Rate</span>
                  <span className="text-emerald-600">92%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-600">Average Score</span>
                  <span className="text-amber-600">88%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Passed Mid-term Exam</p>
                  <p className="text-sm text-slate-500">You scored 92% in the recent speaking test.</p>
                  <p className="text-xs text-slate-400 mt-1">2 days ago</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Submitted Homework</p>
                  <p className="text-sm text-slate-500">Grammar exercise 4 was submitted successfully.</p>
                  <p className="text-xs text-slate-400 mt-1">4 days ago</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">New Study Material</p>
                  <p className="text-sm text-slate-500">Vocabulary list for week 5 is now available.</p>
                  <p className="text-xs text-slate-400 mt-1">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
