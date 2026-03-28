import React, { useState, useEffect, FormEvent } from "react";
import { BookOpen, Users, Plus, Trash2, Edit2, Save, X, Loader2, Clock } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { PageHero } from "../components/PageHero";

export default function CourseManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"courses" | "batches">("courses");
  
  // Form States
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newCourse, setNewCourse] = useState({ name: "", fee: "", duration: "" });
  const [newBatch, setNewBatch] = useState({ name: "", course_id: "", batch_time: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: coursesData, error: coursesError } = await supabase.from('courses').select('*').order('name');
      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

      const { data: batchesData, error: batchesError } = await supabase.from('batches').select('*, courses(name)').order('name');
      if (batchesError) throw batchesError;
      setBatches(batchesData || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCourse = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([{ name: newCourse.name, fee: parseFloat(newCourse.fee), duration: newCourse.duration }])
        .select();
      if (error) throw error;
      setCourses([...courses, data[0]]);
      setNewCourse({ name: "", fee: "", duration: "" });
      setShowAddCourse(false);
      toast.success("Course added successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBatch = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('batches')
        .insert([{ name: newBatch.name, course_id: newBatch.course_id, batch_time: newBatch.batch_time }])
        .select();
      if (error) throw error;
      
      // Refresh to get joined data
      fetchData();
      setNewBatch({ name: "", course_id: "", batch_time: "" });
      setShowAddBatch(false);
      toast.success("Batch added successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add batch");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure? This will not delete batches but may cause issues.")) return;
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      setCourses(courses.filter(c => c.id !== id));
      toast.success("Course deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete course");
    }
  };

  const handleDeleteBatch = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const { error } = await supabase.from('batches').delete().eq('id', id);
      if (error) throw error;
      setBatches(batches.filter(b => b.id !== id));
      toast.success("Batch deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete batch");
    }
  };

  return (
    <div className="min-h-screen pb-12" style={{ backgroundColor: 'rgba(0, 77, 64, 0.04)' }}>
      <PageHero 
        title="Course & Batch Management"
        subtitle="Define your academic structure"
        icon={BookOpen}
        darkColor="#004d40"
        badge="Academic"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#004d40" strokeWidth="0.5" opacity="0.1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        }
      />

      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        {/* Tabs */}
        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm mb-8 w-fit">
          <button 
            onClick={() => setActiveTab("courses")}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === "courses" ? "bg-[#004d40] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
          >
            Courses
          </button>
          <button 
            onClick={() => setActiveTab("batches")}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === "batches" ? "bg-[#004d40] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
          >
            Batches
          </button>
        </div>

        {activeTab === "courses" ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Available Courses</h2>
              <button 
                onClick={() => setShowAddCourse(!showAddCourse)}
                className="flex items-center gap-2 bg-[#004d40] text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#003d33] transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Course
              </button>
            </div>

            {showAddCourse && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in zoom-in-95 duration-200">
                <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course Name</label>
                    <input type="text" required value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#004d40]" placeholder="e.g. Spoken English" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fee (৳)</label>
                    <input type="number" required value={newCourse.fee} onChange={e => setNewCourse({...newCourse, fee: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#004d40]" placeholder="e.g. 5000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration</label>
                    <input type="text" required value={newCourse.duration} onChange={e => setNewCourse({...newCourse, duration: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#004d40]" placeholder="e.g. 3 Months" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#004d40] text-white py-2 rounded-lg font-bold disabled:opacity-50">
                      {isSubmitting ? "Saving..." : "Save"}
                    </button>
                    <button type="button" onClick={() => setShowAddCourse(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-500">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-3 py-12 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 text-[#004d40] animate-spin mb-2" />
                  <p className="text-sm text-gray-500">Loading courses...</p>
                </div>
              ) : courses.length === 0 ? (
                <div className="col-span-3 py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                  No courses added yet.
                </div>
              ) : courses.map((course) => (
                <div key={course.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 bg-emerald-50 text-[#004d40] rounded-xl flex items-center justify-center">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <button onClick={() => handleDeleteCourse(course.id)} className="text-gray-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{course.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-bold text-[#004d40]">৳{course.fee.toLocaleString()}</span>
                    <span>•</span>
                    <span>{course.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Active Batches</h2>
              <button 
                onClick={() => setShowAddBatch(!showAddBatch)}
                className="flex items-center gap-2 bg-[#004d40] text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#003d33] transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Batch
              </button>
            </div>

            {showAddBatch && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in zoom-in-95 duration-200">
                <form onSubmit={handleAddBatch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch Name/No</label>
                    <input type="text" required value={newBatch.name} onChange={e => setNewBatch({...newBatch, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#004d40]" placeholder="e.g. Batch-01" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course</label>
                    <select required value={newBatch.course_id} onChange={e => setNewBatch({...newBatch, course_id: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#004d40] bg-white">
                      <option value="">Select Course</option>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch Time</label>
                    <input type="text" required value={newBatch.batch_time} onChange={e => setNewBatch({...newBatch, batch_time: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#004d40]" placeholder="e.g. 10:00 AM - 12:00 PM" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#004d40] text-white py-2 rounded-lg font-bold disabled:opacity-50">
                      {isSubmitting ? "Saving..." : "Save"}
                    </button>
                    <button type="button" onClick={() => setShowAddBatch(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-500">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-3 py-12 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 text-[#004d40] animate-spin mb-2" />
                  <p className="text-sm text-gray-500">Loading batches...</p>
                </div>
              ) : batches.length === 0 ? (
                <div className="col-span-3 py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                  No batches added yet.
                </div>
              ) : batches.map((batch) => (
                <div key={batch.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6" />
                    </div>
                    <button onClick={() => handleDeleteBatch(batch.id)} className="text-gray-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{batch.name}</h3>
                  <p className="text-sm font-medium text-[#004d40] mb-3">{batch.courses?.name || "N/A"}</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 p-2 rounded-lg">
                    <Clock className="h-3 w-3" />
                    {batch.batch_time}
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
