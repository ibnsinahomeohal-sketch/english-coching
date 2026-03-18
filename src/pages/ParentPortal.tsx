import React, { useState, FormEvent } from "react";
import { User, Lock, PieChart, Calendar, CreditCard, BookOpen, LogOut, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function ParentPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const checkSession = async () => {
      const sessionStr = localStorage.getItem('studentSession');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session.role === 'parent') {
          const { data, error } = await supabase
            .from("students")
            .select("*")
            .eq("student_id", session.studentId)
            .single();
          
          if (!error && data) {
            setStudent(data);
            setIsLoggedIn(true);
          }
        }
      }
    };
    checkSession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('studentSession');
    setIsLoggedIn(false);
    setStudent(null);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("student_id", studentId)
        .eq("mobile", phone)
        .single();

      if (error || !data) {
        toast.error("Invalid Student ID or Mobile Number");
      } else {
        setStudent(data);
        setIsLoggedIn(true);
        toast.success("Welcome to Parent Portal");
      }
    } catch (err) {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Parent Portal</h2>
          <p className="text-sm text-gray-500 mt-2">Log in to view your child's progress</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                required
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="e.g. 2026001" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registered Mobile Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="tel" 
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="e.g. 01711000000" 
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Access Portal"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-sm text-gray-500">ID: {student.student_id} • {student.course}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsLoggedIn(false)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Attendance</h3>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-bold text-gray-900">92%</span>
            <span className="text-sm text-gray-500 mb-1">Present</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Batch: {student.batch}</p>
        </div>

        {/* Fees */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Fees & Dues</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Course Fee:</span>
              <span className="font-medium text-gray-900">৳{student.fee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Paid:</span>
              <span className="font-medium text-emerald-600">৳{student.paid_amount || 0}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
              <span className="font-medium text-gray-900">Current Due:</span>
              <span className="font-bold text-rose-600">৳{student.due_amount || (student.fee - (student.paid_amount || 0))}</span>
            </div>
          </div>
        </div>

        {/* Homework */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Homework</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="text-sm font-medium text-gray-900">Vocabulary Practice Set 1</h4>
              <p className="text-xs text-gray-500 mt-1">Status: Checked</p>
              <span className="inline-block mt-2 text-[10px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
