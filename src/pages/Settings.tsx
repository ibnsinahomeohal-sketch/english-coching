import React, { useState, useEffect, FormEvent } from "react";
import { Save, Upload, Phone, Mail, User } from "lucide-react";
import ResetDemoDataButton from "../components/ResetDemoDataButton";

export default function Settings() {
  const [settings, setSettings] = useState({
    logo: "",
    profilePhoto: "",
    phone: "",
    email: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    localStorage.setItem("appSettings", JSON.stringify(settings));
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "profilePhoto") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSettings({ ...settings, [field]: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your app branding and contact details</p>
        </div>
        <div className="flex gap-3">
          <ResetDemoDataButton />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Branding */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Branding</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Institute Logo</label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden relative">
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Upload className="h-6 w-6 text-gray-400" />
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "logo")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <div className="text-sm text-gray-500">
                <p>Upload your institute logo.</p>
                <p className="text-xs mt-1">This will appear in the Chat background.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Profile Photo</label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden relative">
                {settings.profilePhoto ? (
                  <img src={settings.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-gray-400" />
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "profilePhoto")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <div className="text-sm text-gray-500">
                <p>Upload your profile photo.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Contact Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="tel" 
                value={settings.phone}
                onChange={(e) => setSettings({...settings, phone: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                placeholder="01XXX-XXXXXX" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="email" 
                value={settings.email}
                onChange={(e) => setSettings({...settings, email: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                placeholder="admin@example.com" 
              />
            </div>
          </div>
        </div>

        {/* Security / Password Change */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Security & Password</h3>
          <p className="text-sm text-gray-500 mb-4">Update your login password here. (Teachers can also use this section to change their auto-generated passwords).</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                placeholder="Enter current password" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                placeholder="Enter new password" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                placeholder="Confirm new password" 
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button 
              onClick={(e) => { e.preventDefault(); alert("Password updated successfully!"); }}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
