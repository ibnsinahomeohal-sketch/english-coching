import { useState } from "react";
import { BookOpen, CheckCircle, XCircle, ArrowRight, Volume2, Trophy, Star, Sparkles, ChevronRight, RefreshCw } from "lucide-react";
import { PageHero } from "../components/PageHero";

const quizData = {
  "Daily Life": [
    { question: "What time do you usually ____ up in the morning?", options: ["wake", "get", "stand"], answer: "wake" },
    { question: "I need to make a phone ____ to my mother.", options: ["call", "talk", "chat"], answer: "call" }
  ],
  "Bazaar & Shopping": [
    { question: "How much is this ____ of potatoes?", options: ["kilo", "piece", "bag"], answer: "kilo" },
    { question: "Can you give me a ____?", options: ["discount", "price", "money"], answer: "discount" }
  ],
  "Transport": [
    { question: "How much to ____ to New Market?", options: ["go", "ride", "take"], answer: "go" },
    { question: "Please ____ the rickshaw here.", options: ["stop", "wait", "park"], answer: "stop" }
  ],
  "Restaurant": [
    { question: "I would like to order a plate of ____ biryani.", options: ["kacchi", "rice", "food"], answer: "kacchi" },
    { question: "Can I have the ____, please?", options: ["bill", "money", "check"], answer: "bill" }
  ],
  "Education": [
    { question: "I have a ____ today at 10 AM.", options: ["class", "study", "book"], answer: "class" },
    { question: "Please ____ your presentation.", options: ["start", "begin", "do"], answer: "start" }
  ],
  "Job & Interview": [
    { question: "I am here for the ____.", options: ["interview", "job", "work"], answer: "interview" },
    { question: "Can you tell me about your ____?", options: ["experience", "work", "life"], answer: "experience" }
  ],
  "Hospital": [
    { question: "I have a ____ in my stomach.", options: ["pain", "hurt", "ache"], answer: "pain" },
    { question: "I need to see a ____.", options: ["doctor", "nurse", "medicine"], answer: "doctor" }
  ],
  "Social": [
    { question: "Are you coming to the ____?", options: ["wedding", "party", "event"], answer: "wedding" },
    { question: "____ Mubarak!", options: ["Eid", "Ramadan", "Day"], answer: "Eid" }
  ],
  "Online": [
    { question: "I will ____ you the file.", options: ["email", "send", "post"], answer: "email" },
    { question: "Are you ____ for a new project?", options: ["available", "free", "ready"], answer: "available" }
  ]
};

export default function LearningModule() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof quizData>("Daily Life");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuiz = quizData[selectedCategory];
  const currentQuestion = currentQuiz[currentQuestionIndex];

  const speakQuestion = () => {
    const utterance = new SpeechSynthesisUtterance(currentQuestion.question.replace("____", "blank"));
    window.speechSynthesis.speak(utterance);
  };

  const handleCheck = () => {
    if (selectedOption === currentQuestion.answer) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
    } else {
      setIsCorrect(false);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    if (currentQuestionIndex < currentQuiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setShowResults(false);
  };

  const handleCategoryChange = (category: keyof typeof quizData) => {
    setSelectedCategory(category);
    resetQuiz();
  };

  const progressPercentage = ((currentQuestionIndex) / currentQuiz.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <PageHero 
        title="Learning Module"
        subtitle="Interactive vocabulary and grammar practice"
        icon={BookOpen}
        darkColor="#059669"
        badge="Practice"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="leaves" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 10 0 C 15 5 15 15 10 20 C 5 15 5 5 10 0" fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-500/20" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#leaves)" />
          </svg>
        }
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 mb-6 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 min-w-max">
            {Object.keys(quizData).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category as keyof typeof quizData)}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                  selectedCategory === category 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                    : "bg-transparent text-slate-600 hover:bg-slate-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Main Quiz Area */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {showResults ? (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 relative">
                <Trophy className="h-12 w-12 text-emerald-600" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center border-4 border-white">
                  <Star className="h-4 w-4 text-white fill-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Module Completed!</h2>
              <p className="text-slate-500 mb-8">You've finished the {selectedCategory} practice.</p>
              
              <div className="bg-slate-50 rounded-2xl p-6 w-full max-w-sm mb-8 border border-slate-100">
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Your Score</div>
                <div className="text-5xl font-black text-emerald-600">
                  {score}<span className="text-2xl text-slate-300">/{currentQuiz.length}</span>
                </div>
              </div>
              
              <button 
                onClick={resetQuiz}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-0.5"
              >
                <RefreshCw className="h-5 w-5" /> Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="h-2 bg-slate-100 w-full">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              <div className="p-8 sm:p-12">
                <div className="flex justify-between items-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold">
                    <Sparkles className="h-4 w-4" />
                    Question {currentQuestionIndex + 1} of {currentQuiz.length}
                  </div>
                  <button 
                    onClick={speakQuestion} 
                    className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors border border-emerald-100"
                    title="Listen to question"
                  >
                    <Volume2 className="h-6 w-6" />
                  </button>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-10 leading-tight">
                  {currentQuestion.question.split('____').map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="inline-block w-24 border-b-2 border-slate-300 mx-2 translate-y-1"></span>
                      )}
                    </span>
                  ))}
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-1">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOption === option;
                    const isCorrectAnswer = option === currentQuestion.answer;
                    
                    let buttonClass = "w-full text-left p-5 rounded-2xl border-2 transition-all text-lg font-medium flex items-center justify-between group ";
                    
                    if (isCorrect === null) {
                      buttonClass += isSelected 
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm" 
                        : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-700";
                    } else {
                      if (isCorrectAnswer) {
                        buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-900";
                      } else if (isSelected && !isCorrectAnswer) {
                        buttonClass += "border-rose-500 bg-rose-50 text-rose-900";
                      } else {
                        buttonClass += "border-slate-200 opacity-50 text-slate-500";
                      }
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => isCorrect === null && setSelectedOption(option)}
                        disabled={isCorrect !== null}
                        className={buttonClass}
                      >
                        <span>{option}</span>
                        
                        {/* Status Icon */}
                        {isCorrect !== null && isCorrectAnswer && (
                          <CheckCircle className="h-6 w-6 text-emerald-500" />
                        )}
                        {isCorrect !== null && isSelected && !isCorrectAnswer && (
                          <XCircle className="h-6 w-6 text-rose-500" />
                        )}
                        {isCorrect === null && (
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-emerald-500' : 'border-slate-300 group-hover:border-emerald-300'}`}>
                            {isSelected && <div className="w-3 h-3 bg-emerald-500 rounded-full" />}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="mt-10 flex justify-end border-t border-slate-100 pt-8">
                  {isCorrect === null ? (
                    <button 
                      onClick={handleCheck} 
                      disabled={!selectedOption} 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 w-full sm:w-auto"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-6">
                      <div className={`flex items-center gap-3 font-bold text-lg ${isCorrect ? "text-emerald-600" : "text-rose-600"}`}>
                        <div className={`p-2 rounded-full ${isCorrect ? "bg-emerald-100" : "bg-rose-100"}`}>
                          {isCorrect ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                        </div>
                        {isCorrect ? "Excellent!" : "Not quite right."}
                      </div>
                      <button 
                        onClick={nextQuestion} 
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 w-full sm:w-auto"
                      >
                        Continue <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
