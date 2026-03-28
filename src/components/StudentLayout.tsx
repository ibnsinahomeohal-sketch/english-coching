import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, BookOpen, Clock, MessageSquare, FileText, 
  UserCircle, Settings as SettingsIcon, Mic, Users, Award, 
  LogOut, Bell, Sun, Moon, Menu, Bot, BrainCircuit, GraduationCap,
  Search, ChevronRight
} from "lucide-react";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { MobileBottomNav } from "./MobileBottomNav";
import { motion, AnimatePresence } from "motion/react";

const studentNavigation = [
  {
    label: "LEARNING",
    items: [
      { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
      { name: "Daily Quiz", href: "/student/daily-quiz", icon: BrainCircuit },
      { name: "Class Schedule", href: "/student/schedule", icon: Clock },
      { name: "Homework", href: "/student/homework", icon: BookOpen },
      { name: "Chat", href: "/student/chat", icon: MessageSquare },
      { name: "Leaderboard", href: "/student/leaderboard", icon: Award },
      { name: "Course Notes", href: "/student/notes", icon: FileText },
      { name: "My Exams", href: "/student/my-exams", icon: Award },
      { name: "Back to Portfolio", href: "/", icon: GraduationCap },
    ]
  },
  {
    label: "PRACTICE",
    items: [
      { name: "Speaking Practice", href: "/student/speaking", icon: Mic },
      { name: "Community", href: "/student/community", icon: Users },
      { name: "AI & Support", href: "/student/ai-support", icon: Bot },
    ]
  },
  {
    label: "ACCOUNT",
    items: [
      { name: "Student Profile", href: "/student/profile", icon: UserCircle },
    ]
  }
];

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('studentSession');
      const { error } = await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.div 
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : (window.innerWidth < 768 ? -320 : 0) }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-100 flex flex-col transition-all duration-500 md:relative md:translate-x-0 shadow-2xl shadow-slate-200/50",
          !isSidebarOpen && "md:w-80"
        )}
      >
        <div className="h-32 flex items-center px-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500" />
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl mr-5 flex items-center justify-center text-secondary shadow-2xl shadow-primary/30 group-hover:rotate-6 transition-transform duration-500">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl font-display font-black tracking-tighter text-slate-900 leading-none mb-1">
              English <span className="text-primary italic">Therapy</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Excellence Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-8 py-4 space-y-12 overflow-y-auto custom-scrollbar">
          {studentNavigation.map((group) => (
            <div key={group.label}>
              <h3 className="px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-8 flex items-center gap-4">
                {group.label}
                <div className="h-px flex-1 bg-slate-50" />
              </h3>
              <div className="space-y-3">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "group flex items-center px-6 py-4.5 text-sm font-bold rounded-[1.5rem] transition-all duration-500 relative overflow-hidden",
                        isActive 
                          ? "text-primary shadow-2xl shadow-primary/10 scale-[1.02] z-10" 
                          : "text-slate-500 hover:bg-primary/5 hover:text-primary"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5.5 w-5.5 mr-4 transition-all duration-500",
                        isActive ? "text-primary scale-110 rotate-3" : "text-slate-400 group-hover:text-primary group-hover:scale-110"
                      )} />
                      <span className="relative z-10 tracking-tight">{item.name}</span>
                      
                      {isActive && (
                        <motion.div 
                          layoutId="sidebar-active-pill"
                          className="absolute inset-0 bg-secondary -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      {isActive && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_rgba(0,77,64,0.4)]" 
                        />
                      )}
                      
                      {!isActive && (
                        <ChevronRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-10 border-t border-slate-50 bg-slate-50/30">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-8 py-5 text-sm font-black text-rose-500 rounded-[1.5rem] hover:bg-rose-500 hover:text-white transition-all duration-500 group shadow-sm hover:shadow-xl hover:shadow-rose-500/20 active:scale-95"
          >
            <LogOut className="mr-4 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Logout Session
          </button>
        </div>
      </motion.div>

      {/* Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 transition-all duration-500" 
            onClick={() => setIsSidebarOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none" />

        <header className="h-32 bg-white/70 backdrop-blur-3xl border-b border-slate-100 flex items-center justify-between px-12 sticky top-0 z-40">
          <div className="flex items-center gap-8">
            <button 
              className="md:hidden p-4 text-slate-600 hover:bg-slate-100 rounded-2xl transition-all active:scale-90" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-8 w-8" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(0,77,64,0.5)]" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Active Session</p>
              </div>
              <h2 className="text-4xl font-display font-black text-slate-900 tracking-tighter leading-none">
                {studentNavigation.flatMap(g => g.items).find((n) => n.href === location.pathname)?.name || "Dashboard"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 group focus-within:ring-2 ring-primary/20 transition-all">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-transparent border-none outline-none text-sm font-bold text-slate-600 placeholder:text-slate-300 w-48 focus:w-64 transition-all"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-base font-black text-slate-900 tracking-tight">{user?.email?.split('@')[0]}</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Premium Scholar</p>
                </div>
              </div>
              <div className="h-16 w-16 rounded-[1.8rem] bg-gradient-to-br from-primary to-secondary p-[3px] shadow-2xl shadow-primary/20 group cursor-pointer transition-all hover:scale-110 active:scale-95 relative">
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary border-4 border-white rounded-full z-10" />
                <div className="h-full w-full bg-white rounded-[1.5rem] flex items-center justify-center text-primary font-black text-2xl group-hover:bg-primary group-hover:text-secondary transition-all duration-500">
                  {user?.email?.[0].toUpperCase() || "S"}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 pb-32 md:pb-12 relative z-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        <MobileBottomNav />
      </div>
    </div>
  );
}
