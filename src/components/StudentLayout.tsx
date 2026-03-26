import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, BookOpen, Clock, MessageSquare, FileText, 
  UserCircle, Settings as SettingsIcon, Mic, Users, Award, 
  LogOut, Bell, Sun, Moon, Menu, Bot
} from "lucide-react";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { MobileBottomNav } from "./MobileBottomNav";

const studentNavigation = [
  {
    label: "LEARNING",
    items: [
      { name: "Dashboard", href: "/student", icon: LayoutDashboard, color: "var(--color-dashboard)" },
      { name: "Class Schedule", href: "/schedule", icon: Clock, color: "var(--color-schedule)" },
      { name: "Homework", href: "/homework", icon: BookOpen, color: "var(--color-homework)" },
      { name: "Course Notes", href: "/notes", icon: FileText, color: "var(--color-learning)" },
      { name: "My Exams", href: "/my-exams", icon: Award, color: "var(--color-exams)" },
    ]
  },
  {
    label: "PRACTICE",
    items: [
      { name: "Speaking Practice", href: "/speaking", icon: Mic, color: "var(--color-learning)" },
      { name: "Community", href: "/community", icon: Users, color: "var(--color-dashboard)" },
      { name: "AI & Support", href: "/ai-support", icon: Bot, color: "var(--color-dashboard)" },
    ]
  },
  {
    label: "ACCOUNT",
    items: [
      { name: "Student Profile", href: "/profile", icon: UserCircle, color: "var(--color-dashboard)" },
      { name: "Settings", href: "/settings", icon: SettingsIcon, color: "var(--color-dashboard)" },
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
    <div className="flex h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-56 bg-[#1a1a2e] text-[#aaaaaa] flex flex-col transition-transform duration-300 md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-14 flex items-center px-6 border-b border-[#2a2a3e]">
          <div className="w-6 h-6 bg-[var(--color-dashboard)] rounded-md mr-2 flex items-center justify-center text-white text-xs font-bold">ET</div>
          <h1 className="text-sm font-bold tracking-tight text-white">Student Portal</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {studentNavigation.map((group) => (
            <div key={group.label}>
              <h3 className="px-3 text-[9px] font-bold text-[#666] uppercase tracking-[0.1em] mb-2">
                {group.label}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "relative flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                        isActive ? "font-semibold" : "hover:bg-[#2a2a3e] hover:text-white"
                      )}
                      style={{ color: isActive ? "white" : undefined }}
                    >
                      {isActive && <div className="absolute inset-0 rounded-lg opacity-15" style={{ backgroundColor: item.color }} />}
                      <div className={cn(
                        "relative flex items-center justify-center w-7 h-7 rounded-lg mr-3 transition-colors",
                      )}
                      style={{ backgroundColor: item.color }}
                      >
                        <item.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="relative">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-[#2a2a3e]">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-[var(--color-exams)] rounded-lg hover:bg-[#2a2a3e] transition-all"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-[var(--bg2)] border-b border-[var(--bd)] flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <button className="md:hidden p-2" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-sm font-bold text-[var(--text)]">
            {studentNavigation.flatMap(g => g.items).find((n) => n.href === location.pathname)?.name || "Dashboard"}
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg bg-[var(--bg3)] text-[var(--text2)] hover:text-[var(--pri)]">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className="h-8 w-8 rounded-full bg-[var(--bg3)] flex items-center justify-center text-[var(--pri)] font-bold text-xs border border-[var(--bd)]" title={user?.email}>
              {user?.email?.[0].toUpperCase() || "S"}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
