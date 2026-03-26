import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { Camera, Save, User, Mail, Phone, BookOpen, Trophy, Star, Target, IdCard, Download, X, Upload, Clock } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const idCardRef = useRef<HTMLDivElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [templateBg, setTemplateBg] = useState<string | null>(null);
  const [layout, setLayout] = useState({
    name: { top: 225, left: 0 },
    qr: { top: 448, left: 252 }
  });

  const [studentData, setStudentData] = useState({
    name: "",
    id: "",
    course: "",
    phone: "",
    email: "",
    address: "",
    dob: "",
    bloodGroup: "",
    batchNo: "",
    batchTime: "",
    session: "",
    points: 0,
    rank: 0,
    examsTaken: 0,
    photo_url: ""
  });

  // Load student data from Supabase
  useEffect(() => {
    const fetchStudentData = async () => {
      const sessionStr = localStorage.getItem('studentSession');
      if (!sessionStr) return;
      
      const session = JSON.parse(sessionStr);
      const studentId = session.studentId;

      const { data, error } = await supabase
        .from("students")
        .select(`
          *,
          courses (name),
          batches (name, batch_time)
        `)
        .eq("student_id", studentId)
        .single();

      if (error) {
        console.error("Error fetching student:", error);
        toast.error("Could not load student profile.");
      } else if (data) {
        setStudentData({
          name: data.name || "",
          id: data.student_id || "",
          course: data.courses?.name || "",
          phone: data.phone || data.mobile || "",
          email: data.email || "",
          address: data.address || "",
          dob: data.dob || "",
          bloodGroup: data.blood_group || "",
          batchNo: data.batches?.name || "",
          batchTime: data.batches?.batch_time || "",
          session: data.session || "",
          points: data.points || 0,
          rank: data.rank || 0,
          examsTaken: data.exams_taken || 0,
          photo_url: data.photo_url || ""
        });
        if (data.photo_url) setPhoto(data.photo_url);
      }
    };

    fetchStudentData();
  }, []);

  // Load saved template and layout on mount
  useEffect(() => {
    try {
      const savedTemplate = localStorage.getItem("idCardTemplate");
      if (savedTemplate) setTemplateBg(savedTemplate);
      
      const savedLayout = localStorage.getItem("idCardLayout");
      if (savedLayout) setLayout(JSON.parse(savedLayout));
    } catch (e) {
      console.error("Could not load data from local storage");
    }
  }, []);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleDownloadIdCard = async () => {
    if (!idCardRef.current) return;
    try {
      const canvas = await html2canvas(idCardRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${studentData.name}_ID_Card.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download ID card.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information and view your performance</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsIdModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <IdCard className="h-4 w-4" /> View ID Card
          </button>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            {isEditing ? (
              <><Save className="h-4 w-4" /> Save Profile</>
            ) : (
              <><User className="h-4 w-4" /> Edit Profile</>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center px-8 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-20 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-widest opacity-90 drop-shadow-lg z-10 uppercase">
            Basic English Therapy
          </h1>
        </div>
        
        <div className="px-8 pb-8">
          {/* Profile Photo Section */}
          <div className="relative flex items-end gap-6 -mt-12 mb-8">
            <div className="relative shrink-0">
              <div className="h-28 w-28 rounded-full border-4 border-white bg-white overflow-hidden shadow-md flex items-center justify-center">
                {photo ? (
                  <img src={photo} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-gray-300" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 h-8 w-8 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors shadow-sm" title="Change Profile Picture">
                <Camera className="h-4 w-4 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            <div className="pb-2">
              <h3 className="text-2xl font-bold text-gray-900">{studentData.name}</h3>
              <p className="text-sm text-gray-500 font-medium">ID: {studentData.id}</p>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-4">
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">Current Rank</p>
                <p className="text-2xl font-black text-yellow-900">{studentData.rank}st <span className="text-sm font-medium text-yellow-700">Place</span></p>
              </div>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center gap-4">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-800">Total Points</p>
                <p className="text-2xl font-black text-indigo-900">{studentData.points}</p>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4">
              <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800">Exams Completed</p>
                <p className="text-2xl font-black text-emerald-900">{studentData.examsTaken}</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  disabled={true}
                  value={studentData.name}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 outline-none" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  disabled={true}
                  value={studentData.phone}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  disabled={true}
                  value={studentData.email}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enrolled Course</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  disabled={true}
                  value={studentData.course}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  disabled={true}
                  value={studentData.batchNo}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  disabled={true}
                  value={studentData.batchTime}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 outline-none" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ID Card Modal */}
      {isIdModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <IdCard className="h-5 w-5 text-indigo-600" />
                Student ID Card
              </h3>
              <button 
                onClick={() => setIsIdModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 flex justify-center bg-gray-100 overflow-auto">
              {/* ID Card Design (Exactly matching Operations.tsx Live Preview) */}
              <div 
                ref={idCardRef}
                className="w-[340px] h-[540px] relative bg-white shadow-sm shrink-0"
                style={{
                  backgroundImage: templateBg ? `url(${templateBg})` : 'none',
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {!templateBg && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-400 text-center p-6 border-2 border-dashed border-gray-200 m-4 rounded-xl">
                    <Upload className="h-10 w-10 mb-2 opacity-50" />
                    <p className="text-sm">No template found.</p>
                    <p className="text-xs mt-2">Please ask the admin to upload an ID card template in Operations.</p>
                  </div>
                )}

                {/* Photo - Aligned to the circular frame */}
                <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[140px] h-[140px] rounded-full overflow-hidden z-10 flex items-center justify-center bg-gray-50 border-2 border-white shadow-sm">
                  {photo ? (
                    <img src={photo} alt="Student" className="w-full h-full object-cover" crossOrigin="anonymous" />
                  ) : (
                    <User className="h-20 w-20 text-gray-300" />
                  )}
                </div>

                {/* Name - Absolute positioned based on layout */}
                <div 
                  className="absolute w-full text-center z-10"
                  style={{ top: `${layout.name.top}px`, left: `${layout.name.left}px` }}
                >
                  <h2 className="text-[24px] font-black text-[#0a2540] uppercase tracking-wider select-none px-4" style={{ fontFamily: 'Arial, sans-serif' }}>
                    {studentData.name}
                  </h2>
                </div>

                {/* Details - Aligned exactly next to the labels in the template */}
                <div className="absolute top-[52%] left-[45%] w-[50%] flex flex-col gap-[14px] z-10">
                  <p className="text-[13px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.id}</p>
                  <p className="text-[13px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.course}</p>
                  <p className="text-[13px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.dob}</p>
                  <p className="text-[13px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.phone}</p>
                  <p className="text-[13px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide truncate pr-2" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.address}</p>
                  <p className="text-[13px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.bloodGroup}</p>
                  <p className="text-[13px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.batchNo}</p>
                </div>

                {/* QR Code Container - Absolute positioned based on layout */}
                <div 
                  className="absolute z-10 flex items-center justify-center overflow-hidden"
                  style={{ 
                    top: `${layout.qr.top}px`, 
                    left: `${layout.qr.left}px`, 
                    width: '70px', 
                    height: '70px',
                  }}
                >
                  <QRCodeSVG 
                    value={studentData.id} 
                    style={{ margin: 0, width: '90%', height: '90%', objectFit: 'contain', pointerEvents: 'none' }} 
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <button 
                onClick={handleDownloadIdCard}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
