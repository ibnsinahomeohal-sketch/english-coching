import React, { useState, useEffect, FormEvent } from "react";
import { Save, User, Phone, Calendar } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function Admission() {
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
    course: "Spoken English",
    batch: "",
    session: "",
    board: "",
    roll: "",
    gpa: "",
    fee: "",
    discount: "",
  });

  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${year}${random}`;
  };

  useEffect(() => {
    if (formData.fullName.trim().length > 0 && !formData.studentId) {
      setFormData(prev => ({ ...prev, studentId: generateStudentId() }));
    }
  }, [formData.fullName, formData.studentId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to Supabase
      const { data, error } = await supabase
        .from('students')
        .insert([{ 
          student_id: formData.studentId,
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
          course: formData.course,
          batch: formData.batch,
          session: formData.session,
          board: formData.board,
          roll: formData.roll,
          gpa: formData.gpa,
          fee: formData.fee,
          discount: formData.discount,
        }]);

      if (error) throw error;

      // 2. Send Email via Backend (Optional, don't block if fails)
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formData.email || 'student@example.com', 
            subject: 'Admission Successful!',
            html: `<p>Welcome ${formData.fullName}! Your admission is successful.</p>`
          })
        });
      } catch (e) {
        console.warn("Email failed to send", e);
      }

      toast.success("Student admitted successfully!");
      
      // Trigger WhatsApp automatically
      sendWhatsApp();
      
      // Reset form and generate new ID
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
        course: "Spoken English",
        batch: "",
        session: "",
        board: "",
        roll: "",
        gpa: "",
        fee: "",
        discount: "",
      });
    } catch (error: any) {
      console.error(error);
      toast.error(`Failed to admit student: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendWhatsApp = () => {
    const message = `Hello ${formData.fullName}, your admission is successful!`;
    const waLink = `https://wa.me/${formData.mobile}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto pb-8">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Student Admission</h2>
            <p className="text-sm text-gray-500 mt-1">Fill in the details to enroll a new student</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={sendWhatsApp}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Send via WhatsApp
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Student"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  Student Number (ID)
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded uppercase font-bold">Auto</span>
                </label>
                <input 
                  type="text" 
                  required 
                  readOnly
                  value={formData.studentId}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none" 
                  placeholder="Auto-generated after name" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" required value={formData.fullName} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter full name" onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nickname</label>
                <input type="text" value={formData.nickname} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter nickname" onChange={(e) => setFormData({...formData, nickname: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select value={formData.gender} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white" onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" value={formData.dob} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select value={formData.bloodGroup} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white" onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}>
                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                  <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                <input type="text" value={formData.religion} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Islam" onChange={(e) => setFormData({...formData, religion: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Mobile / WhatsApp</label>
                <input type="tel" value={formData.mobile} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="01XXX-XXXXXX" onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Email (For Login)</label>
                <input type="email" value={formData.email} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="student@example.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                <input type="text" value={formData.fatherName} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter father's name" onChange={(e) => setFormData({...formData, fatherName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                <input type="text" value={formData.motherName} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter mother's name" onChange={(e) => setFormData({...formData, motherName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input type="tel" required value={formData.guardianMobile} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="01XXX-XXXXXX" onChange={(e) => setFormData({...formData, guardianMobile: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <input type="text" value={formData.occupation} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Guardian's occupation" onChange={(e) => setFormData({...formData, occupation: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Academic & Course */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Academic & Course</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select value={formData.course} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white" onChange={(e) => setFormData({...formData, course: e.target.value})}>
                  <option>Spoken English</option>
                  <option>Writing</option>
                  <option>Kids English</option>
                  <option>SSC/HSC English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                <input type="text" value={formData.batch} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Morning A" onChange={(e) => setFormData({...formData, batch: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                <input type="text" value={formData.session} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="2025-26" onChange={(e) => setFormData({...formData, session: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Board</label>
                <input type="text" value={formData.board} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Dhaka" onChange={(e) => setFormData({...formData, board: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Roll</label>
                <input type="text" value={formData.roll} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Roll number" onChange={(e) => setFormData({...formData, roll: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous GPA</label>
                <input type="text" value={formData.gpa} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 5.00" onChange={(e) => setFormData({...formData, gpa: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Course Fee (৳)</label>
                <input type="number" required value={formData.fee} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 5000" onChange={(e) => setFormData({...formData, fee: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (৳)</label>
                <input type="number" value={formData.discount} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 500" onChange={(e) => setFormData({...formData, discount: e.target.value})} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
