import React, { useState, useRef, useEffect, FormEvent } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Download, UserCheck, CheckCircle, Upload, Edit2, Save, X, Move, Search, Loader2, MessageSquare, Settings } from "lucide-react";
import html2canvas from "html2canvas";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { PageHero } from "../components/PageHero";

// Mock Data for Recent Admissions with all required fields
const initialStudents: any[] = [];

export default function Operations() {
  const [scanned, setScanned] = useState(false);
  const [templateBg, setTemplateBg] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  
  // Layout State
  const [isLayoutMode, setIsLayoutMode] = useState(false);
  const [layout, setLayout] = useState({
    name: { top: 225, left: 0, scale: 1 },
    qr: { top: 448, left: 252, size: 70 },
    photo: { top: 65, left: 97, size: 146 }
  });
  const dragState = useRef({ 
    isDragging: false, 
    isResizing: false,
    element: null as "name" | "qr" | "photo" | null, 
    offsetX: 0, 
    offsetY: 0,
    initialSize: 0
  });
  
  const idCardRef = useRef<HTMLDivElement>(null);

  // Load saved template and layout on mount
  useEffect(() => {
    fetchStudents();
    try {
      const savedTemplate = localStorage.getItem("idCardTemplate");
      if (savedTemplate) setTemplateBg(savedTemplate);
      
      const savedLayout = localStorage.getItem("idCardLayout");
      if (savedLayout) setLayout(JSON.parse(savedLayout));
    } catch (e) {
      console.error("Could not load data from local storage");
    }
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*');

      if (error) throw error;

      const mappedStudents = (data || []).map(s => ({
        id: s.student_id,
        name: s.name,
        course: s.course,
        photo: s.photo_url || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
        dob: s.dob || "N/A",
        phone: s.mobile || "N/A",
        bloodGroup: s.blood_group || "N/A",
        fatherName: s.father_name || "N/A",
        batchNo: s.batch || "N/A",
        address: s.address || "N/A",
        password: s.password
      }));

      setStudents(mappedStudents);
      if (mappedStudents.length > 0 && !selectedStudent) {
        setSelectedStudent(mappedStudents[0]);
        setEditData(mappedStudents[0]);
      }
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Save layout when it changes
  useEffect(() => {
    localStorage.setItem("idCardLayout", JSON.stringify(layout));
  }, [layout]);

  // Drag and Drop Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.current.isDragging && !dragState.current.isResizing) return;
      if (!idCardRef.current) return;
      
      const { element, offsetX, offsetY, isDragging, isResizing, initialSize } = dragState.current;
      const cardRect = idCardRef.current.getBoundingClientRect();

      if (isDragging) {
        const newLeft = e.clientX - cardRect.left - offsetX;
        const newTop = e.clientY - cardRect.top - offsetY;

        setLayout(prev => ({
          ...prev,
          [element as "name" | "qr" | "photo"]: { ...prev[element as "name" | "qr" | "photo"], top: newTop, left: newLeft }
        }));
      } else if (isResizing && element !== "name") {
        const deltaX = e.clientX - (cardRect.left + offsetX);
        const newSize = Math.max(20, initialSize + deltaX);
        
        setLayout(prev => ({
          ...prev,
          [element as "qr" | "photo"]: { ...prev[element as "qr" | "photo"], size: newSize }
        }));
      }
    };

    const handleMouseUp = () => {
      dragState.current.isDragging = false;
      dragState.current.isResizing = false;
      dragState.current.element = null;
    };

    if (isLayoutMode) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isLayoutMode]);

  const handleMouseDown = (e: React.MouseEvent, element: "name" | "qr" | "photo", isResize = false) => {
    if (!isLayoutMode) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    
    dragState.current = {
      isDragging: !isResize,
      isResizing: isResize,
      element,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      initialSize: element !== "name" ? layout[element].size : 0
    };
  };

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setTemplateBg(base64String);
        try {
          localStorage.setItem("idCardTemplate", base64String);
          toast.success("ID Card template saved successfully!");
        } catch (e) {
          console.error("Could not save template to local storage (file might be too large)");
          toast.error("Template applied, but file is too large to save permanently. Please use a compressed image (under 2MB).");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeTemplate = () => {
    setTemplateBg(null);
    try {
      localStorage.removeItem("idCardTemplate");
      toast.success("Template removed successfully");
    } catch (e) {
      toast.error("Failed to remove template");
    }
  };

  const sendWhatsApp = (student: any) => {
    const coachingName = "English Therapy Coaching Center";
    const password = student.password || student.id;
    const loginUrl = "https://english-coching.vercel.app/login";
    
    const message = `🌟 *অভিনন্দন ${student.name}!* 🌟\n\nআপনি সফলভাবে *${coachingName}*-এ ভর্তি হয়েছেন। আপনার ডিজিটাল যাত্রা শুরু হোক আমাদের সাথে! 🚀\n\nআপনার লগইন তথ্য নিচে দেওয়া হলো:\n\n━━━━━━━━━━━━━━━━━━━━\n🏢 *প্রতিষ্ঠান:* ${coachingName}\n👤 *ইউজার আইডি:* ${student.id}\n🔑 *পাসওয়ার্ড:* ${password}\n━━━━━━━━━━━━━━━━━━━━\n\n🌐 *লগইন লিঙ্ক:* ${loginUrl}\n\nআপনার উজ্জ্বল ভবিষ্যৎ কামনা করি! ❤️`;
    
    const cleanedMobile = String(student.phone || "").replace(/[^\d+]/g, "");
    const waLink = `https://wa.me/${cleanedMobile}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
  };

  const handleDownload = async () => {
    if (idCardRef.current && selectedStudent) {
      const canvas = await html2canvas(idCardRef.current, { scale: 2, useCORS: true });
      const link = document.createElement("a");
      link.download = `ID_Card_${selectedStudent.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  const saveEdit = async () => {
    if (!editData) return;
    
    try {
      const { error } = await supabase
        .from('students')
        .update({
          name: editData.name,
          course: editData.course,
          photo_url: editData.photo,
          dob: editData.dob,
          mobile: editData.phone,
          blood_group: editData.bloodGroup,
          father_name: editData.fatherName,
          batch: editData.batchNo,
          address: editData.address
        })
        .eq('student_id', editData.id);

      if (error) throw error;

      const updatedStudents = students.map(s => s.id === editData.id ? editData : s);
      setStudents(updatedStudents);
      setSelectedStudent(editData);
      setIsEditing(false);
      toast.success("Student details updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update student details");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(17, 17, 17, 0.06)' }}>
      <PageHero 
        title="Operations"
        subtitle="Manage student ID cards and templates"
        icon={UserCheck}
        darkColor="#111111"
        badge="Operations"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="id-card" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="2" y="2" width="16" height="12" fill="none" stroke="#444" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#id-card)" />
          </svg>
        }
      />
      <div className="max-w-7xl mx-auto pb-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Settings & List */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Template Manager */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Upload className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Permanent ID Template</h2>
                  <p className="text-sm text-gray-500">Upload your design once, it saves automatically</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleTemplateUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <div className="flex flex-col items-center justify-center pointer-events-none">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">Click or drag to upload your template</p>
                  <p className="text-xs text-gray-500 mt-1">Upload the blank template you provided</p>
                </div>
              </div>
              {templateBg && (
                <div className="mt-4 flex items-center justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <span className="text-sm font-medium text-emerald-700">Template saved permanently!</span>
                  <button 
                    onClick={removeTemplate}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 bg-rose-100 rounded"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Recent Admissions List */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Student List</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-48 sm:w-64"
                  />
                </div>
              </div>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
                    <p className="text-sm text-gray-500">Loading students...</p>
                  </div>
                ) : filteredStudents.map((student) => (
                  <div 
                    key={student.id} 
                    onClick={() => {
                      setSelectedStudent(student);
                      setEditData(student);
                      setIsEditing(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedStudent?.id === student.id 
                        ? "border-indigo-500 bg-indigo-50" 
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                        {student.photo ? (
                          <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserCheck className="h-6 w-6 text-indigo-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-xs text-gray-500">ID: {student.id} • {student.course}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          sendWhatsApp(student);
                        }}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                        title="Send WhatsApp"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <div className="text-indigo-600">
                        <QrCode className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                ))}
                {!isLoading && filteredStudents.length === 0 && (
                  <div className="py-8 text-center text-gray-500 text-sm">
                    No students found.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Live ID Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Live ID Preview</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setIsLayoutMode(!isLayoutMode); setIsEditing(false); }}
                    className={`p-2 rounded-lg transition-colors ${isLayoutMode ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
                    title="Adjust Layout"
                  >
                    <Move className="h-5 w-5" />
                  </button>
                  {isLayoutMode && (
                    <button 
                      onClick={() => { setIsLayoutMode(false); localStorage.setItem("idCardLayout", JSON.stringify(layout)); toast.success("ID Card layout position saved!"); }}
                      className="p-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                      title="Save Position"
                    >
                      <Save className="h-5 w-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => { setIsEditing(!isEditing); setIsLayoutMode(false); }}
                    className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
                    title="Edit Details"
                  >
                    {isEditing ? <X className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Download ID Card"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {isLayoutMode && (
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <Move className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-indigo-900">Layout Mode Active</h3>
                    <p className="text-xs text-indigo-700 mt-1">Click and drag the <strong>Student Name</strong> or <strong>QR Code</strong> to position them perfectly. Changes are saved automatically.</p>
                  </div>
                </div>
              )}

              {isEditing && editData ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Student Name</label>
                      <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Course (Role)</label>
                      <input type="text" value={editData.course} onChange={(e) => setEditData({...editData, course: e.target.value})} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">D.O.B</label>
                      <input type="text" value={editData.dob} onChange={(e) => setEditData({...editData, dob: e.target.value})} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                      <input type="text" value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Blood Group</label>
                      <input type="text" value={editData.bloodGroup} onChange={(e) => setEditData({...editData, bloodGroup: e.target.value})} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                      <input type="text" value={editData.address} onChange={(e) => setEditData({...editData, address: e.target.value})} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Batch No</label>
                      <input type="text" value={editData.batchNo} onChange={(e) => setEditData({...editData, batchNo: e.target.value})} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Update Photo</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => setEditData({...editData, photo: event.target?.result as string});
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none bg-white" 
                      />
                    </div>
                  </div>
                  <button onClick={saveEdit} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              ) : null}

              {/* Actual ID Card Element (Perfectly aligned to your template) */}
              <div className="flex justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-100 p-4">
                {selectedStudent ? (
                  <div 
                    ref={idCardRef}
                    // Using standard ID card aspect ratio (approx 2.13 x 3.38 inches)
                    className="w-[340px] h-[540px] relative bg-white shadow-sm"
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
                        <p className="text-sm">Upload your blank template from the left panel.</p>
                        <p className="text-xs mt-2">The text will align perfectly with your design!</p>
                      </div>
                    )}

                    {/* Photo - Draggable & Resizable */}
                      <div 
                        className={`absolute z-10 rounded-full overflow-hidden border-[6px] border-white shadow-md ${isLayoutMode ? 'cursor-move outline-dashed outline-2 outline-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20' : ''}`}
                        style={{ 
                          top: `${layout.photo.top}px`, 
                          left: `${layout.photo.left}px`,
                          width: `${layout.photo.size}px`,
                          height: `${layout.photo.size}px`,
                        }}
                        onMouseDown={(e) => handleMouseDown(e, 'photo')}
                      >
                        {selectedStudent.photo ? (
                          <img src={selectedStudent.photo} alt="Student" className="w-full h-full object-cover" crossOrigin="anonymous" />
                        ) : (
                          <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                            <UserCheck className="h-1/2 w-1/2 text-indigo-300" />
                          </div>
                        )}
                        {isLayoutMode && (
                          <div 
                            className="absolute bottom-0 right-0 w-4 h-4 bg-indigo-600 cursor-nwse-resize rounded-tl-lg"
                            onMouseDown={(e) => handleMouseDown(e, 'photo', true)}
                          />
                        )}
                      </div>

                    {/* Name - Draggable */}
                    <div 
                      className={`absolute w-full text-center z-10 ${isLayoutMode ? 'cursor-move outline-dashed outline-2 outline-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20' : ''}`}
                      style={{ top: `${layout.name.top}px`, left: `${layout.name.left}px` }}
                      onMouseDown={(e) => handleMouseDown(e, 'name')}
                    >
                      <h2 className="text-[26px] font-black text-[#0a2540] uppercase tracking-wider select-none" style={{ fontFamily: 'Arial, sans-serif' }}>
                        {selectedStudent.name}
                      </h2>
                    </div>

                    {/* Details - Aligned exactly next to the labels in your template */}
                    <div className="absolute top-[50%] left-[43%] w-[55%] flex flex-col gap-[12.5px] z-10">
                      <p className="text-[14px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{selectedStudent.id}</p>
                      <p className="text-[14px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{selectedStudent.course}</p>
                      <p className="text-[14px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{selectedStudent.dob}</p>
                      <p className="text-[14px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{selectedStudent.phone}</p>
                      <p className="text-[14px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide truncate pr-2" style={{ fontFamily: 'Arial, sans-serif' }}>{selectedStudent.address}</p>
                      <p className="text-[14px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{selectedStudent.bloodGroup}</p>
                      <p className="text-[14px] font-extrabold text-[#0a2540] leading-none uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{selectedStudent.batchNo}</p>
                    </div>

                    {/* QR Code Container - Draggable & Resizable */}
                    <div 
                      className={`absolute z-10 flex items-center justify-center overflow-hidden ${isLayoutMode ? 'cursor-move outline-dashed outline-2 outline-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20' : ''}`}
                      style={{ 
                        top: `${layout.qr.top}px`, 
                        left: `${layout.qr.left}px`, 
                        width: `${layout.qr.size}px`, 
                        height: `${layout.qr.size}px`,
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 'qr')}
                    >
                      <QRCodeSVG 
                        value={selectedStudent.id} 
                        style={{ margin: 0, width: '90%', height: '90%', objectFit: 'contain', pointerEvents: 'none' }} 
                      />
                      {isLayoutMode && (
                        <div 
                          className="absolute bottom-0 right-0 w-4 h-4 bg-indigo-600 cursor-nwse-resize"
                          onMouseDown={(e) => handleMouseDown(e, 'qr', true)}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-[340px] h-[540px] flex items-center justify-center bg-gray-50 text-gray-400 text-center p-6 border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-sm">Select a student from the list to preview their ID card.</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleDownload}
                disabled={!selectedStudent}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                Download ID Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
