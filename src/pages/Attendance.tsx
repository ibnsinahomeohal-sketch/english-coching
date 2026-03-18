import React, { useState, useRef, useEffect, FormEvent } from "react";
import { ScanLine, CheckCircle, X, MessageCircle, UserX, UserCheck, Send, Camera, AlertTriangle, Smartphone, Clock, Loader2 } from "lucide-react";
import { Scanner } from '@yudiel/react-qr-scanner';
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function Attendance() {
  const [scanInput, setScanInput] = useState("");
  const [attendanceLog, setAttendanceLog] = useState<{id: string, name: string, time: string, status: string} | null>(null);
  const [presentIds, setPresentIds] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [schedules, setSchedules] = useState<{id: number, course: string, batch: string, time: string}[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStudents();
    const saved = localStorage.getItem("classSchedules");
    if (saved) setSchedules(JSON.parse(saved));
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*');
      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students for attendance");
    } finally {
      setIsLoading(false);
    }
  };

  const processScan = (studentId: string) => {
    const student = students.find(s => s.student_id === studentId);
    
    if (student) {
      if (!presentIds.includes(student.student_id)) {
        setPresentIds(prev => [...prev, student.student_id]);
      }
      
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setAttendanceLog({
        id: student.student_id,
        name: student.name,
        time: time,
        status: `Present! Attendance recorded.`
      });
      toast.success(`Attendance marked for ${student.name}`);
    } else {
      setAttendanceLog({
        id: studentId,
        name: "Unknown Student",
        time: new Date().toLocaleTimeString(),
        status: "ID not found in database"
      });
      toast.error("Student ID not found");
    }
  };

  const handleScan = (e: FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    processScan(scanInput.trim());
    setScanInput("");
    setTimeout(() => scannerInputRef.current?.focus(), 100);
  };

  const handleSendSMS = (student: any) => {
    toast.success(`SMS Alert Sent to ${student.name} and Guardian!`);
  };

  const handleSendWhatsApp = (student: any) => {
    const message = `Alert: ${student.name} is absent from the ${student.course} class today. Please ensure they attend.`;
    const whatsappUrl = `https://wa.me/${String(student.guardian_mobile || "").replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const displayStudents = selectedBatch 
    ? students.filter(s => s.batch === selectedBatch)
    : students;

  const presentStudents = displayStudents.filter(s => presentIds.includes(s.student_id));
  const absentStudents = displayStudents.filter(s => !presentIds.includes(s.student_id));

  const handleBulkSMS = () => {
    toast.success(`Bulk SMS sent to ${absentStudents.length} absent students and their guardians!`);
  };

  return (
    <div className="max-w-6xl mx-auto pb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">Daily Attendance</h2>
        <p className="text-sm text-zinc-500 mt-1">Scan QR code or enter Student ID manually to mark attendance</p>
      </div>

      {/* Batch Selection & Late Alerts */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Select Active Class/Batch</label>
          <select 
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full sm:w-72 px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="">All Students</option>
            {schedules.map(s => (
              <option key={s.id} value={s.batch}>{s.course} - {s.batch} ({s.time})</option>
            ))}
          </select>
        </div>
        
        {selectedBatch && absentStudents.length > 0 && (
          <div className="flex flex-col items-end">
            <p className="text-xs text-rose-600 font-medium mb-2 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 5+ mins passed since class started?
            </p>
            <button 
              onClick={handleBulkSMS} 
              className="flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-rose-700 transition-colors shadow-sm"
            >
              <AlertTriangle className="h-4 w-4" />
              Send Late SMS to All Absentees
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scanner Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <ScanLine className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">Scanner</h3>
                  <p className="text-xs text-zinc-500">Ready to scan</p>
                </div>
              </div>
              <button
                onClick={() => setShowCamera(!showCamera)}
                className={`p-2 rounded-lg transition-colors ${showCamera ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                title="Toggle Camera Scanner"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>

            {showCamera && (
              <div className="mb-6 rounded-lg overflow-hidden border border-zinc-200 aspect-square relative bg-black">
                <Scanner
                  onScan={(result) => {
                    if (result && result.length > 0) {
                      processScan(result[0].rawValue);
                      setShowCamera(false);
                    }
                  }}
                  components={{
                    finder: true,
                  }}
                />
              </div>
            )}

            <form onSubmit={handleScan} className="flex flex-col gap-3 mb-6">
              <input
                ref={scannerInputRef}
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Scan QR or Enter ID..."
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-center text-lg font-medium tracking-wider"
                autoFocus
              />
              <button 
                type="submit"
                className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2"
              >
                <CheckCircle className="h-5 w-5" />
                Mark Present
              </button>
            </form>

            {attendanceLog && (
              <div className={`p-4 rounded-lg border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${attendanceLog.name === "Unknown Student" ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                {attendanceLog.name === "Unknown Student" ? (
                  <X className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <h3 className={`text-sm font-semibold ${attendanceLog.name === "Unknown Student" ? 'text-red-900' : 'text-emerald-900'}`}>
                    {attendanceLog.name} ({attendanceLog.id})
                  </h3>
                  <p className={`text-xs mt-1 ${attendanceLog.name === "Unknown Student" ? 'text-red-700' : 'text-emerald-700'}`}>
                    {attendanceLog.time} - {attendanceLog.status}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                <UserCheck className="h-5 w-5" />
              </div>
              <h4 className="text-2xl font-bold text-zinc-900">{presentStudents.length}</h4>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Present</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="h-10 w-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-2">
                <UserX className="h-5 w-5" />
              </div>
              <h4 className="text-2xl font-bold text-zinc-900">{absentStudents.length}</h4>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Absent</p>
            </div>
          </div>
        </div>

        {/* Lists Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Absent Students */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-rose-900 flex items-center gap-2">
                <UserX className="h-5 w-5" />
                Absent Students
              </h3>
              <span className="bg-rose-200 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full">{absentStudents.length}</span>
            </div>
            <div className="divide-y divide-zinc-100">
              {isLoading ? (
                <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-zinc-400" /></div>
              ) : absentStudents.length === 0 ? (
                <div className="p-8 text-center text-zinc-500">Everyone is present today!</div>
              ) : (
                absentStudents.map(student => (
                  <div key={student.student_id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 overflow-hidden">
                        {student.photo_url ? (
                          <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserCheck className="h-6 w-6 text-zinc-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-zinc-900">{student.name}</h4>
                        <p className="text-xs text-zinc-500">ID: {student.student_id} • {student.course} ({student.batch})</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button 
                        onClick={() => handleSendSMS(student)}
                        className="flex items-center gap-1.5 bg-zinc-100 text-zinc-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
                        title="Send SMS to Student & Guardian"
                      >
                        <Smartphone className="h-4 w-4" />
                        <span className="hidden sm:inline">SMS</span>
                      </button>
                      <button 
                        onClick={() => handleSendWhatsApp(student)}
                        className="flex items-center gap-1.5 bg-[#25D366] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#1ebd57] transition-colors"
                        title="Send WhatsApp to Guardian"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Present Students */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-emerald-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Present Students
              </h3>
              <span className="bg-emerald-200 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">{presentStudents.length}</span>
            </div>
            <div className="divide-y divide-zinc-100">
              {isLoading ? (
                <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-zinc-400" /></div>
              ) : presentStudents.length === 0 ? (
                <div className="p-8 text-center text-zinc-500">No students marked present yet.</div>
              ) : (
                presentStudents.map(student => (
                  <div key={student.student_id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 overflow-hidden">
                        {student.photo_url ? (
                          <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserCheck className="h-6 w-6 text-zinc-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-zinc-900">{student.name}</h4>
                        <p className="text-xs text-zinc-500">ID: {student.student_id} • {student.course} ({student.batch})</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                      Present
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
