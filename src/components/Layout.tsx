import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, UserPlus, Users, IdCard, BookOpen, Library, Bot, Wallet, Mic,
  UserCircle, FileQuestion, GraduationCap, Trophy, LogOut, CalendarCheck,
  MessageSquare, FileText, Settings as SettingsIcon, Clock, CreditCard,
  TrendingDown, Award, User, Sun, Moon, Menu
} from "lucide-react";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { MobileBottomNav } from "./MobileBottomNav";

const navigationGroups = [
  {
    label: "PLATFORM",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Students", href: "/students", icon: Users },
      { name: "Teachers", href: "/teachers", icon: GraduationCap },
      { name: "Classes", href: "/schedule", icon: Clock },
      { name: "Payments", href: "/fees", icon: CreditCard },
      { name: "Exams", href: "/exams", icon: FileQuestion },
    ]
  },
  {
    label: "ACADEMIC",
    items: [
      { name: "Admission", href: "/admission", icon: UserPlus },
      { name: "Attendance", href: "/attendance", icon: CalendarCheck },
      { name: "Homework", href: "/homework", icon: BookOpen },
      { name: "Certificates", href: "/certificates", icon: Award },
    ]
  },
  {
    label: "LEARNING",
    items: [
      { name: "Learning", href: "/learning", icon: BookOpen },
      { name: "Speaking", href: "/speaking", icon: Mic },
      { name: "Community", href: "/community", icon: Users },
    ]
  },
  {
    label: "SYSTEM",
    items: [
      { name: "Settings", href: "/settings", icon: SettingsIcon },
      { name: "Finance", href: "/finance", icon: Wallet },
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
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center px-8">
          <div className="w-8 h-8 bg-primary rounded-xl mr-3 flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-display font-bold tracking-tight text-gray-900">English Therapy</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                        isActive 
                          ? "bg-primary-light text-primary shadow-sm" 
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 mr-3 transition-colors",
                        isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                      )} />
                      <span>{item.name}</span>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(79,70,229,0.6)]" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-semibold text-red-500 rounded-xl hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <button className="md:hidden p-2 text-gray-600" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-col">
            <h2 className="text-xl font-display font-bold text-gray-900">
              {navigationGroups.flatMap(g => g.items).find((n) => n.href === location.pathname)?.name || "Dashboard"}
            </h2>
            <p className="text-xs text-gray-400 font-medium">Welcome back, {user?.email?.split('@')[0] || "Admin"}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">System Online</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 shadow-sm" title={user?.email}>
              {user?.email?.[0].toUpperCase() || "A"}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
