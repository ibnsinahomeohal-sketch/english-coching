import { useState, useEffect } from "react";
import { Plus, Save, Trophy, CheckCircle, XCircle, HelpCircle, FileQuestion, BookOpen, Users, Clock } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function Exams() {
  const [activeTab, setActiveTab] = useState<"create" | "leaderboard">("create");
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  
  // Quiz Creation State
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { id: 1, text: "", options: ["", "", "", ""], correctOption: 0, explanation: "" }
  ]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: coursesData } = await supabase.from('courses').select('*');
      if (coursesData) {
        setCourses(coursesData);
        if (coursesData.length > 0) {
          setSelectedCourseId(coursesData[0].id);
          fetchBatches(coursesData[0].id);
        }
      }
    };
    fetchInitialData();
  }, []);

  const fetchBatches = async (courseId: string) => {
    const { data: batchesData } = await supabase
      .from('batches')
      .select('*')
      .eq('course_id', courseId);
    if (batchesData) {
      setBatches(batchesData);
      if (batchesData.length > 0) {
        setSelectedBatchId(batchesData[0].id);
      } else {
        setSelectedBatchId("");
      }
    }
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    fetchBatches(courseId);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: questions.length + 1, text: "", options: ["", "", "", ""], correctOption: 0, explanation: "" }
    ]);
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle || !selectedCourseId || !selectedBatchId) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { error } = await supabase
        .from('exams')
        .insert([{
          title: quizTitle,
          course_id: selectedCourseId,
          batch_id: selectedBatchId,
          questions: questions,
          duration_minutes: 30
        }]);

      if (error) throw error;

      toast.success(`Quiz "${quizTitle}" published successfully!`);
      setQuizTitle("");
      setQuestions([{ id: 1, text: "", options: ["", "", "", ""], correctOption: 0, explanation: "" }]);
    } catch (error: any) {
      toast.error(error.message || "Failed to save quiz");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(26, 7, 20, 0.06)' }}>
      <PageHero 
        title="Exam & MCQ Management"
        subtitle="Create quizzes and view student leaderboards by course and batch"
        icon={FileQuestion}
        darkColor="#1a0714"
        badge="Exams"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="circles" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="3" fill="#db2777" fillOpacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circles)" />
          </svg>
        }
      />
      <div className="max-w-5xl mx-auto pb-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "create" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
            >
              Create Quiz
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "leaderboard" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
            >
              Leaderboard
            </button>
          </div>
        </div>

        {/* Course & Batch Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            <label className="font-medium text-gray-700 min-w-[100px]">Course:</label>
            <select 
              value={selectedCourseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
            >
              {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
            </select>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <Users className="h-5 w-5 text-indigo-500" />
            <label className="font-medium text-gray-700 min-w-[100px]">Batch:</label>
            <select 
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              disabled={!selectedCourseId}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 disabled:opacity-50"
            >
              <option value="">Select Batch</option>
              {batches.map(batch => <option key={batch.id} value={batch.id}>{batch.name} ({batch.batch_time})</option>)}
            </select>
          </div>
        </div>

        {activeTab === "create" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
              <input 
                type="text" 
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="e.g., Daily Vocabulary Test - Day 1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-6" 
              />

              <div className="space-y-8">
                {questions.map((q, qIndex) => (
                  <div key={q.id} className="p-5 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-900">Question {qIndex + 1}</h4>
                    </div>
                    
                    <input 
                      type="text" 
                      placeholder="Enter question text..."
                      value={q.text}
                      onChange={(e) => {
                        const newQ = [...questions];
                        newQ[qIndex].text = e.target.value;
                        setQuestions(newQ);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-4" 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200">
                          <input 
                            type="radio" 
                            name={`correct-${q.id}`} 
                            checked={q.correctOption === oIndex}
                            onChange={() => {
                              const newQ = [...questions];
                              newQ[qIndex].correctOption = oIndex;
                              setQuestions(newQ);
                            }}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <input 
                            type="text" 
                            placeholder={`Option ${oIndex + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const newQ = [...questions];
                              newQ[qIndex].options[oIndex] = e.target.value;
                              setQuestions(newQ);
                            }}
                            className="flex-1 outline-none text-sm"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <HelpCircle className="h-4 w-4 text-indigo-500" /> Explanation (Why is this correct?)
                      </label>
                      <textarea 
                        placeholder="Explain the correct answer so students can learn from their mistakes..."
                        value={q.explanation}
                        onChange={(e) => {
                          const newQ = [...questions];
                          newQ[qIndex].explanation = e.target.value;
                          setQuestions(newQ);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none" 
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button 
                  onClick={handleAddQuestion}
                  className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg"
                >
                  <Plus className="h-4 w-4" /> Add Another Question
                </button>
                <button 
                  onClick={handleSaveQuiz}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Save className="h-4 w-4" /> Publish Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" /> 
                Leaderboard: {courses.find(c => c.id === selectedCourseId)?.name || "All Courses"}
              </h3>
              <select className="px-3 py-1.5 border border-gray-300 rounded-md text-sm outline-none">
                <option value="">Select a quiz</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-200">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Rank</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Student Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Score</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Correct</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Wrong</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaderboardData.map((student) => (
                    <tr key={student.rank} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold ${
                          student.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                          student.rank === 2 ? 'bg-gray-200 text-gray-700' :
                          student.rank === 3 ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {student.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 font-bold text-indigo-600">{student.score}%</td>
                      <td className="px-6 py-4 text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> {student.correct}
                      </td>
                      <td className="px-6 py-4 text-rose-600 flex items-center gap-1">
                        <XCircle className="h-4 w-4" /> {student.wrong}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
