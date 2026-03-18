import { Zap, Flame, BookOpen, Award, TrendingUp, Target, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

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

      // Fetch recent (last 7 days)
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={fetchStats} className="bg-zinc-100 text-zinc-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-200 transition-colors">
            Refresh Stats
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors">
            Continue Learning
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.totalStudents.toString()} icon={Zap} trend={`+${stats.recentAdmissions} this week`} color="text-amber-500" />
        <StatCard title="Current Streak" value="0 Days" icon={Flame} trend="Start learning!" color="text-rose-500" />
        <StatCard title="Lessons" value="0/0" icon={BookOpen} trend="Not started" color="text-indigo-500" />
        <StatCard title="Rank" value="None" icon={Award} trend="Newbie" color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-zinc-900">Learning Progress</h3>
              <TrendingUp className="h-5 w-5 text-zinc-400" />
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-3">
              <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <p className="text-sm text-zinc-500 mt-3 font-medium">0 out of 0 days completed</p>
          </div>

          {/* Free Google Maps Embed */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-500" />
                <h3 className="text-lg font-semibold text-zinc-900">Our Location</h3>
              </div>
              <span className="text-xs font-medium text-zinc-500">Free Embed Mode</span>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-zinc-100">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0 }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3688.825638166548!2d91.1474771!3d23.0383828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37549f23f6d9b553%3A0xb28b2edc93a5eadb!2sChatarpaiya%20Bazar!5e0!3m2!1sen!2sbd!4v1710780000000!5m2!1sen!2sbd" 
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-xs text-zinc-400 mt-2 italic">* This is a free Google Maps embed. No API key required.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-zinc-900">Weekly Goal</h3>
              <Target className="h-5 w-5 text-zinc-400" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-zinc-900">0%</span>
              <span className="text-sm text-zinc-500 mb-1">of weekly goal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-zinc-100 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <p className="text-sm font-medium text-zinc-500">{title}</p>
      <p className="text-2xl font-bold text-zinc-900 mt-1">{value}</p>
    </div>
  );
}
