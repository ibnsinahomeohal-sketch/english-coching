import { useState, useEffect } from "react";
import { Plus, Save, Trophy, CheckCircle, XCircle, HelpCircle, FileQuestion, BookOpen, Users, Clock, Trash2, Loader2, TrendingUp } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function Exams() {
  const [activeTab, setActiveTab] = useState<"create" | "leaderboard">("create");
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Quiz Creation State
  const [quizTitle, setQuizTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [totalMarks, setTotalMarks] = useState(1);
  const [passingScore, setPassingScore] = useState(40);
  const [questions, setQuestions] = useState([
    { id: 1, text: "", options: ["", "", "", ""], correctOption: 0, explanation: "" }
  ]);

  useEffect(() => {
    setTotalMarks(questions.length);
  }, [questions.length]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const { data: coursesData, error } = await supabase.from('courses').select('*');
        if (error) throw error;
        
        if (coursesData) {
          setCourses(coursesData);
          if (coursesData.length > 0) {
            setSelectedCourseId(coursesData[0].id);
            fetchBatches(coursesData[0].id);
          }
        }
      } catch (error: any) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchBatches = async (courseId: string) => {
    try {
      const { data: batchesData, error } = await supabase
        .from('batches')
        .select('*')
        .eq('course_id', courseId);
      
      if (error) throw error;

      if (batchesData) {
        setBatches(batchesData);
        if (batchesData.length > 0) {
          const firstBatchId = batchesData[0].id;
          setSelectedBatchId(firstBatchId);
          fetchExams(courseId, firstBatchId);
        } else {
          setSelectedBatchId("");
          setExams([]);
          setSelectedExamId("");
        }
      }
    } catch (error: any) {
      console.error("Error fetching batches:", error);
      toast.error("Failed to load batches");
    }
  };

  const fetchExams = async (courseId: string, batchId: string) => {
    if (!courseId || !batchId) return;
    const { data: examsData } = await supabase
      .from('exams')
      .select('*')
      .eq('course_id', courseId)
      .eq('batch_id', batchId);
    if (examsData) {
      setExams(examsData);
      if (examsData.length > 0) {
        setSelectedExamId(examsData[0].id);
      } else {
        setSelectedExamId("");
      }
    }
  };

  const fetchLeaderboard = async (examId: string) => {
    if (!examId) {
      setLeaderboardData([]);
      return;
    }
    setIsLoading(true);
    try {
      // Assuming a table 'exam_results' exists that links students and exams
      const { data, error } = await supabase
        .from('exam_results')
        .select(`
          *,
          students (
            name
          )
        `)
        .eq('exam_id', examId)
        .order('score', { ascending: false });

      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        name: item.students?.name || "Unknown Student",
        score: item.score,
        correct: item.correct_answers,
        total: item.total_questions
      })) || [];
      
      setLeaderboardData(formattedData);
    } catch (error: any) {
      console.error("Error fetching leaderboard:", error);
      // Fallback to empty if table doesn't exist yet
      setLeaderboardData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "leaderboard") {
      fetchLeaderboard(selectedExamId);
    }
  }, [activeTab, selectedExamId]);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    fetchBatches(courseId);
  };

  const handleBatchChange = (batchId: string) => {
    setSelectedBatchId(batchId);
    fetchExams(selectedCourseId, batchId);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: questions.length + 1, text: "", options: ["", "", "", ""], correctOption: 0, explanation: "" }
    ]);
  };

  const handleRemoveQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle || !selectedCourseId || !selectedBatchId) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('exams')
        .insert([{
          title: quizTitle,
          course_id: selectedCourseId,
          batch_id: selectedBatchId,
          questions: questions,
          duration_minutes: duration,
          total_marks: totalMarks,
          passing_score: passingScore
        }]);

      if (error) throw error;

      toast.success(`Quiz "${quizTitle}" published successfully!`);
      setQuizTitle("");
      setQuestions([{ id: 1, text: "", options: ["", "", "", ""], correctOption: 0, explanation: "" }]);
      fetchExams(selectedCourseId, selectedBatchId);
    } catch (error: any) {
      toast.error(error.message || "Failed to save quiz");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-gray-900 tracking-tight">Exam Management</h1>
          <p className="text-gray-400 font-medium mt-1">Create assessments and track student performance</p>
        </div>
        
        <div className="flex bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${activeTab === "create" ? "bg-white text-primary shadow-soft" : "text-gray-400 hover:text-gray-600"}`}
          >
            Create Quiz
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${activeTab === "leaderboard" ? "bg-white text-primary shadow-soft" : "text-gray-400 hover:text-gray-600"}`}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {/* Course & Batch Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-premium p-6 flex items-center gap-6 group">
          <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Select Course</label>
            <select 
              value={selectedCourseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full bg-white/50 border border-gray-100 rounded-xl px-4 py-3 font-display font-bold text-gray-900 text-lg outline-none cursor-pointer hover:bg-white hover:border-primary/30 transition-all shadow-sm"
            >
              <option value="" disabled>Select Course</option>
              {courses.length > 0 ? (
                courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)
              ) : (
                <option value="" disabled>No Courses Available</option>
              )}
            </select>
          </div>
        </div>
        
        <div className="card-premium p-6 flex items-center gap-6 group">
          <div className="p-4 rounded-2xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform duration-300">
            <Users className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Select Batch</label>
            <select 
              value={selectedBatchId}
              onChange={(e) => handleBatchChange(e.target.value)}
              disabled={!selectedCourseId}
              className="w-full bg-white/50 border border-gray-100 rounded-xl px-4 py-3 font-display font-bold text-gray-900 text-lg outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:border-secondary/30 transition-all shadow-sm"
            >
              <option value="">Choose Batch</option>
              {batches.length > 0 ? (
                batches.map(batch => <option key={batch.id} value={batch.id}>{batch.name} ({batch.batch_time})</option>)
              ) : (
                <option value="" disabled>{selectedCourseId ? "No Batches Found" : "Select a Course First"}</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {activeTab === "create" ? (
        <div className="space-y-8">
          <div className="card-premium p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-accent/10 text-accent">
                <FileQuestion className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-gray-900">Quiz Details</h3>
                <p className="text-sm text-gray-400 font-medium">Define the basic information for this assessment</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Quiz Title</label>
                <input 
                  type="text" 
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="e.g., Daily Vocabulary Test - Day 1"
                  className="input-premium text-lg font-medium" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Duration (Minutes)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                      type="number" 
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="input-premium pl-12" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Total Marks</label>
                  <input 
                    type="number" 
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(parseInt(e.target.value))}
                    className="input-premium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Passing Score (%)</label>
                  <input 
                    type="number" 
                    value={passingScore}
                    onChange={(e) => setPassingScore(parseInt(e.target.value))}
                    className="input-premium" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-gray-900">Questions ({questions.length})</h3>
              <button 
                onClick={handleAddQuestion}
                className="flex items-center gap-2 text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-xl transition-all"
              >
                <Plus className="h-5 w-5" /> Add Question
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={q.id} className="card-premium p-8 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary font-bold text-sm">
                        {qIndex + 1}
                      </span>
                      <h4 className="text-lg font-display font-bold text-gray-900">Question {qIndex + 1}</h4>
                    </div>
                    <button 
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <input 
                      type="text" 
                      placeholder="Enter your question here..."
                      value={q.text}
                      onChange={(e) => {
                        const newQ = [...questions];
                        newQ[qIndex].text = e.target.value;
                        setQuestions(newQ);
                      }}
                      className="input-premium font-medium" 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((opt, oIndex) => (
                        <div 
                          key={oIndex} 
                          onClick={() => {
                            const newQ = [...questions];
                            newQ[qIndex].correctOption = oIndex;
                            setQuestions(newQ);
                          }}
                          className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                            q.correctOption === oIndex 
                            ? 'bg-secondary/5 border-secondary/30 ring-1 ring-secondary/30' 
                            : 'bg-gray-50/50 border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="radio" 
                              name={`correct-${q.id}`} 
                              checked={q.correctOption === oIndex}
                              onChange={() => {}} // Handled by parent div onClick
                              className="peer h-6 w-6 opacity-0 cursor-pointer z-10"
                            />
                            <div className={`absolute h-6 w-6 rounded-full border-2 transition-all ${
                              q.correctOption === oIndex 
                              ? 'border-secondary bg-secondary scale-110' 
                              : 'border-gray-300 bg-white'
                            }`}>
                              {q.correctOption === oIndex && <CheckCircle className="h-4 w-4 text-white m-auto mt-0.5" />}
                            </div>
                          </div>
                          <input 
                            type="text" 
                            placeholder={`Option ${oIndex + 1}`}
                            value={opt}
                            onClick={(e) => e.stopPropagation()} // Prevent radio selection when typing
                            onChange={(e) => {
                              const newQ = [...questions];
                              newQ[qIndex].options[oIndex] = e.target.value;
                              setQuestions(newQ);
                            }}
                            className="flex-1 bg-transparent outline-none font-medium text-gray-700 placeholder:text-gray-300"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" /> Explanation (Optional)
                      </label>
                      <textarea 
                        placeholder="Explain the correct answer to help students learn..."
                        value={q.explanation}
                        onChange={(e) => {
                          const newQ = [...questions];
                          newQ[qIndex].explanation = e.target.value;
                          setQuestions(newQ);
                        }}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none h-24 resize-none font-medium text-gray-600 transition-all" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6">
              <button 
                onClick={handleSaveQuiz}
                disabled={isLoading}
                className="btn-primary flex items-center gap-3 px-10 py-4 text-lg"
              >
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                Publish Assessment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-premium overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/10 text-accent">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-gray-900">Performance Leaderboard</h3>
                <p className="text-sm text-gray-400 font-medium">Top performing students in this batch</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select Quiz</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.title}</option>
                ))}
              </select>
              <button 
                onClick={() => fetchLeaderboard(selectedExamId)}
                className="p-2.5 bg-primary/5 text-primary rounded-xl hover:bg-primary/10 transition-colors"
              >
                <TrendingUp className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Rank</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Score</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Correct</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Accuracy</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaderboardData.length > 0 ? leaderboardData.map((student, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className={`flex items-center justify-center h-10 w-10 rounded-xl font-display font-bold text-lg ${
                        idx === 0 ? 'bg-accent/10 text-accent ring-2 ring-accent/20' :
                        idx === 1 ? 'bg-gray-100 text-gray-600' :
                        idx === 2 ? 'bg-orange-50 text-orange-700' :
                        'text-gray-400'
                      }`}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center font-bold text-primary">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-lg font-display font-bold text-primary">{student.score}%</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-secondary font-bold">
                        <CheckCircle className="h-4 w-4" />
                        {student.correct}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="w-24 mx-auto h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-secondary rounded-full" 
                          style={{ width: `${student.score}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">
                        Excellent
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-6 rounded-full bg-gray-50 text-gray-200">
                          <Trophy className="h-12 w-12" />
                        </div>
                        <div>
                          <p className="text-lg font-display font-bold text-gray-900">No data available yet</p>
                          <p className="text-sm text-gray-400 font-medium">Results will appear here once students complete the quiz</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
