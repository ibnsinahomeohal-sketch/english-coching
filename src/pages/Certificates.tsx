import { useState, useRef, useEffect } from "react";
import { Award, Download, Search, Star, QrCode } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

export default function Certificates() {
  const [studentName, setStudentName] = useState("");
  const [session, setSession] = useState("");
  const [course, setCourse] = useState("");
  const [batch, setBatch] = useState("");
  const [duration, setDuration] = useState("");
  const [grade, setGrade] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [instituteName, setInstituteName] = useState("BASIC ENGLISH THERAPY");
  const [address, setAddress] = useState("ChakBazar, Lakshmipur Sadar-3700, Lakshmipur.");
  const [regNo, setRegNo] = useState("1385461729");
  const [instCode, setInstCode] = useState("54617");
  const [logo, setLogo] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
  const [isGenerating, setIsGenerating] = useState(false);
  
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.logo) setLogo(parsed.logo);
      if (parsed.instituteName) setInstituteName(parsed.instituteName);
      if (parsed.address) setAddress(parsed.address);
    }
  }, []);

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    
    try {
      setIsGenerating(true);
      const canvas = await html2canvas(certificateRef.current, { 
        scale: 2, // 2 is enough for good quality and keeps file size reasonable
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${studentName.replace(/\s+/g, '_')}_Certificate.pdf`);
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Certificate Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
                <input 
                  type="text" 
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institute Address</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. 64dddf72f1a57"
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 2023-24"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 2401"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                <input 
                  type="text" 
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 3 Months"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade / Result</label>
                  <input 
                    type="text" 
                    placeholder="e.g. A+ (5.00)"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                <input 
                  type="text" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                />
              </div>
              
              <button 
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-4 disabled:opacity-70"
              >
                <Download className="h-4 w-4" />
                {isGenerating ? "Generating PDF..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="lg:col-span-3 flex justify-center overflow-x-auto">
          <div className="bg-white p-4 shadow-2xl border border-gray-200 min-w-[950px]">
            <div 
              ref={certificateRef}
              className="relative bg-[#fffdfa] w-[900px] h-[636px] flex flex-col items-center justify-center overflow-hidden border-[16px] border-double border-[#065f46]"
              style={{ 
                backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')"
              }}
            >
              {/* Center Watermark Logo */}
              {logo && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none z-0">
                  <img 
                    src={logo} 
                    alt="Watermark" 
                    className="w-[400px] h-[400px] object-contain grayscale" 
                    crossOrigin="anonymous"
                  />
                </div>
              )}

              {/* Background Text Watermark */}
              <div className="absolute inset-0 overflow-hidden opacity-[0.03] flex flex-wrap content-start pointer-events-none z-0" style={{ wordBreak: 'break-all' }}>
                {[...Array(150)].map((_, i) => (
                  <span key={i} className="text-2xl font-bold whitespace-nowrap mr-4 mb-2">
                    {instituteName}
                  </span>
                ))}
              </div>

              {/* Decorative Corner Borders */}
              <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-[#065f46] m-2"></div>
              <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-[#065f46] m-2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-[#065f46] m-2"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-[#065f46] m-2"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center w-full px-24 h-full pt-12">
                
                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                  <h1 className="text-6xl font-serif font-black text-[#065f46] tracking-wider mb-1" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>CERTIFICATE</h1>
                  <h2 className="text-2xl font-serif text-[#111827] tracking-[0.3em] mb-4">OF COMPLETION</h2>
                  
                  <div className="flex items-center gap-6">
                    {logo && <img src={logo} alt="Logo" className="h-20 w-20 object-contain" crossOrigin="anonymous" />}
                    <div className="flex flex-col items-center">
                      <h3 className="text-3xl font-bold text-[#065f46] tracking-widest uppercase">{instituteName}</h3>
                      <p className="text-xs text-[#111827] uppercase tracking-wider mt-1">{address}</p>
                      <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-[#111827] uppercase tracking-wider">
                        <span>Govt. Reg. No: {regNo}</span>
                        <span className="h-3 w-px bg-[#111827]/50"></span>
                        <span>Institute Code: {instCode}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-bold text-[#111827] tracking-widest uppercase mb-4">THIS CERTIFICATE IS PROUDLY PRESENTED TO</p>

                <h2 className="text-6xl font-cursive text-[#065f46] mb-6 border-b border-[#065f46] pb-2 px-16 min-w-[500px] text-center">
                  {studentName || "Student Name"}
                </h2>

                <p className="text-center text-[#111827] max-w-2xl leading-relaxed mb-8 text-sm">
                  This is to certify that the above named student has successfully completed the <span className="font-bold">{course || "Course Name"}</span> course from <span className="font-bold">{session || "Session"}</span>. They have demonstrated outstanding dedication and achieved a grade of <span className="font-bold">{grade || "A+"}</span>.
                </p>

                {/* Footer with Signatures and Badge */}
                <div className="absolute bottom-12 flex justify-between items-center w-full px-24">
                  {/* Signature 1 */}
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-px bg-[#111827] mb-2"></div>
                    <p className="text-xs font-bold text-[#111827] uppercase tracking-wider">Course Co-Ordinator</p>
                    <p className="text-[9px] text-[#065f46] font-bold uppercase mt-1">Date: {date}</p>
                  </div>

                  {/* Golden Badge */}
                  <div className="relative flex items-center justify-center w-32 h-32">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-xl">
                      <defs>
                        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#BF953F" />
                          <stop offset="25%" stopColor="#FCF6BA" />
                          <stop offset="50%" stopColor="#B38728" />
                          <stop offset="75%" stopColor="#FBF5B7" />
                          <stop offset="100%" stopColor="#AA771C" />
                        </linearGradient>
                      </defs>
                      <path d="M50 0 L55 10 L65 8 L68 18 L78 20 L78 30 L88 35 L85 45 L95 50 L85 55 L88 65 L78 70 L78 80 L68 82 L65 92 L55 90 L50 100 L45 90 L35 92 L32 82 L22 80 L22 70 L12 65 L15 55 L5 50 L15 45 L12 35 L22 30 L22 20 L32 18 L35 8 L45 10 Z" fill="url(#gold)" />
                      <circle cx="50" cy="50" r="35" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5" />
                      <circle cx="50" cy="50" r="30" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.5" />
                    </svg>
                    <div className="relative z-10 text-center flex flex-col items-center justify-center">
                      <span className="text-[9px] font-bold text-[#111827] uppercase tracking-widest">Duration</span>
                      <span className="text-sm font-black text-[#111827]">{duration || "3 Months"}</span>
                    </div>
                  </div>

                  {/* Signature 2 */}
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-px bg-[#111827] mb-2"></div>
                    <p className="text-xs font-bold text-[#111827] uppercase tracking-wider">Principal</p>
                    <p className="text-[9px] text-[#065f46] font-bold uppercase mt-1">ID: {serialNo || "CERT-001"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
