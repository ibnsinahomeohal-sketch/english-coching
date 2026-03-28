import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CalendarCheck, CreditCard, MoreHorizontal, X, UserPlus, IdCard, BookOpen, GraduationCap, Clock, TrendingDown, Award, MessageSquare, FileText, FileQuestion, Trophy, Mic, Bot, Library, Wallet, UserCircle, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, color: "var(--color-dashboard)" },
  { name: "Students", href: "/admin/students", icon: Users, color: "var(--color-dashboard)" },
  { name: "Attendance", href: "/admin/attendance", icon: CalendarCheck, color: "var(--color-attendance)" },
  { name: "Fees", href: "/admin/fees", icon: CreditCard, color: "var(--color-fees)" },
  { name: "More", href: "#", icon: MoreHorizontal, isMore: true, color: "var(--color-dashboard)" },
];

const allItems = [
  { name: "Admission", href: "/admin/admission", icon: UserPlus, color: "var(--color-dashboard)" },
  { name: "Teachers", href: "/admin/teachers", icon: GraduationCap, color: "var(--color-dashboard)" },
  { name: "Operations", href: "/admin/operations", icon: IdCard, color: "var(--color-dashboard)" },
  { name: "Class Schedule", href: "/admin/schedule", icon: Clock, color: "var(--color-schedule)" },
  { name: "Expenses", href: "/admin/expenses", icon: TrendingDown, color: "var(--color-fees)" },
  { name: "Homework", href: "/admin/homework", icon: BookOpen, color: "var(--color-homework)" },
  { name: "Certificates", href: "/admin/certificates", icon: Award, color: "var(--color-learning)" },
  { name: "Parent Portal", href: "/admin/parent-portal", icon: UserCircle, color: "var(--color-dashboard)" },
  { name: "Student Chat", href: "/admin/chat", icon: MessageSquare, color: "var(--color-dashboard)" },
  { name: "Course Notes", href: "/admin/notes", icon: FileText, color: "var(--color-learning)" },
  { name: "Exams", href: "/admin/exams", icon: FileQuestion, color: "var(--color-exams)" },
  { name: "Leaderboard", href: "/admin/leaderboard", icon: Trophy, color: "var(--color-exams)" },
  { name: "Learning", href: "/admin/learning", icon: BookOpen, color: "var(--color-learning)" },
  { name: "Speaking", href: "/admin/speaking", icon: Mic, color: "var(--color-learning)" },
  { name: "Community", href: "/admin/community", icon: Users, color: "var(--color-dashboard)" },
  { name: "EdTech", href: "/admin/edtech", icon: BookOpen, color: "var(--color-learning)" },
  { name: "Resources", href: "/admin/resources", icon: Library, color: "var(--color-learning)" },
  { name: "AI Support", href: "/admin/ai-support", icon: Bot, color: "var(--color-dashboard)" },
  { name: "Finance", href: "/admin/finance", icon: Wallet, color: "var(--color-fees)" },
  { name: "Profile", href: "/admin/profile", icon: UserCircle, color: "var(--color-dashboard)" },
  { name: "Settings", href: "/admin/settings", icon: Settings, color: "var(--color-dashboard)" },
];

export function MobileBottomNav() {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg2)] border-t border-[var(--bd)] h-16 flex items-center justify-around z-50 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => item.isMore ? setIsMoreOpen(true) : null}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full",
              location.pathname === item.href ? "font-semibold" : "text-[var(--text3)]"
            )}
            style={{ color: location.pathname === item.href ? item.color : undefined }}
          >
            {!item.isMore ? (
              <Link to={item.href} className="flex flex-col items-center">
                <item.icon className="h-6 w-6" />
                <span className="text-[10px] font-medium mt-1">{item.name}</span>
              </Link>
            ) : (
              <>
                <item.icon className="h-6 w-6" />
                <span className="text-[10px] font-medium mt-1">{item.name}</span>
              </>
            )}
          </button>
        ))}
      </div>

      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 bg-[var(--bg2)] z-50 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">More</h2>
            <button onClick={() => setIsMoreOpen(false)}><X className="h-6 w-6" /></button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {allItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMoreOpen(false)}
                className="flex flex-col items-center text-center p-2 rounded-xl hover:bg-[var(--bg3)]"
              >
                <item.icon className="h-8 w-8 mb-2" style={{ color: item.color }} />
                <span className="text-xs font-medium text-[var(--text2)]">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
