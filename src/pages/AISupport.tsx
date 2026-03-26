import { useState, useRef, useEffect } from "react";
import React from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { PageHero } from "../components/PageHero";

export default function AISupport() {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Hello! I am your AI Assistant. You can ask me anything, and I can communicate in any language you prefer.' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      // Initialize Gemini API
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "dummy_key" });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "You are a helpful, friendly, and knowledgeable AI assistant. You can communicate in any language and answer questions on a wide variety of topics clearly and accurately."
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "I couldn't process that." }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I am having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(15, 10, 30, 0.06)' }}>
      <PageHero 
        title="AI Assistant"
        subtitle="Ask me anything, in any language"
        icon={Bot}
        darkColor="#0f0a1e"
        badge="Support"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4c1d95" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        }
      />
      <div className="max-w-5xl mx-auto pb-8 pt-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 h-[500px]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'}`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'}`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSend} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything... (e.g. 'How are you?' or 'Translate this to Bengali')"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="h-5 w-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
