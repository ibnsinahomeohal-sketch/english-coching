import React, { useState, useRef, useEffect, FormEvent, ChangeEvent } from "react";
import { Send, Paperclip, Image as ImageIcon, FileText, MoreVertical, Search, User, MessageSquare } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function StudentChat() {
  const [student, setStudent] = useState<any>(null);
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStudentAndUsers = async () => {
      const sessionStr = localStorage.getItem('studentSession');
      if (!sessionStr) return;
      
      const session = JSON.parse(sessionStr);
      const studentId = session.studentId;

      // Fetch student details
      const { data: studentData } = await supabase
        .from("students")
        .select(`
          *,
          batches (name)
        `)
        .eq("student_id", studentId)
        .single();

      if (studentData) {
        setStudent(studentData);

        // Fetch users in the same batch + teachers/admins
        const { data: users } = await supabase
          .from("students")
          .select(`
            *,
            batches (name)
          `)
          .eq("batch_id", studentData.batch_id)
          .neq("student_id", studentId); // Exclude self
          
        setChatUsers(users || []);
      }
    };

    fetchStudentAndUsers();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const newMsg = {
      id: messages.length + 1,
      senderId: student.student_id,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSender: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const filteredUsers = chatUsers.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.student_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-6rem)] bg-white rounded-3xl border border-slate-200 shadow-sm flex overflow-hidden m-4 sm:m-6 lg:m-8">
      {/* Sidebar - User List */}
      <div className="w-full sm:w-80 md:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
        <div className="p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Messages</h2>
              <p className="text-xs font-medium text-slate-500">Chat with your batchmates</p>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search classmates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-xl text-sm transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No classmates found.
            </div>
          ) : (
            filteredUsers.map(user => (
              <button 
                key={user.student_id}
                onClick={() => setSelectedUser(user)}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-center gap-4 ${
                  selectedUser?.student_id === user.student_id 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'hover:bg-white hover:shadow-sm text-slate-700'
                }`}
              >
                <div className="relative shrink-0">
                  {user.photo_url ? (
                    <img src={user.photo_url} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                  ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${selectedUser?.student_id === user.student_id ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      <User className="h-6 w-6" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold truncate ${selectedUser?.student_id === user.student_id ? 'text-white' : 'text-slate-900'}`}>
                    {user.name}
                  </h4>
                  <p className={`text-xs truncate mt-0.5 ${selectedUser?.student_id === user.student_id ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {user.batches?.name || 'Student'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${selectedUser ? 'flex' : 'hidden sm:flex'} flex-1 flex-col bg-slate-50/30 relative`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="h-20 border-b border-slate-200 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {selectedUser.photo_url ? (
                    <img src={selectedUser.photo_url} alt={selectedUser.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{selectedUser.name}</h3>
                  <p className="text-xs text-emerald-600 font-medium">Online</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="text-center">
                <span className="bg-slate-200/50 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Today
                </span>
              </div>
              
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-slate-300" />
                  </div>
                  <p>Send a message to start the conversation</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] sm:max-w-[60%] flex flex-col ${msg.isSender ? 'items-end' : 'items-start'}`}>
                      <div 
                        className={`px-5 py-3 shadow-sm ${
                          msg.isSender 
                            ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 mt-1.5 px-1">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-4xl mx-auto">
                <div className="flex gap-1 pb-1">
                  <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors hidden sm:block">
                    <ImageIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex-1 bg-slate-100 rounded-2xl border border-transparent focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 transition-all overflow-hidden">
                  <textarea 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Type your message..." 
                    className="w-full max-h-32 min-h-[44px] py-3 px-4 bg-transparent outline-none text-sm resize-none"
                    rows={1}
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="p-3.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6">
              <MessageSquare className="h-10 w-10 text-indigo-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Your Messages</h3>
            <p className="text-sm max-w-xs text-center">Select a classmate from the sidebar to start a conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
