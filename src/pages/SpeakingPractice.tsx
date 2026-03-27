import { useState, useRef, useEffect } from "react";
import { Mic, Square, Upload, Play, Pause, RefreshCw, CheckCircle2, AlertCircle, Volume2 } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { toast } from "sonner";

export default function SpeakingPractice() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Microphone access is not supported by your browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioURL(URL.createObjectURL(blob));
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      setIsSubmitted(false);
      setAudioURL(null);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error: any) {
      console.error("Error accessing microphone:", error);
      let errorMessage = "Could not access your microphone.";
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = "Microphone device not found. Please ensure a microphone is connected.";
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = "Microphone access denied. Please grant permission in your browser settings.";
      }
      toast.error(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleSubmit = () => {
    // In a real app, this would upload the audio blob to storage
    toast.success("Recording submitted successfully!");
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setAudioURL(null);
    setRecordingTime(0);
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <PageHero 
        title="Speaking Practice"
        subtitle="Improve your pronunciation and fluency"
        icon={Mic}
        darkColor="#4f46e5"
        badge="Interactive"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="waves" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 10 Q 5 5 10 10 T 20 10" fill="none" stroke="currentColor" strokeWidth="1" className="text-indigo-500/20" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#waves)" />
          </svg>
        }
      />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* Header Section */}
          <div className="p-8 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-wide uppercase mb-4">
                  <Volume2 className="h-3.5 w-3.5" />
                  Daily Task
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Introduce Yourself</h2>
                <p className="text-slate-600 leading-relaxed">
                  Speak for at least 30 seconds about your day, your hobbies, and why you are learning English. Try to use full sentences and speak clearly.
                </p>
              </div>
              
              <div className="hidden sm:flex shrink-0 h-16 w-16 bg-indigo-50 rounded-2xl items-center justify-center text-indigo-600">
                <Mic className="h-8 w-8" />
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                <AlertCircle className="h-3.5 w-3.5" /> Target: 30s - 2m
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="h-3.5 w-3.5" /> Clear pronunciation
              </span>
            </div>
          </div>
          
          {/* Recording Interface */}
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center min-h-[320px]">
            
            {/* Visualizer / Status Area */}
            <div className="mb-10 relative flex items-center justify-center w-full max-w-md h-32">
              {isRecording ? (
                <div className="flex items-center gap-2 h-16">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-2 bg-rose-500 rounded-full animate-pulse"
                      style={{ 
                        height: `${Math.max(20, Math.random() * 100)}%`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.5s'
                      }}
                    />
                  ))}
                </div>
              ) : audioURL ? (
                <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-inner">
                  <audio src={audioURL} controls className="w-full h-10" />
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                    <Mic className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-medium">Ready to record</p>
                </div>
              )}
            </div>

            {/* Timer */}
            {(isRecording || audioURL) && !isSubmitted && (
              <div className={`text-3xl font-mono font-bold tracking-wider mb-8 ${isRecording ? 'text-rose-600' : 'text-slate-700'}`}>
                {formatTime(recordingTime)}
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm">
              {!isRecording && !audioURL ? (
                <button 
                  onClick={startRecording} 
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-rose-600/20 hover:shadow-rose-600/40 hover:-translate-y-0.5"
                >
                  <Mic className="h-6 w-6" /> 
                  Start Recording
                </button>
              ) : isRecording ? (
                <button 
                  onClick={stopRecording} 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5"
                >
                  <Square className="h-6 w-6" /> 
                  Stop Recording
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row w-full gap-3">
                  {!isSubmitted ? (
                    <>
                      <button 
                        onClick={handleRetake} 
                        className="flex-1 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <RefreshCw className="h-5 w-5" /> 
                        Retake
                      </button>
                      <button 
                        onClick={handleSubmit}
                        className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5"
                      >
                        <Upload className="h-5 w-5" /> 
                        Submit Audio
                      </button>
                    </>
                  ) : (
                    <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-1" />
                      <p className="font-bold">Successfully Submitted!</p>
                      <p className="text-sm text-emerald-600/80">Your teacher will review your recording soon.</p>
                      <button 
                        onClick={handleRetake}
                        className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                      >
                        Record another practice
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
          </div>
          
          {/* Tips Section */}
          <div className="bg-slate-50 p-6 sm:p-8 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs">💡</span>
              Speaking Tips
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <p>Find a quiet place to record to minimize background noise.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <p>Speak at a normal, conversational pace. Don't rush.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <p>Focus on clear pronunciation rather than complex vocabulary.</p>
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
}
