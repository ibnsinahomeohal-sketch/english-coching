import { useState, useRef, useEffect } from "react";
import { Award, Download, Search } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export default function Certificates() {
  const [studentName, setStudentName] = useState("");
  const [course, setCourse] = useState("");
  const [instituteName, setInstituteName] = useState("");
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
    }
  }, []);

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    
    try {
      setIsGenerating(true);
      const canvas = await html2canvas(certificateRef.current, { 
        scale: 2,
        useCORS: true,
        logging: false
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
    <div className="max-w-5xl mx-auto pb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Certificate Generator</h2>
        <p className="text-sm text-gray-500 mt-1">Generate and download completion certificates as PDF</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Completed</label>
                <input 
                  type="text" 
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                <input 
                  type="text" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
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
        <div className="lg:col-span-2 flex justify-center overflow-x-auto">
          <div className="bg-white p-2 shadow-xl border border-gray-200 min-w-[800px]">
            <div 
              ref={certificateRef}
              className="border-[12px] border-double border-[#312e81] p-12 text-center relative bg-[#fdfbf7] w-[800px] h-[600px] flex flex-col justify-between"
              style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}
            >
              
              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-[#312e81]"></div>
              <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-[#312e81]"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-[#312e81]"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-[#312e81]"></div>

              {/* Header: Logo & Institute Name */}
              <div className="flex flex-col items-center justify-center mt-4">
                {logo ? (
                  <img src={logo} alt="Institute Logo" className="h-16 object-contain mb-2" crossOrigin="anonymous" />
                ) : (
                  <Award className="h-12 w-12 text-[#f59e0b] mb-2" />
                )}
                <h2 className="text-xl font-bold text-[#1e1b4b] uppercase tracking-widest">{instituteName}</h2>
              </div>

              <div className="mt-4 mb-6">
                <h1 className="text-4xl font-serif font-bold text-[#1e1b4b] uppercase tracking-widest">Certificate</h1>
                <p className="text-lg font-serif text-[#3730a3] tracking-widest mt-1">OF COMPLETION</p>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-[#4b5563] italic">This is proudly presented to</p>
                <h2 className="text-4xl font-serif font-bold text-[#111827] border-b-2 border-[#d1d5db] pb-2 inline-block min-w-[300px]">
                  {studentName || "Student Name"}
                </h2>
                <p className="text-[#4b5563] italic max-w-lg mx-auto leading-relaxed mt-4">
                  for successfully completing the rigorous requirements and demonstrating exceptional proficiency in
                </p>
                <h3 className="text-2xl font-bold text-[#312e81] uppercase tracking-wider mt-2">
                  {course || "Course Name"}
                </h3>
              </div>

              <div className="flex justify-between items-end mt-auto px-12 pb-4">
                <div className="text-center">
                  <div className="border-b border-[#9ca3af] w-40 mb-2 pb-1 text-[#1f2937] font-medium">{date}</div>
                  <p className="text-xs text-[#6b7280] uppercase tracking-wider">Date of Issue</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-[#9ca3af] w-40 mb-2 pb-1 text-[#1f2937] font-medium font-serif italic">Director</div>
                  <p className="text-xs text-[#6b7280] uppercase tracking-wider">Authorized Signature</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
