import { useState } from "react";
import { MessageSquare, Users, BookOpen, Star } from "lucide-react";

const communityPosts: any[] = [];

export default function Community() {
  const [newPost, setNewPost] = useState("");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Community Discussion</h1>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-2xl mb-6">
        <textarea 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share something in English..."
          className="w-full p-3 border border-gray-200 rounded-lg mb-3"
          rows={3}
        />
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium">Post</button>
      </div>

      <div className="space-y-4 max-w-2xl">
        {communityPosts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-900">{post.author}</h4>
            <p className="text-gray-700 mt-2">{post.text}</p>
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              <span>{post.likes} Likes</span>
              <span>{post.comments} Comments</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
