import React, { useState, useEffect, FormEvent } from "react";
import { Upload, FileText, Image as ImageIcon, Download, Search, BookOpen, Users, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";

export default function Notes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({ 
    title: "", 
    course_id: "", 
    batch_id: "", 
    file: null as File | null 
  });

  const [pdfConfig, setPdfConfig] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    batch_name: "All",
    title: "Lesson 1",
    visible_pages_start: 1,
    visible_pages_end: 10
  });

  useEffect(() => {
    fetchInitialData();
    fetchPdfData();
  }, []);

  const fetchPdfData = async () => {
    const { data: config } = await supabase.from('pdf_config').select('*').single();
    if (config) setPdfConfig(config);

    const { data: assignData } = await supabase.from('pdf_assignments').select('*').order('created_at', { ascending: false });
    if (assignData) setAssignments(assignData);

    const { data: logData } = await supabase.from('pdf_analytics').select('*').order('viewed_at', { ascending: false }).limit(20);
    if (logData) setAnalytics(logData);
  };

  const handleUpdateConfig = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      const { error } = await supabase.from('pdf_config').update(pdfConfig).eq('id', 'main_pdf');
      if (error) throw error;
      toast.success("PDF Institutional settings updated!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleAddAssignment = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('pdf_assignments').insert([newAssignment]);
      if (error) throw error;
      toast.success("New assignment created!");
      fetchPdfData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleUnlock = async (assignId: string, current: boolean) => {
    const expiresAt = !current ? new Date(Date.now() + 10 * 60 * 1000).toISOString() : null;
    try {
      const { error } = await supabase
        .from('pdf_assignments')
        .update({ 
          is_unlocked: !current,
          unlock_expires_at: expiresAt
        })
        .eq('id', assignId);
      if (error) throw error;
      toast.success(!current ? "Flash unlocked (10m)!" : "Locked access");
      fetchPdfData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    try {
      const { error } = await supabase.from('pdf_assignments').delete().eq('id', id);
      if (error) throw error;
      toast.success("Assignment removed");
      fetchPdfData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchInitialData = async () => {
    const { data: coursesData } = await supabase.from('courses').select('*');
    if (coursesData) setCourses(coursesData);

    const { data: notesData } = await supabase
      .from('notes')
      .select(`
        *,
        courses (name),
        batches (name)
      `)
      .order('created_at', { ascending: false });
    if (notesData) setNotes(notesData);
  };

  const handleCourseChange = async (courseId: string) => {
    setUploadData({ ...uploadData, course_id: courseId, batch_id: "" });
    const { data: batchesData } = await supabase
      .from('batches')
      .select('*')
      .eq('course_id', courseId);
    if (batchesData) setBatches(batchesData);
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.title || !uploadData.course_id || !uploadData.batch_id) {
      toast.error("Please fill in all fields and select a file");
      return;
    }

    setIsUploading(true);
    
    try {
      // In a real app, you'd upload the file to Supabase Storage first
      // For now, we'll just save the metadata and a mock URL
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          title: uploadData.title,
          course_id: uploadData.course_id,
          batch_id: uploadData.batch_id === "all" ? null : uploadData.batch_id,
          type: uploadData.file?.type.includes('image') ? 'image' : 'pdf',
          size: (uploadData.file!.size / (1024 * 1024)).toFixed(1) + " MB",
          file_url: "" // Real URL should come from Supabase Storage
        }])
        .select(`
          *,
          courses (name),
          batches (name)
        `)
        .single();

      if (error) throw error;

      setNotes([data, ...notes]);
      setUploadData({ title: "", course_id: "", batch_id: "", file: null });
      toast.success("Note uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload note");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(26, 12, 0, 0.06)' }}>
      <PageHero 
        title="Course Notes"
        subtitle="Upload and manage PDF/Image notes for students"
        icon={FileText}
        darkColor="#1a0c00"
        badge="Notes"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="files" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 5 2 L 15 2 L 15 18 L 5 18 Z" fill="none" stroke="#c2410c" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#files)" />
          </svg>
        }
      />
      <div className="max-w-6xl mx-auto pb-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Advanced PDF & Batch Control */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">Smart PDF Manager</h2>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Assignment & Customization</p>
                </div>
              </div>

              {/* Institutional Customization */}
              {pdfConfig && (
                <div className="mb-8 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 block">Institutional Branding</label>
                  <form onSubmit={handleUpdateConfig} className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Coaching Name"
                      value={pdfConfig.coaching_name}
                      onChange={e => setPdfConfig({...pdfConfig, coaching_name: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold" 
                    />
                    <input 
                      type="text" 
                      placeholder="Teacher Name"
                      value={pdfConfig.teacher_name}
                      onChange={e => setPdfConfig({...pdfConfig, teacher_name: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold" 
                    />
                    <input 
                      type="text" 
                      placeholder="PDF URL"
                      value={pdfConfig.file_url}
                      onChange={e => setPdfConfig({...pdfConfig, file_url: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-mono" 
                    />
                    <button type="submit" disabled={isSavingConfig} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-black transition-all">
                      {isSavingConfig ? "SAVING..." : "UPDATE BRANDING"}
                    </button>
                  </form>
                </div>
              )}

              {/* Create New Assignment */}
              <div className="mb-8 border-t border-slate-800 pt-6">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 block">New Page Assignment</label>
                <form onSubmit={handleAddAssignment} className="space-y-4">
                  <input 
                    type="text" 
                    required
                    placeholder="Assignment Title (e.g. Week 1)"
                    value={newAssignment.title}
                    onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={newAssignment.batch_name}
                      onChange={e => setNewAssignment({...newAssignment, batch_name: e.target.value})}
                      className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold outline-none bg-white/5"
                    >
                      <option value="All">All Batches</option>
                      {courses.map(c => (
                        <optgroup key={c.id} label={c.name}>
                          {batches.filter(b => b.course_id === c.id).map(b => (
                            <option key={b.id} value={b.name}>{b.name}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="Start"
                        value={newAssignment.visible_pages_start}
                        onChange={e => setNewAssignment({...newAssignment, visible_pages_start: parseInt(e.target.value)})}
                        className="w-full px-2 py-2 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs font-bold"
                      />
                      <input 
                        type="number" 
                        placeholder="End"
                        value={newAssignment.visible_pages_end}
                        onChange={e => setNewAssignment({...newAssignment, visible_pages_end: parseInt(e.target.value)})}
                        className="w-full px-2 py-2 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs font-bold"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4" /> CREATE ASSIGNMENT
                  </button>
                </form>
              </div>

              {/* Assignment List */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Active Assignments</label>
                {assignments.map(assign => (
                  <div key={assign.id} className="p-3 bg-slate-900/50 border border-slate-800 rounded-2xl group hover:border-slate-700 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-xs font-black text-white">{assign.title}</h4>
                        <p className="text-[10px] text-indigo-400 font-bold tracking-tight">{assign.batch_name} • Pages {assign.visible_pages_start}-{assign.visible_pages_end}</p>
                      </div>
                      <button onClick={() => handleDeleteAssignment(assign.id)} className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleToggleUnlock(assign.id, assign.is_unlocked)}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                          assign.is_unlocked 
                          ? "bg-amber-500 text-slate-900 animate-pulse" 
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {assign.is_unlocked ? "MANUALLY UNLOCKED (10m)" : "FLASH UNLOCK"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Analytics Summary */}
              {analytics.length > 0 && (
                <div className="mt-8 border-t border-slate-800 pt-6">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                    <Users className="h-3 w-3" /> Recent Activity
                  </label>
                  <div className="space-y-2">
                    {analytics.map(item => (
                      <div key={item.id} className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span className="font-bold text-slate-300">{item.student_name}</span>
                        <span className="text-[8px] opacity-50">opened book</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Upload New Note</h3>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note Title</label>
                  <input 
                    type="text" 
                    required
                    value={uploadData.title}
                    onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                    placeholder="e.g. Class 1 Vocabulary" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <select 
                    required 
                    value={uploadData.course_id} 
                    onChange={e => handleCourseChange(e.target.value)} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                  <select 
                    required 
                    disabled={!uploadData.course_id}
                    value={uploadData.batch_id} 
                    onChange={e => setUploadData({...uploadData, batch_id: e.target.value})} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white disabled:bg-gray-50"
                  >
                    <option value="">Select Batch</option>
                    <option value="all">All Batches</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.batch_time})</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF or Image)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors relative">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                          <span>{uploadData.file ? uploadData.file.name : "Upload a file"}</span>
                          <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            accept=".pdf,image/png,image/jpeg" 
                            onChange={(e) => setUploadData({...uploadData, file: e.target.files?.[0] || null})}
                            required
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isUploading || !uploadData.file}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Upload Note"}
                </button>
              </form>
            </div>
          </div>

          {/* Notes List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  Available Notes
                </h3>
              </div>
              
              <div className="divide-y divide-gray-100">
                {notes.map(note => (
                  <div key={note.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${note.type === 'pdf' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                        {note.type === 'pdf' ? <FileText className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{note.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                            {note.courses?.name} • {note.batches?.name || "All Batches"}
                          </span>
                          <span>{new Date(note.created_at).toLocaleDateString()}</span>
                          <span>{note.size}</span>
                        </div>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
