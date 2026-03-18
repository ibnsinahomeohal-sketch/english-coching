import React, { useState, useEffect, FormEvent } from "react";
import { Clock, Plus, Trash2, Calendar } from "lucide-react";

export default function ClassSchedule() {
  const [schedules, setSchedules] = useState<{id: number, course: string, batch: string, time: string}[]>([]);
  const [newSchedule, setNewSchedule] = useState({ course: "Spoken English", batch: "", time: "" });

  useEffect(() => {
    const saved = localStorage.getItem("classSchedules");
    if (saved) setSchedules(JSON.parse(saved));
  }, []);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newSchedule.batch || !newSchedule.time) return;
    const updated = [...schedules, { ...newSchedule, id: Date.now() }];
    setSchedules(updated);
    localStorage.setItem("classSchedules", JSON.stringify(updated));
    setNewSchedule({ course: "Spoken English", batch: "", time: "" });
  };

  const handleDelete = (id: number) => {
    const updated = schedules.filter(s => s.id !== id);
    setSchedules(updated);
    localStorage.setItem("classSchedules", JSON.stringify(updated));
  };

  return (
    <div className="max-w-5xl mx-auto pb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Class Schedules</h2>
        <p className="text-sm text-gray-500 mt-1">Set class start times by Course and Batch for attendance tracking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Schedule Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Add New Schedule</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select 
                  value={newSchedule.course}
                  onChange={(e) => setNewSchedule({...newSchedule, course: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option>Spoken English</option>
                  <option>SSC/HSC English</option>
                  <option>Writing</option>
                  <option>Kids English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                <input 
                  type="text" 
                  required
                  value={newSchedule.batch}
                  onChange={(e) => setNewSchedule({...newSchedule, batch: e.target.value})}
                  placeholder="e.g. Morning-A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Start Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="time" 
                    required
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Save Schedule
              </button>
            </form>
          </div>
        </div>

        {/* Schedules List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Active Schedules
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {schedules.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No schedules added yet.</div>
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
                    <button 
                      onClick={() => handleDelete(schedule.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
