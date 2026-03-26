/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { supabase } from "./lib/supabaseClient";
import { Layout } from "./components/Layout";
import StudentLayout from "./components/StudentLayout";
import Dashboard from "./pages/Dashboard";
import Admission from "./pages/Admission";
import Operations from "./pages/Operations";
import Attendance from "./pages/Attendance";
import Chat from "./pages/Chat";
import Notes from "./pages/Notes";
import StudentNotes from "./pages/StudentNotes";
import Settings from "./pages/Settings";
import ClassSchedule from "./pages/ClassSchedule";
import StudentClassSchedule from "./pages/StudentClassSchedule";
import EdTech from "./pages/EdTech";
import Resources from "./pages/Resources";
import AISupport from "./pages/AISupport";
import Finance from "./pages/Finance";
import StudentProfile from "./pages/StudentProfile";
import Exams from "./pages/Exams";
import StudentExams from "./pages/StudentExams";
import Leaderboard from "./pages/Leaderboard";
import StudentsList from "./pages/StudentsList";
import Teachers from "./pages/Teachers";
import Fees from "./pages/Fees";
import Expenses from "./pages/Expenses";
import Homework from "./pages/Homework";
import StudentHomework from "./pages/StudentHomework";
import Certificates from "./pages/Certificates";
import ParentPortal from "./pages/ParentPortal";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import LearningModule from "./pages/LearningModule";
import SpeakingPractice from "./pages/SpeakingPractice";
import Community from "./pages/Community";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;
  
  const studentSession = localStorage.getItem('studentSession');
  if (!session && !studentSession) return <Navigate to="/login" />;

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="admission" element={<Admission />} />
          <Route path="students" element={<StudentsList />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="operations" element={<Operations />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="schedule" element={<ClassSchedule />} />
          <Route path="fees" element={<Fees />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="homework" element={<Homework />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="parent-portal" element={<ParentPortal />} />
          <Route path="chat" element={<Chat />} />
          <Route path="notes" element={<Notes />} />
          <Route path="settings" element={<Settings />} />
          <Route path="edtech" element={<EdTech />} />
          <Route path="resources" element={<Resources />} />
          <Route path="ai-support" element={<AISupport />} />
          <Route path="finance" element={<Finance />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="exams" element={<Exams />} />
          <Route path="my-exams" element={<StudentExams />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="learning" element={<LearningModule />} />
          <Route path="speaking" element={<SpeakingPractice />} />
          <Route path="community" element={<Community />} />
        </Route>

        <Route path="/student" element={<ProtectedRoute><StudentLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="schedule" element={<StudentClassSchedule />} />
          <Route path="homework" element={<StudentHomework />} />
          <Route path="notes" element={<StudentNotes />} />
          <Route path="my-exams" element={<StudentExams />} />
          <Route path="speaking" element={<SpeakingPractice />} />
          <Route path="community" element={<Community />} />
          <Route path="ai-support" element={<AISupport />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
