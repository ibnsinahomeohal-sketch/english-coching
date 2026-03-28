import { 
  Users, GraduationCap, CreditCard, CalendarCheck, 
  TrendingUp, ArrowUpRight, ArrowDownRight, 
  Clock, BookOpen, FileQuestion, Trophy, Activity, MessageSquare
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { cn } from "../lib/utils";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    recentAdmissions: 0,
    pendingAdmissions: 0,
    totalRevenue: 0,
    attendanceRate: 0
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

      // Calculate Total Revenue from students paid_amount
      const { data: studentsRevenue } = await supabase
        .from('students')
        .select('paid_amount');
      
      const revenue = (studentsRevenue || []).reduce((acc, curr) => acc + (curr.paid_amount || 0), 0);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());
      
      const { count: pendingCount } = await supabase
        .from('pending_admissions')
        .select('*', { count: 'exact', head: true });

      const { count: activeClassesCount } = await supabase
        .from('batches')
        .select('*', { count: 'exact', head: true });
      
      setStats(prev => ({ 
        ...prev, 
        recentAdmissions: recentCount || 0,
        pendingAdmissions: pendingCount || 0,
        totalRevenue: revenue,
        attendanceRate: activeClassesCount || 0 // Reusing attendanceRate state for active classes count for now or adding a new one
      }));
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: stats.totalStudents, icon: Users, trend: `+${stats.recentAdmissions}`, color: "primary" },
          { label: "Pending Requests", value: stats.pendingAdmissions, icon: MessageSquare, trend: "New", color: "secondary" },
          { label: "Total Revenue", value: `৳${stats.totalRevenue.toLocaleString()}`, icon: CreditCard, trend: "Live", color: "accent" },
          { label: "Active Batches", value: stats.attendanceRate, icon: Clock, trend: "Stable", color: "primary" },
        ].map((stat, i) => (
          <div key={i} className="card-premium p-6 group">
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm",
                stat.color === 'primary' ? "bg-[#004d40]/10 text-[#004d40]" :
                stat.color === 'secondary' ? "bg-[#ffc107]/10 text-[#ffc107]" :
                "bg-[#00695c]/10 text-[#00695c]"
              )}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold",
                stat.trend.startsWith('+') ? 'text-[#004d40]' : 'text-slate-400'
              )}>
                {stat.trend.startsWith('+') && <ArrowUpRight className="h-3 w-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-display font-bold text-slate-900 tracking-tight">{stat.value}</h3>
              <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area Placeholder */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card-premium p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-display font-bold text-gray-900">Student Growth</h3>
                <p className="text-sm text-gray-400 font-medium">Monthly enrollment statistics</p>
              </div>
              <select className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-600 outline-none focus:ring-2 focus:ring-[#004d40]/20">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {[0, 0, 0, 0, 0, 0].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                  <div 
                    className="w-full bg-[#004d40]/10 rounded-t-xl group-hover:bg-[#004d40]/30 transition-all duration-500 relative"
                    style={{ height: `${h || 5}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {h}%
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-premium p-6 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full border-4 border-[#004d40]/10 border-t-[#004d40] flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">0%</span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-900">Daily Target</h4>
                  <p className="text-xs text-gray-400 font-medium">0/0 classes completed</p>
                </div>
              </div>
              <div className="card-premium p-6 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full border-4 border-[#ffc107]/10 border-t-[#ffc107] flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">0%</span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-900">Student Satisfaction</h4>
                  <p className="text-xs text-gray-400 font-medium">No recent feedback</p>
                </div>
              </div>
            </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <div className="card-premium p-8">
            <h3 className="text-lg font-display font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: "Take Attendance", icon: CalendarCheck, color: "primary" },
                { name: "Collect Fees", icon: CreditCard, color: "secondary" },
                { name: "Assign Homework", icon: BookOpen, color: "accent" },
                { name: "Create Exam", icon: FileQuestion, color: "primary" },
              ].map((action, i) => (
                <button key={i} className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group",
                  action.color === 'primary' ? "bg-[#004d40]/5 text-[#004d40] hover:bg-[#004d40]/10" :
                  action.color === 'secondary' ? "bg-[#ffc107]/5 text-[#ffc107] hover:bg-[#ffc107]/10" :
                  "bg-[#00695c]/5 text-[#00695c] hover:bg-[#00695c]/10"
                )}>
                  <div className={`p-2 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-sm">{action.name}</span>
                  <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          <div className="card-premium p-8 overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-lg font-display font-bold text-gray-900 mb-2">Center Location</h3>
              <p className="text-xs text-gray-400 font-medium mb-6">Chatarpaiya Bazar, Feni</p>
              <div className="aspect-square w-full rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-gray-100">
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
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
