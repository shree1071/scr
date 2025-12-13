import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, ArrowRight, ArrowLeft, ClipboardList, Smile, Frown, Meh, Zap, Sun, Calendar, Flame, CloudRain, Printer, Download, BookOpen, Lightbulb, PenTool } from 'lucide-react';
import { Message } from '../../types';

// --- Types & Constants ---

type Mode = 'selection' | 'chat' | 'survey' | 'report';

interface ReportMetric {
  label: string;
  score: number; // 0-100
  color: string;
  description: string;
}

interface ReportData {
  type: 'survey' | 'chat';
  summary: string;
  metrics: ReportMetric[];
  actions: string[];
  resources: { title: string; type: string; link: string }[];
}

const MOODS = [
    { id: 'terrible', icon: CloudRain, label: 'Drained', color: 'bg-slate-100 text-slate-500 hover:bg-slate-200', quote: "It's okay to not be okay. Rest is productive too." },
    { id: 'bad', icon: Frown, label: 'Frustrated', color: 'bg-red-50 text-red-500 hover:bg-red-100', quote: "Frustration is just energy without a place to go. Let's vent it out." },
    { id: 'okay', icon: Meh, label: 'Okay', color: 'bg-amber-50 text-amber-500 hover:bg-amber-100', quote: "Stability is a superpower. Keep moving forward." },
    { id: 'good', icon: Smile, label: 'Good', color: 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100', quote: "Great! Capture this energy and use it." },
    { id: 'great', icon: Zap, label: 'Energized', color: 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100', quote: "You're on fire! 🔥 Share that spark with the team." },
];

const SURVEY_QUESTIONS = [
  { id: 1, text: "I feel energized when I start my work day.", category: 'wellbeing' },
  { id: 2, text: "My manager gives me clear and helpful direction.", category: 'support' },
  { id: 3, text: "I feel safe taking risks or making mistakes here.", category: 'safety' },
  { id: 4, text: "My workload is manageable and realistic.", category: 'wellbeing' },
  { id: 5, text: "I have good opportunities to learn and grow.", category: 'growth' },
  { id: 6, text: "My immediate team supports each other.", category: 'support' },
  { id: 7, text: "I believe I am fairly compensated for my work.", category: 'satisfaction' },
  { id: 8, text: "I feel respected by the company leadership.", category: 'safety' },
  { id: 9, text: "I am able to maintain a healthy work-life balance.", category: 'wellbeing' },
  { id: 10, text: "I would recommend this company to a friend.", category: 'satisfaction' },
];

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "Hey there! 👋 I'm your private AI companion. This is a safe space to vent, share, or just reflect on your work day. How are things going?",
  timestamp: new Date(),
};

// --- Main Component ---

const AiChat: React.FC = () => {
  const [mode, setMode] = useState<Mode>('selection');
  const [greeting, setGreeting] = useState('Good Morning');
  
  // Mood State
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodQuote, setMoodQuote] = useState<string>('');
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Survey State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Report State
  const [report, setReport] = useState<ReportData | null>(null);
  const [journalEntry, setJournalEntry] = useState('');

  // --- Logic ---
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (mode === 'chat') scrollToBottom();
  }, [messages, isTyping, mode]);

  const handleMoodSelect = (mood: typeof MOODS[0]) => {
    setSelectedMood(mood.id);
    setMoodQuote(mood.quote);
  };

  // Generate Survey Report
  const completeSurvey = (finalAnswers: Record<number, number>) => {
    // Calculate averages based on categories
    const getAvg = (ids: number[]) => {
      const scores = ids.map(id => finalAnswers[id] || 0);
      const sum = scores.reduce((a, b) => a + b, 0);
      return Math.round((sum / (ids.length * 5)) * 100);
    };

    const wellbeingScore = getAvg([1, 4, 9]);
    const supportScore = getAvg([2, 6]);
    const safetyScore = getAvg([3, 8]);
    const growthScore = getAvg([5]);
    const satisfactionScore = getAvg([7, 10]);

    const data: ReportData = {
      type: 'survey',
      summary: wellbeingScore < 50 
        ? "It looks like you're carrying a heavy load right now. Your wellbeing scores indicate potential burnout risk. It's important to prioritize recovery."
        : "You're showing strong resilience, though there are areas in management support that could be improved to unlock your full potential.",
      metrics: [
        { label: 'Wellbeing & Balance', score: wellbeingScore, color: 'bg-emerald-500', description: 'Energy levels and workload balance' },
        { label: 'Psychological Safety', score: safetyScore, color: 'bg-violet-500', description: 'Comfort in taking risks and speaking up' },
        { label: 'Manager Support', score: supportScore, color: 'bg-blue-500', description: 'Clarity and backing from leadership' },
        { label: 'Growth Potential', score: growthScore, color: 'bg-amber-500', description: 'Opportunities to learn and advance' },
        { label: 'Job Satisfaction', score: satisfactionScore, color: 'bg-rose-500', description: 'Overall happiness and advocacy' },
      ],
      actions: [
        "Block out 1 hour of 'focus time' on your calendar daily.",
        "Schedule a career conversation with your skip-level manager.",
        "Take a 15-minute unplugged walk during lunch tomorrow."
      ],
      resources: [
        { title: "Dealing with Micro-management", type: "Article", link: "#" },
        { title: "5-Minute Desk Meditation", type: "Audio", link: "#" },
        { title: "Negotiating Workload Boundaries", type: "Guide", link: "#" }
      ]
    };

    setReport(data);
    setMode('report');
  };

  // Generate Chat Report (Mock Analysis)
  const completeChat = () => {
    const userWordCount = messages.filter(m => m.role === 'user').reduce((acc, m) => acc + m.content.split(' ').length, 0);
    const sentimentScore = Math.min(100, Math.max(20, userWordCount / 2)); // Mock logic

    const data: ReportData = {
      type: 'chat',
      summary: "Thanks for sharing. Based on our conversation, you seem to be seeking clarity in a complex situation. Venting is a healthy first step.",
      metrics: [
        { label: 'Emotional Intensity', score: 75, color: 'bg-rose-500', description: 'Strength of feelings expressed' },
        { label: 'Clarity of Thought', score: 60, color: 'bg-blue-500', description: 'Coherence and focus of the session' },
        { label: 'Solution Orientation', score: 45, color: 'bg-emerald-500', description: 'Focus on fixing vs. expressing' },
        { label: 'Support Required', score: 80, color: 'bg-violet-500', description: 'Need for external validation or help' },
        { label: 'Vent Relief Factor', score: 90, color: 'bg-amber-500', description: 'Estimated stress reduction from chat' },
      ],
      actions: [
        "Write down the one thing you can control in this situation.",
        "Wait 24 hours before sending any emotional emails.",
        "Talk to a trusted peer about the specific blocker."
      ],
      resources: [
        { title: "Difficult Conversations Framework", type: "Template", link: "#" },
        { title: "The Art of Letting Go", type: "Video", link: "#" },
        { title: "EAP Support Contacts", type: "Internal", link: "#" }
      ]
    };

    setReport(data);
    setMode('report');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = "That sounds tough. 🫂 Can you tell me more about how that made you feel?";
      const lowerInput = userMsg.content.toLowerCase();
      
      if (lowerInput.includes('burnout') || lowerInput.includes('tired')) {
        aiResponseText = "I hear you, and your feelings are valid. 💙 Burnout is real. Has your manager been supportive at all?";
      } else if (lowerInput.includes('manager') || lowerInput.includes('boss')) {
        aiResponseText = "Management styles make such a huge difference! 🏢 On a scale of 1-10, how psychologically safe do you feel with them?";
      } else if (lowerInput.includes('good') || lowerInput.includes('happy')) {
        aiResponseText = "Yay! 🎉 It's so important to celebrate the wins. What's one thing your team is doing right?";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
        tags: ['Empathy Mode']
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleRate = (score: number) => {
    const question = SURVEY_QUESTIONS[currentQuestionIdx];
    if (!question) return;

    const newAnswers = { ...answers, [question.id]: score };
    setAnswers(newAnswers);
    
    if (currentQuestionIdx < SURVEY_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestionIdx(prev => prev + 1), 250);
    } else {
      setTimeout(() => completeSurvey(newAnswers), 500);
    }
  };

  const downloadPDF = () => {
    window.print();
  };

  // --- Renders ---

  const renderSelection = () => (
    <div className="flex flex-col h-full animate-fade-in print:hidden pb-12">
      
      {/* 1. Header with Daily Greeting & Streak */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-1 uppercase tracking-wider">
                <Sun size={14} className="text-amber-500"/> {greeting}, Colleague
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Time to Check In.</h2>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
             <div className="bg-orange-50 p-2 rounded-lg text-orange-500">
                <Flame size={20} fill="currentColor" />
             </div>
             <div>
                <div className="text-xs font-bold text-slate-400 uppercase">Current Streak</div>
                <div className="text-lg font-black text-slate-800">4 Days</div>
             </div>
        </div>
      </div>

      {/* 2. Daily Mood Logger */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400"></div>
        
        {!selectedMood ? (
            <>
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Calendar size={20} className="text-slate-400"/> How are you feeling right now?
                </h3>
                <div className="grid grid-cols-5 gap-2 md:gap-4">
                    {MOODS.map((mood) => (
                        <button
                            key={mood.id}
                            onClick={() => handleMoodSelect(mood)}
                            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl transition-all duration-300 group ${mood.color}`}
                        >
                            <mood.icon size={32} className="transform group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-xs font-bold md:text-sm">{mood.label}</span>
                        </button>
                    ))}
                </div>
            </>
        ) : (
            <div className="py-6 text-center animate-slide-up">
                 <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 text-3xl">
                    {MOODS.find(m => m.id === selectedMood)?.icon({ size: 32, className: "text-slate-700" })}
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-2">Mood Logged.</h3>
                 <p className="text-lg text-slate-600 font-medium italic max-w-xl mx-auto">"{moodQuote}"</p>
                 <button 
                    onClick={() => setSelectedMood(null)}
                    className="mt-6 text-xs font-bold text-slate-400 hover:text-slate-600 underline"
                 >
                    Undo / Log Different Mood
                 </button>
            </div>
        )}
      </div>

      {/* 3. Deep Dive Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        <button 
          onClick={() => {
            setCurrentQuestionIdx(0);
            setAnswers({});
            setMode('survey');
          }}
          className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-32 bg-violet-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                <ClipboardList size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Deep Dive Survey</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-4">
                Answer 10 quick questions to help us grade the company culture score.
            </p>
            <span className="inline-flex items-center text-sm font-bold text-violet-600 group-hover:gap-2 transition-all">
                Start Survey <ArrowRight size={16} className="ml-1"/>
            </span>
          </div>
        </button>

        <button 
          onClick={() => {
              setMessages([INITIAL_MESSAGE]);
              setMode('chat');
          }}
          className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-32 bg-pink-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-pink-100 text-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                <Bot size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Vent Session</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-4">
                Chat anonymously with our AI to process a difficult interaction or just let off steam.
            </p>
            <span className="inline-flex items-center text-sm font-bold text-pink-600 group-hover:gap-2 transition-all">
                Start Chat <ArrowRight size={16} className="ml-1"/>
            </span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderSurvey = () => {
    const question = SURVEY_QUESTIONS[currentQuestionIdx];
    if (!question) return null;

    const progress = ((currentQuestionIdx + 1) / SURVEY_QUESTIONS.length) * 100;

    return (
      <div className="max-w-2xl mx-auto w-full h-full flex flex-col justify-center p-6 animate-fade-in relative print:hidden">
        <button 
          onClick={() => setMode('selection')}
          className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Exit
        </button>

        <div className="mb-12">
           <div className="flex justify-between items-end mb-4">
             <span className="text-xs font-bold text-violet-500 uppercase tracking-wider">Question {currentQuestionIdx + 1} of {SURVEY_QUESTIONS.length}</span>
             <span className="text-xs font-bold text-slate-400">{Math.round(progress)}%</span>
           </div>
           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-violet-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-100/50">
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-10 text-center leading-tight">
            {question.text}
          </h3>

          <div className="flex flex-col gap-3">
             <div className="flex justify-between px-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
             </div>
             <div className="grid grid-cols-5 gap-2 md:gap-4">
               {[1, 2, 3, 4, 5].map((score) => (
                 <button
                   key={score}
                   onClick={() => handleRate(score)}
                   className={`h-14 md:h-20 rounded-2xl font-bold text-lg md:text-2xl transition-all duration-200 border-2 hover:-translate-y-1 ${
                     answers[question.id] === score
                       ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-200'
                       : 'bg-white text-slate-400 border-slate-100 hover:border-violet-300 hover:text-violet-500'
                   }`}
                 >
                   {score}
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>
    );
  };

  const renderChat = () => (
    <div className="flex flex-col h-full relative print:hidden">
       {/* Chat Header */}
       <div className="bg-white/90 backdrop-blur-sm border-b border-slate-100 p-4 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <button onClick={() => setMode('selection')} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-tr from-pink-400 to-violet-500 rounded-full flex items-center justify-center text-white shadow-md">
                    <Bot size={20} />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-sm">Vent Session</h3>
                <p className="text-[10px] text-slate-500 font-medium">AI Companion • Anonymous</p>
            </div>
          </div>
        </div>
        <button 
          onClick={completeChat}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg"
        >
          Analyze Session
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
            <div className={`max-w-[85%] md:max-w-[75%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-auto mb-1 ${
                msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white text-violet-500 border border-slate-100'
              }`}>
                {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
              </div>
              <div className={`px-5 py-3 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-br-none' 
                  : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start px-12">
               <div className="bg-white border border-slate-100 px-4 py-3 rounded-[1.5rem] rounded-bl-none shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
               </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/50 backdrop-blur-sm">
        <div className="relative flex items-center bg-white rounded-full shadow-sm border border-slate-200 p-1.5 focus-within:ring-2 focus-within:ring-violet-100 transition-shadow">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your feelings..."
            className="w-full px-4 py-2 bg-transparent focus:outline-none text-slate-700 font-medium placeholder:text-slate-400 text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 bg-slate-900 text-white rounded-full hover:bg-violet-600 disabled:opacity-50 transition-all transform active:scale-95"
          >
            <Send size={16} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderReport = () => {
    if (!report) return null;

    return (
      <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative animate-fade-in" id="printable-report">
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-6">
            
            {/* Header */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm text-center relative overflow-hidden print:shadow-none print:border-none">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 print:hidden"></div>
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-slate-200 print:hidden">
                    <Sparkles size={32} />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Session Insights</h2>
                <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
                    {report.summary}
                </p>
            </div>

            {/* 5 Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {report.metrics.map((metric, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow print:break-inside-avoid print:shadow-none">
                        <div className="mb-4">
                             <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Metric</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${metric.color} print:text-black print:bg-transparent print:border`}>{metric.score}/100</span>
                             </div>
                             <h4 className="font-bold text-slate-800 leading-tight">{metric.label}</h4>
                             <p className="text-[10px] text-slate-500 mt-1">{metric.description}</p>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${metric.color} transition-all duration-1000 print:bg-black`} style={{ width: `${metric.score}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Feature 1: Action Plan */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm print:break-inside-avoid print:shadow-none">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Lightbulb size={24} className="text-amber-400 print:text-black" fill="currentColor"/>
                        Recommended Actions
                    </h3>
                    <div className="space-y-4">
                        {report.actions.map((action, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 print:bg-white print:border-slate-300">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-slate-400 shadow-sm shrink-0 border border-slate-100 print:border-slate-300">
                                    {i + 1}
                                </div>
                                <p className="text-slate-700 font-medium pt-1">{action}</p>
                            </div>
                        ))}
                    </div>
                </div>

                 {/* Feature 2: Resources */}
                 <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-[2rem] p-8 shadow-xl print:bg-none print:bg-white print:text-black print:border print:border-slate-200 print:shadow-none">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <BookOpen size={24} className="text-blue-300 print:text-black" />
                        Resources
                    </h3>
                    <div className="space-y-4">
                        {report.resources.map((res, i) => (
                            <div key={i} className="block group">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{res.type}</span>
                                </div>
                                <div className="font-bold text-lg leading-tight group-hover:text-blue-300 transition-colors print:text-black">
                                    {res.title}
                                </div>
                                <div className="h-px bg-white/10 mt-3 group-hover:bg-white/30 transition-colors print:bg-slate-200"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feature 3: Journaling */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm print:hidden">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <PenTool size={20} className="text-violet-500" />
                    Private Reflection Journal
                </h3>
                <textarea 
                    className="w-full h-32 p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 resize-none font-medium text-slate-600 placeholder:text-slate-400"
                    placeholder="Write down any thoughts you want to keep from this session..."
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                ></textarea>
                <div className="flex justify-end gap-3 mt-4">
                    <button 
                        onClick={() => {
                            setJournalEntry('');
                            alert("Journal saved to your private vault.");
                        }}
                        disabled={!journalEntry.trim()}
                        className="px-6 py-2 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                        <Download size={14} /> Save Entry
                    </button>
                </div>
            </div>
        </div>
        
        {/* Footer Actions */}
        <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-between items-center z-10 print:hidden">
            <button onClick={() => setMode('selection')} className="text-slate-500 font-bold text-sm hover:text-slate-800 px-4">
                Close Report
            </button>
            <button 
                onClick={downloadPDF}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-2 rounded-full font-bold text-sm transition-colors"
            >
                <Printer size={16} /> Download PDF
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 z-0 pointer-events-none"></div>
      
      <div className="relative z-10 h-full">
        {mode === 'selection' && renderSelection()}
        {mode === 'survey' && renderSurvey()}
        {mode === 'chat' && renderChat()}
        {mode === 'report' && renderReport()}
      </div>
    </div>
  );
};

export default AiChat;