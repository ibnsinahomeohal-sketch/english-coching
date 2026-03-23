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
    label: "MAIN",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Admission", href: "/admission", icon: UserPlus },
      { name: "All Students", href: "/students", icon: Users },
      { name: "Teachers", href: "/teachers", icon: GraduationCap },
      { name: "Operations", href: "/operations", icon: IdCard },
    ]
  },
  {
    label: "ACADEMIC",
    items: [
      { name: "Class Schedule", href: "/schedule", icon: Clock },
      { name: "Attendance", href: "/attendance", icon: CalendarCheck },
      { name: "Fees & Payments", href: "/fees", icon: CreditCard },
      { name: "Expenses", href: "/expenses", icon: TrendingDown },
      { name: "Homework", href: "/homework", icon: BookOpen },
      { name: "Certificates", href: "/certificates", icon: Award },
      { name: "Parent Portal", href: "/parent-portal", icon: User },
      { name: "Student Chat", href: "/chat", icon: MessageSquare },
      { name: "Course Notes", href: "/notes", icon: FileText },
      { name: "Exams (Admin)", href: "/exams", icon: FileQuestion },
      { name: "My Exams (Student)", href: "/my-exams", icon: GraduationCap },
      { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    ]
  },
  {
    label: "LEARNING",
    items: [
      { name: "Learning Module", href: "/learning", icon: BookOpen },
      { name: "Speaking Practice", href: "/speaking", icon: Mic },
      { name: "Community", href: "/community", icon: Users },
      { name: "EdTech", href: "/edtech", icon: BookOpen },
      { name: "Resources", href: "/resources", icon: Library },
      { name: "AI & Support", href: "/ai-support", icon: Bot },
    ]
  },
  {
    label: "ACCOUNT",
    items: [
      { name: "Finance", href: "/finance", icon: Wallet },
      { name: "Student Profile", href: "/profile", icon: UserCircle },
      { name: "Settings", href: "/settings", icon: SettingsIcon },
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
    <div className="flex h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-56 bg-[var(--bg2)] border-r border-[var(--bd)] flex flex-col transition-transform duration-300 md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-14 flex items-center px-6 border-b border-[var(--bd)]">
          <div className="w-6 h-6 bg-[var(--pri)] rounded-md mr-2" />
          <h1 className="text-sm font-bold tracking-tight">English Therapy</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              <h3 className="px-3 text-[9px] font-bold text-[var(--text3)] uppercase tracking-[1px] mb-2">
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
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 border-l-[3px]",
                        isActive
                          ? "bg-[var(--pri-bg)] text-[var(--pri)] border-[var(--pri)] font-semibold"
                          : "text-[var(--text2)] border-transparent hover:bg-[var(--bg3)]"
                      )}
                    >
                      <item.icon className={cn("mr-3 h-4 w-4", isActive ? "text-[var(--pri)]" : "text-[var(--text3)]")} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-[var(--bd)]">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-[var(--red)] bg-[var(--red-bg)] rounded-lg hover:opacity-90 transition-all"
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
            {navigationGroups.flatMap(g => g.items).find((n) => n.href === location.pathname)?.name || "Dashboard"}
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg bg-[var(--bg3)] text-[var(--text2)] hover:text-[var(--pri)]">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className="h-8 w-8 rounded-full bg-[var(--bg3)] flex items-center justify-center text-[var(--pri)] font-bold text-xs border border-[var(--bd)]" title={user?.email}>
              {user?.email?.[0].toUpperCase() || "A"}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
