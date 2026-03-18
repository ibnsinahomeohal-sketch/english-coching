import React, { useState, FormEvent } from "react";
import { PlayCircle, FileText, Baby, Download, Plus, X, UploadCloud, Volume2 } from "lucide-react";

export default function Resources() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isKidsZoneOpen, setIsKidsZoneOpen] = useState(false);
  const [kidsTab, setKidsTab] = useState<"vocab" | "sentences">("vocab");
  const [uploadType, setUploadType] = useState<"video" | "pdf">("video");
  const [newResourceTitle, setNewResourceTitle] = useState("");
  
  const [videos, setVideos] = useState([
    { id: 1, title: "Spoken English: Fluency Hacks", duration: "1h 20m", thumbnail: "https://picsum.photos/seed/class1/400/225" },
    { id: 2, title: "SSC/HSC: Right Form of Verbs", duration: "1h 20m", thumbnail: "https://picsum.photos/seed/class2/400/225" },
    { id: 3, title: "Writing: Essay Structure", duration: "1h 20m", thumbnail: "https://picsum.photos/seed/class3/400/225" }
  ]);

  const [pdfs, setPdfs] = useState([
    { id: 1, title: "Basic Grammar Master Sheet", size: "2.4 MB" },
    { id: 2, title: "Spoken English Vocabulary", size: "1.8 MB" },
    { id: 3, title: "SSC/HSC Board Question Solve", size: "3.2 MB" },
    { id: 4, title: "Writing Formats & Templates", size: "1.5 MB" }
  ]);

  const handleUpload = (e: FormEvent) => {
    e.preventDefault();
    if (!newResourceTitle) return;

    if (uploadType === "video") {
      setVideos([
        {
          id: Date.now(),
          title: newResourceTitle,
          duration: "Just added",
          thumbnail: `https://picsum.photos/seed/${Date.now()}/400/225`
        },
        ...videos
      ]);
    } else {
      setPdfs([
        {
          id: Date.now(),
          title: newResourceTitle,
          size: "Uploaded"
        },
        ...pdfs
      ]);
    }

    setNewResourceTitle("");
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Study Resources</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and share class recordings and lecture sheets</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Upload Resource
        </button>
      </div>

      {/* Recorded Classes */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <PlayCircle className="h-6 w-6 text-indigo-600" />
          Recorded Classes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm group cursor-pointer">
              <div className="aspect-video bg-gray-100 relative">
                <img src={video.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 line-clamp-1">{video.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Duration: {video.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PDF Library */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-6 w-6 text-rose-600" />
          Special Lecture Sheets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pdfs.map((pdf) => (
            <div key={pdf.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-rose-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-rose-50 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{pdf.title}</h4>
                  <p className="text-xs text-gray-500">PDF • {pdf.size}</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Download className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Kids Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Baby className="h-6 w-6 text-emerald-600" />
          Kids Interactive Zone
        </h2>
        <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl p-8 text-white flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Learn with Fun!</h3>
            <p className="text-emerald-50 max-w-md">Interactive modules with pictures and audio for our junior batch students.</p>
            <button 
              onClick={() => setIsKidsZoneOpen(true)}
              className="mt-6 bg-white text-emerald-600 px-6 py-2 rounded-full font-bold hover:bg-emerald-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              Enter Kids Zone
            </button>
          </div>
          <div className="hidden md:block">
            <img src="https://picsum.photos/seed/kids/200/200" alt="Kids" className="rounded-full border-4 border-white/30 w-32 h-32 object-cover" />
          </div>
        </div>
      </section>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Upload Resource</h3>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUploadType("video")}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border font-medium transition-colors ${
                      uploadType === "video" 
                        ? "bg-indigo-50 border-indigo-600 text-indigo-700" 
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <PlayCircle className="h-5 w-5" />
                    Video Class
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadType("pdf")}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border font-medium transition-colors ${
                      uploadType === "pdf" 
                        ? "bg-rose-50 border-rose-600 text-rose-700" 
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FileText className="h-5 w-5" />
                    PDF Sheet
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={newResourceTitle}
                  onChange={(e) => setNewResourceTitle(e.target.value)}
                  placeholder="e.g. Tense Masterclass Part 1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {uploadType === "video" ? "YouTube/Drive Link" : "Upload File"}
                </label>
                {uploadType === "video" ? (
                  <input 
                    type="url" 
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-indigo-400 transition-colors cursor-pointer">
                    <UploadCloud className="h-8 w-8 mb-2 text-indigo-500" />
                    <span className="text-sm font-medium">Click to browse or drag file here</span>
                    <span className="text-xs mt-1">PDF up to 10MB</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kids Zone Modal */}
      {isKidsZoneOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border-4 border-emerald-400 flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-6 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-3">
                <Baby className="h-8 w-8" />
                <h3 className="text-3xl font-bold font-serif tracking-wide">Kids Interactive Zone</h3>
              </div>
              <button 
                onClick={() => setIsKidsZoneOpen(false)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex border-b border-gray-200 bg-white px-8 pt-4 gap-8 shrink-0">
              <button 
                onClick={() => setKidsTab("vocab")}
                className={`pb-3 font-bold text-lg border-b-4 transition-colors ${kidsTab === "vocab" ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                Vocabulary (শব্দভাণ্ডার)
              </button>
              <button 
                onClick={() => setKidsTab("sentences")}
                className={`pb-3 font-bold text-lg border-b-4 transition-colors ${kidsTab === "sentences" ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                Basic Sentences (সাধারণ বাক্য)
              </button>
            </div>

            <div className="p-8 bg-[#f8fafc] overflow-y-auto">
              <p className="text-center text-gray-600 mb-8 text-lg font-medium">
                {kidsTab === "vocab" ? "Click on any picture to hear its name! 🎧" : "Click on any sentence to hear the pronunciation! 🎧"}
              </p>
              
              {kidsTab === "vocab" ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { emoji: "🍎", word: "Apple", bangla: "আপেল", color: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" },
                    { emoji: "🐶", word: "Dog", bangla: "কুকুর", color: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100" },
                    { emoji: "🐱", word: "Cat", bangla: "বিড়াল", color: "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100" },
                    { emoji: "🚗", word: "Car", bangla: "গাড়ি", color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" },
                    { emoji: "🎈", word: "Balloon", bangla: "বেলুন", color: "bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100" },
                    { emoji: "🌟", word: "Star", bangla: "তারা", color: "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100" },
                    { emoji: "🦋", word: "Butterfly", bangla: "প্রজাপতি", color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100" },
                    { emoji: "🌳", word: "Tree", bangla: "গাছ", color: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" },
                    { emoji: "🐘", word: "Elephant", bangla: "হাতি", color: "bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100" },
                    { emoji: "🍓", word: "Strawberry", bangla: "স্ট্রবেরি", color: "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100" },
                    { emoji: "🌞", word: "Sun", bangla: "সূর্য", color: "bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100" },
                    { emoji: "📚", word: "Book", bangla: "বই", color: "bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100" },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(item.word);
                        utterance.lang = 'en-US';
                        utterance.rate = 0.85;
                        window.speechSynthesis.speak(utterance);
                      }}
                      className={`${item.color} border-2 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all transform hover:scale-105 hover:shadow-xl relative group`}
                    >
                      <Volume2 className="absolute top-3 right-3 h-5 w-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                      <span className="text-6xl drop-shadow-md mb-2">{item.emoji}</span>
                      <span className="text-2xl font-bold tracking-wide">{item.word}</span>
                      <span className="text-lg font-medium opacity-80">{item.bangla}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { en: "How are you?", bn: "তুমি কেমন আছো?", color: "bg-blue-50 border-blue-200 text-blue-800" },
                    { en: "What is your name?", bn: "তোমার নাম কী?", color: "bg-green-50 border-green-200 text-green-800" },
                    { en: "I am fine, thank you.", bn: "আমি ভালো আছি, ধন্যবাদ।", color: "bg-purple-50 border-purple-200 text-purple-800" },
                    { en: "Nice to meet you.", bn: "তোমার সাথে দেখা হয়ে ভালো লাগলো।", color: "bg-rose-50 border-rose-200 text-rose-800" },
                    { en: "See you later.", bn: "পরে দেখা হবে।", color: "bg-amber-50 border-amber-200 text-amber-800" },
                    { en: "Please help me.", bn: "দয়া করে আমাকে সাহায্য করো।", color: "bg-teal-50 border-teal-200 text-teal-800" },
                    { en: "I love my country.", bn: "আমি আমার দেশকে ভালোবাসি।", color: "bg-indigo-50 border-indigo-200 text-indigo-800" },
                    { en: "Let's play together.", bn: "চলো একসাথে খেলি।", color: "bg-orange-50 border-orange-200 text-orange-800" },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(item.en);
                        utterance.lang = 'en-US';
                        utterance.rate = 0.85;
                        window.speechSynthesis.speak(utterance);
                      }}
                      className={`${item.color} border-2 rounded-2xl p-6 flex items-center justify-between text-left transition-all transform hover:scale-[1.02] hover:shadow-md group`}
                    >
                      <div>
                        <h4 className="text-2xl font-bold mb-2">{item.en}</h4>
                        <p className="text-lg opacity-80 font-medium">{item.bn}</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-white transition-colors shrink-0 ml-4">
                        <Volume2 className="h-6 w-6 opacity-70" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
