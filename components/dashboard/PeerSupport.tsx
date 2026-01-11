import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Shield, Clock, Heart, Star, Send, Check, User } from 'lucide-react';

interface SupportRequest {
  id: string;
  category: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  timestamp: Date;
  status: 'open' | 'matched' | 'resolved';
  matchedPeer?: string;
  messages: SupportMessage[];
}

interface SupportMessage {
  id: string;
  senderId: string;
  senderType: 'requester' | 'supporter';
  content: string;
  timestamp: Date;
}

interface PeerSupportProps {
  companyId: string;
}

const PeerSupport: React.FC<PeerSupportProps> = ({ companyId }) => {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [activeRequest, setActiveRequest] = useState<SupportRequest | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [newRequest, setNewRequest] = useState({
    category: 'work-stress',
    description: '',
    urgency: 'medium' as 'low' | 'medium' | 'high'
  });

  const categories = [
    { id: 'work-stress', label: 'Work Stress', icon: '💼' },
    { id: 'burnout', label: 'Burnout', icon: '🔥' },
    { id: 'anxiety', label: 'Anxiety', icon: '😰' },
    { id: 'work-life-balance', label: 'Work-Life Balance', icon: '⚖️' },
    { id: 'career-growth', label: 'Career Growth', icon: '📈' },
    { id: 'team-conflict', label: 'Team Conflict', icon: '👥' },
    { id: 'motivation', label: 'Motivation', icon: '🎯' }
  ];

  const urgencyColors = {
    low: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'bg-red-100 text-red-700 border-red-200'
  };

  // Load requests from localStorage
  useEffect(() => {
    const savedRequests = localStorage.getItem(`support-requests-${companyId}`);
    if (savedRequests) {
      const parsed = JSON.parse(savedRequests);
      setRequests(parsed.map((req: any) => ({
        ...req,
        timestamp: new Date(req.timestamp),
        messages: req.messages || []
      })));
    }
  }, [companyId]);

  const createSupportRequest = () => {
    if (!newRequest.description.trim()) return;

    const request: SupportRequest = {
      id: Date.now().toString(),
      category: newRequest.category,
      description: newRequest.description,
      urgency: newRequest.urgency,
      timestamp: new Date(),
      status: 'open',
      messages: []
    };

    const updatedRequests = [request, ...requests];
    setRequests(updatedRequests);
    localStorage.setItem(`support-requests-${companyId}`, JSON.stringify(updatedRequests));
    
    // Reset form
    setNewRequest({
      category: 'work-stress',
      description: '',
      urgency: 'medium'
    });
    setShowNewRequest(false);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeRequest) return;

    const message: SupportMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderType: activeRequest.matchedPeer ? 'requester' : 'supporter',
      content: newMessage,
      timestamp: new Date()
    };

    const updatedRequests = requests.map(req => {
      if (req.id === activeRequest.id) {
        return {
          ...req,
          messages: [...req.messages, message]
        };
      }
      return req;
    });

    setRequests(updatedRequests);
    localStorage.setItem(`support-requests-${companyId}`, JSON.stringify(updatedRequests));
    
    // Update active request
    setActiveRequest({
      ...activeRequest,
      messages: [...activeRequest.messages, message]
    });
    
    setNewMessage('');
  };

  const matchWithPeer = (requestId: string) => {
    const updatedRequests = requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'matched' as const,
          matchedPeer: `Peer-${Math.floor(Math.random() * 1000)}`
        };
      }
      return req;
    });

    setRequests(updatedRequests);
    localStorage.setItem(`support-requests-${companyId}`, JSON.stringify(updatedRequests));
  };

  const openRequests = requests.filter(req => req.status === 'open');
  const myRequests = requests.filter(req => req.status !== 'open');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
        <div className="flex items-center gap-3">
          <Users className="text-purple-600" size={24} />
          <div>
            <h3 className="text-xl font-bold text-slate-900">Peer Support Network</h3>
            <p className="text-slate-600 text-sm">Connect anonymously with peers for support</p>
          </div>
        </div>
      </div>

      {/* New Request Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowNewRequest(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Users size={18} className="mr-2" />
          Request Support
        </button>
      </div>

      {/* New Request Modal */}
      {showNewRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h4 className="text-lg font-bold text-slate-900 mb-4">Request Anonymous Support</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setNewRequest(prev => ({ ...prev, category: cat.id }))}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        newRequest.category === cat.id
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-slate-200 hover:border-purple-200'
                      }`}
                    >
                      <span className="text-lg mr-2">{cat.icon}</span>
                      <span className="text-sm font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Urgency</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setNewRequest(prev => ({ ...prev, urgency: level }))}
                      className={`flex-1 py-2 rounded-lg border-2 font-medium transition-all ${
                        newRequest.urgency === level
                          ? urgencyColors[level]
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what you're going through... (This will be kept anonymous)"
                  className="w-full h-32 p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewRequest(false)}
                className="flex-1 py-2 border border-slate-200 rounded-lg font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={createSupportRequest}
                disabled={!newRequest.description.trim()}
                className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Requests */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Heart className="text-red-500" size={20} />
            Open Support Requests ({openRequests.length})
          </h4>
          
          <div className="space-y-3">
            {openRequests.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No open requests at the moment</p>
            ) : (
              openRequests.map(request => (
                <div key={request.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">
                          {categories.find(cat => cat.id === request.category)?.icon}
                        </span>
                        <span className="font-medium text-slate-900">
                          {categories.find(cat => cat.id === request.category)?.label}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[request.urgency]}`}>
                          {request.urgency}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm">{request.description}</p>
                    </div>
                    <button
                      onClick={() => matchWithPeer(request.id)}
                      className="ml-3 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                    >
                      Support
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={12} />
                    {request.timestamp.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Requests */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <MessageCircle className="text-blue-500" size={20} />
            My Support Requests ({myRequests.length})
          </h4>
          
          <div className="space-y-3">
            {myRequests.length === 0 ? (
              <p className="text-slate-500 text-center py-8">You haven't made any requests yet</p>
            ) : (
              myRequests.map(request => (
                <div 
                  key={request.id} 
                  className={`border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    activeRequest?.id === request.id ? 'border-purple-300 bg-purple-50' : 'border-slate-200'
                  }`}
                  onClick={() => setActiveRequest(request)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {categories.find(cat => cat.id === request.category)?.icon}
                      </span>
                      <span className="font-medium text-slate-900">
                        {categories.find(cat => cat.id === request.category)?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[request.urgency]}`}>
                        {request.urgency}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'matched' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {request.status === 'matched' ? 'Matched' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                  
                  {request.matchedPeer && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-2 mb-2">
                      <User size={16} />
                      Matched with anonymous peer
                    </div>
                  )}
                  
                  <p className="text-slate-600 text-sm mb-2">{request.description}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={12} />
                    {request.timestamp.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {activeRequest && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={20} />
                <div>
                  <h5 className="font-semibold">
                    {categories.find(cat => cat.id === activeRequest.category)?.label}
                  </h5>
                  <p className="text-sm opacity-90">
                    {activeRequest.matchedPeer ? 'Chat with matched peer' : 'Waiting for peer match...'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveRequest(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-3">
            {activeRequest.messages.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                {activeRequest.matchedPeer 
                  ? 'Start the conversation with your matched peer' 
                  : 'Your request is waiting to be matched with a peer...'}
              </div>
            ) : (
              activeRequest.messages.map(message => (
                <div 
                  key={message.id}
                  className={`flex ${message.senderType === 'requester' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs rounded-2xl px-4 py-2 ${
                    message.senderType === 'requester'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Message Input */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || !activeRequest.matchedPeer}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeerSupport;
