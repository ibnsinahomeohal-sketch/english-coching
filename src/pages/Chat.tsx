import React, { useState, useRef, useEffect, FormEvent, ChangeEvent } from "react";
import { Send, Paperclip, Image as ImageIcon, FileText, MoreVertical, Search, User } from "lucide-react";

// Mock Data for Students
const students: any[] = [];

const mockMessages: any[] = [];

export default function Chat() {
  const [selectedStudent, setSelectedStudent] = useState<any>(students[0] || null);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [bgLogo, setBgLogo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.logo) setBgLogo(parsed.logo);
    }
  }, []);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedStudent) return;

    const newMsg = {
      id: messages.length + 1,
      senderId: "admin",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSender: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedStudent) {
      const isImage = file.type.startsWith('image/');
      const newMsg = {
        id: messages.length + 1,
        senderId: "admin",
        text: `Sent a ${isImage ? 'photo' : 'document'}: ${file.name}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSender: true,
        attachment: {
          type: isImage ? 'image' : 'document',
          name: file.name,
          url: URL.createObjectURL(file)
        }
      };
      setMessages([...messages, newMsg]);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-xl border border-gray-200 shadow-sm flex overflow-hidden">
      
      {/* Sidebar - Student List */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Student Chat</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search students..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {students.map(student => (
            <div 
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors flex items-start gap-3 ${
                selectedStudent?.id === student.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-gray-100 border-l-4 border-l-transparent'
              }`}
            >
              <div className="relative">
                <img src={student.photo} alt={student.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                {student.unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {student.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{student.name}</h4>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap">{student.time}</span>
                </div>
                <p className={`text-xs truncate ${student.unread > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                  {student.lastMessage}
                </p>
                <p className="text-[10px] text-indigo-600 mt-1">{student.course}</p>
              </div>
            </div>
          ))}
          {students.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              No students available to chat.
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedStudent ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
              <div className="flex items-center gap-3">
                <img src={selectedStudent.photo} alt={selectedStudent.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-gray-500">ID: {selectedStudent.id} • {selectedStudent.course}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              className="flex-1 overflow-y-auto p-6 bg-[#efeae2] space-y-4 relative"
            >
              {/* Background Logo Watermark */}
              {bgLogo && (
                <div 
                  className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${bgLogo})`,
                    backgroundSize: '50%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                />
              )}

              <div className="text-center mb-6 relative z-10">
                <span className="bg-white/80 text-gray-500 text-xs px-3 py-1 rounded-lg shadow-sm">Today</span>
              </div>

              {messages.map((msg) => (
                <div key={msg.id} className={`flex relative z-10 ${msg.isSender ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-xl p-3 shadow-sm relative ${
                    msg.isSender ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none'
                  }`}>
                    {msg.attachment && (
                      <div className="mb-2">
                        {msg.attachment.type === 'image' ? (
                          <img src={msg.attachment.url} alt="attachment" className="rounded-lg max-w-full h-auto max-h-64 object-cover" />
                        ) : (
                          <div className="flex items-center gap-2 bg-black/5 p-3 rounded-lg">
                            <FileText className="h-8 w-8 text-indigo-500" />
                            <span className="text-sm font-medium truncate">{msg.attachment.name}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[10px] text-gray-500 float-right mt-1 ml-4">{msg.time}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*,.pdf,.doc,.docx"
                />
                
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors shrink-0"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                
                <div className="flex-1 bg-white border border-gray-300 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                  <textarea 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="w-full max-h-32 min-h-[44px] py-3 px-4 outline-none resize-none text-sm"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5 ml-0.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
            <User className="h-16 w-16 mb-4 opacity-20" />
            <h3 className="text-lg font-bold">Select a student</h3>
            <p className="text-sm">Choose a student from the sidebar to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
