import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { 
  User, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Award, 
  LogOut, 
  Bell, 
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export default function StudentPortal() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      // 1. Check for table-based session first
      const studentSession = localStorage.getItem('studentSession');
      if (studentSession) {
        const session = JSON.parse(studentSession);
        const { data, error } = await supabase
          .from("students")
          .select("*")
          .eq("student_id", session.studentId)
          .single();

        if (!error && data) {
          setStudent(data);
          setLoading(false);
          return;
        }
      }

      // 2. Fallback to Supabase Auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Fetch student details from students table using email
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("email", user.email)
        .single();

      if (error) {
        console.error("Error fetching student:", error);
        toast.error("Could not find student profile linked to this account.");
      } else {
        setStudent(data);
      }
      setLoading(false);
    };

    fetchStudentData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('studentSession');
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <AlertCircle className="h-16 w-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
        <p className="text-slate-500 max-w-md mb-6">
          Your account is authenticated, but we couldn't find a student record associated with your email ({student?.email}).
        </p>
        <button 
          onClick={handleLogout}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Logout and Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Student Portal</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">English Therapy</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{student.name}</p>
                <p className="text-xs text-slate-500">ID: {student.student_id}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Welcome Banner */}
        <div className="bg-indigo-600 rounded-3xl p-8 text-white mb-8 relative overflow-hidden shadow-xl shadow-indigo-200">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Hello, {student.name.split(' ')[0]}! 👋</h2>
            <p className="text-indigo-100 max-w-lg">
              Welcome back to your learning dashboard. You have 2 assignments due this week and your attendance is looking great!
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Next Class: Tomorrow, 10:00 AM</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">Course: {student.course}</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute right-12 bottom-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Progress */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-slate-500 mb-1">Attendance</p>
                <h3 className="text-2xl font-bold text-slate-900">94.5%</h3>
                <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '94.5%' }}></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-slate-500 mb-1">Assignments</p>
                <h3 className="text-2xl font-bold text-slate-900">12 / 14</h3>
                <p className="text-xs text-slate-400 mt-2 font-medium">Completed this term</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-slate-500 mb-1">Current Grade</p>
                <h3 className="text-2xl font-bold text-slate-900">A-</h3>
                <p className="text-xs text-slate-400 mt-2 font-medium">Top 15% of class</p>
              </div>
            </div>

            {/* Recent Homework */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Recent Homework</h3>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All</button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { title: "Vocabulary Practice Set 4", due: "Tomorrow", status: "pending", color: "amber" },
                  { title: "Grammar: Tenses Overview", due: "20 Mar", status: "pending", color: "amber" },
                  { title: "Speaking Exercise: My Daily Routine", due: "15 Mar", status: "completed", color: "emerald" },
                ].map((hw, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 bg-${hw.color}-100 text-${hw.color}-600 rounded-lg flex items-center justify-center`}>
                        {hw.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{hw.title}</h4>
                        <p className="text-xs text-slate-500">Due: {hw.due}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-${hw.color}-100 text-${hw.color}-700`}>
                      {hw.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar Info */}
          <div className="space-y-8">
            {/* Payment Status */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Fees & Payments</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Total Course Fee</span>
                  <span className="text-sm font-bold text-slate-900">৳{student.total_fee || '5,000'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Paid Amount</span>
                  <span className="text-sm font-bold text-emerald-600">৳{student.paid_amount || '2,000'}</span>
                </div>
                <div className="h-px bg-slate-100 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900">Current Due</span>
                  <span className="text-lg font-black text-rose-600">৳{student.due_amount || '3,000'}</span>
                </div>
                <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all mt-4">
                  Pay Now
                </button>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Profile Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Student Name</p>
                    <p className="text-sm font-bold text-slate-900">{student.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Batch</p>
                    <p className="text-xs font-bold text-slate-900">{student.batch || 'Morning A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Roll No</p>
                    <p className="text-xs font-bold text-slate-900">{student.roll_no || '24'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Contact</p>
                  <p className="text-xs font-bold text-slate-900">{student.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
