import React, { useState, useEffect, FormEvent } from "react";
import { UserPlus, Users, MessageCircle, Shield, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "../components/PageHero";
import { SectionBanner } from "../components/SectionBanner";
import { supabase } from "../lib/supabaseClient";

export default function Teachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: "", phone: "", subject: "Spoken English" });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist, we'll handle it gracefully
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.warn("Teachers table might not exist yet.");
          setTeachers([]);
        } else {
          throw error;
        }
      } else {
        setTeachers(data || []);
      }
    } catch (error: any) {
      console.error("Error fetching teachers:", error);
      toast.error("Failed to load teachers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTeacher = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.phone) return;

    setIsLoading(true);
    try {
      // Generate a random 6-character password
      const generatedPassword = Math.random().toString(36).slice(-6).toUpperCase();
      const appUrl = window.location.origin;

      const { data, error } = await supabase
        .from('teachers')
        .insert([{
          name: newTeacher.name,
          phone: newTeacher.phone,
          subject: newTeacher.subject,
          password: generatedPassword,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      if (data) {
        setTeachers([data[0], ...teachers]);
        
        // Also update localStorage for portfolio backward compatibility if needed, 
        // but portfolio should be updated to use Supabase too.
        const updatedLocal = [data[0], ...teachers];
        localStorage.setItem("teachersList", JSON.stringify(updatedLocal));

        // Send WhatsApp Message with Credentials
        const message = `Hello ${newTeacher.name} Sir/Madam,\n\nYou have been added as a Teacher at our Coaching Center.\n\n🌐 *App Link:* ${appUrl}\n👤 *Username:* ${newTeacher.phone}\n🔑 *Password:* ${generatedPassword}\n\nPlease log in and change your password from the Settings menu.`;
        const whatsappUrl = `https://wa.me/${newTeacher.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');

        setNewTeacher({ name: "", phone: "", subject: "Spoken English" });
        setShowAddForm(false);
        toast.success(`Teacher ${newTeacher.name} added and credentials sent!`);
      }
    } catch (error: any) {
      console.error("Error adding teacher:", error);
      toast.error("Failed to add teacher. Make sure 'teachers' table exists.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!confirm("Are you sure you want to remove this teacher?")) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      const updated = teachers.filter(t => t.id !== id);
      setTeachers(updated);
      localStorage.setItem("teachersList", JSON.stringify(updated));
      toast.success("Teacher removed successfully");
    } catch (error: any) {
      console.error("Error deleting teacher:", error);
      toast.error("Failed to remove teacher");
    } finally {
      setIsLoading(false);
    }
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
      <div className="max-w-6xl mx-auto pb-8 pt-6 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-[#BA7517]/10 rounded-2xl flex items-center justify-center">
              <Users className="h-6 w-6 text-[#BA7517]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Active Teachers</h2>
              <p className="text-sm text-gray-500">Manage your faculty members</p>
            </div>
          </div>
          
          {!showAddForm ? (
            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-[#BA7517] text-white px-6 py-3 rounded-[16px] font-bold hover:opacity-90 transition-all shadow-lg shadow-[#BA7517]/20"
            >
              <UserPlus className="h-5 w-5" />
              Add New Teacher
            </button>
          ) : (
            <button 
              onClick={() => setShowAddForm(false)}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-[16px] font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              Cancel
            </button>
          )}
        </div>

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
                  {isLoading && teachers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Loader2 className="h-8 w-8 text-[#BA7517] animate-spin" />
                          <p className="text-sm font-bold text-gray-500">Loading teachers...</p>
                        </div>
                      </td>
                    </tr>
                  ) : teachers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Users className="h-12 w-12 text-gray-200" />
                          <p className="text-sm font-bold text-gray-400">No teachers added yet.</p>
                        </div>
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
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(teacher.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
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
