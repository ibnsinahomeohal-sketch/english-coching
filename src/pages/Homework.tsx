import React, { useState, FormEvent } from "react";
import { BookOpen, Upload, CheckCircle, Plus, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";

const initialHomework: any[] = [];

export default function Homework() {
  const [assignments, setAssignments] = useState(initialHomework);
  const [showAdd, setShowAdd] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: "", course: "Spoken English", batch: "", dueDate: "" });

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.dueDate) return;

    setAssignments([{
      id: Date.now(),
      ...newAssignment,
      status: "Active"
    }, ...assignments]);
    
    setNewAssignment({ title: "", course: "Spoken English", batch: "", dueDate: "" });
    setShowAdd(false);
    toast.success("Assignment created and assigned successfully!");
  };

  return (
    <div className="max-w-5xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Homework & Assignments</h2>
          <p className="text-sm text-gray-500 mt-1">Assign tasks to batches and track submissions</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {showAdd ? "Cancel" : "Create Assignment"}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">New Assignment</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
              <input type="text" required value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Read Chapter 4 and summarize" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select value={newAssignment.course} onChange={e => setNewAssignment({...newAssignment, course: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                <option>Spoken English</option>
                <option>SSC/HSC English</option>
                <option>Writing</option>
                <option>Kids English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
              <input type="text" required value={newAssignment.batch} onChange={e => setNewAssignment({...newAssignment, batch: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Morning-A" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" required value={newAssignment.dueDate} onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (Optional)</label>
              <input type="file" className="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Assign to Students
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map(assignment => (
          <div key={assignment.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                  <p className="text-xs text-gray-500">{assignment.course} • {assignment.batch}</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {assignment.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                Due: {assignment.dueDate}
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-gray-400" />
                0/15 Submitted
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
