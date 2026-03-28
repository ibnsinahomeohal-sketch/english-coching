import React, { useState, useEffect, FormEvent } from "react";
import { CreditCard, MessageCircle, AlertCircle, Search, CheckCircle, X, Receipt, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../components/ui/Card";
import { PageHero } from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";

export default function Fees() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      console.error("Error fetching students for fees:", error);
      toast.error("Failed to load student fee records");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const newPaidAmount = (selectedStudent.paid_amount || 0) + amount;
      const newDueAmount = (selectedStudent.fee || 0) - (selectedStudent.discount || 0) - newPaidAmount;

      const { error } = await supabase
        .from('students')
        .update({ 
          paid_amount: newPaidAmount,
          due_amount: newDueAmount
        })
        .eq('student_id', selectedStudent.student_id);

      if (error) throw error;

      // Update local state
      setStudents(students.map(s => 
        s.student_id === selectedStudent.student_id 
          ? { ...s, paid_amount: newPaidAmount, due_amount: newDueAmount } 
          : s
      ));
      
      // Send Invoice via WhatsApp
      const message = `*Payment Invoice 🧾*\n\nHello ${selectedStudent.name},\nWe have received your payment of *৳${amount}* for the ${selectedStudent.course} course.\n\n📊 *Summary:*\nTotal Fee: ৳${selectedStudent.fee}\nTotal Paid: ৳${newPaidAmount}\nCurrent Due: ৳${newDueAmount}\n\nThank you for your payment!`;
      const whatsappUrl = `https://wa.me/${selectedStudent.mobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      setSelectedStudent(null);
      setPaymentAmount("");
      toast.success(`Payment of ৳${amount} recorded for ${selectedStudent.name}!`);
    } catch (error: any) {
      console.error("Payment Error:", error);
      toast.error("Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendDueAlert = (student: any) => {
    const due = student.due_amount;
    const message = `*Fee Reminder ⚠️*\n\nHello ${student.name},\nThis is a gentle reminder that your fee of *৳${due}* is pending for the ${student.course} course. Please clear your dues at your earliest convenience.\n\nThank you!`;
    const whatsappUrl = `https://wa.me/${student.mobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success(`Due alert sent to ${student.name} via WhatsApp!`);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpected = students.reduce((acc, s) => acc + (s.fee || 0) - (s.discount || 0), 0);
  const totalCollected = students.reduce((acc, s) => acc + (s.paid_amount || 0), 0);
  const totalDue = totalExpected - totalCollected;

  return (
    <div className="min-h-screen pb-12" style={{ backgroundColor: 'rgba(7, 24, 40, 0.06)' }}>
      <PageHero 
        title="Fees & Payments"
        subtitle="Collect offline payments and send WhatsApp invoices/alerts"
        icon={CreditCard}
        darkColor="#071828"
        badge="Fees"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="coins" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="4" fill="#1e40af" fillOpacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#coins)" />
          </svg>
        }
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white border-l-4 border-l-blue-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Expected</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">৳{totalExpected.toLocaleString()}</h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Receipt className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-l-4 border-l-emerald-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Collected</p>
                <h3 className="text-2xl font-black text-emerald-600 mt-1">৳{totalCollected.toLocaleString()}</h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-l-4 border-l-rose-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Due</p>
                <h3 className="text-2xl font-black text-rose-600 mt-1">৳{totalDue.toLocaleString()}</h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-rose-500" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search student by name or ID..."
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-[#BA7517] focus:ring-0 transition-all font-medium shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-3xl border-2 border-gray-50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Student</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Course</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Total Fee</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Paid</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Due</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Loader2 className="h-8 w-8 text-[#BA7517] animate-spin" />
                            <p className="text-sm font-bold text-gray-500">Loading fee records...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <p className="text-gray-400 font-bold">No students found matching your search.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => {
                        const isPaid = (student.due_amount || 0) <= 0;
                        return (
                          <tr 
                            key={student.student_id} 
                            className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${selectedStudent?.student_id === student.student_id ? 'bg-[#BA7517]/5' : ''}`}
                            onClick={() => setSelectedStudent(student)}
                          >
                            <td className="px-6 py-4">
                              <div className="font-black text-gray-900">{student.name}</div>
                              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">ID: {student.student_id}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-gray-600">{student.course}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-black text-gray-900">৳{(student.fee || 0) - (student.discount || 0)}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-black text-emerald-600">৳{student.paid_amount || 0}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                ৳{student.due_amount || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {student.due_amount > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSendDueAlert(student);
                                  }}
                                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                  title="Send Due Alert"
                                >
                                  <MessageCircle className="h-5 w-5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 border-2 border-[#BA7517]/20 shadow-xl shadow-[#BA7517]/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-[#BA7517]/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-[#BA7517]" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Record Payment</h3>
              </div>

              {selectedStudent ? (
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Selected Student</p>
                      <button 
                        type="button"
                        onClick={() => setSelectedStudent(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="font-black text-gray-900">{selectedStudent.name}</p>
                    <p className="text-sm font-bold text-[#BA7517] mt-1">Due: ৳{selectedStudent.due_amount}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Payment Amount (৳)</label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-[#BA7517] focus:ring-0 transition-all font-bold text-lg"
                      placeholder="Enter amount..."
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#BA7517] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#965e12] transition-all shadow-lg shadow-[#BA7517]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Confirm Payment'
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="h-16 w-16 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-200" />
                  </div>
                  <p className="text-gray-400 font-bold">Select a student from the list to record a payment.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
