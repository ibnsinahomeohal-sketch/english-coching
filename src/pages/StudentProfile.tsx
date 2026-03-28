import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { Camera, Save, User, Mail, Phone, BookOpen, Trophy, Star, Target, IdCard, Download, X, Upload, Clock, MapPin, Calendar, Hash, Shield, Award, Zap, CheckCircle2, ArrowRight, Sparkles, Heart, Activity, Briefcase } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const idCardRef = useRef<HTMLDivElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [templateBg, setTemplateBg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const sessionStr = localStorage.getItem('studentSession');
      if (!sessionStr) {
        setLoading(false);
        return;
      }
      
      const session = JSON.parse(sessionStr);
      const studentId = session.studentId;

      const { data, error } = await supabase
        .from("students")
        .select('*')
        .eq("student_id", studentId)
        .single();

      if (error) {
        console.error("Error fetching student:", error);
        toast.error("Could not load student profile.");
      } else if (data) {
        setStudentData({
          name: data.name || "",
          id: data.student_id || "",
          course: data.course || "",
          phone: data.phone || data.mobile || "",
          email: data.email || "",
          address: data.address || "",
          dob: data.dob || "",
          bloodGroup: data.blood_group || "",
          batchNo: data.batch || "",
          batchTime: data.batch_time || "",
          session: data.session || "",
          points: data.points || 0,
          rank: data.rank || 0,
          examsTaken: data.exams_taken || 0,
          photo_url: data.photo_url || ""
        });
        if (data.photo_url) setPhoto(data.photo_url);
      }
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Premium Header Section */}
      <div className="relative bg-[#004d40] pt-24 pb-40 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ffc107]/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ffc107]/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center md:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#ffc107] text-sm font-bold mb-6 tracking-wider uppercase">
                <Sparkles className="h-4 w-4" />
                Student Profile
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tight mb-4 leading-tight">
                Manage Your <span className="text-[#ffc107] italic">Identity</span>
              </h1>
              <p className="text-emerald-50/70 text-lg font-medium max-w-xl">
                Keep your information up to date and access your digital student ID card anytime.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-wrap items-center gap-4 justify-center md:justify-end"
            >
              <button
                onClick={() => setIsIdModalOpen(true)}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all flex items-center gap-3 group"
              >
                <IdCard className="h-5 w-5 text-[#ffc107] group-hover:scale-110 transition-transform" />
                Digital ID
              </button>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="px-8 py-4 bg-[#ffc107] text-[#004d40] font-black rounded-2xl hover:bg-[#ffc107]/90 transition-all shadow-xl shadow-[#ffc107]/20 flex items-center gap-3 group"
              >
                {isEditing ? (
                  <><Save className="h-5 w-5 group-hover:scale-110 transition-transform" /> Save Changes</>
                ) : (
                  <><User className="h-5 w-5 group-hover:scale-110 transition-transform" /> Edit Profile</>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden"
            >
              <div className="h-40 bg-gradient-to-r from-[#004d40] to-[#00695c] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              </div>
              
              <div className="px-8 pb-10">
                <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-10">
                  <div className="relative shrink-0">
                    <div className="h-40 w-40 rounded-[2.5rem] border-8 border-white bg-slate-100 overflow-hidden shadow-2xl flex items-center justify-center relative group">
                      {photo ? (
                        <img src={photo} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-[#004d40]/5 flex items-center justify-center">
                          <User className="h-20 w-20 text-[#004d40]/20" />
                        </div>
                      )}
                      <AnimatePresence>
                        {isEditing && (
                          <motion.label 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white cursor-pointer group-hover:bg-black/50 transition-all"
                          >
                            <Camera className="h-8 w-8 mb-2" />
                            <span className="text-xs font-black uppercase tracking-widest">Change</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                          </motion.label>
                        )}
                      </AnimatePresence>
                    </div>
                    {!isEditing && (
                      <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-[#ffc107] text-[#004d40] rounded-2xl border-4 border-white flex items-center justify-center shadow-lg" title="Verified Student">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="pb-4 text-center sm:text-left">
                    <h3 className="text-3xl font-display font-black text-slate-900 tracking-tight mb-1">{studentData.name}</h3>
                    <div className="flex items-center justify-center sm:justify-start gap-4 text-slate-500 font-bold">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs">
                        <Hash className="h-3 w-3 text-[#004d40]" />
                        {studentData.id}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#004d40]/10 text-[#004d40] text-xs">
                        <Briefcase className="h-3 w-3" />
                        {studentData.course}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#004d40] transition-colors" />
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={studentData.name}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:bg-white focus:border-[#004d40] focus:ring-4 focus:ring-[#004d40]/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#004d40] transition-colors" />
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={studentData.phone}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:bg-white focus:border-[#004d40] focus:ring-4 focus:ring-[#004d40]/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#004d40] transition-colors" />
                      <input 
                        type="email" 
                        disabled={!isEditing}
                        value={studentData.email}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:bg-white focus:border-[#004d40] focus:ring-4 focus:ring-[#004d40]/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Address</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#004d40] transition-colors" />
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={studentData.address}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:bg-white focus:border-[#004d40] focus:ring-4 focus:ring-[#004d40]/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Date of Birth</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#004d40] transition-colors" />
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={studentData.dob}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:bg-white focus:border-[#004d40] focus:ring-4 focus:ring-[#004d40]/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Blood Group</label>
                    <div className="relative group">
                      <Heart className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#004d40] transition-colors" />
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={studentData.bloodGroup}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:bg-white focus:border-[#004d40] focus:ring-4 focus:ring-[#004d40]/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Academic Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="h-14 w-14 rounded-2xl bg-[#004d40]/10 text-[#004d40] flex items-center justify-center border border-[#004d40]/20">
                  <BookOpen className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Academic Details</h3>
                  <p className="text-slate-500 font-medium">Your enrollment and schedule information</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-[#004d40]/30 transition-all">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Enrolled Course</p>
                  <p className="text-lg font-black text-slate-900">{studentData.course || "N/A"}</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-[#004d40]/30 transition-all">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Batch Name</p>
                  <p className="text-lg font-black text-slate-900">{studentData.batchNo || "N/A"}</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-[#004d40]/30 transition-all">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Batch Time</p>
                  <p className="text-lg font-black text-slate-900">{studentData.batchTime || "N/A"}</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            {/* Performance Stats */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] p-8 space-y-8 border border-slate-200 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffc107]/5 rounded-full blur-3xl"></div>
              
              <div className="flex items-center gap-4 mb-2 relative z-10">
                <div className="h-12 w-12 rounded-xl bg-[#ffc107]/10 text-[#ffc107] flex items-center justify-center border border-[#ffc107]/20">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-display font-black text-slate-900 tracking-tight">Performance</h3>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-4 p-5 rounded-3xl bg-amber-50 border border-amber-100 group hover:scale-[1.02] transition-transform">
                  <div className="h-14 w-14 bg-[#ffc107]/20 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
                    <Trophy className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-amber-800/60 uppercase tracking-widest mb-1">Current Rank</p>
                    <p className="text-2xl font-black text-amber-900">#{studentData.rank}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 rounded-3xl bg-[#004d40]/5 border border-[#004d40]/10 group hover:scale-[1.02] transition-transform">
                  <div className="h-14 w-14 bg-[#004d40]/10 rounded-2xl flex items-center justify-center text-[#004d40] shadow-sm">
                    <Star className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#004d40]/60 uppercase tracking-widest mb-1">Total Points</p>
                    <p className="text-2xl font-black text-[#004d40]">{studentData.points}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 rounded-3xl bg-[#00695c]/5 border border-[#00695c]/10 group hover:scale-[1.02] transition-transform">
                  <div className="h-14 w-14 bg-[#00695c]/10 rounded-2xl flex items-center justify-center text-[#00695c] shadow-sm">
                    <Target className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#00695c]/60 uppercase tracking-widest mb-1">Exams Taken</p>
                    <p className="text-2xl font-black text-[#00695c]">{studentData.examsTaken}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 relative z-10">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  <span>Course Progress</span>
                  <span className="text-[#004d40]">65%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#004d40] to-[#00695c] rounded-full shadow-[0_0_10px_rgba(0,77,64,0.3)]"
                  ></motion.div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl"
            >
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Quick Links</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-[#004d40]/5 border border-slate-100 hover:border-[#004d40]/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-[#004d40]/10 text-[#004d40] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Course Materials</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-[#004d40] group-hover:translate-x-1 transition-all" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-[#00695c]/5 border border-slate-100 hover:border-[#00695c]/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-[#00695c]/10 text-[#00695c] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Clock className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Class Schedule</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-[#00695c] group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ID Card Modal */}
      <AnimatePresence>
        {isIdModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsIdModalOpen(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden relative z-10"
            >
              <div className="flex justify-between items-center p-8 border-b border-slate-50">
                <h3 className="text-xl font-display font-black text-slate-900 flex items-center gap-3">
                  <IdCard className="h-6 w-6 text-[#004d40]" />
                  Digital ID Card
                </h3>
                <button 
                  onClick={() => setIsIdModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-8 flex justify-center bg-slate-50 overflow-auto max-h-[60vh]">
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 text-center p-8 border-4 border-dashed border-slate-200 m-6 rounded-3xl">
                      <Upload className="h-12 w-12 mb-4 opacity-30" />
                      <p className="text-sm font-black uppercase tracking-widest">No Template</p>
                      <p className="text-xs mt-2 font-medium">Please ask the admin to upload an ID card template in Operations.</p>
                    </div>
                  )}

                  <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[140px] h-[140px] rounded-full overflow-hidden z-10 flex items-center justify-center bg-slate-50 border-4 border-white shadow-xl">
                    {photo ? (
                      <img src={photo} alt="Student" className="w-full h-full object-cover" crossOrigin="anonymous" />
                    ) : (
                      <User className="h-20 w-20 text-slate-300" />
                    )}
                  </div>

                  <div 
                    className="absolute w-full text-center z-10"
                    style={{ top: `${layout.name.top}px`, left: `${layout.name.left}px` }}
                  >
                    <h2 className="text-[24px] font-black text-[#0a2540] uppercase tracking-wider select-none px-4 leading-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
                      {studentData.name}
                    </h2>
                  </div>

                  <div className="absolute top-[52%] left-[45%] w-[50%] flex flex-col gap-[14px] z-10">
                    <p className="text-[13px] font-black text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.id}</p>
                    <p className="text-[13px] font-black text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.course}</p>
                    <p className="text-[13px] font-black text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.dob}</p>
                    <p className="text-[13px] font-black text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.phone}</p>
                    <p className="text-[13px] font-black text-[#0a2540] leading-none uppercase tracking-wide truncate pr-2" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.address}</p>
                    <p className="text-[13px] font-black text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.bloodGroup}</p>
                    <p className="text-[13px] font-black text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{studentData.batchNo}</p>
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

              <div className="p-8 border-t border-slate-50 bg-white">
                <button 
                  onClick={handleDownloadIdCard}
                  className="w-full py-4 bg-[#004d40] text-white font-black rounded-2xl hover:bg-[#004d40]/90 transition-all shadow-xl shadow-[#004d40]/20 flex items-center justify-center gap-3 group"
                >
                  <Download className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  Download PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

