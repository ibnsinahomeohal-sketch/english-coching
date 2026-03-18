import { useState } from "react";
import { BookOpen, CheckCircle, XCircle, ArrowRight, Volume2 } from "lucide-react";

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

  const currentQuiz = quizData[selectedCategory];
  const currentQuestion = currentQuiz[currentQuestionIndex];

  const speakQuestion = () => {
    const utterance = new SpeechSynthesisUtterance(currentQuestion.question.replace("____", "blank"));
    window.speechSynthesis.speak(utterance);
  };

  const handleCheck = () => {
    if (selectedOption === currentQuestion.answer) {
      setIsCorrect(true);
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
      setCurrentQuestionIndex(0);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Learning Module</h1>
      
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {Object.keys(quizData).map((category) => (
          <button
            key={category}
            onClick={() => { setSelectedCategory(category as keyof typeof quizData); setCurrentQuestionIndex(0); setSelectedOption(null); setIsCorrect(null); }}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${selectedCategory === category ? "bg-indigo-600 text-white" : "bg-white text-gray-700 border border-gray-200"}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Question {currentQuestionIndex + 1}</h2>
          <button onClick={speakQuestion} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full">
            <Volume2 className="h-6 w-6" />
          </button>
        </div>
        <p className="text-gray-700 mb-6 text-xl">{currentQuestion.question}</p>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedOption(option)}
              className={`w-full text-left p-3 rounded-lg border ${selectedOption === option ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"}`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          {isCorrect === null ? (
            <button onClick={handleCheck} disabled={!selectedOption} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50">Check</button>
          ) : (
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 font-medium ${isCorrect ? "text-emerald-600" : "text-rose-600"}`}>
                {isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                {isCorrect ? "Correct!" : `Incorrect. Correct answer: ${currentQuestion.answer}`}
              </div>
              <button onClick={nextQuestion} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
