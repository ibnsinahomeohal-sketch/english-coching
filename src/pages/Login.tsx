import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { Lock, Mail, User, GraduationCap, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"admin" | "teacher" | "student" | "parent">("admin");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const studentSession = localStorage.getItem('studentSession');
      if (session) {
        navigate("/admin/dashboard");
      } else if (studentSession) {
        navigate("/student/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === 'student' || role === 'parent') {
        // Table-based login for students and parents
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('student_id', email)
          .eq('password', password)
          .single();

        if (error || !data) {
          throw new Error("ভুল আইডি অথবা পাসওয়ার্ড। আবার চেষ্টা করুন।");
        }

        // Store student session locally
        localStorage.setItem('studentSession', JSON.stringify({
          role,
          studentId: data.student_id,
          name: data.name
        }));

        toast.success("লগইন সফল হয়েছে!");
        navigate("/student/dashboard");
        return;
      }

      // Standard Auth for Admin/Teacher
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Logged in successfully!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-3 text-slate-500 hover:text-primary font-black text-xs uppercase tracking-[0.2em] transition-all group z-20"
      >
        <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:shadow-md transition-all">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className="hidden sm:inline">Back to Portfolio</span>
      </Link>

      {/* Background Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl w-full bg-white rounded-[40px] shadow-premium overflow-hidden flex flex-col md:flex-row border border-slate-100">
        {/* Left Side - Branding */}
        <div className="md:w-1/2 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          
          <div className="relative z-10">
            <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-display font-black mb-6 leading-tight tracking-tight">
              English Therapy <br />
              <span className="text-primary">Portal</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-sm leading-relaxed">
              Access your personalized learning dashboard and track your progress in real-time.
            </p>
          </div>
          
          <div className="relative z-10 mt-12">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                    className="w-10 h-10 rounded-full border-2 border-slate-800" 
                    alt="User"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-400 font-bold">Join 10,000+ students globally</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-12 md:p-16 bg-white">
          <div className="mb-12">
            <h2 className="text-3xl font-display font-black text-slate-900 mb-3">Welcome back!</h2>
            <p className="text-slate-500 font-medium">Please enter your credentials to continue.</p>
          </div>

          {/* Role Selector */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-10">
            {(["admin", "teacher", "student", "parent"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-3 text-xs font-black rounded-xl transition-all capitalize tracking-widest ${
                  role === r ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                {role === 'student' ? 'Student ID' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  {role === 'student' ? <User className="h-5 w-5 text-slate-400" /> : <Mail className="h-5 w-5 text-slate-400" />}
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium !pl-14"
                  placeholder={role === 'student' ? "Enter Student ID" : "name@example.com"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
                <a href="#" className="text-[10px] font-black text-primary hover:text-primary-dark uppercase tracking-widest">Forgot?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium !pl-14 !pr-14"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center ml-1">
              <input
                id="remember-me"
                type="checkbox"
                className="h-5 w-5 text-primary focus:ring-primary border-slate-200 rounded-lg transition-all cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-3 text-sm text-slate-500 font-bold cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary !w-full !py-5 !text-lg group"
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account? <span className="text-primary font-black cursor-pointer hover:underline">Contact Admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
