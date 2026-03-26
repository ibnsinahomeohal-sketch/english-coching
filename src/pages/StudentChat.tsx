import React, { useState, useRef, useEffect, FormEvent, ChangeEvent } from "react";
import { Send, Paperclip, Image as ImageIcon, FileText, MoreVertical, Search, User } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function StudentChat() {
  const [student, setStudent] = useState<any>(null);
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
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
        .select("*")
        .eq("student_id", studentId)
        .single();

      if (studentData) {
        setStudent(studentData);

        // Fetch users in the same batch + teachers/admins
        const { data: users } = await supabase
          .from("students")
          .select("*")
          .eq("batch_id", studentData.batch_id);
          // In a real app, you'd also fetch teachers and admins here
        
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

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-xl border border-gray-200 shadow-sm flex overflow-hidden">
      {/* Sidebar - User List */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Batch Chat</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatUsers.map(user => (
            <div 
              key={user.student_id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors flex items-start gap-3 ${
                selectedUser?.student_id === user.student_id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-gray-100 border-l-4 border-l-transparent'
              }`}
            >
              <img src={user.photo || "/default-avatar.png"} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">{user.name}</h4>
                <p className="text-[10px] text-indigo-600 mt-1">{user.batch}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedUser ? (
          <>
            <div className="h-16 border-b border-gray-200 flex items-center px-6 bg-white">
              <h3 className="text-sm font-bold text-gray-900">{selectedUser.name}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-[#efeae2] space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-xl p-3 shadow-sm ${msg.isSender ? 'bg-[#d9fdd3]' : 'bg-white'}`}>
                    <p className="text-sm text-gray-800">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-full outline-none text-sm"
                />
                <button type="submit" className="p-2 bg-indigo-600 text-white rounded-full">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a person to chat with.
          </div>
        )}
      </div>
    </div>
  );
}
