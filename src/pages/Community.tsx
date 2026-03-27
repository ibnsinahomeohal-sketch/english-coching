import React, { useState } from "react";
import { MessageSquare, Users, Heart, Share2, Send, Image as ImageIcon, MoreHorizontal, User } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { toast } from "sonner";

interface Post {
  id: string;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const initialPosts: Post[] = [
  {
    id: "1",
    author: "Sarah Johnson",
    authorRole: "Advanced English Student",
    content: "Just finished the latest speaking module! The pronunciation exercises were challenging but really helpful. Has anyone else tried the tongue twisters in lesson 4? 🗣️✨",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 5,
    isLiked: false
  },
  {
    id: "2",
    author: "Michael Chen",
    authorRole: "IELTS Prep Student",
    content: "Looking for a speaking partner to practice for the IELTS speaking test. I'm aiming for a band 7.5. Available evenings (GMT+6). Let me know if you're interested! 📚🤝",
    timestamp: "5 hours ago",
    likes: 18,
    comments: 12,
    isLiked: true
  },
  {
    id: "3",
    author: "Emma Davis",
    authorRole: "Beginner English Student",
    content: "I finally understand the difference between Present Perfect and Past Simple! The teacher explained it so well today. Feeling motivated! 🌟📖",
    timestamp: "1 day ago",
    likes: 45,
    comments: 8,
    isLiked: false
  }
];

export default function Community() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [studentName, setStudentName] = useState("Student");

  React.useEffect(() => {
    const sessionStr = localStorage.getItem('studentSession');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      setStudentName(session.studentName || "Student");
    }
  }, []);

  const handlePost = () => {
    if (!newPost.trim()) {
      toast.error("Please write something to post.");
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: studentName,
      authorRole: "Student",
      content: newPost,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      isLiked: false
    };

    setPosts([post, ...posts]);
    setNewPost("");
    toast.success("Post published successfully!");
  };

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <PageHero 
        title="Student Community"
        subtitle="Connect, share, and learn with your fellow students"
        icon={Users}
        darkColor="#312e81"
        badge="Community"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="community" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="#e0e7ff" fillOpacity="0.4" />
              <path d="M10 12 Q 15 18 20 12" fill="none" stroke="#e0e7ff" strokeOpacity="0.4" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#community)" />
          </svg>
        }
      />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Create Post */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your learning progress, ask a question, or start a discussion..."
                className="w-full p-4 border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-slate-50 transition-all"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <ImageIcon className="h-5 w-5" />
                  </button>
                </div>
                <button 
                  onClick={handlePost}
                  disabled={!newPost.trim()}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Send className="h-4 w-4" />
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-50">
                    <span className="font-bold text-lg">{post.author.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{post.author}</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-indigo-600 font-medium">{post.authorRole}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{post.timestamp}</span>
                    </div>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              {/* Post Content */}
              <p className="text-slate-700 text-[15px] leading-relaxed mb-6 whitespace-pre-wrap">
                {post.content}
              </p>

              {/* Post Actions */}
              <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    post.isLiked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
                </button>
                <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                  <MessageSquare className="h-5 w-5" />
                  {post.comments} {post.comments === 1 ? 'Comment' : 'Comments'}
                </button>
                <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors ml-auto">
                  <Share2 className="h-5 w-5" />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
