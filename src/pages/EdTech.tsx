import React, { useState, useEffect, FormEvent } from "react";
import { BookOpen, Trophy, Upload, CheckCircle, Search, MessageSquare, Award, X } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function EdTech() {
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({ 
    title: "", 
    course_id: "", 
    batch_id: "", 
    dueDate: "",
    file: null as File | null 
  });

  // Tracking state
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [gradingStudent, setGradingStudent] = useState<any>(null);
  const [marks, setMarks] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const { data: coursesData } = await supabase.from('courses').select('*');
    if (coursesData) setCourses(coursesData);
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
    if (!uploadData.title || !uploadData.course_id || !uploadData.batch_id || !uploadData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsUploading(true);
    
    try {
      const { data, error } = await supabase
        .from('homework')
        .insert([{
          title: uploadData.title,
          course_id: uploadData.course_id,
          batch_id: uploadData.batch_id,
          due_date: uploadData.dueDate,
        }])
        .select()
        .single();

      if (error) throw error;

      setUploadData({ title: "", course_id: "", batch_id: "", dueDate: "", file: null });
      toast.success("Homework assigned successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to assign homework");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendWhatsApp = (phone: string, name: string) => {
    const message = `Hello ${name}, you have not submitted your recent homework. Please submit it as soon as possible.`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success(`WhatsApp message opened for ${name}`);
  };

  const handleGradeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!marks) return;

    // Update local state
    setSubmissions(submissions.map(sub => 
      sub.id === gradingStudent.id ? { ...sub, marks: parseInt(marks) } : sub
    ));

    // Send WhatsApp notification
    const message = `Hello ${gradingStudent.studentName}, your homework has been graded. You received ${marks} marks. Great job!`;
    const whatsappUrl = `https://wa.me/${gradingStudent.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    toast.success(`Marks saved and notification sent to ${gradingStudent.studentName}`);
    setGradingStudent(null);
    setMarks("");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(10, 21, 0, 0.06)' }}>
      <PageHero 
        title="EdTech Learning"
        subtitle="Interactive learning and progress tracking"
        icon={BookOpen}
        darkColor="#0a1500"
        badge="EdTech"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="leaves" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 10 0 C 15 5 15 15 10 20 C 5 15 5 5 10 0" fill="none" stroke="#15803d" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#leaves)" />
          </svg>
        }
      />
      <div className="max-w-5xl mx-auto pb-8 pt-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Vocab */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl text-white shadow-sm">
            <div className="flex items-center gap-2 mb-4 opacity-80">
              <BookOpen className="h-5 w-5" />
              <h3 className="font-medium">Daily Vocabulary</h3>
            </div>
            <div className="text-center py-4">
              <h2 className="text-4xl font-bold mb-2">Word of the Day</h2>
              <p className="text-indigo-100 italic mb-4">Expand your vocabulary</p>
              <p className="text-sm bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                New words will appear here daily to help you improve your English skills.
              </p>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Today's Homework Leaderboard</h3>
              <Trophy className="h-5 w-5 text-amber-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {leaderboard.length > 0 ? leaderboard.map((student) => (
                <div key={student.rank} className={`p-4 rounded-xl border flex flex-col items-center text-center ${
                  student.rank === 1 ? 'bg-amber-50 border-amber-200' :
                  student.rank === 2 ? 'bg-gray-50 border-gray-200' :
                  'bg-orange-50 border-orange-200'
                }`}>
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-xl mb-3 ${
                    student.rank === 1 ? 'bg-amber-100 text-amber-700' :
                    student.rank === 2 ? 'bg-gray-200 text-gray-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    #{student.rank}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{student.name}</h4>
                  <div className="flex items-center gap-1 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    <Award className="h-4 w-4" />
                    {student.score} Marks
                  </div>
                </div>
              )) : (
                <div className="col-span-3 text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No leaderboard data available yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Homework System */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Homework</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
                <input 
                  type="text" 
                  required 
                  value={uploadData.title} 
                  onChange={e => setUploadData({...uploadData, title: e.target.value})} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g. Read Chapter 4" 
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
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.batch_time})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input 
                  type="date" 
                  required 
                  value={uploadData.dueDate} 
                  onChange={e => setUploadData({...uploadData, dueDate: e.target.value})} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignment File (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={e => setUploadData({...uploadData, file: e.target.files?.[0] || null})}
                  />
                  <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Upload className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm">
                    {uploadData.file ? uploadData.file.name : "Upload Assignment File"}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOCX, or Image</p>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isUploading ? "Assigning..." : "Assign Homework"}
              </button>
            </form>
          </div>

          {/* Homework Tracking */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Homework Tracking</h3>
              <select 
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="">Select Assignment</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {submissions.length > 0 ? submissions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                      {sub.studentName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{sub.studentName}</h4>
                      <p className="text-xs text-gray-500">{sub.studentId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {sub.status === 'submitted' ? (
                      <div className="flex items-center gap-3">
                        {sub.marks !== null ? (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                            {sub.marks} Marks
                          </span>
                        ) : (
                          <button 
                            onClick={() => setGradingStudent(sub)}
                            className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors"
                          >
                            Grade Now
                          </button>
                        )}
                        <a href={sub.fileUrl || '#'} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="View Submission">
                          <BookOpen className="h-4 w-4" />
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-medium">
                          Not Submitted
                        </span>
                        <button 
                          onClick={() => handleSendWhatsApp(sub.phone, sub.studentName)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Send WhatsApp Reminder"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <BookOpen className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                  <p>No submissions found for this assignment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grading Modal */}
      {gradingStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-900">Grade Homework</h3>
              <button 
                onClick={() => setGradingStudent(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleGradeSubmit} className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Student</p>
                <p className="font-medium text-gray-900">{gradingStudent.studentName} ({gradingStudent.studentId})</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marks (out of 100)</label>
                <input 
                  type="number" 
                  required 
                  min="0"
                  max="100"
                  value={marks} 
                  onChange={e => setMarks(e.target.value)} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g. 85" 
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  Save Marks & Notify Student
                </button>
                <p className="text-xs text-center text-gray-500 mt-3">
                  This will automatically open WhatsApp to send a notification.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
