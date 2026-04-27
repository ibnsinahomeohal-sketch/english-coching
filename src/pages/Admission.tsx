import React, { useState, useEffect, FormEvent } from "react";
import { Save, UserPlus, Send, ArrowRight, User, Phone, Mail, BookOpen, Hash, Calendar, Shield, MapPin, Briefcase, GraduationCap, Users, Droplet, Milestone, Clock, ClipboardList, Star, DollarSign, X, Loader2, Trash2, Camera, Upload } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function Admission() {
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDuration, setNewCourseDuration] = useState("");
  const [newBatchName, setNewBatchName] = useState("");
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isAddingBatch, setIsAddingBatch] = useState(false);

  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    nickname: "",
    gender: "Male",
    dob: "",
    bloodGroup: "A+",
    religion: "",
    mobile: "",
    fatherName: "",
    motherName: "",
    guardianMobile: "",
    occupation: "",
    email: "",
    password: "",
    course_id: "",
    batch_id: "",
    duration: "",
    session: "",
    board: "",
    roll: "",
    gpa: "",
    fee: "",
    discount: "",
    paidAmount: "",
    address: "",
    photo_url: "",
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        setFormData(prev => ({ ...prev, photo_url: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchInitialData = async () => {
    const { data: coursesData } = await supabase.from('courses').select('*').order('name');
    if (coursesData) setCourses(coursesData);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSeedCourses = async () => {
    setIsAddingCourse(true);
    try {
      const defaultCourses = [
        { name: "Spoken English", duration: "3 Months" },
        { name: "IELTS Preparation", duration: "3 Months" },
        { name: "Grammar Foundation", duration: "2 Months" },
        { name: "Phonetics & Pronunciation", duration: "1 Month" },
        { name: "Academic English (HSC)", duration: "6 Months" }
      ];
      
      const { error } = await supabase
        .from('courses')
        .insert(defaultCourses);
      
      if (error) throw error;
      toast.success("Default courses seeded successfully!");
      fetchInitialData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAddingCourse(false);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourseName.trim()) return;
    setIsAddingCourse(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([{ 
          name: newCourseName.trim(),
          duration: newCourseDuration.trim() || "3 Months"
        }])
        .select();
      
      if (error) throw error;
      toast.success("Course added successfully!");
      setNewCourseName("");
      setNewCourseDuration("");
      fetchInitialData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAddingCourse(false);
    }
  };

  const handleAddBatch = async () => {
    if (!newBatchName.trim() || !formData.course_id) {
      toast.error("Please select a course first");
      return;
    }
    setIsAddingBatch(true);
    try {
      const { data, error } = await supabase
        .from('batches')
        .insert([{ 
          name: newBatchName.trim(),
          course_id: formData.course_id
        }])
        .select();
      
      if (error) throw error;
      toast.success("Batch added successfully!");
      setNewBatchName("");
      handleCourseChange(formData.course_id);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAddingBatch(false);
    }
  };

  const handleCourseChange = async (courseId: string) => {
    const selectedCourse = courses.find(c => c.id === courseId);
    setFormData(prev => ({ 
      ...prev, 
      course_id: courseId, 
      batch_id: "",
      duration: selectedCourse?.duration || ""
    }));
    
    const { data: batchesData } = await supabase
      .from('batches')
      .select('*')
      .eq('course_id', courseId);
    if (batchesData) setBatches(batchesData);
  };

  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${year}${random}`;
  };

  const generatePassword = (name: string, id: string) => {
    const cleanName = (name || "").split(" ")[0].replace(/[^a-zA-Z]/g, "") || "Student";
    const last3 = (id || "").slice(-3);
    return `ET@${cleanName}${last3}`;
  };

  useEffect(() => {
    if (formData.fullName.trim().length > 0 && !formData.studentId) {
      const newId = generateStudentId();
      setFormData(prev => ({ 
        ...prev, 
        studentId: newId,
        password: generatePassword(formData.fullName, newId)
      }));
    }
  }, [formData.fullName, formData.studentId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let studentId = formData.studentId;
      if (!studentId) {
        studentId = generateStudentId();
      }

      const fee = parseFloat(formData.fee) || 0;
      const discount = parseFloat(formData.discount) || 0;
      const paid = parseFloat(formData.paidAmount) || 0;
      const due = fee - discount - paid;

      const { data, error } = await supabase
        .from('students')
        .insert([{ 
          student_id: studentId,
          name: formData.fullName,
          nickname: formData.nickname,
          gender: formData.gender,
          dob: formData.dob,
          blood_group: formData.bloodGroup,
          religion: formData.religion,
          mobile: formData.mobile,
          father_name: formData.fatherName,
          mother_name: formData.motherName,
          guardian_mobile: formData.guardianMobile,
          occupation: formData.occupation,
          email: formData.email,
          password: formData.password,
          course_id: formData.course_id,
          batch_id: formData.batch_id,
          duration: formData.duration,
          session: formData.session,
          board: formData.board,
          roll: formData.roll,
          gpa: formData.gpa,
          fee: fee,
          discount: discount,
          paid_amount: paid,
          due_amount: due,
          address: formData.address,
          photo_url: formData.photo_url,
        }])
        .select();

      if (error) throw error;

      toast.success("Student admitted successfully!");
      sendWhatsApp();
      
      setTimeout(() => {
        window.location.href = "/students";
      }, 2000);
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        toast.error("Database connection failed. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly in the Secrets panel.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendWhatsApp = () => {
    const coachingName = "English Therapy Coaching Center";
    const loginUrl = "https://english-coching.vercel.app/login";
    const message = `🌟 *অভিনন্দন ${formData.fullName}!* 🌟\n\nআপনি সফলভাবে *${coachingName}*-এ ভর্তি হয়েছেন। আপনার ডিজিটাল যাত্রা শুরু হোক আমাদের সাথে! 🚀\n\nআপনার লগইন তথ্য নিচে দেওয়া হলো:\n\n━━━━━━━━━━━━━━━━━━━━\n🏢 *প্রতিষ্ঠান:* ${coachingName}\n👤 *ইউজার আইডি:* ${formData.studentId}\n🔑 *পাসওয়ার্ড:* ${formData.password}\n━━━━━━━━━━━━━━━━━━━━\n\n🌐 *লগইন লিঙ্ক:* ${loginUrl}\n\nআপনার উজ্জ্বল ভবিষ্যৎ কামনা করি! ❤️`;
    const cleanedMobile = formData.mobile.replace(/[^\d+]/g, "");
    const waLink = `https://wa.me/${cleanedMobile}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Official Government Header */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-[#004d40]/20 shadow-sm">
        <div className="bg-[#004d40] p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-white rounded-full p-1 flex items-center justify-center shrink-0">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/1200px-Government_Seal_of_Bangladesh.svg.png" 
                alt="Govt Seal" 
                className="h-14 w-14 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-lg md:text-xl font-bold leading-tight">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত</h2>
              <p className="text-xs md:text-sm font-medium opacity-90">Government Approved Coaching Center Admission System</p>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1 text-xs md:text-sm font-bold">
            <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm text-[#ffc107]">
              Govt. Reg. No: 165451
            </div>
            <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm text-[#ffc107]">
              Institute Code: 76148
            </div>
          </div>
        </div>
        <div className="bg-white px-6 py-3 border-t border-[#004d40]/10 flex items-center justify-center gap-2 text-[#004d40] font-bold text-sm">
          <Star className="h-4 w-4 fill-[#ffc107] text-[#ffc107]" />
          শিক্ষা নিয়ে গড়ব দেশ, শেখ হাসিনার বাংলাদেশ
          <Star className="h-4 w-4 fill-[#ffc107] text-[#ffc107]" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">New Admission</h1>
            <p className="text-sm text-gray-400 font-medium">Complete the form below to register a new student</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={sendWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#25D366]/10 text-[#25D366] font-bold rounded-xl hover:bg-[#25D366]/20 transition-all duration-200"
            >
              <Send className="h-4 w-4" />
              WhatsApp
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-8 py-2.5 bg-[#004d40] text-white font-bold rounded-xl hover:bg-[#004d40]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Student"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form Sections */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Info */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-[#004d40]/10 text-[#004d40]">
                  <User className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Student ID</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      readOnly
                      placeholder="Auto-generated"
                      className="input-premium pl-11 bg-gray-50 font-mono font-bold text-[#004d40]" 
                      value={formData.studentId}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. John Doe"
                      className="input-premium pl-11" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nickname</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Johnny"
                    className="input-premium" 
                    value={formData.nickname}
                    onChange={(e) => setFormData({...formData, nickname: e.target.value})} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Gender</label>
                  <select 
                    className="input-premium appearance-none bg-white" 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="date" 
                      className="input-premium pl-11" 
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Blood Group</label>
                  <div className="relative">
                    <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select 
                      className="input-premium pl-11 appearance-none bg-white" 
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Religion</label>
                  <div className="relative">
                    <Milestone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. Islam"
                      className="input-premium pl-11" 
                      value={formData.religion}
                      onChange={(e) => setFormData({...formData, religion: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mobile / WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="tel" 
                      placeholder="+880 1XXX XXXXXX"
                      className="input-premium pl-11" 
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="input-premium pl-11" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Guardian Info */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-[#ffc107]/10 text-[#ffc107]">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-gray-900">Guardian Information</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Father's Name</label>
                  <input 
                    type="text" 
                    className="input-premium" 
                    value={formData.fatherName}
                    onChange={(e) => setFormData({...formData, fatherName: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mother's Name</label>
                  <input 
                    type="text" 
                    className="input-premium" 
                    value={formData.motherName}
                    onChange={(e) => setFormData({...formData, motherName: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Guardian Mobile</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="tel" 
                      required 
                      className="input-premium pl-11" 
                      value={formData.guardianMobile}
                      onChange={(e) => setFormData({...formData, guardianMobile: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Occupation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      className="input-premium pl-11" 
                      value={formData.occupation}
                      onChange={(e) => setFormData({...formData, occupation: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Academic & Course Info */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-[#00695c]/10 text-[#00695c]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-gray-900">Academic & Course Details</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Course</label>
                    <button 
                      type="button"
                      onClick={() => setShowCourseModal(true)}
                      className="text-[10px] font-bold text-[#004d40] hover:underline"
                    >
                      + Add New
                    </button>
                  </div>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select 
                      required
                      className="input-premium pl-11 appearance-none bg-white" 
                      value={formData.course_id}
                      onChange={(e) => handleCourseChange(e.target.value)}
                    >
                      <option value="">Select Course</option>
                      {courses.length > 0 ? (
                        courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                      ) : (
                        <option disabled>No courses available.</option>
                      )}
                    </select>
                    {courses.length === 0 && (
                      <button 
                        type="button"
                        onClick={handleSeedCourses}
                        className="mt-2 text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        <Star className="h-3 w-3 fill-current" />
                        Seed Default Courses
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Batch</label>
                    {formData.course_id && (
                      <button 
                        type="button"
                        onClick={() => setShowCourseModal(true)}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        + Add New
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select 
                      required
                      disabled={!formData.course_id}
                      className="input-premium pl-11 appearance-none bg-white disabled:bg-gray-50" 
                      value={formData.batch_id}
                      onChange={(e) => setFormData({...formData, batch_id: e.target.value})}
                    >
                      <option value="">Select Batch</option>
                      {batches.length > 0 ? (
                        batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)
                      ) : (
                        formData.course_id && <option disabled>No batches for this course. Add one.</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Duration</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. 3 Months"
                      className="input-premium pl-11 bg-gray-50" 
                      value={formData.duration}
                      readOnly
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Session</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. 2023-24"
                      className="input-premium pl-11" 
                      value={formData.session}
                      onChange={(e) => setFormData({...formData, session: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Board</label>
                  <div className="relative">
                    <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. Dhaka"
                      className="input-premium pl-11" 
                      value={formData.board}
                      onChange={(e) => setFormData({...formData, board: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Roll</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      className="input-premium pl-11" 
                      value={formData.roll}
                      onChange={(e) => setFormData({...formData, roll: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">GPA</label>
                  <div className="relative">
                    <Star className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. 5.00"
                      className="input-premium pl-11" 
                      value={formData.gpa}
                      onChange={(e) => setFormData({...formData, gpa: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Total Course Fee</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="number" 
                      className="input-premium pl-11" 
                      value={formData.fee}
                      onChange={(e) => setFormData({...formData, fee: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Discount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="number" 
                      className="input-premium pl-11" 
                      value={formData.discount}
                      onChange={(e) => setFormData({...formData, discount: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Paid Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="number" 
                      className="input-premium pl-11" 
                      value={formData.paidAmount}
                      onChange={(e) => setFormData({...formData, paidAmount: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-white rounded-2xl p-8 border border-[#004d40]/10 bg-[#004d40]/5">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-[#004d40] text-white">
                  <Hash className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-gray-900">System Credentials</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Auto-Generated Password</label>
                  <input 
                    type="text" 
                    readOnly 
                    className="w-full bg-white/50 border-2 border-slate-100 rounded-xl py-2.5 px-4 font-mono font-bold text-[#004d40]" 
                    value={formData.password} 
                  />
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#004d40]/10 flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-[#004d40]/10 text-[#004d40]">
                    <Shield className="h-3 w-3" />
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    Credentials will be sent automatically to the student's WhatsApp number upon successful registration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Photo & Summary */}
          <div className="space-y-8">
            {/* Photo Upload Section */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 text-[#004d40] rounded-lg">
                  <Camera className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Student Photo / Documents</h3>
              </div>
              
              <div className="space-y-4">
                <div className="relative group">
                  <div className={`w-full aspect-square rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${photoPreview ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-emerald-400'}`}>
                    {photoPreview ? (
                      photoPreview.startsWith('data:application/pdf') ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-4 bg-red-100 text-red-600 rounded-2xl">
                            <ClipboardList className="h-12 w-12" />
                          </div>
                          <p className="text-sm font-bold text-slate-600">PDF Document Selected</p>
                        </div>
                      ) : (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="text-center p-6">
                        <Upload className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-500">Click or Drag to Upload</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">JPG, PNG or PDF (Max 2MB)</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  {photoPreview && (
                    <button 
                      type="button"
                      onClick={() => {
                        setPhotoPreview(null);
                        setFormData(prev => ({ ...prev, photo_url: "" }));
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course & Batch Management Modal */}
        {showCourseModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-display font-bold text-gray-900">Manage Courses & Batches</h3>
                  <p className="text-sm text-gray-500">Add or remove courses and their respective batches</p>
                </div>
                <button 
                  onClick={() => setShowCourseModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Course Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-primary">
                    <BookOpen className="h-5 w-5" />
                    <h4 className="font-bold uppercase tracking-wider text-xs">Courses</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Course Name (e.g. Spoken)"
                      className="input-premium py-2"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Duration (e.g. 3 Months)"
                        className="input-premium py-2"
                        value={newCourseDuration}
                        onChange={(e) => setNewCourseDuration(e.target.value)}
                      />
                      <button 
                        onClick={handleAddCourse}
                        disabled={isAddingCourse}
                        className="px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {isAddingCourse ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                      </button>
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {courses.map(course => (
                      <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <p className="text-sm font-bold text-gray-700">{course.name}</p>
                          <p className="text-[10px] text-gray-400">{course.duration || "No duration set"}</p>
                        </div>
                        <button 
                          onClick={async () => {
                            if (confirm("Are you sure? This will delete the course and all its batches.")) {
                              await supabase.from('courses').delete().eq('id', course.id);
                              fetchInitialData();
                            }
                          }}
                          className="text-rose-500 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Batch Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-accent">
                    <Users className="h-5 w-5" />
                    <h4 className="font-bold uppercase tracking-wider text-xs">Batches</h4>
                  </div>

                  <div className="space-y-4">
                    <select 
                      className="input-premium py-2 appearance-none bg-white"
                      value={formData.course_id}
                      onChange={(e) => handleCourseChange(e.target.value)}
                    >
                      <option value="">Select Course first</option>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="New batch name..."
                        className="input-premium py-2"
                        value={newBatchName}
                        onChange={(e) => setNewBatchName(e.target.value)}
                      />
                      <button 
                        onClick={handleAddBatch}
                        disabled={isAddingBatch || !formData.course_id}
                        className="px-4 py-2 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors disabled:opacity-50"
                      >
                        {isAddingBatch ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                      </button>
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {batches.map(batch => (
                      <div key={batch.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-sm font-medium text-gray-700">{batch.name}</span>
                        <button 
                          onClick={async () => {
                            if (confirm("Are you sure?")) {
                              await supabase.from('batches').delete().eq('id', batch.id);
                              handleCourseChange(formData.course_id);
                            }
                          }}
                          className="text-rose-500 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {formData.course_id && batches.length === 0 && (
                      <p className="text-center py-4 text-xs text-gray-400">No batches for this course</p>
                    )}
                    {!formData.course_id && (
                      <p className="text-center py-4 text-xs text-gray-400">Select a course to see batches</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
