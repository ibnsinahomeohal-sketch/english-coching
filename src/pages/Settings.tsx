import React, { useState, useEffect, FormEvent } from "react";
import { Save, Upload, Phone, Mail, User } from "lucide-react";
import ResetDemoDataButton from "../components/ResetDemoDataButton";

export default function Settings() {
  const [settings, setSettings] = useState({
    logo: "",
    profilePhoto: "",
    teacherPhoto: "",
    phone: "",
    email: "",
    instituteName: "BASIC ENGLISH THERAPY",
    address: "ChakBazar, Lakshmipur Sadar-3700, Lakshmipur.",
    portfolioContent: {
      heroTitle: "Unlock Your Potential with English Mastery",
      heroSubtitle: "Join the most trusted English coaching center in the region. We provide quality education with modern techniques.",
      heroImage: "https://images.unsplash.com/photo-1523240715639-9a6710541190?auto=format&fit=crop&q=80&w=1920",
      heroBackgroundSize: "cover",
      aboutTitle: "Why Choose Us?",
      aboutText: "We believe in practical learning. Our courses are designed to help you speak English fluently and confidently in real-world situations.",
      aboutImages: [] as string[],
      stats: {
        students: "1000+",
        teachers: "20+",
        courses: "10+",
        successRate: "98%"
      },
      features: [
        { title: "Expert Teachers", desc: "Learn from the best in the industry with years of experience." },
        { title: "Modern Methods", desc: "We use the latest techniques to ensure effective learning." },
        { title: "Flexible Batches", desc: "Choose a schedule that fits your busy lifestyle." }
      ]
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(prev => ({
        ...prev,
        ...parsed,
        portfolioContent: {
          ...prev.portfolioContent,
          ...parsed.portfolioContent,
          aboutImages: parsed.portfolioContent?.aboutImages || prev.portfolioContent.aboutImages || []
        }
      }));
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "profilePhoto" | "teacherPhoto") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSettings(prevSettings => ({
          ...prevSettings,
          [field]: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePortfolioImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "heroImage" | "aboutImages") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSettings(prevSettings => {
          const newPortfolioContent = { ...prevSettings.portfolioContent };
          if (field === "heroImage") {
            newPortfolioContent.heroImage = event.target?.result as string;
          } else {
            newPortfolioContent.aboutImages = [...newPortfolioContent.aboutImages, event.target?.result as string];
          }
          return {
            ...prevSettings,
            portfolioContent: newPortfolioContent
          };
        });
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Photo (Portfolio)</label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full border-4 border-[#f5a625] flex items-center justify-center bg-gray-50 overflow-hidden relative">
                {settings.teacherPhoto ? (
                  <img src={settings.teacherPhoto} alt="Teacher" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-gray-400" />
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "teacherPhoto")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <div className="text-sm text-gray-500">
                <p>Upload the teacher's photo for the portfolio.</p>
                <p className="text-xs mt-1">This will appear in the Hero and About sections.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
            <input 
              type="text" 
              value={settings.instituteName}
              onChange={(e) => setSettings({...settings, instituteName: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
              placeholder="e.g. BASIC ENGLISH THERAPY" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institute Address</label>
            <input 
              type="text" 
              value={settings.address}
              onChange={(e) => setSettings({...settings, address: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
              placeholder="e.g. ChakBazar, Lakshmipur Sadar-3700" 
            />
          </div>
        </div>

        {/* Portfolio Customization */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Portfolio Customization</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                <input 
                  type="text" 
                  value={settings.portfolioContent.heroTitle}
                  onChange={(e) => setSettings({
                    ...settings, 
                    portfolioContent: { ...settings.portfolioContent, heroTitle: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                <textarea 
                  rows={3}
                  value={settings.portfolioContent.heroSubtitle}
                  onChange={(e) => setSettings({
                    ...settings, 
                    portfolioContent: { ...settings.portfolioContent, heroSubtitle: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none" 
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About Title</label>
                <input 
                  type="text" 
                  value={settings.portfolioContent.aboutTitle}
                  onChange={(e) => setSettings({
                    ...settings, 
                    portfolioContent: { ...settings.portfolioContent, aboutTitle: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About Text</label>
                <textarea 
                  rows={3}
                  value={settings.portfolioContent.aboutText}
                  onChange={(e) => setSettings({
                    ...settings, 
                    portfolioContent: { ...settings.portfolioContent, aboutText: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none" 
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h4 className="text-md font-bold text-gray-800 mb-4">Stats & Features</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(settings.portfolioContent.stats).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{key}</label>
                  <input 
                    type="text"
                    value={value}
                    onChange={(e) => setSettings({
                      ...settings,
                      portfolioContent: {
                        ...settings.portfolioContent,
                        stats: { ...settings.portfolioContent.stats, [key]: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {settings.portfolioContent.features.map((feature, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-indigo-600 mb-2 uppercase">Feature {idx + 1}</p>
                  <input 
                    type="text"
                    placeholder="Title"
                    value={feature.title}
                    onChange={(e) => {
                      const newFeatures = [...settings.portfolioContent.features];
                      newFeatures[idx].title = e.target.value;
                      setSettings({ ...settings, portfolioContent: { ...settings.portfolioContent, features: newFeatures } });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
                  />
                  <textarea 
                    rows={2}
                    placeholder="Description"
                    value={feature.desc}
                    onChange={(e) => {
                      const newFeatures = [...settings.portfolioContent.features];
                      newFeatures[idx].desc = e.target.value;
                      setSettings({ ...settings, portfolioContent: { ...settings.portfolioContent, features: newFeatures } });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h4 className="text-md font-bold text-gray-800 mb-4">Portfolio Images</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Image</label>
                <div className="h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden relative mb-2">
                  {settings.portfolioContent.heroImage ? (
                    <img src={settings.portfolioContent.heroImage} alt="Hero" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handlePortfolioImageUpload(e, "heroImage")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background Size</label>
                <select 
                  value={settings.portfolioContent.heroBackgroundSize}
                  onChange={(e) => setSettings({
                    ...settings,
                    portfolioContent: { ...settings.portfolioContent, heroBackgroundSize: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Section Images</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {settings.portfolioContent.aboutImages.map((img, idx) => (
                    <div key={idx} className="h-20 rounded-lg overflow-hidden relative">
                      <img src={img} alt={`About ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setSettings({
                          ...settings,
                          portfolioContent: {
                            ...settings.portfolioContent,
                            aboutImages: settings.portfolioContent.aboutImages.filter((_, i) => i !== idx)
                          }
                        })}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                      >X</button>
                    </div>
                  ))}
                </div>
                <div className="h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden relative">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <input type="file" accept="image/*" onChange={(e) => handlePortfolioImageUpload(e, "aboutImages")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
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
