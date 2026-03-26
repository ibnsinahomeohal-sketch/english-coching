import React, { useState, useEffect, FormEvent } from "react";
import { Save, UserPlus } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { PageHero } from "../components/PageHero";
import { SectionBanner } from "../components/SectionBanner";

export default function Admission() {
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    session: "",
    board: "",
    roll: "",
    gpa: "",
    fee: "",
    discount: "",
    paidAmount: "",
    address: "",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: coursesData } = await supabase.from('courses').select('*');
      if (coursesData) setCourses(coursesData);
    };
    fetchInitialData();
  }, []);

  const handleCourseChange = async (courseId: string) => {
    setFormData(prev => ({ ...prev, course_id: courseId, batch_id: "" }));
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
          session: formData.session,
          board: formData.board,
          roll: formData.roll,
          gpa: formData.gpa,
          fee: fee,
          discount: discount,
          paid_amount: paid,
          due_amount: due,
          address: formData.address,
        }])
        .select();

      if (error) throw error;

      toast.success("Student admitted successfully!");
      sendWhatsApp();
      
      setTimeout(() => {
        window.location.href = "/students";
      }, 2000);
      
      setFormData({
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
        course: "Spoken English",
        batch: "",
        batchTime: "",
        session: "",
        board: "",
        roll: "",
        gpa: "",
        fee: "",
        discount: "",
        paidAmount: "",
      });
    } catch (error: any) {
      toast.error(`Failed to admit student: ${error.message || "Unknown error"}`);
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
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(7, 24, 40, 0.06)' }}>
      <PageHero 
        title="Student Admission"
        subtitle="Register a new student to the system"
        icon={UserPlus}
        darkColor="#071828"
        badge="Admission"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="10" y="10" width="20" height="15" fill="#378ADD" />
            <rect x="50" y="20" width="30" height="20" fill="#378ADD" />
            <rect x="20" y="50" width="25" height="15" fill="#378ADD" />
            <rect x="70" y="60" width="20" height="25" fill="#378ADD" />
          </svg>
        }
      />
      
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6">
        <div className="flex justify-end gap-2 mb-6">
          <button
            type="button"
            onClick={sendWhatsApp}
            className="flex items-center gap-2 text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-colors"
            style={{ backgroundColor: 'var(--color-whatsapp)' }}
          >
            Send via WhatsApp
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-70"
            style={{ backgroundColor: '#378ADD' }}
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Student"}
          </button>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[24px] border border-[#B5D4F4] shadow-lg shadow-[#B5D4F4]/20">
            <SectionBanner title="Personal Information" color="#378ADD" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Number (ID)</label>
                <input type="text" required readOnly value={formData.studentId} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg bg-gray-50 text-gray-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" required value={formData.fullName} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nickname</label>
                <input type="text" value={formData.nickname} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, nickname: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select value={formData.gender} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none bg-white" onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" value={formData.dob} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select value={formData.bloodGroup} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none bg-white" onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}>
                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                  <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                <input type="text" value={formData.religion} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, religion: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Mobile / WhatsApp</label>
                <input type="tel" value={formData.mobile} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
                <input type="email" value={formData.email} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Generated Password</label>
                <input type="text" readOnly value={formData.password} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg bg-gray-50 text-gray-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[24px] border border-[#B5D4F4] shadow-lg shadow-[#B5D4F4]/20">
            <SectionBanner title="Guardian Information" color="#378ADD" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                <input type="text" value={formData.fatherName} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, fatherName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                <input type="text" value={formData.motherName} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, motherName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input type="tel" required value={formData.guardianMobile} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, guardianMobile: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <input type="text" value={formData.occupation} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, occupation: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[24px] border border-[#B5D4F4] shadow-lg shadow-[#B5D4F4]/20">
            <SectionBanner title="Academic & Course" color="#378ADD" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select 
                  required
                  value={formData.course_id} 
                  className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none bg-white" 
                  onChange={(e) => handleCourseChange(e.target.value)}
                >
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                <select 
                  required
                  disabled={!formData.course_id}
                  value={formData.batch_id} 
                  className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none bg-white disabled:bg-gray-50" 
                  onChange={(e) => setFormData({...formData, batch_id: e.target.value})}
                >
                  <option value="">Select Batch</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.batch_time})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={formData.address} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                <input type="text" value={formData.session} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, session: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Board</label>
                <input type="text" value={formData.board} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, board: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll</label>
                <input type="text" value={formData.roll} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, roll: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                <input type="text" value={formData.gpa} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, gpa: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Course Fee (৳)</label>
                <input type="number" required value={formData.fee} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, fee: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (৳)</label>
                <input type="number" value={formData.discount} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, discount: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount (৳)</label>
                <input type="number" value={formData.paidAmount} className="w-full px-4 py-2 border border-[#B5D4F4] rounded-lg focus:ring-2 focus:ring-[#378ADD] outline-none" onChange={(e) => setFormData({...formData, paidAmount: e.target.value})} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
