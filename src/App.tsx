/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Admission from "./pages/Admission";
import Operations from "./pages/Operations";
import Attendance from "./pages/Attendance";
import Chat from "./pages/Chat";
import Notes from "./pages/Notes";
import Settings from "./pages/Settings";
import ClassSchedule from "./pages/ClassSchedule";
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
import Certificates from "./pages/Certificates";
import ParentPortal from "./pages/ParentPortal";
import LearningModule from "./pages/LearningModule";
import SpeakingPractice from "./pages/SpeakingPractice";
import Community from "./pages/Community";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
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
      </Routes>
    </BrowserRouter>
  );
}
