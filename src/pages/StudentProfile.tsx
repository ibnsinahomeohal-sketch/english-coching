import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { Camera, Save, User, Mail, Phone, BookOpen, Trophy, Star, Target, IdCard, Download, X, Upload, Clock, MapPin, Calendar, Hash, Shield, Award, Zap, CheckCircle2, ArrowRight } from "lucide-react";
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
    toast.success("Profile updated successfully!");
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
      toast.error("Failed to download ID card.");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Student Profile</h1>
          <p className="text-sm text-gray-400 font-medium">Manage your personal information and view your performance</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsIdModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-soft"
          >
            <IdCard className="h-4 w-4 text-primary" />
            Digital ID
          </button>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex-1 sm:flex-none btn-primary flex items-center justify-center gap-2"
          >
            {isEditing ? (
              <><Save className="h-4 w-4" /> Save Changes</>
            ) : (
              <><User className="h-4 w-4" /> Edit Profile</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Card */}
          <div className="card-premium overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary to-primary-light relative">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
              </div>
            </div>
            
            <div className="px-8 pb-8">
              <div className="relative flex items-end gap-6 -mt-12 mb-8">
                <div className="relative shrink-0">
                  <div className="h-32 w-32 rounded-3xl border-4 border-white bg-white overflow-hidden shadow-lg flex items-center justify-center">
                    {photo ? (
                      <img src={photo} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-primary/5 flex items-center justify-center">
                        <User className="h-16 w-16 text-primary/20" />
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary text-white rounded-xl border-4 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-md" title="Change Profile Picture">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-display font-bold text-gray-900">{studentData.name}</h3>
                    <div className="p-1 rounded-full bg-emerald-500 text-white">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                    <Hash className="h-3 w-3" />
                    <span>{studentData.id}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={studentData.name}
                      className="input-premium pl-11 disabled:bg-gray-50/50 disabled:text-gray-500" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={studentData.phone}
                      className="input-premium pl-11 disabled:bg-gray-50/50 disabled:text-gray-500" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="email" 
                      disabled={!isEditing}
                      value={studentData.email}
                      className="input-premium pl-11 disabled:bg-gray-50/50 disabled:text-gray-500" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={studentData.address}
                      className="input-premium pl-11 disabled:bg-gray-50/50 disabled:text-gray-500" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={studentData.dob}
                      className="input-premium pl-11 disabled:bg-gray-50/50 disabled:text-gray-500" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Blood Group</label>
                  <div className="relative">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={studentData.bloodGroup}
                      className="input-premium pl-11 disabled:bg-gray-50/50 disabled:text-gray-500" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-gray-900">Academic Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Enrolled Course</p>
                <p className="font-bold text-gray-900">{studentData.course || "N/A"}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Batch Name</p>
                <p className="font-bold text-gray-900">{studentData.batchNo || "N/A"}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Batch Time</p>
                <p className="font-bold text-gray-900">{studentData.batchTime || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Performance Stats */}
          <div className="card-premium p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-gray-900">Performance</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-800/60 uppercase tracking-wider">Current Rank</p>
                  <p className="text-xl font-black text-amber-900">{studentData.rank}st Place</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary/60 uppercase tracking-wider">Total Points</p>
                  <p className="text-xl font-black text-primary">{studentData.points}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/5 border border-secondary/10">
                <div className="h-12 w-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-secondary/60 uppercase tracking-wider">Exams Completed</p>
                  <p className="text-xl font-black text-secondary">{studentData.examsTaken}</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <span>Course Progress</span>
                <span>65%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-premium p-8">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Course Materials</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Class Schedule</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-secondary transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ID Card Modal */}
      {isIdModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center p-6 border-b border-gray-50">
              <h3 className="text-lg font-display font-bold text-gray-900 flex items-center gap-2">
                <IdCard className="h-5 w-5 text-primary" />
                Digital ID Card
              </h3>
              <button 
                onClick={() => setIsIdModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-8 flex justify-center bg-gray-50 overflow-auto max-h-[60vh]">
              <div 
                ref={idCardRef}
                className="w-[340px] h-[540px] relative bg-white shadow-2xl rounded-2xl overflow-hidden shrink-0"
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
                    <p className="text-sm font-bold">No template found.</p>
                    <p className="text-xs mt-2">Please ask the admin to upload an ID card template in Operations.</p>
                  </div>
                )}

                <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[140px] h-[140px] rounded-full overflow-hidden z-10 flex items-center justify-center bg-gray-50 border-4 border-white shadow-md">
                  {photo ? (
                    <img src={photo} alt="Student" className="w-full h-full object-cover" crossOrigin="anonymous" />
                  ) : (
                    <User className="h-20 w-20 text-gray-300" />
                  )}
                </div>

                <div 
                  className="absolute w-full text-center z-10"
                  style={{ top: `${layout.name.top}px`, left: `${layout.name.left}px` }}
                >
                  <h2 className="text-[24px] font-black text-[#0a2540] uppercase tracking-wider select-none px-4" style={{ fontFamily: 'Arial, sans-serif' }}>
                    {studentData.name}
                  </h2>
                </div>

                <div className="absolute top-[52%] left-[45%] w-[50%] flex flex-col gap-[14px] z-10">
                  <p className="text-[13px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.id}</p>
                  <p className="text-[13px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.course}</p>
                  <p className="text-[13px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.dob}</p>
                  <p className="text-[13px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.phone}</p>
                  <p className="text-[13px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide truncate pr-2" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.address}</p>
                  <p className="text-[13px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.bloodGroup}</p>
                  <p className="text-[13px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.batchNo}</p>
                </div>

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

            <div className="p-6 border-t border-gray-50 bg-white">
              <button 
                onClick={handleDownloadIdCard}
                className="w-full btn-primary flex items-center justify-center gap-2"
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
