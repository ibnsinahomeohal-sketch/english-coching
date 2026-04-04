import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Menu,
  X,
  GraduationCap,
  Star,
  Check,
  Send,
  Loader2,
  MessageSquare,
  Clock
} from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState({
    instituteName: "BASIC ENGLISH THERAPY",
    logo: "",
    teacherPhoto: "",
    phone: "01707-581180",
    email: "basicenglishtherapy@gmail.com",
    address: "ছাতারপাইয়া পশ্চিম বাজার, নুর জাহান কমপ্লেক্স, ওয়ান ব্যাংকের নিচ তলা, সেনবাগ, নোয়াখালী",
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
        { title: "Expert Teachers", desc: "Learn from highly qualified and experienced instructors." },
        { title: "Modern Facilities", desc: "Smart classrooms with audio-visual learning aids." },
        { title: "Flexible Batches", desc: "Morning, afternoon, and evening batches available." }
      ]
    }
  });

  const [admissionForm, setAdmissionForm] = useState({
    fullName: "",
    nickname: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    religion: "",
    mobile: "",
    fatherName: "",
    motherName: "",
    guardianMobile: "",
    occupation: "",
    education: "",
    whatsapp: "",
    email: "",
    session: "",
    board: "",
    roll: "",
    gpa: "",
    course: "",
    address: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [appId, setAppId] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('settings_data')
        .eq('id', 1)
        .single();
      
      if (data && data.settings_data) {
        setSettings(prev => ({
          ...prev,
          ...data.settings_data,
          portfolioContent: {
            ...prev.portfolioContent,
            ...data.settings_data.portfolioContent,
            aboutImages: data.settings_data.portfolioContent?.aboutImages || prev.portfolioContent.aboutImages || []
          }
        }));
      }
    };
    fetchSettings();

    const fetchInitialData = async () => {
      // Fetch Courses
      const { data: coursesData } = await supabase.from('courses').select('*').order('name');
      if (coursesData) setCourses(coursesData);

      // Fetch Teachers
      try {
        const { data: teachersData, error: teachersError } = await supabase
          .from('teachers')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (teachersError) throw teachersError;
        if (teachersData) setTeachers(teachersData);
      } catch (error) {
        console.error("Error fetching teachers for portfolio:", error);
      }
    };
    
    fetchInitialData();
  }, []);

  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const id = 'BET-' + Date.now().toString().slice(-6);
    setAppId(id);

    try {
      const { error } = await supabase
        .from('pending_admissions')
        .insert([{
          full_name: admissionForm.fullName,
          mobile: admissionForm.mobile,
          father_name: admissionForm.fatherName,
          mother_name: admissionForm.motherName,
          gender: admissionForm.gender,
          dob: admissionForm.dob,
          email: admissionForm.email,
          whatsapp: admissionForm.whatsapp,
          guardian_mobile: admissionForm.guardianMobile,
          occupation: admissionForm.occupation,
          education: admissionForm.education,
          course_name: admissionForm.course,
          address: admissionForm.address,
          message: admissionForm.message,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      
      setIsSuccess(true);
      toast.success("Application submitted successfully!");

    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(`Failed to submit application: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0f4223] z-50 px-6 flex items-center justify-between h-[62px] shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
        <div className="font-rajdhani text-[1.3rem] font-bold text-[var(--secondary)] tracking-wider">
          Basic <span className="text-white">English Therapy</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-7 list-none">
          <li><a href="#about" className="text-white/85 text-[0.92rem] font-medium hover:text-[var(--secondary)] transition-colors">শিক্ষক পরিচিতি</a></li>
          <li><a href="#gallery" className="text-white/85 text-[0.92rem] font-medium hover:text-[var(--secondary)] transition-colors">আমাদের কার্যক্রম</a></li>
          <li><a href="#courses" className="text-white/85 text-[0.92rem] font-medium hover:text-[var(--secondary)] transition-colors">কোর্সসমূহ</a></li>
          <li><a href="#batch" className="text-white/85 text-[0.92rem] font-medium hover:text-[var(--secondary)] transition-colors">ব্যাচ তথ্য</a></li>
          <li><a href="#admission" className="text-white/85 text-[0.92rem] font-medium hover:text-[var(--secondary)] transition-colors">ভর্তি ফর্ম</a></li>
          <li><a href="#contact" className="text-white/85 text-[0.92rem] font-medium hover:text-[var(--secondary)] transition-colors">যোগাযোগ</a></li>
          <li>
            <Link 
              to="/login" 
              className="text-[var(--secondary)] text-[0.92rem] font-bold hover:text-[var(--secondary-light)] transition-colors"
            >
              ⚙️ Admin
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={`block w-6 h-0.5 bg-[var(--secondary)] rounded-full transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-[var(--secondary)] rounded-full transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-[var(--secondary)] rounded-full transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="fixed top-[62px] left-0 right-0 bg-[#0f4223] z-[998] py-4 shadow-[0_8px_24px_rgba(0,0,0,0.4)] animate-in slide-in-from-top duration-300 md:hidden">
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="block px-7 py-3 text-white/85 font-medium border-b border-white/5 hover:bg-white/5 hover:text-[var(--secondary)]">👨‍🏫 শিক্ষক পরিচিতি</a>
            <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="block px-7 py-3 text-white/85 font-medium border-b border-white/5 hover:bg-white/5 hover:text-[var(--secondary)]">📸 আমাদের কার্যক্রম</a>
            <a href="#courses" onClick={() => setIsMenuOpen(false)} className="block px-7 py-3 text-white/85 font-medium border-b border-white/5 hover:bg-white/5 hover:text-[var(--secondary)]">📚 কোর্সসমূহ</a>
            <a href="#batch" onClick={() => setIsMenuOpen(false)} className="block px-7 py-3 text-white/85 font-medium border-b border-white/5 hover:bg-white/5 hover:text-[var(--secondary)]">📋 ব্যাচ তথ্য</a>
            <a href="#admission" onClick={() => setIsMenuOpen(false)} className="block px-7 py-3 text-white/85 font-medium border-b border-white/5 hover:bg-white/5 hover:text-[var(--secondary)]">📝 ভর্তি ফর্ম</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block px-7 py-3 text-white/85 font-medium border-b border-white/5 hover:bg-white/5 hover:text-[var(--secondary)]">📞 যোগাযোগ</a>
            <Link 
              to="/login" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-7 py-3 text-[var(--secondary)] font-bold hover:bg-white/5"
            >
              ⚙️ Admin Panel
            </Link>
          </div>
        )}
      </nav>

      {/* Notice Bar */}
      <div className="mt-[62px] notice-bar">
        <span className="notice-badge">সুখবর!</span>
        সুখবর সুখবর সুখবর স্পোকেন ইংলিশ এর চতুর্থ ব্যাচ এর ক্লাস আগামী <strong>২৮-০৩-২০২৬</strong> ইং তারিখে অনুষ্ঠিত হবে।
      </div>

      {/* Hero Section */}
      <section id="home" className="hero-pattern pt-[70px] pb-[80px] px-6 text-center" style={{ backgroundImage: settings.portfolioContent.heroImage ? `linear-gradient(rgba(15, 66, 35, 0.8), rgba(15, 66, 35, 0.8)), url(${settings.portfolioContent.heroImage})` : undefined, backgroundSize: settings.portfolioContent.heroBackgroundSize || 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="font-rajdhani text-[clamp(2.5rem,8vw,4.5rem)] font-bold text-white leading-[1.1] mb-2 drop-shadow-[0_2px_20px_rgba(0,0,0,0.3)]">
            Basic English<br /><span className="text-[#f5a625]">Therapy</span>
          </h1>
          <p className="text-[1.2rem] text-white/90 mb-10">ইংলিশে দুর্বলদের জন্য — আমরা আপনাকে শেখাবোই ইনশাআল্লাহ</p>
          
          <div className="w-[140px] h-[140px] rounded-full border-4 border-[#f5a625] overflow-hidden mx-auto mb-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <img 
              src={settings.teacherPhoto || "https://i.ibb.co/v4m0YmH/teacher-photo.png"} 
              alt="ডা. আবদুল মোমিন" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Momin";
              }}
            />
          </div>
          <p className="text-white text-[1.3rem] font-bold mb-1">ডা. আবদুল মোমিন</p>
          <p className="text-white/80 text-[0.95rem] mb-10">B.A (Hons), M.A — ইংরেজি বিভাগ</p>

          <div className="flex justify-center gap-4 flex-wrap mb-12">
            <div className="hero-card-v2">
              <span className="block text-[2rem] font-bold text-[#f5a625]">৩</span>
              <span className="text-[0.9rem] text-white/90">মাসের কোর্স</span>
            </div>
            <div className="hero-card-v2">
              <span className="block text-[2rem] font-bold text-[#f5a625]">৩৬</span>
              <span className="text-[0.9rem] text-white/90">মোট ক্লাস</span>
            </div>
            <div className="hero-card-v2">
              <span className="block text-[2rem] font-bold text-[#f5a625]">৫০০০+</span>
              <span className="text-[0.9rem] text-white/90">শব্দভান্ডার</span>
            </div>
            <div className="hero-card-v2">
              <span className="block text-[2rem] font-bold text-[#f5a625]">২০</span>
              <span className="text-[0.9rem] text-white/90">অধ্যায়</span>
            </div>
          </div>

          <a 
            href="#admission" 
            className="inline-block bg-[#f5a625] text-[#0f4223] px-12 py-4 rounded-full text-[1.1rem] font-bold hover:bg-[#ffb84d] transition-all shadow-[0_4px_20px_rgba(245,166,37,0.4)] hover:shadow-[0_8px_28px_rgba(245,166,37,0.5)] hover:-translate-y-0.5"
          >
            📝 এখনই ভর্তি হোন
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[2.2rem] font-bold text-[#0f4223] mb-4 flex items-center justify-center gap-3">
              📋 শিক্ষক পরিচিতি ও কোর্সের বিবরণ
            </h2>
            <div className="w-24 h-1.5 bg-[#f5a625] mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-[1fr_1.8fr] gap-12 items-start">
            {/* Teacher Info Card */}
            <div className="space-y-8">
              <div className="teacher-card-v2">
                <div className="teacher-photo-ring-v2">
                  <img 
                    src={settings.teacherPhoto || "/teacher.png"} 
                    alt="ডা. আবদুল মোমিন" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Momin";
                    }}
                  />
                </div>
                <h3 className="text-[2rem] font-bold mb-2">ডা. আবদুল মোমিন</h3>
                <p className="text-white/90 text-[1.1rem] mb-2 font-medium">পরিচালক: বেসিক ইংলিশ থেরাপি</p>
                <p className="text-white/90 text-[1rem] mb-4 font-medium">বি. এ, অনার্স, এম. এ (মাস্টার্স)<br />ইংরেজি বিভাগ</p>
                <p className="text-white/70 text-[0.95rem] mb-10">সহকারী শিক্ষক<br />ছাতারপাইয়া আই-কে দাখিল মাদ্রাসা</p>
                
                <div className="bg-white/10 border border-white/20 rounded-2xl p-5 flex items-center gap-4 text-left">
                  <div className="text-3xl">🏛️</div>
                  <p className="text-[0.9rem] font-bold leading-tight">সরকার অনুমোদিত সার্টিফিকেট প্রদান করা হবে</p>
                </div>
                </div>
              </div>

            {/* Course Details Content */}
            <div className="promise-section-v2">
              <div className="promise-item-v2">
                <div className="promise-icon-v2">📍</div>
                <div>
                  <h4 className="promise-title-v2">আমাদের প্রতিশ্রুতি</h4>
                  <p className="promise-text-v2">আমি নিশ্চয়তা দিচ্ছি — যদি কোনো ছাত্র-ছাত্রী সঠিকভাবে পরিপূর্ণ কোর্সটি সম্পন্ন করে, তাহলে তার ইংরেজিতে কথা বলা এবং লেখার জড়তা কেটে যাবে ইনশাআল্লাহ।</p>
                </div>
              </div>

              <div className="promise-item-v2">
                <div className="promise-icon-v2">📊</div>
                <div>
                  <h4 className="promise-title-v2">পাঠদান পদ্ধতি</h4>
                  <p className="promise-text-v2">প্রতিটি ক্লাস ১ ঘণ্টা ৩০ মিনিটের। ১ ঘণ্টা শিক্ষক নিজে পাঠদান করবেন, বাকি ৩০ মিনিট শিক্ষার্থীদের দিয়ে প্র্যাকটিস করানো হবে। মনিটরের মাধ্যমে ক্লাস এবং প্র্যাকটিস পরিচালিত হবে। প্র্যাকটিসের জন্য পার্টনার নির্ধারণ করে দেওয়া হবে।</p>
                </div>
              </div>

              <div className="promise-item-v2">
                <div className="promise-icon-v2">🔒</div>
                <div>
                  <h4 className="promise-title-v2">নিরাপত্তা ব্যবস্থা</h4>
                  <p className="promise-text-v2">অত্র প্রতিষ্ঠানটির প্রতিটি কক্ষ সিসি ক্যামেরা দ্বারা নিয়ন্ত্রিত থাকবে।</p>
                </div>
              </div>

              <div className="guarantee-footer-box-v2">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-xl shrink-0">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-[1rem] font-bold text-emerald-900 leading-relaxed">
                  কোর্স শেষে পরীক্ষার মাধ্যমে সরকারি সার্টিফিকেট প্রদান করা হবে। প্র্যাকটিসের জন্য পার্টনার নির্ধারণ করে দেওয়া হবে।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[2.2rem] font-bold text-[#0f4223] mb-4 flex items-center justify-center gap-3">
              📸 আমাদের কার্যক্রমের কিছু ছবি
            </h2>
            <div className="w-24 h-1.5 bg-[#f5a625] mx-auto rounded-full"></div>
          </div>
          {settings.portfolioContent.aboutImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {settings.portfolioContent.aboutImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 aspect-[3/4] cursor-pointer"
                  onClick={() => {
                    setLightboxIndex(idx);
                    setLightboxOpen(true);
                  }}
                >
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={settings.portfolioContent.aboutImages.map((img) => ({ src: img }))}
      />

      {/* Courses Section */}
      <section id="courses" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[1.8rem] font-bold text-[var(--primary-dark)] mb-2">📚 আমাদের কোর্সসমূহ</h2>
            <div className="w-16 h-1 bg-[var(--secondary)] mx-auto rounded-full"></div>
            <p className="mt-4 text-slate-600">আপনার প্রয়োজন অনুযায়ী সেরা কোর্সটি বেছে নিন</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="bg-[var(--primary)] p-6 text-white text-center">
                    <h3 className="text-[1.3rem] font-bold">{course.name}</h3>
                  </div>
                  <div className="p-8 flex-grow">
                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3 text-slate-700 text-[0.95rem]">
                        <span className="text-emerald-500">✔</span> কোর্সের সময়সীমা: ৩ মাস
                      </li>
                      <li className="flex items-center gap-3 text-slate-700 text-[0.95rem]">
                        <span className="text-emerald-500">✔</span> মোট ক্লাস সংখ্যা: ৩৬ টি
                      </li>
                      <li className="flex items-center gap-3 text-slate-700 text-[0.95rem]">
                        <span className="text-emerald-500">✔</span> ক্লাসের সময়সীমা: ১ ঘণ্টা ৩০ মিনিট
                      </li>
                      <li className="flex items-center gap-3 text-slate-700 text-[0.95rem]">
                        <span className="text-emerald-500">✔</span> সিলেবাস: ABCD থেকে এডভান্স পর্যন্ত
                      </li>
                      <li className="flex items-center gap-3 text-slate-700 text-[0.95rem]">
                        <span className="text-emerald-500">✔</span> ২০টি অধ্যায় ও ৫০০০+ শব্দার্থ
                      </li>
                    </ul>
                    <a 
                      href="#admission" 
                      onClick={() => setAdmissionForm(prev => ({ ...prev, course: course.name }))}
                      className="block w-full py-3.5 bg-[var(--primary)] text-white text-center rounded-xl font-bold hover:bg-[var(--primary-dark)] transition-all"
                    >
                      ভর্তি হোন
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-400">
                লোড হচ্ছে...
              </div>
            )}
          </div>

          {/* Other Courses List */}
          <div className="mt-16 bg-white rounded-3xl p-10 border border-slate-200 shadow-sm">
            <h3 className="text-[1.4rem] font-bold text-[var(--primary-dark)] mb-8 flex items-center gap-3">
              <span className="text-2xl">🔵</span> আমাদের অন্যান্য কোর্সসমূহ:
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">A-Z</div>
                <p className="font-bold text-slate-700">English Grammar Course</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center font-bold">Kids</div>
                <p className="font-bold text-slate-700">Kids Spoken Course</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold">SSC</div>
                <p className="font-bold text-slate-700">SSC English Course</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold">HSC</div>
                <p className="font-bold text-slate-700">HSC English Course</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Batch Info Section */}
      <section id="batch" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[1.8rem] font-bold text-[var(--primary-dark)] mb-2">📋 ব্যাচ ও সময়সূচী</h2>
            <div className="w-16 h-1 bg-[var(--secondary)] mx-auto rounded-full"></div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f4223] text-white">
                  <th className="p-6 font-bold">ব্যাচ নং</th>
                  <th className="p-6 font-bold">ক্লাস সময়</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {[
                  { id: "১ম ব্যাচ", time: "আলোচনা সাপেক্ষে" },
                  { id: "২য় ব্যাচ", time: "আলোচনা সাপেক্ষে" },
                  { id: "৩য় ব্যাচ", time: "আলোচনা সাপেক্ষে" },
                  { id: "৪র্থ ব্যাচ", time: "আলোচনা সাপেক্ষে" },
                ].map((batch, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-6 font-bold text-slate-700">{batch.id}</td>
                    <td className="p-6 font-bold text-emerald-600">{batch.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Admission Form Section */}
      <section id="admission" className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[1.8rem] font-bold text-[var(--primary-dark)] mb-2">📝 অনলাইন ভর্তি ফরম</h2>
            <div className="w-16 h-1 bg-[var(--secondary)] mx-auto rounded-full"></div>
            <p className="mt-4 text-slate-600">সঠিক তথ্য দিয়ে নিচের ফরমটি পূরণ করুন</p>
          </div>

          <div className="form-wrapper relative overflow-hidden shadow-2xl">
            {isSuccess ? (
              <div className="text-center py-12 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-[1.5rem] font-bold text-slate-900 mb-2">আবেদন সফল হয়েছে!</h3>
                <p className="text-slate-600 mb-6">আপনার আবেদন আইডি: <span className="font-bold text-[var(--primary)]">{appId}</span></p>
                <p className="text-[0.9rem] text-slate-500 mb-8">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো। ইনশাআল্লাহ।</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="px-8 py-3 bg-[var(--primary)] text-white rounded-xl font-bold hover:bg-[var(--primary-dark)] transition-all"
                >
                  নতুন আবেদন করুন
                </button>
              </div>
            ) : (
              <form onSubmit={handleAdmissionSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">শিক্ষার্থীর পূর্ণ নাম *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="আপনার নাম লিখুন"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.fullName}
                      onChange={(e) => setAdmissionForm({...admissionForm, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">ডাক নাম</label>
                    <input 
                      type="text" 
                      placeholder="আপনার ডাক নাম লিখুন"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.nickname}
                      onChange={(e) => setAdmissionForm({...admissionForm, nickname: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">মোবাইল নম্বর *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="০১৭XXXXXXXX"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.mobile}
                      onChange={(e) => setAdmissionForm({...admissionForm, mobile: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">পিতার নাম *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="পিতার নাম লিখুন"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.fatherName}
                      onChange={(e) => setAdmissionForm({...admissionForm, fatherName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">মাতার নাম *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="মাতার নাম লিখুন"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.motherName}
                      onChange={(e) => setAdmissionForm({...admissionForm, motherName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">লিঙ্গ *</label>
                    <select 
                      required
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all bg-white"
                      value={admissionForm.gender}
                      onChange={(e) => setAdmissionForm({...admissionForm, gender: e.target.value})}
                    >
                      <option value="">লিঙ্গ নির্বাচন করুন</option>
                      <option value="পুরুষ">পুরুষ</option>
                      <option value="মহিলা">মহিলা</option>
                      <option value="অন্যান্য">অন্যান্য</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">জন্ম তারিখ *</label>
                    <input 
                      type="date" 
                      required
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.dob}
                      onChange={(e) => setAdmissionForm({...admissionForm, dob: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">রক্তের গ্রুপ</label>
                    <select 
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all bg-white"
                      value={admissionForm.bloodGroup}
                      onChange={(e) => setAdmissionForm({...admissionForm, bloodGroup: e.target.value})}
                    >
                      <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">ধর্ম</label>
                    <input 
                      type="text" 
                      placeholder="আপনার ধর্ম লিখুন"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.religion}
                      onChange={(e) => setAdmissionForm({...admissionForm, religion: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">ইমেইল (ঐচ্ছিক)</label>
                    <input 
                      type="email" 
                      placeholder="আপনার ইমেইল লিখুন"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.email}
                      onChange={(e) => setAdmissionForm({...admissionForm, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">হোয়াটসঅ্যাপ নম্বর *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="০১৭XXXXXXXX"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.whatsapp}
                      onChange={(e) => setAdmissionForm({...admissionForm, whatsapp: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">অভিভাবকের মোবাইল নম্বর *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="০১৭XXXXXXXX"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.guardianMobile}
                      onChange={(e) => setAdmissionForm({...admissionForm, guardianMobile: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">পেশা *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="আপনার পেশা লিখুন"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.occupation}
                      onChange={(e) => setAdmissionForm({...admissionForm, occupation: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">শিক্ষাগত যোগ্যতা *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="আপনার শিক্ষাগত যোগ্যতা লিখুন"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.education}
                      onChange={(e) => setAdmissionForm({...admissionForm, education: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">সেশন</label>
                    <input 
                      type="text" 
                      placeholder="যেমন: ২০২৪-২৫"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.session}
                      onChange={(e) => setAdmissionForm({...admissionForm, session: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">বোর্ড</label>
                    <input 
                      type="text" 
                      placeholder="যেমন: কুমিল্লা"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.board}
                      onChange={(e) => setAdmissionForm({...admissionForm, board: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">রোল নম্বর</label>
                    <input 
                      type="text" 
                      placeholder="আপনার রোল নম্বর লিখুন"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.roll}
                      onChange={(e) => setAdmissionForm({...admissionForm, roll: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">GPA</label>
                    <input 
                      type="text" 
                      placeholder="যেমন: ৫.০০"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.gpa}
                      onChange={(e) => setAdmissionForm({...admissionForm, gpa: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[0.9rem] font-bold text-slate-700">কোর্স নির্বাচন করুন *</label>
                    <select 
                      required
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all bg-white"
                      value={admissionForm.course}
                      onChange={(e) => setAdmissionForm({...admissionForm, course: e.target.value})}
                    >
                      <option value="">কোর্স পছন্দ করুন</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <label className="block text-[0.9rem] font-bold text-slate-700">বর্তমান ঠিকানা *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="আপনার পূর্ণ ঠিকানা লিখুন"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      value={admissionForm.address}
                      onChange={(e) => setAdmissionForm({...admissionForm, address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <label className="block text-[0.9rem] font-bold text-slate-700">আপনার বার্তা (ঐচ্ছিক)</label>
                    <textarea 
                      placeholder="আপনার যদি কোন কিছু বলার থাকে তবে এখানে লিখুন"
                      rows={3}
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all resize-none"
                      value={admissionForm.message}
                      onChange={(e) => setAdmissionForm({...admissionForm, message: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-bold text-[1.1rem] hover:bg-[var(--primary-dark)] transition-all shadow-lg shadow-[var(--primary)]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      প্রসেসিং হচ্ছে...
                    </>
                  ) : (
                    <>📝 আবেদন জমা দিন</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-info" className="py-20 px-6 bg-[#0a2e18] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[var(--secondary)] text-[0.9rem] font-bold uppercase tracking-widest mb-2">যোগাযোগ করুন</p>
            <h2 className="text-[2.2rem] font-bold text-white">আমাদের সাথে <span className="text-[var(--secondary)]">যোগাযোগ</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-all group">
              <div className="w-14 h-14 bg-[var(--secondary)]/20 text-[var(--secondary)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7" />
              </div>
              <h4 className="text-[1.1rem] font-bold mb-4">ঠিকানা</h4>
              <p className="text-white/70 text-[0.92rem] leading-relaxed">
                ছাতারপাইয়া পশ্চিম বাজার,<br />
                নুর জাহান কমপ্লেক্স,<br />
                ওয়ান ব্যাংকের নিচ তলা,<br />
                সেনবাগ, নোয়াখালী
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-all group">
              <div className="w-14 h-14 bg-[var(--secondary)]/20 text-[var(--secondary)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Phone className="w-7 h-7" />
              </div>
              <h4 className="text-[1.1rem] font-bold mb-4">ফোন নম্বর</h4>
              <p className="text-white/70 text-[1rem] font-bold mb-1">01707-581180</p>
              <p className="text-white/70 text-[1rem] font-bold">01816-648831</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-all group">
              <div className="w-14 h-14 bg-[var(--secondary)]/20 text-[var(--secondary)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h4 className="text-[1.1rem] font-bold mb-4">WHATSAPP</h4>
              <p className="text-white/70 text-[1rem] font-bold">01707-581180</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-all group">
              <div className="w-14 h-14 bg-[var(--secondary)]/20 text-[var(--secondary)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7" />
              </div>
              <h4 className="text-[1.1rem] font-bold mb-4">ক্লাসের সময়</h4>
              <p className="text-white/70 text-[1rem] font-bold mb-1">সপ্তাহে ৩ দিন</p>
              <p className="text-white/70 text-[0.92rem]">সময়: পরামর্শযোগ্য</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#051a0e] text-white pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="font-rajdhani text-[1.5rem] font-bold text-[var(--secondary)] tracking-wider">
                Basic <span className="text-white">English Therapy</span>
              </div>
              <p className="text-white/60 text-[0.92rem] leading-relaxed">
                আমরা বিশ্বাস করি সঠিক দিকনির্দেশনা এবং কঠোর পরিশ্রমের মাধ্যমে যে কেউ ইংরেজিতে দক্ষ হয়ে উঠতে পারে। আমাদের লক্ষ্য প্রতিটি শিক্ষার্থীকে আত্মবিশ্বাসী করে তোলা।
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[var(--secondary)] hover:text-[var(--text-main)] transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[var(--secondary)] hover:text-[var(--text-main)] transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[var(--secondary)] hover:text-[var(--text-main)] transition-all">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-[1.1rem] font-bold mb-6 text-white">প্রয়োজনীয় লিংক</h4>
              <ul className="space-y-4 text-white/60 text-[0.92rem]">
                <li><a href="#about" className="hover:text-[var(--secondary)] transition-colors">শিক্ষক পরিচিতি</a></li>
                <li><a href="#courses" className="hover:text-[var(--secondary)] transition-colors">আমাদের কোর্সসমূহ</a></li>
                <li><a href="#batch" className="hover:text-[var(--secondary)] transition-colors">ব্যাচ ও সময়সূচী</a></li>
                <li><a href="#admission" className="hover:text-[var(--secondary)] transition-colors">অনলাইন ভর্তি</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[1.1rem] font-bold mb-6 text-white">যোগাযোগ</h4>
              <ul className="space-y-4 text-white/60 text-[0.92rem]">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[var(--secondary)] shrink-0" />
                  <span>ছাতারপাইয়া পশ্চিম বাজার, নুর জাহান কমপ্লেক্স, ওয়ান ব্যাংকের নিচ তলা, সেনবাগ, নোয়াখালী</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--secondary)] shrink-0" />
                  <span>01707-581180, 01816-648831</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--secondary)] shrink-0" />
                  <span>basicenglishtherapy@gmail.com</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[1.1rem] font-bold mb-6 text-white">অফিস সময়</h4>
              <ul className="space-y-4 text-white/60 text-[0.92rem]">
                <li className="flex justify-between">
                  <span>শনিবার - বৃহস্পতিবার:</span>
                  <span>০৮:০০ AM - ০৯:০০ PM</span>
                </li>
                <li className="flex justify-between text-[var(--secondary)]">
                  <span>শুক্রবার:</span>
                  <span>বন্ধ</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 text-center text-white/40 text-[0.85rem]">
            <p className="mb-2">© ২০২৩ Basic English Therapy — ডা. আবদুল মোমিন কর্তৃক পরিচালিত</p>
            <p>Govt. Reg. No: 165451 | TICTB/BTEB অনুমোদিত | Institute Code: 76148</p>
            <p className="mt-4 opacity-50">Developed by <a href="#" className="hover:text-white transition-colors">AI Studio</a></p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/8801707581180?text=${encodeURIComponent("আসসালামু আলাইকুম, আমি আপনাদের কোর্স সম্পর্কে জানতে চাই।")}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="wa-float"
        title="WhatsApp Us"
      >
        <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
