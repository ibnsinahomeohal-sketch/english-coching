import React, { useState, FormEvent } from "react";
import { CreditCard, MessageCircle, AlertCircle, Search, CheckCircle, X, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../components/ui/Card";
import { PageHero } from "../components/PageHero";

const initialStudents: any[] = [];

export default function Fees() {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const handlePayment = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !paymentAmount) return;

    const amount = parseInt(paymentAmount);
    const updatedStudents = students.map(s => 
      s.id === selectedStudent.id ? { ...s, paid: s.paid + amount } : s
    );
    setStudents(updatedStudents);
    
    const updatedStudent = updatedStudents.find(s => s.id === selectedStudent.id);
    
    // Send Invoice via WhatsApp
    const due = updatedStudent!.totalFee - updatedStudent!.paid;
    const message = `*Payment Invoice 🧾*\n\nHello ${updatedStudent!.name},\nWe have received your payment of *৳${amount}* for the ${updatedStudent!.course} course.\n\n📊 *Summary:*\nTotal Fee: ৳${updatedStudent!.totalFee}\nTotal Paid: ৳${updatedStudent!.paid}\nCurrent Due: ৳${due}\n\nThank you for your payment!`;
    const whatsappUrl = `https://wa.me/${updatedStudent!.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    setSelectedStudent(null);
    setPaymentAmount("");
    toast.success(`Payment of ৳${amount} recorded for ${updatedStudent!.name}!`);
  };

  const handleSendDueAlert = (student: any) => {
    const due = student.totalFee - student.paid;
    const message = `*Fee Reminder ⚠️*\n\nHello ${student.name},\nThis is a gentle reminder that your fee of *৳${due}* is pending for the ${student.course} course. Please clear your dues at your earliest convenience.\n\nThank you!`;
    const whatsappUrl = `https://wa.me/${student.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success(`Due alert sent to ${student.name} via WhatsApp!`);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.includes(searchTerm)
  );

  const totalExpected = students.reduce((acc, s) => acc + s.totalFee, 0);
  const totalCollected = students.reduce((acc, s) => acc + s.paid, 0);
  const totalDue = totalExpected - totalCollected;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(7, 24, 40, 0.06)' }}>
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
      <div className="max-w-6xl mx-auto pb-8 pt-6">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="flex items-center gap-4 border-l-4 border-l-[var(--blue)]">
            <div className="h-12 w-12 bg-[var(--blue-bg)] text-[var(--blue)] rounded-full flex items-center justify-center">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text2)]">Total Expected</p>
              <h3 className="text-2xl font-bold text-[var(--text)]">৳{totalExpected.toLocaleString()}</h3>
            </div>
          </Card>
          <Card className="flex items-center gap-4 border-l-4 border-l-[var(--green)]">
            <div className="h-12 w-12 bg-[var(--green-bg)] text-[var(--green)] rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text2)]">Total Collected</p>
              <h3 className="text-2xl font-bold text-[var(--text)]">৳{totalCollected.toLocaleString()}</h3>
            </div>
          </Card>
          <Card className="flex items-center gap-4 border-l-4 border-l-[var(--red)]">
            <div className="h-12 w-12 bg-[var(--red-bg)] text-[var(--red)] rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text2)]">Total Due</p>
              <h3 className="text-2xl font-bold text-[var(--text)]">৳{totalDue.toLocaleString()}</h3>
            </div>
          </Card>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Student Fee Records</h3>
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search by name or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Student</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Course</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Total Fee</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Paid</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Due</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => {
                  const due = student.totalFee - student.paid;
                  const isPaid = due <= 0;
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-xs text-gray-500">ID: {student.id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.course}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">৳{student.totalFee}</td>
                      <td className="px-6 py-4 text-sm font-medium text-emerald-600">৳{student.paid}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          ৳{due}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {!isPaid && (
                          <>
                            <button 
                              onClick={() => setSelectedStudent(student)}
                              className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                            >
                              <CreditCard className="h-4 w-4" />
                              Collect
                            </button>
                            <button 
                              onClick={() => handleSendDueAlert(student)}
                              className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors"
                              title="Send Due Alert via WhatsApp"
                            >
                              <AlertCircle className="h-4 w-4" />
                              Alert
                            </button>
                          </>
                        )}
                        {isPaid && (
                          <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium px-3 py-1.5">
                            <CheckCircle className="h-4 w-4" /> Cleared
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Collect Payment</h3>
                <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handlePayment} className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Student</p>
                  <p className="font-medium text-gray-900">{selectedStudent.name} ({selectedStudent.id})</p>
                </div>
                <div className="flex justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Total Fee</p>
                    <p className="font-semibold text-gray-900">৳{selectedStudent.totalFee}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Current Due</p>
                    <p className="font-semibold text-rose-600">৳{selectedStudent.totalFee - selectedStudent.paid}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount (৳)</label>
                  <input 
                    type="number" 
                    required
                    max={selectedStudent.totalFee - selectedStudent.paid}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-medium" 
                    placeholder="Enter amount" 
                    autoFocus
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#1ebd57] transition-colors mt-2"
                >
                  <Receipt className="h-5 w-5" />
                  Save & Send WhatsApp Invoice
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
