import React, { useState, useEffect } from "react";
import { FileText, Image as ImageIcon, Download, Search, BookOpen } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function StudentNotes() {
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const sessionStr = localStorage.getItem('studentSession');
      if (!sessionStr) return;
      
      const session = JSON.parse(sessionStr);
      const studentId = session.studentId;

      // Fetch student details
      const { data: studentData } = await supabase
        .from("students")
        .select("course_id, batch_id")
        .eq("student_id", studentId)
        .single();

      if (studentData) {
        // Fetch notes for this student's course and batch
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("course_id", studentData.course_id)
          .eq("batch_id", studentData.batch_id);

        if (error) {
          console.error("Error fetching notes:", error);
          toast.error("Could not load notes.");
        } else {
          setNotes(data || []);
        }
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(26, 12, 0, 0.06)' }}>
      <PageHero 
        title="Course Notes"
        subtitle="View and download your study materials"
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
      <div className="max-w-4xl mx-auto pb-8 pt-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              Available Notes
            </h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {notes.map(note => (
              <div key={note.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${note.file_type === 'pdf' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                    {note.file_type === 'pdf' ? <FileText className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{note.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">{note.course}</span>
                      <span>{note.date}</span>
                    </div>
                  </div>
                </div>
                <a 
                  href={note.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </div>
            ))}
            {notes.length === 0 && (
              <p className="p-8 text-center text-gray-500">No notes available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
