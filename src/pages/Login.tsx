import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { Lock, Mail, User, GraduationCap, ArrowRight, Eye, EyeOff } from "lucide-react";

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
      if (session) {
        navigate("/");
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
        if (role === 'parent') {
          navigate("/parent-portal");
        } else {
          navigate("/student-portal");
        }
        return;
      }

      // Standard Auth for Admin/Teacher
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
        {/* Left Side - Branding */}
        <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">English Therapy<br/>Management</h1>
            <p className="text-indigo-100 text-lg font-medium max-w-sm">Empowering education through technology and personalized learning experiences.</p>
          </div>
          
          <div className="relative z-10 mt-12">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                    className="w-10 h-10 rounded-full border-2 border-indigo-500" 
                    alt="User"
                  />
                ))}
              </div>
              <p className="text-sm text-indigo-100 font-medium">Join 2,000+ students</p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-12">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

          {/* Role Selector */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
            {(["admin", "teacher", "student", "parent"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all capitalize ${
                  role === r ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {role === 'student' ? 'Student ID' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {role === 'student' ? <User className="h-5 w-5 text-slate-400" /> : <Mail className="h-5 w-5 text-slate-400" />}
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder={role === 'student' ? "Enter Student ID" : "name@example.com"}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 group"
            >
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account? <span className="text-indigo-600 font-bold cursor-pointer hover:underline">Contact Administrator</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
