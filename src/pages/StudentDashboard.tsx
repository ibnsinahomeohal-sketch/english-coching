import React, { useState, useEffect } from "react";
import { LayoutDashboard, BookOpen, Clock, Award, FileText } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState({ homework: 0, exams: 0, notes: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const sessionStr = localStorage.getItem('studentSession');
      if (!sessionStr) return;
      
      const session = JSON.parse(sessionStr);
      const studentId = session.studentId;

      // Fetch student details with course and batch names
      const { data: studentData } = await supabase
        .from("students")
        .select(`
          *,
          courses (name),
          batches (name)
        `)
        .eq("student_id", studentId)
        .single();

      if (studentData) {
        setStudent({
          ...studentData,
          courseName: studentData.courses?.name,
          batchName: studentData.batches?.name
        });

        // Fetch counts for dashboard using IDs
        const { count: homeworkCount } = await supabase
          .from("homework")
          .select("*", { count: 'exact', head: true })
          .eq("course_id", studentData.course_id)
          .eq("batch_id", studentData.batch_id);

        const { count: examCount } = await supabase
          .from("exams")
          .select("*", { count: 'exact', head: true })
          .eq("course_id", studentData.course_id)
          .eq("batch_id", studentData.batch_id);

        const { count: notesCount } = await supabase
          .from("notes")
          .select("*", { count: 'exact', head: true })
          .eq("course_id", studentData.course_id)
          .eq("batch_id", studentData.batch_id);

        setStats({
          homework: homeworkCount || 0,
          exams: examCount || 0,
          notes: notesCount || 0
        });
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <PageHero 
        title={`Hello, ${student?.name?.split(' ')[0] || 'Student'}! 👋`}
        subtitle={`Your dashboard for ${student?.courseName || ''} - ${student?.batchName || ''}`}
        icon={LayoutDashboard}
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
            <p className="text-sm font-medium text-slate-500 mb-1">Pending Homework</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.homework}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Award className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Exams Taken</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.exams}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Available Notes</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.notes}</h3>
          </div>
        </div>
      </main>
    </div>
  );
}
