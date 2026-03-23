import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CalendarCheck, CreditCard, MoreHorizontal, X, UserPlus, IdCard, BookOpen, GraduationCap, Clock, TrendingDown, Award, MessageSquare, FileText, FileQuestion, Trophy, Mic, Bot, Library, Wallet, UserCircle, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Students", href: "/students", icon: Users },
  { name: "Attendance", href: "/attendance", icon: CalendarCheck },
  { name: "Fees", href: "/fees", icon: CreditCard },
  { name: "More", href: "#", icon: MoreHorizontal, isMore: true },
];

const allItems = [
  { name: "Admission", href: "/admission", icon: UserPlus },
  { name: "Teachers", href: "/teachers", icon: GraduationCap },
  { name: "Operations", href: "/operations", icon: IdCard },
  { name: "Class Schedule", href: "/schedule", icon: Clock },
  { name: "Expenses", href: "/expenses", icon: TrendingDown },
  { name: "Homework", href: "/homework", icon: BookOpen },
  { name: "Certificates", href: "/certificates", icon: Award },
  { name: "Parent Portal", href: "/parent-portal", icon: UserCircle },
  { name: "Student Chat", href: "/chat", icon: MessageSquare },
  { name: "Course Notes", href: "/notes", icon: FileText },
  { name: "Exams", href: "/exams", icon: FileQuestion },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Learning", href: "/learning", icon: BookOpen },
  { name: "Speaking", href: "/speaking", icon: Mic },
  { name: "Community", href: "/community", icon: Users },
  { name: "EdTech", href: "/edtech", icon: BookOpen },
  { name: "Resources", href: "/resources", icon: Library },
  { name: "AI Support", href: "/ai-support", icon: Bot },
  { name: "Finance", href: "/finance", icon: Wallet },
  { name: "Profile", href: "/profile", icon: UserCircle },
  { name: "Settings", href: "/settings", icon: Settings },
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
              location.pathname === item.href ? "text-[var(--pri)]" : "text-[var(--text3)]"
            )}
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
                <item.icon className="h-8 w-8 text-[var(--pri)] mb-2" />
                <span className="text-xs font-medium text-[var(--text2)]">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
