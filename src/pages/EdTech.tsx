import { BookOpen, Trophy, Upload } from "lucide-react";

export default function EdTech() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Vocab */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl text-white shadow-sm">
          <div className="flex items-center gap-2 mb-4 opacity-80">
            <BookOpen className="h-5 w-5" />
            <h3 className="font-medium">Daily Vocabulary</h3>
          </div>
          <div className="text-center py-4">
            <h2 className="text-4xl font-bold mb-2">Ubiquitous</h2>
            <p className="text-indigo-100 italic mb-4">[ yoo-bik-wi-tuhs ]</p>
            <p className="text-sm bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              Present, appearing, or found everywhere.
              <br />
              <span className="opacity-70 mt-2 block">"His ubiquitous influence was felt by all."</span>
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Course Progress</h3>
          <div className="space-y-6">
            <ProgressItem title="Spoken English - Fluency" progress={85} />
            <ProgressItem title="Writing - Paragraph Structure" progress={40} />
            <ProgressItem title="SSC/HSC English - Grammar" progress={65} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Homework System */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Homework Submission</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-6 w-6 text-indigo-600" />
            </div>
            <h4 className="font-medium text-gray-900">Upload Assignment</h4>
            <p className="text-sm text-gray-500 mt-1">Take a photo of your notebook and upload</p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Leaderboard</h3>
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div className="space-y-4">
            {[].map((student: any) => (
              <div key={student.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${
                    student.rank === 1 ? 'bg-amber-100 text-amber-700' :
                    student.rank === 2 ? 'bg-gray-200 text-gray-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    #{student.rank}
                  </div>
                  <span className="font-medium text-gray-900">{student.name}</span>
                </div>
                <span className="font-bold text-indigo-600">{student.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressItem({ title, progress }: { title: string, progress: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-2">
        <span className="text-gray-700">{title}</span>
        <span className="text-indigo-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}
