import React, { useState, useEffect } from "react";
import { BookOpen, FileText, Calendar, CheckCircle } from "lucide-react";
import { PageHero } from "../components/PageHero";

// This would typically come from a backend/database
const initialHomework: any[] = [
  { id: 1, title: "Vocabulary Practice Set 4", course: "Spoken English", batch: "Morning-A", dueDate: "2026-03-28", status: "Active" },
  { id: 2, title: "Grammar: Tenses Overview", course: "Spoken English", batch: "Morning-A", dueDate: "2026-03-30", status: "Active" },
];

export default function StudentHomework() {
  const [assignments, setAssignments] = useState(initialHomework);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(26, 12, 0, 0.06)' }}>
      <PageHero 
        title="My Homework"
        subtitle="View and submit your assigned tasks"
        icon={BookOpen}
        darkColor="#1a0c00"
        badge="Homework"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="books" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="5" y="5" width="10" height="12" fill="#c2410c" fillOpacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#books)" />
          </svg>
        }
      />
      <div className="max-w-5xl mx-auto pb-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map(assignment => (
            <div key={assignment.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                    <p className="text-xs text-gray-500">{assignment.course} • {assignment.batch}</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {assignment.status}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm text-gray-600 border-t pt-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  Due: {assignment.dueDate}
                </div>
                <button className="flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-800">
                  <FileText className="h-4 w-4" />
                  Submit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
