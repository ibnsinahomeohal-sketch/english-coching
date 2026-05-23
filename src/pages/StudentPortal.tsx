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
  AlertCircle,
  Copy,
  Check,
  Smartphone,
  CheckCircle,
  X
} from "lucide-react";
import { toast } from "sonner";

export default function StudentPortal() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // bKash Send Money personal system states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);
  const [senderBkash, setSenderBkash] = useState("");
  const [trxId, setTrxId] = useState("");
  const [amount, setAmount] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchPaymentRequests = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setPaymentRequests(data);
      }
    } catch (err) {
      console.error("Error fetching payment requests:", err);
    }
  };

  const copyNumber = () => {
    navigator.clipboard.writeText("01816648831");
    setCopied(true);
    toast.success("বিকাশ নাম্বার কপি করা হয়েছে!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderBkash || !trxId || !amount) {
      toast.error("সকল তথ্য সঠিকভাবে পূরণ করুন");
      return;
    }

    const payAmount = parseFloat(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      toast.error("সঠিক টাকার পরিমাণ লিখুন");
      return;
    }

    setSubmittingPayment(true);
    try {
      const { error } = await supabase
        .from('payment_requests')
        .insert([{
          student_id: student.student_id,
          student_name: student.name,
          phone: student.mobile || student.phone || "",
          bkash_number: senderBkash.trim(),
          trx_id: trxId.trim().toUpperCase(),
          amount: payAmount,
          status: 'pending'
        }]);

      if (error) {
        if (error.code === '23505') {
          toast.error("এই Transaction ID দিয়ে ইতিমধ্যে একটি পেমেন্ট সাবমিট করা হয়েছে!");
        } else {
          throw error;
        }
      } else {
        toast.success("আপনার পেমেন্ট রিকোয়েস্টটি সফলভাবে সাবমিট করা হয়েছে। দ্রুত ভেরিফাই করে তা যুক্ত করা হবে!");
        setSenderBkash("");
        setTrxId("");
        setAmount("");
        setShowPaymentModal(false);
        fetchPaymentRequests(student.student_id);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("পেমেন্ট সাবমিট করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setSubmittingPayment(false);
    }
  };

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
          fetchPaymentRequests(session.studentId);
          setLoading(false);
          return;
        }
      }

      // 2. Fallback to Supabase Auth
      let user: any = null;
      try {
        const resp = await supabase.auth.getUser();
        user = resp?.data?.user;
      } catch (err) {
        console.error("Error getting user in StudentPortal:", err);
      }
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
        fetchPaymentRequests(data.student_id);
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
        {/* Header removed as it's now in StudentLayout */}
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
                    <span className="text-sm font-bold text-slate-900">৳{student.fee || student.total_fee || '5,000'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Paid Amount</span>
                    <span className="text-sm font-bold text-emerald-600">৳{student.paid_amount || '0'}</span>
                  </div>
                  <div className="h-px bg-slate-100 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900">Current Due</span>
                    <span className="text-lg font-black text-rose-600">৳{student.due_amount || '0'}</span>
                  </div>
                  
                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-[#e2136e] text-white py-3 rounded-xl font-bold hover:bg-[#e2136e]/90 transition-all mt-4 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/10 active:scale-[0.98]"
                  >
                    <Smartphone className="h-4 w-4" />
                    Pay with bKash
                  </button>

                  {/* bKash Payment Request Status List */}
                  {paymentRequests.length > 0 && (
                    <div className="mt-6 border-t border-slate-100 pt-4 space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Submissions</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {paymentRequests.map((req) => (
                          <div key={req.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-slate-800">৳{req.amount}</p>
                              <p className="text-[10px] text-slate-400">TrxID: {req.trx_id}</p>
                            </div>
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-md ${
                              req.status === 'approved' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                              req.status === 'rejected' ? "bg-rose-50 text-rose-600 border border-rose-100" :
                              "bg-amber-50 text-amber-600 border border-amber-100"
                            }`}>
                              {req.status === 'approved' ? 'Approved' : req.status === 'rejected' ? 'Rejected' : 'Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                      <p className="text-xs font-bold text-slate-900">{student.roll_no || student.student_id || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Contact</p>
                    <p className="text-xs font-bold text-slate-900">{student.mobile || student.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* bKash Send Money instructions and Verification Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
              {/* Header */}
              <div className="bg-[#e2136e] p-6 text-white text-center relative">
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="absolute top-4 right-4 p-1.5 bg-black/10 hover:bg-black/20 rounded-full transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  <span className="text-[#e2136e] font-display font-black text-3xl">b</span>
                </div>
                <h3 className="text-lg font-black tracking-tight">bKash Send Money (Personal)</h3>
                <p className="text-xs text-white/85 mt-1 font-semibold">বিকাশ পার্সোনাল সেন্ড মানি গেটওয়ে</p>
              </div>

              {/* Rules / Steps */}
              <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                <div className="p-4 bg-pink-50 border border-pink-100 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-[#e2136e] tracking-widest mb-1 pl-1">bKash Personal Number</p>
                  <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-pink-100 shadow-sm">
                    <span className="font-mono text-lg font-black text-[#e2136e]">01816648831</span>
                    <button 
                      onClick={copyNumber}
                      className="px-3 py-1.5 bg-[#e2136e] hover:bg-[#e2136e]/95 text-white text-xs font-black rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-medium text-slate-600 pl-1">
                  <p className="font-bold text-[#e2136e] mb-1">ধাপসমূহ (Steps to Pay):</p>
                  <div className="flex gap-2">
                    <span className="text-[#e2136e] font-black">১.</span> 
                    <span>আপনার বিকাশ অ্যাপ অথবা *২৪৭# ডায়াল করে <b>Send Money (সেন্ড মানি)</b> অপশন সিলেক্ট করুন।</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#e2136e] font-black">২.</span> 
                    <span>প্রাপক নাম্বারে উপরোক্ত পার্সোনাল নাম্বারটি টাইপ বা পেস্ট করুন: <b>01816648831</b></span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#e2136e] font-black">৩.</span> 
                    <span>টাকার পরিমাণ লিখুন এবং পিন দিয়ে সাবমিট সম্পন্ন করুন।</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#e2136e] font-black">৪.</span> 
                    <span>সেন্ড মানি সম্পন্ন হলে নিচের ফরমে প্রয়োজনীয় তথ্যসমূহ নিখুঁতভাবে প্রদান করুন।</span>
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-4"></div>

                {/* Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider pl-1">প্রেরক বিকাশ নাম্বার (Sender bKash No.)</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 017XXXXXXXX"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800 focus:bg-white focus:border-[#e2136e] focus:outline-none focus:ring-4 focus:ring-pink-500/10 placeholder:text-slate-300 text-sm transition-all"
                      value={senderBkash}
                      onChange={e => setSenderBkash(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider pl-1">ট্রানজেকশন আইডি (Transaction ID / TrxID)</label>
                    <input 
                      type="text" 
                      placeholder="e.g., BKD8J2A98L"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800 uppercase focus:bg-white focus:border-[#e2136e] focus:outline-none focus:ring-4 focus:ring-pink-500/10 placeholder:text-slate-300 text-sm transition-all"
                      value={trxId}
                      onChange={e => setTrxId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider pl-1">টাকার পরিমাণ (Sending Amount ৳)</label>
                    <input 
                      type="number" 
                      placeholder="e.g., 1500"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800 focus:bg-white focus:border-[#e2136e] focus:outline-none focus:ring-4 focus:ring-pink-500/10 placeholder:text-slate-300 text-sm transition-all"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200 transition-all text-xs uppercase"
                    >
                      বন্ধ করুন (Close)
                    </button>
                    <button 
                      type="submit" 
                      disabled={submittingPayment}
                      className="flex-1 py-3 bg-[#e2136e] hover:bg-[#e2136e]/95 text-white font-black rounded-xl shadow-lg shadow-pink-500/20 text-xs uppercase transition-all disabled:opacity-50"
                    >
                      {submittingPayment ? "ভেরিফাই হচ্ছে..." : "সাবমিট করুন (Submit)"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
