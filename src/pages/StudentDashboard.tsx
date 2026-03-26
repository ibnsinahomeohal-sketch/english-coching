import React, { useState } from "react";
import { Award, CheckCircle2, Clock, BookOpen } from "lucide-react";
import { PageHero } from "../components/PageHero";

// Mock Data
const COURSES = ["Spoken English", "Writing", "Kids English", "SSC/HSC English"];

export default function StudentDashboard() {
  // Mock student data
  const student = {
    name: "Student Name",
    course: "Spoken English",
    batch: "Morning A",
    roll_no: "24",
    phone: "01700000000",
    attendance: 94.5,
    assignmentsCompleted: 12,
    totalAssignments: 14,
    grade: "A-"
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <PageHero 
        title={`Hello, ${student.name.split(' ')[0]}! 👋`}
        subtitle="Welcome back to your learning dashboard."
        icon={BookOpen}
        darkColor="#1e1b4b"
        badge="Dashboard"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="dashboard" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="2" y="2" width="16" height="16" fill="none" stroke="#ffffff" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dashboard)" />
          </svg>
        }
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Attendance</p>
            <h3 className="text-2xl font-bold text-slate-900">{student.attendance}%</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Assignments</p>
            <h3 className="text-2xl font-bold text-slate-900">{student.assignmentsCompleted} / {student.totalAssignments}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
              <Award className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Current Grade</p>
            <h3 className="text-2xl font-bold text-slate-900">{student.grade}</h3>
          </div>
        </div>

        {/* Recent Homework Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Recent Homework</h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { title: "Vocabulary Practice Set 4", due: "Tomorrow", status: "pending", color: "amber" },
              { title: "Grammar: Tenses Overview", due: "20 Mar", status: "pending", color: "amber" },
            ].map((hw, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 bg-${hw.color}-100 text-${hw.color}-600 rounded-lg flex items-center justify-center`}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{hw.title}</h4>
                    <p className="text-xs text-slate-500">Due: {hw.due}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-${hw.color}-100 text-${hw.color}-700`}>
                  {hw.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
