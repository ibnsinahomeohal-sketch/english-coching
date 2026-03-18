import React, { useState, useEffect, FormEvent } from "react";
import { UserPlus, Users, MessageCircle, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
    <div className="max-w-6xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teacher Management</h2>
          <p className="text-sm text-gray-500 mt-1">Add teachers and send them login credentials via WhatsApp</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          {showAddForm ? <Users className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          {showAddForm ? "View All Teachers" : "Add New Teacher"}
        </button>
      </div>

      {showAddForm ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Add Teacher</h3>
              <p className="text-xs text-gray-500">They will receive their password on WhatsApp</p>
            </div>
          </div>

          <form onSubmit={handleAddTeacher} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="e.g. Arifur Rahman" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (Username)</label>
              <input 
                type="tel" 
                required
                value={newTeacher.phone}
                onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="e.g. 01711000000" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Subject / Course</label>
              <select 
                value={newTeacher.subject}
                onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option>Spoken English</option>
                <option>SSC/HSC English</option>
                <option>Writing</option>
                <option>Kids English</option>
                <option>IELTS Preparation</option>
              </select>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start">
              <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                A random password will be generated automatically. Clicking "Save & Send" will open WhatsApp to send the login details directly to the teacher.
              </p>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#1ebd57] transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Save & Send Credentials via WhatsApp
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Teacher Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Phone (Username)</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Subject</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Added On</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No teachers added yet.
                    </td>
                  </tr>
                ) : (
                  teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                            {teacher.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{teacher.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{teacher.phone}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
  );
}
