import { useState, useRef } from "react";
import { Mic, Square, Play, Upload } from "lucide-react";

export default function SpeakingPractice() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
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
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access your microphone. Please ensure you have granted permission.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Speaking Practice</h1>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-2xl">
        <p className="text-gray-700 mb-6">Topic: Speak 5 sentences about your day.</p>
        
        <div className="flex gap-4 mb-6">
          {!isRecording ? (
            <button onClick={startRecording} className="bg-rose-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
              <Mic className="h-5 w-5" /> Start Recording
            </button>
          ) : (
            <button onClick={stopRecording} className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
              <Square className="h-5 w-5" /> Stop Recording
            </button>
          )}
        </div>

        {audioURL && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <audio src={audioURL} controls className="w-full" />
            <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
              <Upload className="h-4 w-4" /> Submit Recording
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
