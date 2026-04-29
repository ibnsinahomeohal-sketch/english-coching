import React, { useState, useEffect } from "react";
import { 
  Check, 
  X, 
  User, 
  Phone, 
  Mail, 
  BookOpen, 
  MapPin, 
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Loader2,
  Users,
  MessageSquare,
  ClipboardList
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { PageHeader } from "../components/PageHeader";

export default function AdmissionsManagement() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Approval Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewAdmission, setViewAdmission] = useState<any>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);
  const [selectedAdmissionForReject, setSelectedAdmissionForReject] = useState<any>(null);

  const handleViewClick = (admission: any) => {
    setViewAdmission(admission);
    setShowViewModal(true);
  };
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [fee, setFee] = useState("");
  const [discount, setDiscount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");

  const fetchInitialData = async () => {
    const { data: coursesData } = await supabase.from('courses').select('*').order('name');
    if (coursesData) setCourses(coursesData);
  };

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pending_admissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist yet, we'll show a friendly message
          setAdmissions([]);
        } else {
          throw error;
        }
      } else {
        setAdmissions(data || []);
      }
    } catch (error: any) {
      toast.error("Failed to load admissions: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
    fetchInitialData();
  }, []);

  const handleCourseChange = async (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedBatch("");
    const { data: batchesData } = await supabase
      .from('batches')
      .select('*')
      .eq('course_id', courseId);
    if (batchesData) setBatches(batchesData);
  };

  const handleApproveClick = (admission: any) => {
    setSelectedAdmission(admission);
    // Try to auto-select course if name matches
    const matchedCourse = courses.find(c => c.name.toLowerCase() === admission.course_name?.toLowerCase());
    if (matchedCourse) {
      handleCourseChange(matchedCourse.id);
    } else {
      setSelectedCourse("");
      setBatches([]);
    }
    setShowApproveModal(true);
  };

  const handleApprove = async () => {
    if (!selectedCourse || !selectedBatch) {
      toast.error("Please select both course and batch");
      return;
    }

    setProcessingId(selectedAdmission.id);
    try {
      // 1. Generate Student ID and Password
      const year = new Date().getFullYear();
      const random = Math.floor(1000 + Math.random() * 9000);
      const studentId = `${year}${random}`;
      
      const cleanName = (selectedAdmission.full_name || "").split(" ")[0].replace(/[^a-zA-Z]/g, "") || "Student";
      const last3 = studentId.slice(-3);
      const password = `ET@${cleanName}${last3}`;

      const courseName = courses.find(c => c.id === selectedCourse)?.name;
      const batchName = batches.find(b => b.id === selectedBatch)?.name;

      // 2. Insert into students table
      const { error: insertError } = await supabase
        .from('students')
        .insert([{
          student_id: studentId,
          name: selectedAdmission.full_name,
          mobile: selectedAdmission.mobile,
          email: selectedAdmission.email,
          password: password,
          address: selectedAdmission.address,
          course: courseName,
          batch: batchName,
          fee: parseFloat(fee) || 0,
          discount: parseFloat(discount) || 0,
          paid_amount: parseFloat(paidAmount) || 0,
          due_amount: (parseFloat(fee) || 0) - (parseFloat(discount) || 0) - (parseFloat(paidAmount) || 0),
          photo_url: selectedAdmission.photo_url,
          status: 'approved'
        }]);

      if (insertError) throw insertError;

      // 3. Delete from pending_admissions
      const { error: deleteError } = await supabase
        .from('pending_admissions')
        .delete()
        .eq('id', selectedAdmission.id);

      if (deleteError) throw deleteError;

      toast.success(`${selectedAdmission.full_name} approved successfully!`);
      
      // Send Welcome Email
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedAdmission.email,
          subject: "ভর্তি নিশ্চিতকরণ",
          text: `অভিনন্দন ${selectedAdmission.full_name}! আপনার ভর্তি নিশ্চিত হয়েছে। আপনার ইউজার আইডি: ${studentId} এবং পাসওয়ার্ড: ${password}`
        })
      });

      setShowApproveModal(false);
      fetchAdmissions();
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        toast.error("Database connection failed. Please check your Supabase configuration in Secrets.");
      } else {
        toast.error("Approval failed: " + error.message);
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectClick = (admission: any) => {
    setSelectedAdmissionForReject(admission);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!selectedAdmissionForReject) return;
    
    setProcessingId(selectedAdmissionForReject.id);
    try {
      const { error } = await supabase
        .from('pending_admissions')
        .delete()
        .eq('id', selectedAdmissionForReject.id);

      if (error) throw error;

      toast.success("Application rejected.");
      setShowRejectModal(false);
      fetchAdmissions();
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        toast.error("Database connection failed. Please check your Supabase configuration in Secrets.");
      } else {
        toast.error("Rejection failed: " + error.message);
      }
    } finally {
      setProcessingId(null);
    }
  };

  const filteredAdmissions = admissions.filter(item => 
    (item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.mobile?.includes(searchTerm)) &&
    (filterStatus === "all" || item.status === filterStatus)
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <PageHeader 
        title="Admission Requests" 
        subtitle="Manage and review student applications from the portfolio"
        icon={MessageSquare}
        color="var(--color-dashboard)"
      />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or mobile..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-2 border-transparent focus:border-[#004d40] rounded-xl outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <Filter className="h-4 w-4 text-slate-400" />
              <select 
                className="bg-transparent text-sm font-bold outline-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <button 
              onClick={fetchAdmissions}
              className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Clock className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Course & Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Applied On</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#004d40] mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Loading applications...</p>
                  </td>
                </tr>
              ) : filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No admission requests found</p>
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-emerald-100 text-[#004d40] rounded-full flex items-center justify-center font-bold">
                          {item.full_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 cursor-pointer hover:text-[#004d40]" onClick={() => handleViewClick(item)}>{item.full_name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {item.address?.substring(0, 30)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-[#004d40] flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {item.course_name}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {item.mobile}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {new Date(item.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                        item.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-rose-100 text-rose-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleApproveClick(item)}
                          disabled={processingId === item.id}
                          className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg font-bold text-xs hover:bg-emerald-200 transition-colors flex items-center gap-1"
                          title="Approve"
                        >
                          <Check className="h-3 w-3" /> Approve
                        </button>
                        <button 
                          onClick={() => handleRejectClick(item)}
                          disabled={processingId === item.id}
                          className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg font-bold text-xs hover:bg-rose-200 transition-colors flex items-center gap-1"
                          title="Reject"
                        >
                          <X className="h-3 w-3" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Modal */}
      {showViewModal && viewAdmission && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Student Details</h3>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="font-bold text-slate-900">{viewAdmission.full_name}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Course Applied</p>
                  <p className="font-bold text-[#004d40]">{viewAdmission.course_name}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mobile / WhatsApp</p>
                  <p className="font-bold text-slate-900">{viewAdmission.mobile}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                  <p className="font-bold text-slate-900">{viewAdmission.email || "N/A"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date of Birth</p>
                  <p className="font-bold text-slate-900">{viewAdmission.dob || "N/A"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gender</p>
                  <p className="font-bold text-slate-900">{viewAdmission.gender || "N/A"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Father's Name</p>
                  <p className="font-bold text-slate-900">{viewAdmission.father_name || "N/A"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mother's Name</p>
                  <p className="font-bold text-slate-900">{viewAdmission.mother_name || "N/A"}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Permanent Address</p>
                <p className="font-medium text-slate-700 leading-relaxed">{viewAdmission.address || "N/A"}</p>
              </div>

              {viewAdmission.photo_url && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Student Photo / Document</p>
                  {viewAdmission.photo_url.startsWith('data:application/pdf') ? (
                    <a 
                      href={viewAdmission.photo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 transition-colors group"
                    >
                      <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100 transition-colors">
                        <ClipboardList className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-900">View PDF Document</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Click to open in new tab</p>
                      </div>
                    </a>
                  ) : (
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                      <img 
                        src={viewAdmission.photo_url} 
                        alt="Student" 
                        className="w-full h-auto max-h-64 object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showApproveModal && selectedAdmission && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Approve Admission</h3>
              <button onClick={() => setShowApproveModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Student</p>
                <p className="font-bold text-slate-900">{selectedAdmission.full_name}</p>
                <p className="text-sm text-slate-500">{selectedAdmission.course_name}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Total Course Fee</label>
                  <input type="number" className="input-premium" placeholder="0.00" value={fee} onChange={(e) => setFee(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Discount</label>
                    <input type="number" className="input-premium" placeholder="0.00" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Paid Amount</label>
                    <input type="number" className="input-premium" placeholder="0.00" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Assign Course</label>
                  <select 
                    className="input-premium appearance-none bg-white"
                    value={selectedCourse}
                    onChange={(e) => handleCourseChange(e.target.value)}
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Assign Batch</label>
                  <select 
                    className="input-premium appearance-none bg-white disabled:bg-slate-50"
                    value={selectedBatch}
                    disabled={!selectedCourse}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                  >
                    <option value="">Select Batch</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const year = new Date().getFullYear();
                    const random = Math.floor(1000 + Math.random() * 9000);
                    const studentId = `${year}${random}`;
                    const cleanName = (selectedAdmission.full_name || "").split(" ")[0].replace(/[^a-zA-Z]/g, "") || "Student";
                    const last3 = studentId.slice(-3);
                    const password = `ET@${cleanName}${last3}`;
                    const coachingName = "Coaching Center";
                    const loginUrl = window.location.origin + "/login";
                    const message = `🌟 *অভিনন্দন ${selectedAdmission.full_name}!* 🌟\n\nআপনার ভর্তির আবেদনটি অনুমোদিত হয়েছে।\n\nআপনার লগইন তথ্য:\n🏢 *প্রতিষ্ঠান:* ${coachingName}\n👤 *ইউজার আইডি:* ${studentId}\n🔑 *পাসওয়ার্ড:* ${password}\n\n🌐 *লগইন লিঙ্ক:* ${loginUrl}`;
                    const cleanedMobile = selectedAdmission.mobile.replace(/[^\d+]/g, "");
                    const waLink = `https://wa.me/${cleanedMobile}?text=${encodeURIComponent(message)}`;
                    window.open(waLink, '_blank');
                  }}
                  className="px-4 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#25D366]/90 transition-all"
                >
                  WhatsApp
                </button>
                <button 
                  onClick={handleApprove}
                  disabled={processingId === selectedAdmission.id || !selectedCourse || !selectedBatch}
                  className="flex-1 px-6 py-3 bg-[#004d40] text-white font-bold rounded-xl hover:bg-[#004d40]/90 transition-all shadow-lg shadow-[#004d40]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {processingId === selectedAdmission.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && selectedAdmissionForReject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Reject Application</h3>
              <button onClick={() => setShowRejectModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">Student</p>
                <p className="font-bold text-slate-900">{selectedAdmissionForReject.full_name}</p>
                <p className="text-sm text-slate-500">{selectedAdmissionForReject.course_name}</p>
              </div>

              <p className="text-slate-600 text-center">Are you sure you want to reject this application? This action cannot be undone.</p>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReject}
                  disabled={processingId !== null}
                  className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2"
                >
                  {processingId !== null ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
