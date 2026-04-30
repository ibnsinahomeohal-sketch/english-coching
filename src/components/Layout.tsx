import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, UserPlus, Users, IdCard, BookOpen, Library, Bot, Wallet, Mic,
  UserCircle, FileQuestion, GraduationCap, Trophy, LogOut, CalendarCheck,
  MessageSquare, FileText, Settings as SettingsIcon, Clock, CreditCard,
  TrendingDown, Award, User, Sun, Moon, Menu, Megaphone
} from "lucide-react";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { MobileBottomNav } from "./MobileBottomNav";

const navigationGroups = [
  {
    label: "PLATFORM",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Marketing", href: "/admin/marketing", icon: Megaphone },
      { name: "Courses & Batches", href: "/admin/courses", icon: BookOpen },
      { name: "Students", href: "/admin/students", icon: Users },
      { name: "Teachers", href: "/admin/teachers", icon: GraduationCap },
      { name: "Classes", href: "/admin/schedule", icon: Clock },
      { name: "Payments", href: "/admin/fees", icon: CreditCard },
      { name: "Exams", href: "/admin/exams", icon: FileQuestion },
      { name: "Student Chat", href: "/admin/chat", icon: MessageSquare },
      { name: "Back to Portfolio", href: "/", icon: UserCircle },
    ]
  },
  {
    label: "ACADEMIC",
    items: [
      { name: "Admission", href: "/admin/admission", icon: UserPlus },
      { name: "Admission Requests", href: "/admin/admissions-requests", icon: MessageSquare },
      { name: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
      { name: "Homework", href: "/admin/homework", icon: BookOpen },
      { name: "Course Notes", href: "/admin/notes", icon: FileText },
      { name: "Certificates", href: "/admin/certificates", icon: Award },
    ]
  },
  {
    label: "LEARNING",
    items: [
      { name: "Learning", href: "/admin/learning", icon: BookOpen },
      { name: "Speaking", href: "/admin/speaking", icon: Mic },
      { name: "EdTech", href: "/admin/edtech", icon: Bot },
      { name: "Resources", href: "/admin/resources", icon: Library },
      { name: "Community", href: "/admin/community", icon: Users },
    ]
  },
  {
    label: "SYSTEM",
    items: [
      { name: "Operations", href: "/admin/operations", icon: IdCard },
      { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
      { name: "Finance", href: "/admin/finance", icon: Wallet },
    ]
  }
];

export function Layout() {
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

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col transition-transform duration-500 md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-24 flex items-center px-10">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-2xl mr-4 flex items-center justify-center text-primary-dark shadow-xl shadow-primary/20 animate-float">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-display font-black tracking-tight text-slate-900">English <span className="text-primary">Therapy</span></h1>
        </div>
        <nav className="flex-1 px-6 py-6 space-y-10 overflow-y-auto">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              <h3 className="px-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.3em] mb-5">
                {group.label}
              </h3>
              <div className="space-y-2">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "group flex items-center px-5 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300",
                        isActive 
                          ? "bg-primary text-secondary shadow-lg shadow-primary/30 scale-[1.02]" 
                          : "text-slate-500 hover:bg-primary/5 hover:text-primary"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 mr-4 transition-all duration-300",
                        isActive ? "text-secondary scale-110" : "text-slate-400 group-hover:text-primary group-hover:scale-110"
                      )} />
                      <span>{item.name}</span>
                      {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(255,193,7,0.8)]" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-8 border-t border-slate-50">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-5 py-4 text-sm font-bold text-rose-500 rounded-2xl hover:bg-rose-50 transition-all duration-300 group"
          >
            <LogOut className="mr-4 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 transition-all duration-500" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-10">
          <button className="md:hidden p-3 text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-7 w-7" />
          </button>
          <div className="flex flex-col">
            <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">
              {navigationGroups.flatMap(g => g.items).find((n) => n.href === location.pathname)?.name || "Dashboard"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Welcome back, {user?.email?.split('@')[0] || "Admin"}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,77,64,0.6)]" />
              <span className="text-[11px] font-black text-primary uppercase tracking-widest">Live System</span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[2px] shadow-lg shadow-primary/20 group cursor-pointer transition-transform hover:scale-105 active:scale-95">
              <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center text-primary font-black text-lg group-hover:bg-primary group-hover:text-secondary transition-colors">
                {user?.email?.[0].toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-10 pb-32 md:pb-10 bg-slate-50/30">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
