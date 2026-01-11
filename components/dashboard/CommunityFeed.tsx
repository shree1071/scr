import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Heart, Send, Image as ImageIcon, Hash, TrendingUp, Users, Circle } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { Post } from '../../types';
import { getCompanyPosts, addCompanyPost, updateCompanyPost } from '../../lib/storage';
import { getCompanyChatMessages, addChatMessage, subscribeToChatMessages, getActiveUsers, updateActiveUser, ChatMessage, ChatUser } from '../../lib/chat';

interface CommunityFeedProps {
  companyId: string;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ companyId }) => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [activeUsers, setActiveUsers] = useState<ChatUser[]>([]);
  const [showChat, setShowChat] = useState(true);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [privateChatMessages, setPrivateChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [privateChatInput, setPrivateChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const privateMessagesContainerRef = useRef<HTMLDivElement>(null);

  // Load posts and chat messages on mount
  useEffect(() => {
    loadPosts();
    loadChatMessages();
    
    // Load active users and then register current user
    const initializeUsers = async () => {
      await loadActiveUsers();
      
      // Register current user as active (for online status tracking)
      if (user) {
        const currentUser: ChatUser = {
          id: user.id,
          name: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User',
          initials: user.firstName?.[0] || user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || 'U',
          isOnline: true,
        };
        updateActiveUser(companyId, currentUser);
        
        // Update the users list to mark current user as online
        setActiveUsers(prev => {
          const exists = prev.find(u => u.id === currentUser.id);
          if (exists) {
            return prev.map(u => u.id === currentUser.id ? { ...u, isOnline: true } : u);
          }
          return [...prev, currentUser];
        });
      }
    };
    
    initializeUsers();
    
    // Set up real-time subscription
    const unsubscribe = subscribeToChatMessages(companyId, (message) => {
      setChatMessages(prev => [...prev, message]);
      scrollToChatBottom();
    });
    
    return () => {
      unsubscribe();
    };
  }, [companyId, user]);
  
  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    scrollToChatBottom();
  }, [chatMessages]);
  
  const scrollToChatBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };
  
  const loadChatMessages = async () => {
    const messages = await getCompanyChatMessages(companyId);
    setChatMessages(messages);
  };
  
  const loadActiveUsers = async () => {
    const users = await getActiveUsers(companyId);
    setActiveUsers(users);
  };
  
  const handleSendMessage = async () => {
    if (!chatInput.trim() || !user) return;
    
    const userName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User';
    const userInitials = user.firstName?.[0] || user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || 'U';
    
    await addChatMessage(companyId, user.id, userName, userInitials, chatInput);
    setChatInput('');
  };
  
  const handleSelectUser = (selectedUser: ChatUser) => {
    setSelectedUser(selectedUser);
    // Load private chat messages if not already loaded
    if (!privateChatMessages[selectedUser.id]) {
      const stored = localStorage.getItem(`private-chat-${companyId}-${selectedUser.id}`);
      if (stored) {
        try {
          const messages = JSON.parse(stored).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setPrivateChatMessages(prev => ({
            ...prev,
            [selectedUser.id]: messages,
          }));
        } catch (error) {
          console.error('Error loading private chat:', error);
        }
      } else {
        setPrivateChatMessages(prev => ({
          ...prev,
          [selectedUser.id]: [],
        }));
      }
    }
  };
  
  const handleSendPrivateMessage = async () => {
    if (!privateChatInput.trim() || !user || !selectedUser) return;
    
    const userName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User';
    const userInitials = user.firstName?.[0] || user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || 'U';
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      companyId,
      userId: user.id,
      userName,
      userInitials,
      content: privateChatInput,
      timestamp: new Date(),
    };
    
    // Save to localStorage for private chat
    const chatKey = `private-chat-${companyId}-${selectedUser.id}`;
    const existing = privateChatMessages[selectedUser.id] || [];
    const updated = [...existing, message];
    
    try {
      localStorage.setItem(chatKey, JSON.stringify(updated));
      setPrivateChatMessages(prev => ({
        ...prev,
        [selectedUser.id]: updated,
      }));
      setPrivateChatInput('');
      
      // Scroll to bottom
      setTimeout(() => {
        if (privateMessagesContainerRef.current) {
          privateMessagesContainerRef.current.scrollTop = privateMessagesContainerRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Error saving private message:', error);
    }
  };
  
  // Scroll private chat to bottom when messages change
  useEffect(() => {
    if (selectedUser && privateChatMessages[selectedUser.id]) {
      setTimeout(() => {
        if (privateMessagesContainerRef.current) {
          privateMessagesContainerRef.current.scrollTop = privateMessagesContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [privateChatMessages, selectedUser]);

  const loadPosts = async () => {
    setLoading(true);
    const fetchedPosts = await getCompanyPosts(companyId);
    setPosts(fetchedPosts);
    setLoading(false);
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user) return;

    const userName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User';
    const userInitials = user.firstName?.[0] || user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || 'U';

    const newPost: Post = {
      id: Date.now().toString(),
      content: newPostContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      tags: [],
      hasImage: false,
      userId: user.id,
      userName: userName,
      userInitials: userInitials,
    };

    const savedPost = await addCompanyPost(companyId, newPost);
    if (savedPost) {
      setPosts([savedPost, ...posts]);
      setNewPostContent('');
      setShowNewPost(false);
      
      // Also update active users list with post author
      const postAuthor: ChatUser = {
        id: user.id,
        name: userName,
        initials: userInitials,
        isOnline: true,
      };
      updateActiveUser(companyId, postAuthor);
      loadActiveUsers(); // Refresh user list
    }
  };

  const handleLike = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const updatedLikes = post.likes + 1;
    const success = await updateCompanyPost(postId, { likes: updatedLikes });
    
    if (success) {
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, likes: updatedLikes } : p
      ));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="text-indigo-600" size={24} />
            <div>
              <h3 className="text-xl font-bold text-slate-900">Tribe Community</h3>
              <p className="text-slate-600 text-sm">Share thoughts, ideas, and connect with your team anonymously</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md"
          >
            <MessageSquare size={18} className="inline mr-2" />
            New Post
          </button>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-bold text-slate-900 mb-4">Create a New Post</h4>
            
            <div className="space-y-4">
              <div>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind? (Your post will be anonymous)..."
                  className="w-full h-32 p-4 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Hash size={16} />
                <span>Add tags by typing #tag</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowNewPost(false);
                  setNewPostContent('');
                }}
                className="flex-1 py-2 border border-slate-200 rounded-lg font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Selection Section */}
      <div data-user-selection className="bg-white rounded-2xl p-6 border border-slate-200">
        <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Users className="text-indigo-600" size={20} />
          All Accounts ({activeUsers.length})
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {activeUsers.length === 0 ? (
            <p className="col-span-full text-center text-slate-500 py-4">No users available</p>
          ) : (
            activeUsers.map(activeUser => (
              <button
                key={activeUser.id}
                onClick={() => handleSelectUser(activeUser)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedUser?.id === activeUser.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      selectedUser?.id === activeUser.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                    }`}>
                      {activeUser.initials}
                    </div>
                    {activeUser.isOnline && (
                      <Circle className="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-green-500 fill-green-500" size={16} />
                    )}
                  </div>
                  <span className={`text-sm font-medium truncate w-full text-center ${
                    selectedUser?.id === activeUser.id ? 'text-indigo-700' : 'text-slate-700'
                  }`}>
                    {activeUser.name}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Private Chat Section (when user is selected) */}
      {selectedUser && (
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedUser.initials}
                </div>
                {selectedUser.isOnline && (
                  <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-green-500 fill-green-500" size={12} />
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Chat with {selectedUser.name}</h4>
                <p className="text-xs text-slate-600">{selectedUser.isOnline ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="p-2 hover:bg-white/50 rounded-lg text-slate-500 hover:text-slate-700"
            >
              ×
            </button>
          </div>
          
          <div 
            ref={privateMessagesContainerRef}
            className="h-96 overflow-y-auto p-4 space-y-3 bg-slate-50/50"
          >
            {privateChatMessages[selectedUser.id]?.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                <MessageSquare className="mx-auto mb-2 text-slate-300" size={32} />
                <p className="text-sm">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              privateChatMessages[selectedUser.id]?.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.userId === user?.id ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {message.userInitials}
                  </div>
                  <div className={`flex-1 ${message.userId === user?.id ? 'flex flex-col items-end' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-700">{message.userName}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-2 text-sm ${
                        message.userId === user?.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-slate-900 border border-slate-200'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={privateChatInput}
                onChange={(e) => setPrivateChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendPrivateMessage()}
                placeholder={`Message ${selectedUser.name}...`}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <button
                onClick={handleSendPrivateMessage}
                disabled={!privateChatInput.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Posts and Group Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts Feed - Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
              <Users className="mx-auto mb-4 text-slate-300" size={48} />
              <h4 className="text-lg font-semibold text-slate-900 mb-2">No posts yet</h4>
              <p className="text-slate-600 mb-6">Be the first to share something with your tribe!</p>
              <button
                onClick={() => setShowNewPost(true)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                Create First Post
              </button>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                    {post.userInitials || post.content.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {post.userId ? (
                        <button
                          onClick={() => {
                            const postAuthor: ChatUser = {
                              id: post.userId!,
                              name: post.userName || 'Anonymous',
                              initials: post.userInitials || 'A',
                              isOnline: false,
                            };
                            handleSelectUser(postAuthor);
                            // Scroll to user selection section
                            setTimeout(() => {
                              const userSection = document.querySelector('[data-user-selection]');
                              if (userSection) {
                                userSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 100);
                          }}
                          className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1 underline decoration-dotted underline-offset-2"
                          title="Click to chat with this user"
                        >
                          {post.userName || 'Anonymous Member'}
                          <MessageSquare size={14} className="text-indigo-500" />
                        </button>
                      ) : (
                        <span className="font-semibold text-slate-900">Anonymous Member</span>
                      )}
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-sm text-slate-500">{post.timestamp}</span>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        {post.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Poll Display */}
              {post.isPoll && post.pollData && (
                <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-semibold text-slate-900 mb-3">{post.pollData.question}</h5>
                  <div className="space-y-2">
                    {post.pollData.options.map((option, idx) => (
                      <div key={idx} className="relative">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-sm font-medium text-slate-700">{option.label}</span>
                          <span className="text-sm text-slate-500">{option.votes} votes</span>
                        </div>
                        {post.pollData && post.pollData.totalVotes > 0 && (
                          <div 
                            className="absolute top-0 left-0 h-full bg-indigo-100 rounded-lg opacity-50"
                            style={{ width: `${(option.votes / post.pollData.totalVotes) * 100}%` }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    {post.pollData.totalVotes} total votes
                  </div>
                </div>
              )}

              {/* Post Content */}
              <p className="text-slate-700 mb-4 whitespace-pre-wrap">{post.content}</p>

              {/* Post Image */}
              {post.hasImage && post.imageUrl && (
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img src={post.imageUrl} alt="Post attachment" className="w-full h-auto" />
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors"
                >
                  <Heart size={18} className={post.likes > 0 ? 'text-red-500 fill-red-500' : ''} />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <div className="flex items-center gap-2 text-slate-600">
                  <MessageSquare size={18} />
                  <span className="text-sm font-medium">{post.comments} comments</span>
                </div>
                <div className="flex-1" />
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <TrendingUp size={16} />
                    <span className="text-xs">Trending</span>
                  </div>
                )}
              </div>
            </div>
            ))
          )}
        </div>
        
        {/* Real-time Chat Section - Right Column (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 flex flex-col" style={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="text-indigo-600" size={20} />
                  Live Chat
                </h4>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  {showChat ? '−' : '+'}
                </button>
              </div>
              
              {/* Active Users List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Active Members ({activeUsers.length})
                </div>
                <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                  {activeUsers.map(activeUser => (
                    <div
                      key={activeUser.id}
                      className="flex items-center gap-2 bg-white px-2 py-1 rounded-full border border-slate-200 text-xs"
                    >
                      <div className="relative">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {activeUser.initials}
                        </div>
                        {activeUser.isOnline && (
                          <Circle className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 text-green-500 fill-green-500" size={10} />
                        )}
                      </div>
                      <span className="text-slate-700 font-medium truncate max-w-[80px]">
                        {activeUser.name}
                      </span>
                    </div>
                  ))}
                  {activeUsers.length === 0 && (
                    <span className="text-xs text-slate-400">No active users</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Chat Messages */}
            {showChat && (
              <>
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50"
                >
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">
                      <MessageSquare className="mx-auto mb-2 text-slate-300" size={32} />
                      <p className="text-sm">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    chatMessages.map(message => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.userId === user?.id ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                          {message.userInitials}
                        </div>
                        <div className={`flex-1 ${message.userId === user?.id ? 'flex flex-col items-end' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-slate-700">{message.userName}</span>
                            <span className="text-xs text-slate-400">
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div
                            className={`rounded-2xl px-4 py-2 text-sm ${
                              message.userId === user?.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-900 border border-slate-200'
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>
                
                {/* Chat Input */}
                <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed;

