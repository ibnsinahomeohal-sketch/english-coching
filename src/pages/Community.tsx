import { useState } from "react";
import { MessageSquare, Users, BookOpen, Star } from "lucide-react";
import { PageHero } from "../components/PageHero";

const communityPosts: any[] = [];

export default function Community() {
  const [newPost, setNewPost] = useState("");

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(15, 10, 30, 0.06)' }}>
      <PageHero 
        title="Community Discussion"
        subtitle="Connect with fellow learners and share your progress"
        icon={MessageSquare}
        darkColor="#0f0a1e"
        badge="Community"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="bubbles" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="4" fill="none" stroke="#4c1d95" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#bubbles)" />
          </svg>
        }
      />
      <div className="max-w-2xl mx-auto pb-8 pt-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
          <textarea 
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share something in English..."
            className="w-full p-3 border border-gray-200 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            rows={3}
          />
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Post</button>
        </div>

        <div className="space-y-4">
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
    </div>
  );
}
