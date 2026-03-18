import { useState } from "react";
import { PlayCircle, CheckCircle, XCircle, Trophy, HelpCircle, ArrowRight } from "lucide-react";

// Mock Data for a Quiz
const MOCK_QUIZ: any = null;

export default function StudentExams() {
  const [activeTab, setActiveTab] = useState<"list" | "taking" | "result">("list");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);

  const handleStartQuiz = () => {
    if (!MOCK_QUIZ) return;
    setAnswers({});
    setActiveTab("taking");
  };

  const handleSubmitQuiz = () => {
    if (!MOCK_QUIZ) return;
    let calculatedScore = 0;
    MOCK_QUIZ.questions.forEach((q: any) => {
      if (answers[q.id] === q.correctOption) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setActiveTab("result");
  };

  return (
    <div className="max-w-4xl mx-auto pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Exams</h2>
          <p className="text-sm text-gray-500 mt-1">Take quizzes and review your performance</p>
        </div>
      </div>

      {activeTab === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_QUIZ ? (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-300 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-2">
                    {MOCK_QUIZ.course}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">{MOCK_QUIZ.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{MOCK_QUIZ.questions.length} Questions • 10 Minutes</p>
                </div>
                <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <button 
                onClick={handleStartQuiz}
                className="w-full mt-4 bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                Start Exam <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-gray-200 border-dashed">
              <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No active exams</h3>
              <p className="text-gray-500">Check back later for new quizzes.</p>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-60">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full mb-2">
                  Completed
                </span>
                <h3 className="text-lg font-bold text-gray-900">No recent results</h3>
                <p className="text-sm text-gray-500 mt-1">Your exam history will appear here</p>
              </div>
              <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <button 
              className="w-full mt-4 bg-gray-100 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled
            >
              View Results
            </button>
          </div>
        </div>
      )}

      {activeTab === "taking" && MOCK_QUIZ && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center sticky top-4 z-20">
            <h3 className="text-lg font-bold text-gray-900">{MOCK_QUIZ.title}</h3>
            <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Answered: {Object.keys(answers).length} / {MOCK_QUIZ.questions.length}
            </div>
          </div>

          {MOCK_QUIZ.questions.map((q: any, index: number) => (
            <div key={q.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                <span className="text-indigo-600 mr-2">Q{index + 1}.</span>
                {q.text}
              </h4>
              <div className="space-y-3">
                {q.options.map((opt: string, optIndex: number) => (
                  <label 
                    key={optIndex} 
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      answers[q.id] === optIndex ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name={`question-${q.id}`} 
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 mr-3"
                      checked={answers[q.id] === optIndex}
                      onChange={() => setAnswers({...answers, [q.id]: optIndex})}
                    />
                    <span className="text-gray-800 font-medium">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button 
              onClick={handleSubmitQuiz}
              disabled={Object.keys(answers).length < MOCK_QUIZ.questions.length}
              className="bg-indigo-600 text-white font-medium px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
            >
              <CheckCircle className="h-5 w-5" /> Submit Exam
            </button>
          </div>
        </div>
      )}

      {activeTab === "result" && MOCK_QUIZ && (
        <div className="space-y-6 animate-in fade-in zoom-in-95">
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="inline-flex items-center justify-center h-20 w-20 bg-emerald-100 rounded-full mb-4">
              <Trophy className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Exam Completed!</h2>
            <p className="text-gray-500 mb-6">You have successfully completed {MOCK_QUIZ.title}</p>
            
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Your Score</p>
                <p className="text-4xl font-black text-indigo-600">{Math.round((score / MOCK_QUIZ.questions.length) * 100)}%</p>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div className="text-center">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Correct</p>
                <p className="text-4xl font-black text-emerald-600">{score}/{MOCK_QUIZ.questions.length}</p>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab("list")}
              className="bg-gray-100 text-gray-700 font-medium px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Exam List
            </button>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Review Your Answers</h3>

          {MOCK_QUIZ.questions.map((q: any, index: number) => {
            const isCorrect = answers[q.id] === q.correctOption;
            
            return (
              <div key={q.id} className={`p-6 rounded-xl border-2 shadow-sm ${isCorrect ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/30'}`}>
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    <span className="mr-2">Q{index + 1}.</span>
                    {q.text}
                  </h4>
                  {isCorrect ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-100 px-3 py-1 rounded-full text-sm">
                      <CheckCircle className="h-4 w-4" /> Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600 font-bold bg-rose-100 px-3 py-1 rounded-full text-sm">
                      <XCircle className="h-4 w-4" /> Wrong
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  {q.options.map((opt: string, optIndex: number) => {
                    const isSelected = answers[q.id] === optIndex;
                    const isActuallyCorrect = q.correctOption === optIndex;
                    
                    let bgClass = "bg-white border-gray-200";
                    let textClass = "text-gray-700";
                    
                    if (isActuallyCorrect) {
                      bgClass = "bg-emerald-100 border-emerald-500";
                      textClass = "text-emerald-800 font-bold";
                    } else if (isSelected && !isActuallyCorrect) {
                      bgClass = "bg-rose-100 border-rose-500";
                      textClass = "text-rose-800 font-bold";
                    }

                    return (
                      <div key={optIndex} className={`p-3 border rounded-lg flex items-center justify-between ${bgClass}`}>
                        <span className={textClass}>{opt}</span>
                        {isActuallyCorrect && <CheckCircle className="h-5 w-5 text-emerald-600" />}
                        {isSelected && !isActuallyCorrect && <XCircle className="h-5 w-5 text-rose-600" />}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-blue-900 mb-1">Explanation</h5>
                    <p className="text-blue-800 text-sm leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
