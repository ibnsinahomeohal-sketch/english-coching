import React, { useState, useEffect } from "react";
import { Clock, Calendar } from "lucide-react";
import { PageHero } from "../components/PageHero";

export default function StudentClassSchedule() {
  const [schedules, setSchedules] = useState<{id: number, course: string, batch: string, time: string}[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("classSchedules");
    if (saved) setSchedules(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(17, 17, 17, 0.06)' }}>
      <PageHero 
        title="My Class Schedule"
        subtitle="View your upcoming class timings"
        icon={Calendar}
        darkColor="#111111"
        badge="Schedule"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="calendar" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="2" y="2" width="16" height="16" fill="none" stroke="#444" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#calendar)" />
          </svg>
        }
      />
      <div className="max-w-3xl mx-auto pb-8 pt-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Your Class Schedule
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {schedules.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No schedules available yet.</div>
            ) : (
              schedules.map(schedule => (
                <div key={schedule.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="font-medium text-gray-900">{schedule.course}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">Batch: {schedule.batch}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {schedule.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
