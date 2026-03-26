import { Zap, Flame, BookOpen, Award, TrendingUp, Target, MapPin, RefreshCw, CalendarCheck, CreditCard, FileQuestion, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { ColoredStatBox } from "../components/ColoredStatBox";
import { SectionBanner } from "../components/SectionBanner";
import { PageHero } from "../components/PageHero";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    recentAdmissions: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count, error } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        setStats(prev => ({ ...prev, totalStudents: count || 0 }));
      }

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());
      
      setStats(prev => ({ ...prev, recentAdmissions: recentCount || 0 }));
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(15, 10, 30, 0.06)' }}>
      <PageHero 
        title="Dashboard"
        subtitle="Overview of your English Therapy center"
        icon={LayoutDashboard}
        darkColor="#0f0a1e"
        badge="Overview"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#6C4DEF" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <path d="M 0 0 L 20 0 L 0 20 Z" fill="#6C4DEF" />
            <path d="M 80 0 L 100 0 L 100 20 Z" fill="#6C4DEF" />
            <path d="M 0 80 L 0 100 L 20 100 Z" fill="#6C4DEF" />
            <path d="M 80 100 L 100 100 L 100 80 Z" fill="#6C4DEF" />
          </svg>
        }
      />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "Attendance", icon: CalendarCheck, color: "var(--color-attendance)" },
            { name: "Fees", icon: CreditCard, color: "var(--color-fees)" },
            { name: "Homework", icon: BookOpen, color: "var(--color-homework)" },
            { name: "Exam", icon: FileQuestion, color: "var(--color-exams)" },
          ].map((action, i) => (
            <button key={i} className="flex items-center gap-3 p-4 rounded-xl text-white font-bold" style={{ backgroundColor: action.color }}>
              <action.icon className="h-5 w-5" />
              <span>{action.name}</span>
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <ColoredStatBox title="Total Students" value={stats.totalStudents} icon={Zap} trend={`+${stats.recentAdmissions} this week`} color="var(--color-dashboard)" />
          <ColoredStatBox title="Current Streak" value="0 Days" icon={Flame} trend="Start learning!" color="var(--color-attendance)" />
          <ColoredStatBox title="Lessons" value="0/0" icon={BookOpen} color="var(--color-homework)" />
          <ColoredStatBox title="Rank" value="None" icon={Award} color="var(--color-exams)" />
        </div>

        {/* Progress & Goal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-[14px] border border-[#E2E8F0] shadow-sm">
            <h3 className="text-sm font-bold text-[var(--color-dashboard)] uppercase mb-4">Learning Progress</h3>
            <div className="w-full bg-[#EDE9FE] rounded-full h-3">
              <div className="bg-[var(--color-dashboard)] h-3 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs font-medium text-gray-600 mt-2">20 out of 30 days completed</p>
          </div>

          <div className="bg-white p-6 rounded-[14px] border border-[#E2E8F0] shadow-sm">
            <h3 className="text-sm font-bold text-[var(--color-dashboard)] uppercase mb-4">Weekly Goal</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">0%</span>
              <span className="text-sm text-gray-600 mb-1">of weekly goal</span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-6 rounded-[14px] border border-[#E2E8F0] shadow-sm">
          <SectionBanner title="Our Location" color="var(--color-dashboard)" />
          <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#E2E8F0]">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3688.825638166548!2d91.1474771!3d23.0383828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37549f23f6d9b553%3A0xb28b2edc93a5eadb!2sChatarpaiya%20Bazar!5e0!3m2!1sen!2sbd!4v1710780000000!5m2!1sen!2sbd" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
