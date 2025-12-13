import React, { useState, useRef } from 'react';
import { MessageSquare, ThumbsUp, EyeOff, Eye, Filter, Heart, Zap, Image as ImageIcon, X, Send, Plus } from 'lucide-react';
import { Post } from '../../types';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    content: "Is anyone else's manager constantly messaging them after 8 PM? It feels like we have no boundaries anymore.",
    timestamp: '2h ago',
    likes: 45,
    comments: 12,
    tags: ['Burnout', 'Boundaries'],
  },
  {
    id: '2',
    content: "The new office layout is a disaster for focus work. Here's a photo of the 'quiet zone' which is right next to the kitchen.",
    timestamp: '4h ago',
    likes: 128,
    comments: 34,
    tags: ['Office', 'Focus'],
    hasImage: true,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '3',
    content: "Poll: How confident are you in the current leadership's direction?",
    timestamp: '5h ago',
    likes: 89,
    comments: 5,
    tags: ['Leadership', 'Poll'],
    isPoll: true,
    pollData: {
      question: "How confident are you?",
      totalVotes: 432,
      options: [
        { label: "Very Confident", votes: 15 },
        { label: "Somewhat Confident", votes: 35 },
        { label: "Not Confident", votes: 50 },
      ]
    }
  }
];

const CommunityFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [blurredImages, setBlurredImages] = useState<Record<string, boolean>>({ '2': true });
  
  // Create Post State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleBlur = (id: string) => {
    setBlurredImages(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      content: newPostContent,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      tags: ['New', 'General'],
      hasImage: !!newPostImage,
      imageUrl: newPostImage || undefined,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostImage(null);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 relative">
      
      {/* Create Post Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Create Anonymous Post</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shrink-0">
                  <EyeOff size={18} />
                </div>
                <div className="flex-grow">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Speak your mind safely..."
                    className="w-full h-32 p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-violet-100 resize-none placeholder:text-slate-400 font-medium text-slate-700"
                  />
                </div>
              </div>

              {newPostImage && (
                <div className="relative mb-4 rounded-xl overflow-hidden h-40 group">
                  <img src={newPostImage} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setNewPostImage(null)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors text-sm font-bold"
                  >
                    <ImageIcon size={18} />
                    Add Image
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                <button 
                  onClick={handleSubmitPost}
                  disabled={!newPostContent.trim()}
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
                >
                  Post <Send size={14} />
                </button>
              </div>
            </div>
            <div className="bg-slate-50 p-3 text-center text-xs text-slate-400 font-medium">
               Your identity is hidden. Content is AI-moderated.
            </div>
          </div>
        </div>
      )}

      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Tribe</h2>
            <p className="text-slate-500 font-medium">Real talk from real people.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-100 rounded-full text-sm font-bold text-slate-600 hover:border-slate-300 transition-all">
                <Filter size={16} /> Filter
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
                <Plus size={16} /> New Post
            </button>
        </div>
      </div>

      <div className="grid gap-6">
      {posts.map((post, idx) => (
        <div key={post.id} className={`bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group ${
            idx % 2 === 0 ? 'hover:border-pink-200' : 'hover:border-blue-200'
        }`}>
          {/* Subtle colorful gradient top border */}
          <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${
              idx % 2 === 0 ? 'from-pink-400 to-rose-400' : 'from-blue-400 to-cyan-400'
          }`}></div>

            <div className="flex justify-between items-start mb-4 mt-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                     idx % 2 === 0 ? 'bg-pink-100 text-pink-500' : 'bg-blue-100 text-blue-500'
                }`}>
                   <EyeOff size={18} />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Anonymous Colleague</div>
                  <div className="text-xs text-slate-400 font-medium">{post.timestamp}</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {idx % 2 === 0 ? 'Rant' : 'Discussion'}
              </div>
            </div>

            <p className="text-slate-700 text-lg leading-relaxed mb-6 font-medium whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Poll Rendering */}
            {post.isPoll && post.pollData && (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6 space-y-4">
                {post.pollData.options.map((opt, i) => (
                  <div key={i} className="relative group/poll cursor-pointer">
                    <div className="flex justify-between text-sm mb-2 z-10 relative">
                        <span className="font-bold text-slate-700 group-hover/poll:text-violet-600 transition-colors">{opt.label}</span>
                        <span className="font-bold text-slate-400">{opt.votes}%</span>
                    </div>
                    <div className="h-3 bg-white rounded-full overflow-hidden border border-slate-100">
                        <div 
                            className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full" 
                            style={{ width: `${opt.votes}%` }}
                        ></div>
                    </div>
                  </div>
                ))}
                <div className="text-xs text-slate-400 text-center font-medium pt-2 flex items-center justify-center gap-1">
                    <Zap size={12} className="text-yellow-400" fill="currentColor"/>
                    {post.pollData.totalVotes} votes
                </div>
              </div>
            )}

            {/* Image Rendering */}
            {post.hasImage && post.imageUrl && (
              <div className="relative mb-6 rounded-2xl overflow-hidden shadow-sm group/image">
                <img 
                  src={post.imageUrl} 
                  alt="Post attachment" 
                  className={`w-full h-64 object-cover transition-all duration-700 ${blurredImages[post.id] ? 'blur-2xl scale-110 opacity-80' : 'blur-0 scale-100 opacity-100'}`}
                />
                <button 
                  onClick={() => toggleBlur(post.id)}
                  className="absolute inset-0 flex items-center justify-center w-full h-full hover:bg-black/10 transition-colors z-10"
                >
                  <div className="bg-white/90 backdrop-blur-md text-slate-900 px-5 py-3 rounded-full flex items-center gap-2 text-sm font-bold shadow-xl transform transition-transform group-hover/image:scale-105">
                    {blurredImages[post.id] ? (
                      <><Eye size={18} className="text-violet-600" /> Reveal Content</>
                    ) : (
                      <><EyeOff size={18} className="text-slate-400" /> Hide Content</>
                    )}
                  </div>
                </button>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, i) => (
                <span key={i} className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full hover:bg-white hover:border-slate-300 transition-colors cursor-default">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-slate-500 hover:bg-pink-50 hover:text-pink-500 transition-colors text-sm font-bold group/btn">
                  <Heart size={20} className="group-hover/btn:scale-110 transition-transform" />
                  {post.likes}
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-slate-500 hover:bg-blue-50 hover:text-blue-500 transition-colors text-sm font-bold group/btn">
                  <MessageSquare size={20} className="group-hover/btn:scale-110 transition-transform" />
                  {post.comments}
                </button>
              </div>
            </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default CommunityFeed;