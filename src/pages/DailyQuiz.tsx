import React, { useState, useEffect } from 'react';
import { BrainCircuit, CheckCircle2, XCircle, Trophy, ArrowRight, Timer, AlertCircle, Star, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabaseClient';

// 50 Daily Questions covering different subjects (Mock database)
const ALL_QUESTIONS = [
  // Vocabulary (1-10)
  { id: 1, subject: "Vocabulary", q: "What is the synonym of 'Abundant'?", options: ["Plentiful", "Scarce", "Rare", "Short"], ans: 0 },
  { id: 2, subject: "Vocabulary", q: "What is the antonym of 'Benevolent'?", options: ["Kind", "Cruel", "Friendly", "Generous"], ans: 1 },
  { id: 3, subject: "Vocabulary", q: "What is the synonym of 'Candid'?", options: ["Deceitful", "Dishonest", "Honest", "Secretive"], ans: 2 },
  { id: 4, subject: "Vocabulary", q: "What is the antonym of 'Diligent'?", options: ["Hardworking", "Active", "Careful", "Lazy"], ans: 3 },
  { id: 5, subject: "Vocabulary", q: "What is the synonym of 'Eloquent'?", options: ["Fluent", "Hesitant", "Silent", "Mute"], ans: 0 },
  { id: 6, subject: "Vocabulary", q: "What is the antonym of 'Frugal'?", options: ["Economical", "Extravagant", "Thrifty", "Careful"], ans: 1 },
  { id: 7, subject: "Vocabulary", q: "What is the synonym of 'Garrulous'?", options: ["Quiet", "Reserved", "Talkative", "Silent"], ans: 2 },
  { id: 8, subject: "Vocabulary", q: "What is the antonym of 'Haughty'?", options: ["Proud", "Arrogant", "Conceited", "Humble"], ans: 3 },
  { id: 9, subject: "Vocabulary", q: "What is the synonym of 'Inevitable'?", options: ["Unavoidable", "Uncertain", "Doubtful", "Avoidable"], ans: 0 },
  { id: 10, subject: "Vocabulary", q: "What is the antonym of 'Jubilant'?", options: ["Happy", "Sorrowful", "Joyful", "Excited"], ans: 1 },
  
  // Grammar (11-20)
  { id: 11, subject: "Grammar", q: "She ___ to the market yesterday.", options: ["goes", "going", "went", "gone"], ans: 2 },
  { id: 12, subject: "Grammar", q: "I have been living here ___ 2010.", options: ["for", "since", "from", "in"], ans: 1 },
  { id: 13, subject: "Grammar", q: "If it rains, we ___ at home.", options: ["will stay", "stayed", "would stay", "staying"], ans: 0 },
  { id: 14, subject: "Grammar", q: "Neither of the boys ___ passed.", options: ["have", "has", "are", "were"], ans: 1 },
  { id: 15, subject: "Grammar", q: "The news ___ good.", options: ["are", "is", "were", "have been"], ans: 1 },
  { id: 16, subject: "Grammar", q: "He is the ___ boy in the class.", options: ["taller", "tall", "tallest", "most tall"], ans: 2 },
  { id: 17, subject: "Grammar", q: "I prefer tea ___ coffee.", options: ["than", "from", "to", "over"], ans: 2 },
  { id: 18, subject: "Grammar", q: "She is good ___ English.", options: ["in", "at", "with", "about"], ans: 1 },
  { id: 19, subject: "Grammar", q: "He ___ his homework just now.", options: ["finished", "finishes", "will finish", "has finished"], ans: 3 },
  { id: 20, subject: "Grammar", q: "By next year, I ___ my degree.", options: ["will complete", "complete", "completed", "will have completed"], ans: 3 },

  // Prepositions (21-30)
  { id: 21, subject: "Prepositions", q: "He is afraid ___ dogs.", options: ["from", "of", "with", "by"], ans: 1 },
  { id: 22, subject: "Prepositions", q: "She is fond ___ music.", options: ["in", "of", "with", "for"], ans: 1 },
  { id: 23, subject: "Prepositions", q: "He died ___ cholera.", options: ["from", "of", "by", "with"], ans: 1 },
  { id: 24, subject: "Prepositions", q: "I agree ___ you.", options: ["to", "with", "on", "for"], ans: 1 },
  { id: 25, subject: "Prepositions", q: "Listen ___ me.", options: ["at", "to", "for", "with"], ans: 1 },
  { id: 26, subject: "Prepositions", q: "Look ___ the word in the dictionary.", options: ["at", "for", "up", "into"], ans: 2 },
  { id: 27, subject: "Prepositions", q: "He is addicted ___ smoking.", options: ["with", "to", "in", "for"], ans: 1 },
  { id: 28, subject: "Prepositions", q: "She is proud ___ her beauty.", options: ["for", "of", "with", "in"], ans: 1 },
  { id: 29, subject: "Prepositions", q: "He is blind ___ one eye.", options: ["of", "in", "with", "to"], ans: 1 },
  { id: 30, subject: "Prepositions", q: "I congratulate you ___ your success.", options: ["for", "on", "with", "at"], ans: 1 },

  // Idioms (31-40)
  { id: 31, subject: "Idioms", q: "'A piece of cake' means:", options: ["Very difficult", "Very easy", "A sweet dessert", "A small part"], ans: 1 },
  { id: 32, subject: "Idioms", q: "'Break the ice' means:", options: ["Destroy something", "Start a conversation", "Cool down", "Feel cold"], ans: 1 },
  { id: 33, subject: "Idioms", q: "'Bite the bullet' means:", options: ["Eat fast", "Face a difficult situation", "Shoot a gun", "Get angry"], ans: 1 },
  { id: 34, subject: "Idioms", q: "'Under the weather' means:", options: ["Raining", "Feeling ill", "Sunny", "Outside"], ans: 1 },
  { id: 35, subject: "Idioms", q: "'Spill the beans' means:", options: ["Drop food", "Cook well", "Reveal a secret", "Clean up"], ans: 2 },
  { id: 36, subject: "Idioms", q: "'Hit the sack' means:", options: ["Punch a bag", "Go to sleep", "Work hard", "Get fired"], ans: 1 },
  { id: 37, subject: "Idioms", q: "'Cost an arm and a leg' means:", options: ["Very cheap", "Free", "Very expensive", "Painful"], ans: 2 },
  { id: 38, subject: "Idioms", q: "'Once in a blue moon' means:", options: ["Every night", "Very rarely", "Often", "Never"], ans: 1 },
  { id: 39, subject: "Idioms", q: "'See eye to eye' means:", options: ["Stare", "Fight", "Agree completely", "Look closely"], ans: 2 },
  { id: 40, subject: "Idioms", q: "'Let the cat out of the bag' means:", options: ["Free a pet", "Reveal a secret", "Make a mistake", "Buy a cat"], ans: 1 },

  // Spelling & Usage (41-50)
  { id: 41, subject: "Spelling", q: "Choose the correct spelling:", options: ["Accomodation", "Accommodation", "Acommodation", "Acomodation"], ans: 1 },
  { id: 42, subject: "Spelling", q: "Choose the correct spelling:", options: ["Embarass", "Embarrass", "Embaras", "Emmbarrass"], ans: 1 },
  { id: 43, subject: "Spelling", q: "Choose the correct spelling:", options: ["Fascinate", "Fasinate", "Faccinate", "Fassinate"], ans: 0 },
  { id: 44, subject: "Spelling", q: "Choose the correct spelling:", options: ["Recieve", "Receive", "Receve", "Recive"], ans: 1 },
  { id: 45, subject: "Spelling", q: "Choose the correct spelling:", options: ["Seperate", "Separate", "Seprate", "Seperat"], ans: 1 },
  { id: 46, subject: "Usage", q: "Which sentence is correct?", options: ["He gave me some advices.", "He gave me some advice.", "He gave me an advice.", "He gave me many advices."], ans: 1 },
  { id: 47, subject: "Usage", q: "Which sentence is correct?", options: ["I look forward to see you.", "I look forward to seeing you.", "I look forward seeing you.", "I look forward see you."], ans: 1 },
  { id: 48, subject: "Usage", q: "Which sentence is correct?", options: ["She is married with a doctor.", "She is married to a doctor.", "She is married by a doctor.", "She is married a doctor."], ans: 1 },
  { id: 49, subject: "Usage", q: "Which sentence is correct?", options: ["One of my friend is a pilot.", "One of my friends are a pilot.", "One of my friends is a pilot.", "One of my friend are a pilot."], ans: 2 },
  { id: 50, subject: "Usage", q: "Which sentence is correct?", options: ["I have a lot of works to do.", "I have many work to do.", "I have much works to do.", "I have a lot of work to do."], ans: 3 },
];

const PASSING_SCORE = 17;

export default function DailyQuiz() {
  const [student, setStudent] = useState<any>(null);
  const [courseName, setCourseName] = useState<string>("General English");
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [questions, setQuestions] = useState<any[]>(ALL_QUESTIONS);
  
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const initQuiz = async () => {
      const sessionStr = localStorage.getItem('studentSession');
      if (!sessionStr) return;
      
      const session = JSON.parse(sessionStr);
      const studentId = session.studentId;

      // Check if already played today
      const today = new Date().toDateString();
      const lastPlayed = localStorage.getItem(`dailyQuiz_${studentId}`);
      
      if (lastPlayed === today) {
        setAlreadyPlayed(true);
      }

      // Fetch student and course details
      const { data: studentData } = await supabase
        .from("students")
        .select('*')
        .eq("student_id", studentId)
        .single();

      if (studentData) {
        setStudent(studentData);
        if (studentData.course) {
          setCourseName(studentData.course);
          
          // Seeded shuffle to give different questions every day based on course and date
          const seed = today + studentData.course;
          let seedNum = 0;
          for (let i = 0; i < seed.length; i++) {
            seedNum += seed.charCodeAt(i);
          }
          
          const shuffled = [...ALL_QUESTIONS].sort(() => {
            const x = Math.sin(seedNum++) * 10000;
            return x - Math.floor(x) - 0.5;
          });
          
          setQuestions(shuffled); 
        }
      }
    };

    initQuiz();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (started && !finished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !finished) {
      handleFinish();
    }
    return () => clearInterval(timer);
  }, [started, finished, timeLeft]);

  const handleStart = () => {
    setStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
    setTimeLeft(1800);
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === questions[currentIndex].ans) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setFinished(true);
    setIsUpdating(true);
    
    // Mark as played today
    const today = new Date().toDateString();
    if (student) {
      localStorage.setItem(`dailyQuiz_${student.student_id}`, today);
    }

    if (score >= PASSING_SCORE) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#8b5cf6', '#3b82f6']
      });

      // Update points in Supabase
      if (student) {
        const pointsEarned = score * 10;
        await supabase
          .from('students')
          .update({ points: (student.points || 0) + pointsEarned })
          .eq('student_id', student.student_id);
      }
    }
    setIsUpdating(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = questions[currentIndex];
  const isPassed = score >= PASSING_SCORE;
  const pointsEarned = isPassed ? score * 10 : 0;

  if (alreadyPlayed) {
    return (
      <div className="min-h-screen bg-slate-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden text-center p-8 sm:p-16">
            <div className="h-24 w-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">আজকের কুইজ সম্পন্ন হয়েছে!</h2>
            <p className="text-lg text-slate-500 mb-8">
              আপনি ইতিমধ্যে আজকের কুইজটি দিয়ে ফেলেছেন। নতুন কুইজের জন্য আগামীকাল আবার চেষ্টা করুন।
            </p>
            <button 
              onClick={() => window.location.href = '/student'}
              className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              ড্যাশবোর্ডে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden text-center p-8 sm:p-16 relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-pink-500 to-rose-500 opacity-10"></div>
            
            <div className="relative z-10">
              <div className="h-24 w-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-pink-500/30 rotate-3">
                <BrainCircuit className="h-12 w-12 text-white -rotate-3" />
              </div>
              
              <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-pink-100">
                <Star className="h-4 w-4" /> {courseName}
              </div>

              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">ডেইলি ৫০ কুইজ চ্যালেঞ্জ</h1>
              <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
                প্রতিদিন আপনার <strong>{courseName}</strong> কোর্সের উপর ভিত্তি করে ৫০টি নতুন প্রশ্নের উত্তর দিন। 
                পাস করে আপনার প্রোফাইলের জন্য পয়েন্ট অর্জন করুন! (দিনে মাত্র একবার অংশগ্রহণ করা যাবে)
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center">
                  <div className="text-2xl font-black text-slate-900 mb-1">৫০</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট প্রশ্ন</div>
                </div>
                <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100 flex flex-col items-center">
                  <div className="text-2xl font-black text-pink-600 mb-1">{PASSING_SCORE}</div>
                  <div className="text-xs font-bold text-pink-400 uppercase tracking-wider">পাস মার্ক</div>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex flex-col items-center">
                  <div className="text-2xl font-black text-amber-600 mb-1">৩০ মি.</div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">সময়</div>
                </div>
              </div>

              <button 
                onClick={handleStart}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:-translate-y-1 flex items-center gap-3 mx-auto"
              >
                আজকের কুইজ শুরু করুন <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-slate-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden text-center p-8 sm:p-12">
            <div className={`h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isPassed ? 'bg-emerald-100 text-emerald-500' : 'bg-rose-100 text-rose-500'}`}>
              {isPassed ? <Trophy className="h-12 w-12" /> : <XCircle className="h-12 w-12" />}
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {isPassed ? 'অভিনন্দন!' : 'আরও অনুশীলন করুন!'}
            </h2>
            <p className="text-slate-500 mb-8">
              {isPassed 
                ? 'আপনি আজকের চ্যালেঞ্জে পাস করেছেন এবং পয়েন্ট অর্জন করেছেন।' 
                : `পাস করার জন্য আপনাকে অন্তত ${PASSING_SCORE} টি সঠিক উত্তর দিতে হবে। আগামীকাল আবার চেষ্টা করুন!`}
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-4xl font-black text-slate-900 mb-1">{score}<span className="text-xl text-slate-400">/50</span></div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">আপনার স্কোর</div>
              </div>
              <div className={`rounded-2xl p-6 border ${isPassed ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`text-4xl font-black mb-1 flex items-center justify-center gap-1 ${isPassed ? 'text-amber-500' : 'text-slate-400'}`}>
                  {pointsEarned} <Star className="h-6 w-6 fill-current" />
                </div>
                <div className={`text-xs font-bold uppercase tracking-wider ${isPassed ? 'text-amber-600/60' : 'text-slate-400'}`}>অর্জিত পয়েন্ট</div>
              </div>
            </div>

            {isPassed && (
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-bold text-sm mb-8 border border-emerald-100">
                <CheckCircle2 className="h-5 w-5" /> পয়েন্ট আপনার প্রোফাইলে যোগ করা হয়েছে!
              </div>
            )}

            <button 
              onClick={() => window.location.href = '/student'}
              disabled={isUpdating}
              className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'আপডেট হচ্ছে...' : 'ড্যাশবোর্ডে ফিরে যান'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="h-12 w-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center shrink-0">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">ডেইলি চ্যালেঞ্জ - {courseName}</h2>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">{currentQ.subject}</span>
                <span>প্রশ্ন {currentIndex + 1} / 50</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2 text-slate-600 font-bold bg-slate-100 px-4 py-2 rounded-xl">
              <Timer className="h-5 w-5 text-slate-400" />
              <span className={timeLeft < 300 ? 'text-rose-500' : ''}>{formatTime(timeLeft)}</span>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">বর্তমান স্কোর</div>
              <div className="text-xl font-black text-slate-900">{score}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-8 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentIndex) / 50) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 sm:p-10 mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 leading-tight">
            {currentQ.q}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.options.map((option, idx) => {
              let stateClass = "bg-white border-slate-200 hover:border-pink-300 hover:bg-pink-50 text-slate-700";
              
              if (isAnswered) {
                if (idx === currentQ.ans) {
                  stateClass = "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm shadow-emerald-100";
                } else if (idx === selectedOption) {
                  stateClass = "bg-rose-50 border-rose-500 text-rose-700 shadow-sm shadow-rose-100";
                } else {
                  stateClass = "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                }
              } else if (selectedOption === idx) {
                stateClass = "bg-pink-50 border-pink-500 text-pink-700 shadow-sm shadow-pink-100";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isAnswered}
                  className={cn(
                    "relative p-5 rounded-2xl border-2 text-left font-bold text-lg transition-all duration-200 flex items-center justify-between group",
                    stateClass
                  )}
                >
                  <span>{option}</span>
                  {isAnswered && idx === currentQ.ans && <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />}
                  {isAnswered && idx === selectedOption && idx !== currentQ.ans && <XCircle className="h-6 w-6 text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={cn(
              "px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 transition-all",
              isAnswered 
                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 hover:-translate-y-0.5" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            {currentIndex === questions.length - 1 ? 'কুইজ শেষ করুন' : 'পরবর্তী প্রশ্ন'} 
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
