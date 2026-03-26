import React, { useState, FormEvent } from "react";
import { Upload, FileText, Image as ImageIcon, Download, Search, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "../components/PageHero";

// Mock Data for Notes
const initialNotes = [
  { id: 1, title: "Spoken English - Class 1 Vocabulary", course: "Spoken English", type: "pdf", date: "10 Mar 2026", size: "2.4 MB" },
  { id: 2, title: "Grammar Rules Cheat Sheet", course: "SSC/HSC English", type: "image", date: "12 Mar 2026", size: "1.1 MB" },
  { id: 3, title: "Writing Task 1 Formats", course: "Writing", type: "pdf", date: "14 Mar 2026", size: "3.5 MB" },
];

export default function Notes() {
  const [notes, setNotes] = useState(initialNotes);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({ title: "", course: "Spoken English", file: null as File | null });

  const handleUpload = (e: FormEvent) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.title) return;

    setIsUploading(true);
    
    setTimeout(() => {
      const newNote = {
        id: notes.length + 1,
        title: uploadData.title,
        course: uploadData.course,
        type: uploadData.file?.type.includes('image') ? 'image' : 'pdf',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        size: (uploadData.file!.size / (1024 * 1024)).toFixed(1) + " MB"
      };
      
      setNotes([newNote, ...notes]);
      setUploadData({ title: "", course: "Spoken English", file: null });
      setIsUploading(false);
      toast.success("Note uploaded successfully!");
    }, 1000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(26, 12, 0, 0.06)' }}>
      <PageHero 
        title="Course Notes"
        subtitle="Upload and manage PDF/Image notes for students"
        icon={FileText}
        darkColor="#1a0c00"
        badge="Notes"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="files" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 5 2 L 15 2 L 15 18 L 5 18 Z" fill="none" stroke="#c2410c" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#files)" />
          </svg>
        }
      />
      <div className="max-w-6xl mx-auto pb-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Upload New Note</h3>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note Title</label>
                  <input 
                    type="text" 
                    required
                    value={uploadData.title}
                    onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                    placeholder="e.g. Class 1 Vocabulary" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                  <select 
                    value={uploadData.course}
                    onChange={(e) => setUploadData({...uploadData, course: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                  >
                    <option>Spoken English</option>
                    <option>Writing</option>
                    <option>Kids English</option>
                    <option>SSC/HSC English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF or Image)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors relative">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                          <span>{uploadData.file ? uploadData.file.name : "Upload a file"}</span>
                          <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            accept=".pdf,image/png,image/jpeg" 
                            onChange={(e) => setUploadData({...uploadData, file: e.target.files?.[0] || null})}
                            required
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isUploading || !uploadData.file}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Upload Note"}
                </button>
              </form>
            </div>
          </div>

          {/* Notes List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  Available Notes
                </h3>
                <div className="relative w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search notes..." 
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {notes.map(note => (
                  <div key={note.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${note.type === 'pdf' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                        {note.type === 'pdf' ? <FileText className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{note.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">{note.course}</span>
                          <span>{note.date}</span>
                          <span>{note.size}</span>
                        </div>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
