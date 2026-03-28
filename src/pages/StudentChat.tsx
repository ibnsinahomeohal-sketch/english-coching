import React, { useState, useRef, useEffect, FormEvent } from "react";
import { Send, Paperclip, Image as ImageIcon, FileText, MoreVertical, Search, User, MessageSquare, Sparkles, Target, Activity, ChevronRight, Filter, Clock, Smile, Phone, Video as VideoIcon, Info, CheckCircle2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export default function StudentChat() {
  const [student, setStudent] = useState<any>(null);
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStudentAndUsers = async () => {
      setLoading(true);
      try {
        const sessionStr = localStorage.getItem('studentSession');
        if (!sessionStr) {
          setLoading(false);
          return;
        }
        
        const session = JSON.parse(sessionStr);
        const studentId = session.studentId;

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

          const { data: users } = await supabase
            .from("students")
            .select(`
              *,
              batches (name)
            `)
            .eq("batch_id", studentData.batch_id)
            .neq("student_id", studentId);
            
          setChatUsers(users || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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
    <div className="h-[calc(100vh-12rem)] bg-white/80 backdrop-blur-xl rounded-[3rem] border border-white/20 shadow-2xl flex overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#004d40]/10 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ffc107]/10 rounded-full blur-[100px] -ml-48 -mb-48 animate-pulse delay-700 pointer-events-none" />

      {/* Sidebar - User List */}
      <div className={cn(
        "w-full sm:w-80 md:w-96 border-r border-slate-100 flex flex-col bg-white/50 backdrop-blur-md shrink-0 transition-all duration-500 relative z-10",
        selectedUser && "hidden sm:flex"
      )}>
        <div className="p-8 border-b border-slate-100 bg-white/80">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-[#004d40]/10 text-[#004d40] rounded-2xl flex items-center justify-center shadow-lg shadow-[#004d40]/5 border border-[#004d40]/20">
                <MessageSquare className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Messages</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Batch Chat</p>
              </div>
            </div>
            <button className="h-10 w-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-[#004d40]/5 hover:text-[#004d40] transition-all border border-slate-100">
              <Filter className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search classmates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 focus:border-[#004d40]/30 focus:ring-8 focus:ring-[#004d40]/5 rounded-2xl text-sm font-bold transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 rounded-3xl flex items-center gap-4 animate-pulse">
                <div className="h-14 w-14 bg-slate-200 rounded-2xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded-full w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded-full w-1/2"></div>
                </div>
              </div>
            ))
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-dashed border-slate-200">
                <User className="h-10 w-10 text-slate-300" />
              </div>
              <p className="text-slate-400 font-black text-sm uppercase tracking-widest">No classmates found</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user, index) => (
                <motion.button 
                  key={user.student_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedUser(user)}
                  className={cn(
                    "w-full text-left p-4 rounded-[2rem] transition-all flex items-center gap-4 group relative overflow-hidden",
                    selectedUser?.student_id === user.student_id 
                      ? 'bg-[#004d40] text-white shadow-2xl shadow-[#004d40]/30 scale-[1.02] z-10' 
                      : 'hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 text-slate-700'
                  )}
                >
                  <div className="relative shrink-0">
                    {user.photo_url ? (
                      <img src={user.photo_url} alt={user.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md" />
                    ) : (
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-white shadow-md transition-colors",
                        selectedUser?.student_id === user.student_id ? 'bg-[#00695c] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-[#004d40]/5 group-hover:text-[#004d40]'
                      )}>
                        <User className="h-7 w-7" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className={cn(
                        "font-display font-black truncate text-lg tracking-tight",
                        selectedUser?.student_id === user.student_id ? 'text-white' : 'text-slate-900'
                      )}>
                        {user.name}
                      </h4>
                      <span className={cn(
                        "text-[10px] font-black",
                        selectedUser?.student_id === user.student_id ? 'text-white/60' : 'text-slate-400'
                      )}>
                        12:45
                      </span>
                    </div>
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest truncate",
                      selectedUser?.student_id === user.student_id ? 'text-white/60' : 'text-slate-400'
                    )}>
                      {user.batches?.name || 'Student'}
                    </p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-white/40 backdrop-blur-md relative transition-all duration-500 z-10",
        !selectedUser && "hidden sm:flex"
      )}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="h-24 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-10">
              <div className="flex items-center gap-5">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="sm:hidden h-10 w-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  <ChevronRight className="h-6 w-6 rotate-180" />
                </button>
                <div className="relative">
                  {selectedUser.photo_url ? (
                    <img src={selectedUser.photo_url} alt={selectedUser.name} className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-white" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm">
                      <User className="h-7 w-7" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                </div>
                <div>
                  <h3 className="font-display font-black text-slate-900 text-xl tracking-tight">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active Now</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-12 w-12 flex items-center justify-center text-slate-400 hover:text-[#004d40] hover:bg-[#004d40]/5 rounded-2xl transition-all border border-slate-100 bg-white shadow-sm">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="h-12 w-12 flex items-center justify-center text-slate-400 hover:text-[#004d40] hover:bg-[#004d40]/5 rounded-2xl transition-all border border-slate-100 bg-white shadow-sm">
                  <VideoIcon className="h-5 w-5" />
                </button>
                <button className="h-12 w-12 flex items-center justify-center text-slate-400 hover:text-[#004d40] hover:bg-[#004d40]/5 rounded-2xl transition-all border border-slate-100 bg-white shadow-sm">
                  <Info className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/20">
              <div className="text-center">
                <span className="bg-white/50 text-slate-500 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.3em] backdrop-blur-sm border border-slate-100 shadow-sm">
                  Today
                </span>
              </div>
              
              <AnimatePresence mode="popLayout">
                {messages.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-slate-400 space-y-8"
                  >
                    <div className="h-32 w-32 bg-white rounded-[3rem] flex items-center justify-center shadow-2xl shadow-slate-200/50 border border-slate-100 relative">
                      <MessageSquare className="h-14 w-14 text-[#004d40]/20" />
                      <div className="absolute -top-2 -right-2 h-10 w-10 bg-[#ffc107] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ffc107]/20 animate-bounce">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="text-slate-900 font-display font-black text-3xl mb-3 tracking-tight">Start a conversation</h4>
                      <p className="text-slate-400 font-bold max-w-[280px] mx-auto leading-relaxed">Send a message to {selectedUser.name.split(' ')[0]} to start sharing ideas and learning together.</p>
                    </div>
                  </motion.div>
                ) : (
                  messages.map((msg, index) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={cn("flex", msg.isSender ? 'justify-end' : 'justify-start')}
                    >
                      <div className={cn("max-w-[85%] sm:max-w-[70%] flex flex-col", msg.isSender ? 'items-end' : 'items-start')}>
                        <div 
                          className={cn(
                            "px-8 py-5 shadow-2xl text-base leading-relaxed font-bold",
                            msg.isSender 
                              ? 'bg-[#004d40] text-white rounded-[2.5rem] rounded-tr-lg shadow-[#004d40]/30' 
                              : 'bg-white border border-slate-100 text-slate-800 rounded-[2.5rem] rounded-tl-lg shadow-slate-200/50'
                          )}
                        >
                          <p>{msg.text}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-3 px-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {msg.time}
                          </span>
                          {msg.isSender && (
                            <div className="flex items-center gap-0.5">
                              <CheckCircle2 className="h-3 w-3 text-[#00695c]" />
                              <CheckCircle2 className="h-3 w-3 text-[#00695c] -ml-1.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 bg-white/80 backdrop-blur-xl border-t border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#004d40]/10 to-transparent"></div>
              <form onSubmit={handleSendMessage} className="flex items-end gap-5 max-w-6xl mx-auto">
                <div className="flex gap-2 pb-2">
                  <button type="button" className="h-14 w-14 flex items-center justify-center text-slate-400 hover:text-[#004d40] hover:bg-[#004d40]/5 rounded-[1.5rem] transition-all group border border-slate-100 bg-white shadow-sm">
                    <Paperclip className="h-7 w-7 group-hover:rotate-45 transition-transform" />
                  </button>
                  <button type="button" className="h-14 w-14 flex items-center justify-center text-slate-400 hover:text-[#004d40] hover:bg-[#004d40]/5 rounded-[1.5rem] transition-all hidden sm:flex border border-slate-100 bg-white shadow-sm">
                    <ImageIcon className="h-7 w-7" />
                  </button>
                </div>
                
                <div className="flex-1 bg-white rounded-[2.5rem] border-2 border-slate-100 focus-within:border-[#004d40]/30 focus-within:ring-[12px] focus-within:ring-[#004d40]/5 transition-all overflow-hidden flex items-center px-6 shadow-sm">
                  <textarea 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Type your message here..." 
                    className="w-full max-h-32 min-h-[64px] py-5 bg-transparent outline-none text-base font-bold resize-none custom-scrollbar"
                    rows={1}
                  />
                  <button type="button" className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-[#004d40] transition-all">
                    <Smile className="h-6 w-6" />
                  </button>
                </div>
                
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="h-16 w-16 bg-[#004d40] text-white rounded-[2rem] flex items-center justify-center hover:bg-[#004d40]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-[#004d40]/30 shrink-0 hover:-translate-y-1 active:translate-y-0 group"
                >
                  <Send className="h-7 w-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#004d40]/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#ffc107]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 text-center"
            >
              <div className="h-40 w-40 bg-white rounded-[4rem] flex items-center justify-center shadow-2xl shadow-slate-200/50 border border-slate-100 mb-10 mx-auto relative group">
                <MessageSquare className="h-16 w-16 text-[#004d40]/20 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute -bottom-4 -right-4 h-16 w-16 bg-[#ffc107] rounded-[2rem] flex items-center justify-center shadow-xl shadow-[#ffc107]/30 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-4xl font-display font-black text-slate-900 mb-4 tracking-tight">Your Learning Community</h3>
              <p className="text-slate-400 font-bold max-w-sm mx-auto leading-relaxed text-lg">Select a classmate from the sidebar to start a conversation, share resources, and learn together.</p>
              
              <div className="mt-12 flex items-center justify-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#004d40] border border-slate-100">
                    <Target className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collaborate</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-emerald-500 border border-slate-100">
                    <Activity className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Real-time</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-amber-500 border border-slate-100">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Grow</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

