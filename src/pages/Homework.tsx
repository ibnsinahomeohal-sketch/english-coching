import React, { useState, useEffect, FormEvent } from "react";
import { BookOpen, Upload, CheckCircle, Plus, FileText, Calendar, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";

export default function Homework() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ 
    title: "", 
    course_id: "", 
    batch_id: "", 
    dueDate: "" 
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const { data: coursesData } = await supabase.from('courses').select('*');
    if (coursesData) setCourses(coursesData);

    const { data: homeworkData } = await supabase
      .from('homework')
      .select(`
        *,
        courses (name),
        batches (name)
      `)
      .order('created_at', { ascending: false });
    if (homeworkData) setAssignments(homeworkData);
  };

  const handleCourseChange = async (courseId: string) => {
    setNewAssignment({ ...newAssignment, course_id: courseId, batch_id: "" });
    const { data: batchesData } = await supabase
      .from('batches')
      .select('*')
      .eq('course_id', courseId);
    if (batchesData) setBatches(batchesData);
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.dueDate || !newAssignment.course_id || !newAssignment.batch_id) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('homework')
        .insert([{
          title: newAssignment.title,
          course_id: newAssignment.course_id,
          batch_id: newAssignment.batch_id,
          due_date: newAssignment.dueDate,
        }])
        .select(`
          *,
          courses (name),
          batches (name)
        `)
        .single();

      if (error) throw error;

      setAssignments([data, ...assignments]);
      setNewAssignment({ title: "", course_id: "", batch_id: "", dueDate: "" });
      setShowAdd(false);
      toast.success("Assignment created and assigned successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create assignment");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(26, 12, 0, 0.06)' }}>
      <PageHero 
        title="Homework & Assignments"
        subtitle="Assign tasks to batches and track submissions"
        icon={BookOpen}
        darkColor="#1a0c00"
        badge="Homework"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="books" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="5" y="5" width="10" height="12" fill="#c2410c" fillOpacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#books)" />
          </svg>
        }
      />
      <div className="max-w-5xl mx-auto pb-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
                <select required value={newAssignment.course_id} onChange={e => handleCourseChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                <select 
                  required 
                  disabled={!newAssignment.course_id}
                  value={newAssignment.batch_id} 
                  onChange={e => setNewAssignment({...newAssignment, batch_id: e.target.value})} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white disabled:bg-gray-50"
                >
                  <option value="">Select Batch</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.batch_time})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" required value={newAssignment.dueDate} onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
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
                    <p className="text-xs text-gray-500">{assignment.courses?.name} • {assignment.batches?.name}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  Due: {new Date(assignment.due_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
