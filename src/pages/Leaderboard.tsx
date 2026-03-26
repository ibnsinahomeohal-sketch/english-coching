import { useState } from "react";
import { Trophy, Medal, Award, Calendar, Star } from "lucide-react";
import { PageHero } from "../components/PageHero";

const COURSES = ["Spoken English", "Writing", "Kids English", "SSC/HSC English"];
const MONTHS = ["March 2026 (Current)", "February 2026", "January 2026"];

const MOCK_LEADERBOARD: any[] = [];

export default function Leaderboard() {
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);

  const topThree = MOCK_LEADERBOARD.slice(0, 3);
  const restOfStudents = MOCK_LEADERBOARD.slice(3);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(15, 10, 30, 0.06)' }}>
      <PageHero 
        title="Monthly Leaderboard"
        subtitle="Daily exam points are accumulated here. Top 3 win monthly prizes!"
        icon={Trophy}
        darkColor="#0f0a1e"
        badge="Leaderboard"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="trophies" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 5 5 L 15 5 L 15 8 C 15 12 5 12 5 8 Z M 10 8 L 10 15 M 7 15 L 13 15" fill="none" stroke="#4c1d95" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#trophies)" />
          </svg>
        }
      />
      <div className="max-w-5xl mx-auto pb-8 pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" /> 
              Monthly Leaderboard
            </h2>
            <p className="text-gray-500 mt-1 font-medium">Daily exam points are accumulated here. Top 3 win monthly prizes!</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
              >
                {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
              >
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Podium for Top 3 */}
        {topThree.length > 0 ? (
          <div className="flex flex-col md:flex-row justify-center items-end gap-4 md:gap-8 mb-12 mt-12 px-4">
            {/* 2nd Place */}
            {topThree[1] && (
              <div className="flex flex-col items-center order-2 md:order-1 relative w-full md:w-1/3 max-w-[200px]">
                <div className="absolute -top-6 bg-gray-200 text-gray-700 font-bold px-3 py-1 rounded-full text-sm border-2 border-white shadow-md z-20 flex items-center gap-1">
                  <Medal className="h-4 w-4" /> 2nd
                </div>
                <div className="h-24 w-24 rounded-full border-4 border-gray-300 overflow-hidden shadow-lg z-10 bg-white">
                  <img src={topThree[1].photo} alt={topThree[1].name} className="w-full h-full object-cover" />
                </div>
                <div className="bg-gradient-to-t from-gray-200 to-gray-100 w-full pt-12 pb-6 px-4 rounded-t-2xl -mt-10 text-center shadow-inner border border-gray-200">
                  <h3 className="font-bold text-gray-900 truncate">{topThree[1].name}</h3>
                  <p className="text-indigo-600 font-black text-xl mt-1">{topThree[1].points} <span className="text-xs text-gray-500 font-medium">pts</span></p>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <div className="flex flex-col items-center order-1 md:order-2 relative w-full md:w-1/3 max-w-[220px] -mt-8 md:mt-0">
                <div className="absolute -top-8 bg-yellow-400 text-yellow-900 font-black px-4 py-1.5 rounded-full text-sm border-2 border-white shadow-lg z-20 flex items-center gap-1">
                  <Trophy className="h-4 w-4" /> 1st Place
                </div>
                <div className="h-32 w-32 rounded-full border-4 border-yellow-400 overflow-hidden shadow-xl z-10 bg-white relative">
                  <img src={topThree[0].photo} alt={topThree[0].name} className="w-full h-full object-cover" />
                </div>
                <div className="bg-gradient-to-t from-yellow-100 to-yellow-50 w-full pt-16 pb-8 px-4 rounded-t-2xl -mt-12 text-center shadow-inner border border-yellow-200">
                  <h3 className="font-black text-gray-900 text-lg truncate">{topThree[0].name}</h3>
                  <p className="text-yellow-600 font-black text-2xl mt-1">{topThree[0].points} <span className="text-xs text-yellow-700 font-medium">pts</span></p>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <div className="flex flex-col items-center order-3 md:order-3 relative w-full md:w-1/3 max-w-[200px]">
                <div className="absolute -top-6 bg-orange-200 text-orange-800 font-bold px-3 py-1 rounded-full text-sm border-2 border-white shadow-md z-20 flex items-center gap-1">
                  <Award className="h-4 w-4" /> 3rd
                </div>
                <div className="h-24 w-24 rounded-full border-4 border-orange-300 overflow-hidden shadow-lg z-10 bg-white">
                  <img src={topThree[2].photo} alt={topThree[2].name} className="w-full h-full object-cover" />
                </div>
                <div className="bg-gradient-to-t from-orange-100 to-orange-50 w-full pt-12 pb-6 px-4 rounded-t-2xl -mt-10 text-center shadow-inner border border-orange-200">
                  <h3 className="font-bold text-gray-900 truncate">{topThree[2].name}</h3>
                  <p className="text-orange-600 font-black text-xl mt-1">{topThree[2].points} <span className="text-xs text-orange-700 font-medium">pts</span></p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center mb-12">
            <Trophy className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No leaderboard data yet</h3>
            <p className="text-gray-500">Points will appear here once students start taking exams.</p>
          </div>
        )}

        {/* Rest of the Leaderboard */}
        {restOfStudents.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900">Other Top Performers</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {restOfStudents.map((student) => (
                <div key={student.rank} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center font-bold text-gray-400">
                      #{student.rank}
                    </div>
                    <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    <div>
                      <h4 className="font-bold text-gray-900">{student.name}</h4>
                      <p className="text-xs text-gray-500 font-medium">{student.exams} Exams Taken</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-black text-gray-900">{student.points}</span>
                    <span className="text-xs text-gray-500 font-medium">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
