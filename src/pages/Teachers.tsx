import React, { useState, useEffect, FormEvent } from "react";
import { UserPlus, Users, MessageCircle, Shield, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "../components/PageHero";
import { SectionBanner } from "../components/SectionBanner";

export default function Teachers() {
  const [teachers, setTeachers] = useState<{id: number, name: string, phone: string, subject: string, addedAt: string}[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: "", phone: "", subject: "Spoken English" });

  useEffect(() => {
    const saved = localStorage.getItem("teachersList");
    if (saved) {
      setTeachers(JSON.parse(saved));
    } else {
      // Mock initial data
      setTeachers([
        { id: 1, name: "Arifur Rahman", phone: "01711000000", subject: "Spoken English", addedAt: "10 Mar 2026" }
      ]);
    }
  }, []);

  const handleAddTeacher = (e: FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.phone) return;

    // Generate a random 6-character password
    const generatedPassword = Math.random().toString(36).slice(-6).toUpperCase();
    const appUrl = window.location.origin;

    const newEntry = {
      id: Date.now(),
      name: newTeacher.name,
      phone: newTeacher.phone,
      subject: newTeacher.subject,
      addedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updatedTeachers = [...teachers, newEntry];
    setTeachers(updatedTeachers);
    localStorage.setItem("teachersList", JSON.stringify(updatedTeachers));

    // Send WhatsApp Message with Credentials
    const message = `Hello ${newTeacher.name} Sir/Madam,\n\nYou have been added as a Teacher at our Coaching Center.\n\n🌐 *App Link:* ${appUrl}\n👤 *Username:* ${newTeacher.phone}\n🔑 *Password:* ${generatedPassword}\n\nPlease log in and change your password from the Settings menu.`;
    const whatsappUrl = `https://wa.me/${newTeacher.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');

    setNewTeacher({ name: "", phone: "", subject: "Spoken English" });
    setShowAddForm(false);
    toast.success(`Teacher ${newEntry.name} added and credentials sent!`);
  };

  const handleDelete = (id: number) => {
    const updated = teachers.filter(t => t.id !== id);
    setTeachers(updated);
    localStorage.setItem("teachersList", JSON.stringify(updated));
    toast.success("Teacher removed successfully");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(26, 18, 0, 0.06)' }}>
      <PageHero 
        title="Teacher Management"
        subtitle="Add teachers and send them login credentials via WhatsApp"
        icon={Users}
        darkColor="#1a1200"
        badge="Teachers"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="diag" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#BA7517" strokeWidth="2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#diag)" />
          </svg>
        }
      />
      <div className="max-w-6xl mx-auto pb-8 pt-6">

        {showAddForm ? (
          <div className="bg-white p-8 rounded-[24px] border border-[#BA7517]/20 shadow-lg max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <SectionBanner title="Add New Teacher" color="#BA7517" />
            <p className="text-sm text-gray-500 mb-6">They will receive their password on WhatsApp</p>

            <form onSubmit={handleAddTeacher} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                  className="w-full px-4 py-2.5 border border-[#BA7517]/30 rounded-[14px] focus:ring-2 focus:ring-[#BA7517] outline-none" 
                  placeholder="e.g. Arifur Rahman" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp Number (Username)</label>
                <input 
                  type="tel" 
                  required
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                  className="w-full px-4 py-2.5 border border-[#BA7517]/30 rounded-[14px] focus:ring-2 focus:ring-[#BA7517] outline-none" 
                  placeholder="e.g. 01711000000" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assigned Subject / Course</label>
                <select 
                  value={newTeacher.subject}
                  onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                  className="w-full px-4 py-2.5 border border-[#BA7517]/30 rounded-[14px] focus:ring-2 focus:ring-[#BA7517] outline-none bg-white"
                >
                  <option>Spoken English</option>
                  <option>SSC/HSC English</option>
                  <option>Writing</option>
                  <option>Kids English</option>
                  <option>IELTS Preparation</option>
                </select>
              </div>

              <div className="bg-[#BA7517]/10 border border-[#BA7517]/20 rounded-[14px] p-4 flex gap-3 items-start">
                <Shield className="h-5 w-5 text-[#BA7517] shrink-0 mt-0.5" />
                <p className="text-sm text-[#BA7517]">
                  A random password will be generated automatically. Clicking "Save & Send" will open WhatsApp to send the login details directly to the teacher.
                </p>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-[14px] font-bold hover:opacity-90 transition-colors shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
                Save & Send Credentials via WhatsApp
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-[24px] border border-[#BA7517]/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#BA7517]/10" style={{ backgroundColor: 'rgba(186, 117, 23, 0.05)' }}>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Teacher Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Phone (Username)</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Subject</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Added On</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#BA7517]/10">
                  {teachers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No teachers added yet.
                      </td>
                    </tr>
                  ) : (
                    teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-[#BA7517]/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#BA7517]/10 text-[#BA7517] flex items-center justify-center font-bold">
                              {teacher.name.charAt(0)}
                            </div>
                            <span className="font-bold text-gray-900">{teacher.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-600">{teacher.phone}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#BA7517]/10 text-[#BA7517]">
                            {teacher.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{teacher.addedAt}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDelete(teacher.id)}
                            className="text-gray-400 hover:text-rose-600 transition-colors p-2"
                            title="Remove Teacher"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
