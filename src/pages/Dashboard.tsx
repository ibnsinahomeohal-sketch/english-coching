import { Zap, Flame, BookOpen, Award, TrendingUp, Target, MapPin, ChevronRight, CalendarCheck, CreditCard, FileQuestion, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Card } from "../components/ui/Card";
import { cn } from "../lib/utils";

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
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-[var(--pri)] to-[var(--pri-t)] p-6 rounded-2xl text-white flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Welcome back, Admin!</h1>
          <p className="text-sm opacity-80 mt-1">{new Date().toLocaleDateString()} • Evening Batch</p>
        </div>
        <div className="h-12 w-12 rounded-full border-2 border-white/20 flex items-center justify-center font-bold text-lg">A</div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: "Attendance", icon: CalendarCheck, color: "border-[var(--green)]", textColor: "text-[var(--green)]" },
          { name: "Fees", icon: CreditCard, color: "border-[var(--blue)]", textColor: "text-[var(--blue)]" },
          { name: "Homework", icon: BookOpen, color: "border-[var(--amber)]", textColor: "text-[var(--amber)]" },
          { name: "Exam", icon: FileQuestion, color: "border-[var(--pri)]", textColor: "text-[var(--pri)]" },
        ].map((action, i) => (
          <button key={i} className={cn("flex items-center justify-between p-4 bg-[var(--bg2)] border-l-4 rounded-xl border border-[var(--bd)]", action.color)}>
            <div className="flex items-center gap-3">
              <action.icon className={cn("h-5 w-5", action.textColor)} />
              <span className="text-sm font-bold">{action.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Total Students" value={stats.totalStudents.toString()} icon={Zap} trend={`+${stats.recentAdmissions} this week`} color="text-[var(--amber)]" />
        <StatCard title="Current Streak" value="0 Days" icon={Flame} trend="Start learning!" color="text-[var(--red)]" />
        <StatCard title="Lessons" value="0/0" icon={BookOpen} trend="Not started" color="text-[var(--pri)]" />
        <StatCard title="Rank" value="None" icon={Award} trend="Newbie" color="text-[var(--green)]" />
      </div>

      {/* Progress & Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[var(--text2)] uppercase">Learning Progress</h3>
            <TrendingUp className="h-5 w-5 text-[var(--text3)]" />
          </div>
          <div className="w-full bg-[var(--bg3)] rounded-full h-3">
            <div className="bg-[var(--pri)] h-3 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs font-medium text-[var(--text2)] mt-2">20 out of 30 days completed</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[var(--text2)] uppercase">Weekly Goal</h3>
            <Target className="h-5 w-5 text-[var(--text3)]" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-[var(--text)]">0%</span>
            <span className="text-sm text-[var(--text2)] mb-1">of weekly goal</span>
          </div>
        </Card>
      </div>

      {/* Location */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[var(--red)]" />
            <h3 className="text-sm font-bold text-[var(--text2)] uppercase">Our Location</h3>
          </div>
          <button onClick={fetchStats} className="p-2 rounded-lg bg-[var(--bg3)] text-[var(--text2)]">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="aspect-video w-full rounded-xl overflow-hidden border border-[var(--bd)]">
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ border: 0 }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3688.825638166548!2d91.1474771!3d23.0383828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37549f23f6d9b553%3A0xb28b2edc93a5eadb!2sChatarpaiya%20Bazar!5e0!3m2!1sen!2sbd!4v1710780000000!5m2!1sen!2sbd" 
            allowFullScreen
          ></iframe>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color }: any) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className={cn("p-2 rounded-lg bg-[var(--bg3)]", color)}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-bold text-[var(--green)] bg-[var(--green-bg)] px-2 py-0.5 rounded-full">{trend}</span>
      </div>
      <p className="text-xs font-medium text-[var(--text2)]">{title}</p>
      <p className="text-xl font-bold text-[var(--text)]">{value}</p>
    </Card>
  );
}
