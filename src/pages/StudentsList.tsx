import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Search, Phone, BookOpen, UserCircle, MoreVertical, Edit, Trash2, X, Loader2, MessageSquare, Camera, Save, User, Calendar, Mail, Briefcase, GraduationCap, UserPlus } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { SectionBanner } from "../components/SectionBanner";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

const COURSES = ["All Courses", "Spoken English", "Writing", "Kids English", "SSC/HSC English"];

export default function StudentsList() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [viewingStudent, setViewingStudent] = useState<any | null>(null);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching students from Supabase...");
      const { data, error } = await supabase
        .from('students')
        .select('*');

      if (error) {
        console.error("Supabase Fetch Error:", error);
        throw error;
      }
      
      const mappedData = (data || []).map(s => ({
        ...s,
        course: s.course || "N/A",
        batch: s.batch || "N/A",
        batch_time: s.batch_time || "N/A"
      }));

      console.log("Fetched Data:", mappedData);
      setStudents(mappedData);
      
      if (mappedData.length === 0) {
        console.warn("No students found in the 'students' table.");
      }
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast.error(`Failed to load students: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesCourse = selectedCourse === "All Courses" || student.course === selectedCourse;
    const query = searchQuery.toLowerCase();
    
    // Safely convert fields to strings for searching
    const name = String(student.name || "").toLowerCase();
    const studentId = String(student.student_id || "").toLowerCase();
    const mobile = String(student.mobile || "").toLowerCase();
    
    const matchesSearch = 
      name.includes(query) || 
      studentId.includes(query) ||
      mobile.includes(query);
      
    return matchesCourse && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('student_id', id);

      if (error) throw error;
      
      setStudents(students.filter(s => s.student_id !== id));
      toast.success("Student deleted successfully");
      setActiveDropdown(null);
    } catch (error: any) {
      toast.error("Failed to delete student");
    }
  };

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    setActiveDropdown(null);
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from('students')
          .update({
            name: editingStudent.name,
            nickname: editingStudent.nickname,
            gender: editingStudent.gender,
            dob: editingStudent.dob,
            blood_group: editingStudent.blood_group,
            religion: editingStudent.religion,
            mobile: editingStudent.mobile,
            father_name: editingStudent.father_name,
            mother_name: editingStudent.mother_name,
            guardian_mobile: editingStudent.guardian_mobile,
            occupation: editingStudent.occupation,
            email: editingStudent.email,
            session: editingStudent.session,
            board: editingStudent.board,
            roll: editingStudent.roll,
            gpa: editingStudent.gpa,
            course: editingStudent.course,
            batch: editingStudent.batch,
            batch_time: editingStudent.batch_time,
            fee: parseFloat(editingStudent.fee) || 0,
            discount: parseFloat(editingStudent.discount) || 0,
            paid_amount: parseFloat(editingStudent.paid_amount) || 0,
            due_amount: (parseFloat(editingStudent.fee) || 0) - (parseFloat(editingStudent.discount) || 0) - (parseFloat(editingStudent.paid_amount) || 0),
            photo_url: editingStudent.photo_url
          })
          .eq('student_id', editingStudent.student_id);

        if (error) throw error;

        // Update local state with the calculated due amount
        const updatedStudent = {
          ...editingStudent,
          due_amount: (parseFloat(editingStudent.fee) || 0) - (parseFloat(editingStudent.discount) || 0) - (parseFloat(editingStudent.paid_amount) || 0)
        };

        setStudents(students.map(s => s.student_id === editingStudent.student_id ? updatedStudent : s));
        setEditingStudent(null);
        toast.success("Student details updated successfully!");
      } catch (error: any) {
        console.error("Update Error:", error);
        toast.error("Failed to update student");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendWhatsAppCredentials = (student: any) => {
    const coachingName = "English Therapy Coaching Center";
    const password = student.password || student.student_id;
    const loginUrl = "https://english-coching.vercel.app/login";
    
    const message = `🌟 *অভিনন্দন ${student.name}!* 🌟\n\nআপনি সফলভাবে *${coachingName}*-এ ভর্তি হয়েছেন। আপনার ডিজিটাল যাত্রা শুরু হোক আমাদের সাথে! 🚀\n\nআপনার লগইন তথ্য নিচে দেওয়া হলো:\n\n━━━━━━━━━━━━━━━━━━━━\n🏢 *প্রতিষ্ঠান:* ${coachingName}\n👤 *ইউজার আইডি:* ${student.student_id}\n🔑 *পাসওয়ার্ড:* ${password}\n━━━━━━━━━━━━━━━━━━━━\n\n🌐 *লগইন লিঙ্ক:* ${loginUrl}\n\nআপনার উজ্জ্বল ভবিষ্যৎ কামনা করি! ❤️`;
    
    const cleanedMobile = String(student.mobile || "").replace(/[^\d+]/g, "");
    const waLink = `https://wa.me/${cleanedMobile}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for base64
        toast.error("Photo is too large. Please select a photo under 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingStudent({ ...editingStudent, photo_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-8 min-h-screen" style={{ backgroundColor: 'rgba(7, 26, 19, 0.06)' }}>
      <PageHero 
        title="All Students" 
        subtitle="Manage and view all registered students"
        icon={UserPlus}
        darkColor="#071a13"
        badge="Students"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="3" fill="#1D9E75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circles)" />
          </svg>
        }
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-4">
        <div className="bg-white px-4 py-2 rounded-[14px] border border-[#B5D4F4] shadow-sm">
          <span className="text-sm font-medium text-[#1D9E75]">Total Students: {students.length}</span>
        </div>
        <button 
          onClick={fetchStudents}
          className="flex items-center gap-2 bg-white border border-[#B5D4F4] px-4 py-2 rounded-[14px] text-sm font-medium text-[#1D9E75] hover:bg-emerald-50 transition-colors"
        >
          <Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-[14px] border border-[#B5D4F4] shadow-sm mb-6 flex flex-col sm:flex-row gap-4 mx-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#1D9E75]" />
          </div>
          <input
            type="text"
            placeholder="Search by Name, ID, or Phone Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none"
          />
        </div>
        <div className="sm:w-64">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none bg-white font-medium text-gray-700"
          >
            {COURSES.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-[#1D9E75] animate-spin mb-4" />
          <p className="text-[#1D9E75] font-medium">Loading students...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
          {filteredStudents.map((student, index) => (
            <div key={student.student_id || student.id || index} className="bg-white rounded-[14px] border border-[#B5D4F4] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-[#1D9E75]/10 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                      {student.photo_url ? (
                        <img src={student.photo_url} alt={student.name} className="h-full w-full object-cover" />
                      ) : (
                        <UserCircle className="h-10 w-10 text-[#1D9E75]" />
                      )}
                    </div>
                    <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500`}></span>
                  </div>
                  
                  {/* 3-Dots Dropdown Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === student.student_id ? null : student.student_id)}
                      className="text-gray-400 hover:text-[#1D9E75] p-1 rounded-md hover:bg-emerald-50 transition-colors"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    
                    {activeDropdown === student.student_id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setActiveDropdown(null)}
                        ></div>
                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-[14px] shadow-lg border border-[#B5D4F4] z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                          <button 
                            onClick={() => sendWhatsAppCredentials(student)}
                            className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                          >
                            <MessageSquare className="h-4 w-4" /> Send WhatsApp
                          </button>
                          <button 
                            onClick={() => handleEdit(student)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(student.student_id)}
                            className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 truncate">{student.name}</h3>
                <p className="text-sm text-gray-500 font-medium mb-4">ID: {student.student_id}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 text-[#1D9E75]" />
                    <span className="truncate font-medium">{student.course}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-[#1D9E75]" />
                    <span>{student.mobile}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-[#B5D4F4] p-3 bg-emerald-50/50 flex justify-between items-center">
                <span className="text-xs font-bold text-[#1D9E75] uppercase tracking-wider bg-white px-2 py-1 rounded-md border border-[#B5D4F4]">
                  {student.batch || "N/A"}
                </span>
                <button 
                  onClick={() => setViewingStudent(student)}
                  className="text-sm font-semibold text-[#1D9E75] hover:text-emerald-800 flex items-center gap-1 transition-colors"
                >
                  <UserCircle className="h-4 w-4" /> View Profile
                </button>
              </div>
            </div>
          ))}

          {filteredStudents.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-[14px] border border-[#B5D4F4] border-dashed">
              <UserCircle className="h-12 w-12 text-[#1D9E75]/30 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                {students.length === 0 ? "No students in database" : "No students match your search"}
              </h3>
              <p className="text-gray-500">
                {students.length === 0 
                  ? "Go to the Admission page to add your first student." 
                  : "Try adjusting your search or course filter."}
              </p>
              {students.length === 0 && (
                <button 
                  onClick={() => window.location.href = '/admission'}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-[14px] shadow-sm text-white bg-[#1D9E75] hover:bg-[#188865] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D9E75]"
                >
                  Go to Admission
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-[24px] max-w-4xl w-full my-8 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-[#B5D4F4] sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">Edit Student Profile</h3>
              <button 
                onClick={() => setEditingStudent(null)}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-8 space-y-8 overflow-y-auto max-h-[75vh]">
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center justify-center pb-6 border-b border-[#B5D4F4]">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-full bg-[#1D9E75]/10 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                    {editingStudent.photo_url ? (
                      <img src={editingStudent.photo_url} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <UserCircle className="h-16 w-16 text-[#1D9E75]/30" />
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="h-6 w-6" />
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium">Click to change photo</p>
              </div>

              {/* Personal Information */}
              <div>
                <SectionBanner title="Personal Information" color="var(--color-students)" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={editingStudent.name || ""} 
                      onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nickname</label>
                    <input 
                      type="text" 
                      value={editingStudent.nickname || ""} 
                      onChange={e => setEditingStudent({...editingStudent, nickname: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                    <select 
                      value={editingStudent.gender || "Male"} 
                      onChange={e => setEditingStudent({...editingStudent, gender: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none bg-white"
                    >
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date of Birth</label>
                    <input 
                      type="date" 
                      value={editingStudent.dob || ""} 
                      onChange={e => setEditingStudent({...editingStudent, dob: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Blood Group</label>
                    <select 
                      value={editingStudent.blood_group || "A+"} 
                      onChange={e => setEditingStudent({...editingStudent, blood_group: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none bg-white"
                    >
                      <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                      <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Religion</label>
                    <input 
                      type="text" 
                      value={editingStudent.religion || ""} 
                      onChange={e => setEditingStudent({...editingStudent, religion: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile / WhatsApp</label>
                    <input 
                      type="text" 
                      value={editingStudent.mobile || ""} 
                      onChange={e => setEditingStudent({...editingStudent, mobile: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                    <input 
                      type="email" 
                      value={editingStudent.email || ""} 
                      onChange={e => setEditingStudent({...editingStudent, email: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div>
                <SectionBanner title="Guardian Information" color="var(--color-students)" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Father's Name</label>
                    <input 
                      type="text" 
                      value={editingStudent.father_name || ""} 
                      onChange={e => setEditingStudent({...editingStudent, father_name: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mother's Name</label>
                    <input 
                      type="text" 
                      value={editingStudent.mother_name || ""} 
                      onChange={e => setEditingStudent({...editingStudent, mother_name: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Guardian Mobile</label>
                    <input 
                      type="text" 
                      value={editingStudent.guardian_mobile || ""} 
                      onChange={e => setEditingStudent({...editingStudent, guardian_mobile: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Occupation</label>
                    <input 
                      type="text" 
                      value={editingStudent.occupation || ""} 
                      onChange={e => setEditingStudent({...editingStudent, occupation: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Academic & Course */}
              <div>
                <SectionBanner title="Academic & Course" color="var(--color-students)" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course</label>
                    <select 
                      value={editingStudent.course || ""} 
                      onChange={e => setEditingStudent({...editingStudent, course: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none bg-white"
                    >
                      {COURSES.filter(c => c !== "All Courses").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch</label>
                    <input 
                      type="text" 
                      value={editingStudent.batch || ""} 
                      onChange={e => setEditingStudent({...editingStudent, batch: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch Time</label>
                    <input 
                      type="text" 
                      value={editingStudent.batch_time || ""} 
                      onChange={e => setEditingStudent({...editingStudent, batch_time: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Session</label>
                    <input 
                      type="text" 
                      value={editingStudent.session || ""} 
                      onChange={e => setEditingStudent({...editingStudent, session: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Board</label>
                    <input 
                      type="text" 
                      value={editingStudent.board || ""} 
                      onChange={e => setEditingStudent({...editingStudent, board: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Roll</label>
                    <input 
                      type="text" 
                      value={editingStudent.roll || ""} 
                      onChange={e => setEditingStudent({...editingStudent, roll: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">GPA</label>
                    <input 
                      type="text" 
                      value={editingStudent.gpa || ""} 
                      onChange={e => setEditingStudent({...editingStudent, gpa: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course Fee (৳)</label>
                    <input 
                      type="number" 
                      value={editingStudent.fee || 0} 
                      onChange={e => setEditingStudent({...editingStudent, fee: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount (৳)</label>
                    <input 
                      type="number" 
                      value={editingStudent.discount || 0} 
                      onChange={e => setEditingStudent({...editingStudent, discount: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Paid Amount (৳)</label>
                    <input 
                      type="number" 
                      value={editingStudent.paid_amount || 0} 
                      onChange={e => setEditingStudent({...editingStudent, paid_amount: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-[#B5D4F4] rounded-[14px] focus:ring-2 focus:ring-[var(--color-students)] outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-[#B5D4F4] flex gap-4 sticky bottom-0 bg-white pb-2">
                <button 
                  type="button" 
                  onClick={() => setEditingStudent(null)} 
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-[14px] font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 text-white rounded-[14px] font-bold hover:opacity-90 transition-colors flex items-center justify-center gap-2 shadow-lg"
                  style={{ backgroundColor: 'var(--color-students)' }}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  Save All Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="h-28 relative" style={{ backgroundColor: 'var(--color-students)' }}>
              <button 
                onClick={() => setViewingStudent(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-8 pb-8 relative">
              <div className="absolute -top-14 left-8">
                <div className="h-28 w-28 rounded-full border-4 border-white bg-[#1D9E75]/10 flex items-center justify-center shadow-md overflow-hidden">
                  {viewingStudent.photo_url ? (
                    <img src={viewingStudent.photo_url} alt={viewingStudent.name} className="h-full w-full object-cover" />
                  ) : (
                    <UserCircle className="h-20 w-20 text-[#1D9E75]/30" />
                  )}
                </div>
              </div>
              <div className="pt-16">
                <div className="flex justify-between items-start mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">{viewingStudent.name}</h2>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-[#1D9E75]`}>
                    Active
                  </span>
                </div>
                <p className="font-semibold mb-6" style={{ color: 'var(--color-students)' }}>Student ID: {viewingStudent.student_id}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-700 bg-emerald-50/50 p-4 rounded-[14px] border border-[#B5D4F4]">
                    <div className="bg-[#1D9E75]/10 p-2 rounded-lg">
                      <BookOpen className="h-5 w-5 text-[#1D9E75]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Course</p>
                      <p className="font-semibold text-gray-900">{viewingStudent.course}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-700 bg-emerald-50/50 p-4 rounded-[14px] border border-[#B5D4F4]">
                    <div className="bg-[#1D9E75]/10 p-2 rounded-lg">
                      <Phone className="h-5 w-5 text-[#1D9E75]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Phone Number</p>
                      <p className="font-semibold text-gray-900">{viewingStudent.mobile}</p>
                    </div>
                    <button 
                      onClick={() => sendWhatsAppCredentials(viewingStudent)}
                      className="p-2 bg-emerald-100 text-[#1D9E75] rounded-lg hover:bg-emerald-200 transition-colors"
                      title="Send WhatsApp Credentials"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-700 bg-emerald-50/50 p-4 rounded-[14px] border border-[#B5D4F4]">
                    <div className="bg-[#1D9E75]/10 p-2 rounded-lg">
                      <UserCircle className="h-5 w-5 text-[#1D9E75]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Batch</p>
                      <p className="font-semibold text-gray-900">{viewingStudent.batch || "N/A"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => { handleEdit(viewingStudent); setViewingStudent(null); }}
                    className="flex-1 font-semibold py-2.5 rounded-[14px] transition-colors flex items-center justify-center gap-2"
                    style={{ backgroundColor: 'rgba(29, 158, 117, 0.1)', color: 'var(--color-students)' }}
                  >
                    <Edit className="h-4 w-4" /> Edit Details
                  </button>
                  <button 
                    onClick={() => setViewingStudent(null)}
                    className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-[14px] hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

