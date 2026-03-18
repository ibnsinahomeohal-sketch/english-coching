import { Zap, Flame, BookOpen, Award, TrendingUp, Target } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Dashboard</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors">
          Continue Learning
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total XP" value="0" icon={Zap} trend="+0 XP" color="text-amber-500" />
        <StatCard title="Current Streak" value="0 Days" icon={Flame} trend="Start learning!" color="text-rose-500" />
        <StatCard title="Lessons" value="0/0" icon={BookOpen} trend="Not started" color="text-indigo-500" />
        <StatCard title="Rank" value="None" icon={Award} trend="Newbie" color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-zinc-900">Learning Progress</h3>
            <TrendingUp className="h-5 w-5 text-zinc-400" />
          </div>
          <div className="w-full bg-zinc-100 rounded-full h-3">
            <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-sm text-zinc-500 mt-3 font-medium">0 out of 0 days completed</p>
        </div>
        
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
