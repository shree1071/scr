import React, { useState } from 'react';
import { PenTool, MessageCircle, Mail, Sparkles, RefreshCw, Copy, Check, ShieldAlert, Lightbulb } from 'lucide-react';
import WellnessTips from './WellnessTips';

const WorkplaceTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'review' | 'script' | 'email' | 'wellness'>('review');

  // --- REVIEW WRITER STATE ---
  const [achievements, setAchievements] = useState('');
  const [reviewResult, setReviewResult] = useState('');
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);

  // --- SCRIPT DOCTOR STATE ---
  const [scriptScenario, setScriptScenario] = useState('raise');
  const [scriptContext, setScriptContext] = useState('');
  const [scriptResult, setScriptResult] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  // --- EMAIL POLISHER STATE ---
  const [emailDraft, setEmailDraft] = useState('');
  const [emailResult, setEmailResult] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);

  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- GENERATORS ---

  const generateReview = () => {
    if (!achievements.trim()) return;
    setIsGeneratingReview(true);
    setTimeout(() => {
      setReviewResult(`**Performance Review Draft:**

During this quarter, I successfully spearheaded several critical initiatives. Specifically, I ${achievements.toLowerCase().replace(/^[-*•] /, '').replace(/\n/g, ' and ')}. 

These efforts resulted in measurable improvements to team velocity and product stability. I demonstrated proactive leadership by identifying bottlenecks early and collaborating cross-functionally to resolve them. 

Moving forward, I plan to leverage these wins to take on more strategic responsibilities within department.`);
      setIsGeneratingReview(false);
    }, 1500);
  };

  const generateScript = () => {
    setIsGeneratingScript(true);
    setTimeout(() => {
      let script = "";
      if (scriptScenario === 'raise') {
        script = `**The "Ask" Script:**

"Hi [Manager Name], thanks for making time.

I'd like to discuss my compensation. Over the last year, I've taken on additional responsibilities such as [Context: ${scriptContext || 'leading new project'}], and achieved [Key Result].

Based on my performance and current market rates for this level, I'm looking for an adjustment to [Target Salary]. I'm committed to this team and want to ensure my compensation reflects the value I'm delivering."`;
      } else if (scriptScenario === 'boundaries') {
         script = `**The "No" Script:**

"I want to ensure I deliver high-quality work on our current priorities. 

Taking on [Context: ${scriptContext || 'this new task'}] right now would compromise the timeline for [Current Project]. 

I propose we either pause the current project or schedule this new request for the next sprint. Which would you prefer?"`;
      } else {
        script = `**The "Feedback" Script:**

"I want to address something so we can work together more effectively. 

When [Context: ${scriptContext || 'decisions are made without my input'}], it impacts my ability to execute on my goals. 

In the future, could you ensure I'm included in the initial planning phase? This will help us avoid bottlenecks later on."`;
      }
      setScriptResult(script);
      setIsGeneratingScript(false);
    }, 1500);
  };

  const polishEmail = () => {
    if (!emailDraft.trim()) return;
    setIsPolishing(true);
    setTimeout(() => {
        setEmailResult(`Hi Team,\n\nI wanted to follow up on the timeline for this project. Given our current capacity and project scope, the proposed deadline presents a significant risk to quality.\n\nI recommend we adjust the delivery date to [Date] to ensure we meet our standards. Let me know if you'd like to discuss prioritization to make this happen.\n\nBest,\n[Your Name]`);
        setIsPolishing(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-12">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Career Power Tools</h2>
            <p className="text-slate-500 text-lg">AI assistants to handle the awkward parts of your job.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
                { id: 'review', icon: PenTool, label: 'Review Writer', color: 'text-violet-500' },
                { id: 'script', icon: MessageCircle, label: 'Script Doctor', color: 'text-pink-500' },
                { id: 'email', icon: Mail, label: 'Email Polisher', color: 'text-blue-500' },
                { id: 'wellness', icon: Lightbulb, label: 'Wellness Tips', color: 'text-emerald-500' },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all border-2 ${
                        activeTab === tab.id 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105' 
                        : 'bg-white text-slate-500 hover:text-slate-900 hover:border-slate-300 border-slate-100'
                    }`}
                >
                    <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : tab.color} />
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl min-h-[500px]">
            
            {/* --- TOOL 1: REVIEW WRITER --- */}
            {activeTab === 'review' && (
                <div className="animate-slide-up grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Self-Evaluations Suck.</h3>
                            <p className="text-slate-500 font-medium">
                                Paste your rough bullet points (e.g. "fixed login bug", "helped sarah") and we'll turn it into professional corporate speak.
                            </p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">Your Rough Notes</label>
                            <textarea
                                value={achievements}
                                onChange={(e) => setAchievements(e.target.value)}
                                placeholder="- Shipped new dark mode feature&#10;- Mentored 2 junior devs&#10;- Reduced server costs by 20%"
                                className="w-full h-48 p-4 bg-violet-50/50 rounded-2xl border-2 border-violet-100 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 transition-all resize-none font-medium text-slate-700 placeholder:text-violet-300"
                            />
                        </div>
                        <button 
                            onClick={generateReview}
                            disabled={!achievements.trim() || isGeneratingReview}
                            className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-200"
                        >
                            {isGeneratingReview ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                            Professionalize It
                        </button>
                    </div>

                    {/* Output */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-slate-300 relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 p-32 bg-violet-500 rounded-full filter blur-[80px] opacity-20 pointer-events-none"></div>
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <PenTool size={18} className="text-violet-400"/> Corporate Translation
                        </h4>
                        
                        {reviewResult ? (
                            <div className="prose prose-invert prose-sm overflow-y-auto custom-scrollbar flex-grow animate-fade-in whitespace-pre-wrap leading-relaxed">
                                {reviewResult}
                            </div>
                        ) : (
                            <div className="flex-grow flex items-center justify-center text-slate-600 font-medium italic text-center px-8">
                                "Your finalized review will appear here..."
                            </div>
                        )}

                        {reviewResult && (
                            <button 
                                onClick={() => handleCopy(reviewResult)}
                                className="mt-4 w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied!' : 'Copy Text'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* --- TOOL 2: SCRIPT DOCTOR --- */}
            {activeTab === 'script' && (
                <div className="animate-slide-up grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">The Script Doctor</h3>
                            <p className="text-slate-500 font-medium">
                                Dread having "that" conversation? Select a scenario and get a word-for-word script you can use.
                            </p>
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">Scenario</label>
                            <div className="grid grid-cols-1 gap-2">
                                <button 
                                    onClick={() => setScriptScenario('raise')}
                                    className={`p-3 rounded-xl border-2 text-left font-bold transition-all ${scriptScenario === 'raise' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-100 hover:border-pink-200'}`}
                                >
                                    💰 Asking for a Raise
                                </button>
                                <button 
                                    onClick={() => setScriptScenario('boundaries')}
                                    className={`p-3 rounded-xl border-2 text-left font-bold transition-all ${scriptScenario === 'boundaries' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-100 hover:border-pink-200'}`}
                                >
                                    ✋ Setting Boundaries / Saying No
                                </button>
                                <button 
                                    onClick={() => setScriptScenario('feedback')}
                                    className={`p-3 rounded-xl border-2 text-left font-bold transition-all ${scriptScenario === 'feedback' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-100 hover:border-pink-200'}`}
                                >
                                    🗣️ Giving Difficult Feedback
                                </button>
                            </div>
                        </div>

                        <div>
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">Context (Optional)</label>
                             <input 
                                type="text"
                                value={scriptContext}
                                onChange={(e) => setScriptContext(e.target.value)}
                                placeholder="e.g. I led the migration project..."
                                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-700 focus:outline-none focus:border-pink-400"
                             />
                        </div>

                        <button 
                            onClick={generateScript}
                            disabled={isGeneratingScript}
                            className="w-full py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-pink-200"
                        >
                            {isGeneratingScript ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                            Generate Script
                        </button>
                    </div>

                    {/* Output */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-slate-300 relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 p-32 bg-pink-500 rounded-full filter blur-[80px] opacity-20 pointer-events-none"></div>
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <MessageCircle size={18} className="text-pink-400"/> Your Script
                        </h4>
                        
                        {scriptResult ? (
                            <div className="prose prose-invert prose-sm overflow-y-auto custom-scrollbar flex-grow animate-fade-in whitespace-pre-wrap leading-relaxed">
                                {scriptResult}
                            </div>
                        ) : (
                            <div className="flex-grow flex items-center justify-center text-slate-600 font-medium italic text-center px-8">
                                "Your custom script will appear here..."
                            </div>
                        )}

                         {scriptResult && (
                            <button 
                                onClick={() => handleCopy(scriptResult)}
                                className="mt-4 w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied!' : 'Copy Script'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* --- TOOL 3: EMAIL POLISHER --- */}
            {activeTab === 'email' && (
                <div className="animate-slide-up grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">The Email Polisher</h3>
                            <p className="text-slate-500 font-medium">
                                Wrote an angry email? Or a weak one? Paste it here and we'll make it professional, firm, and polite.
                            </p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">Your Draft (Angry or Weak)</label>
                            <textarea
                                value={emailDraft}
                                onChange={(e) => setEmailDraft(e.target.value)}
                                placeholder="e.g. I can't believe you changed the deadline again. This is ridiculous."
                                className="w-full h-48 p-4 bg-blue-50/50 rounded-2xl border-2 border-blue-100 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all resize-none font-medium text-slate-700 placeholder:text-blue-300"
                            />
                        </div>
                        <button 
                            onClick={polishEmail}
                            disabled={!emailDraft.trim() || isPolishing}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                        >
                            {isPolishing ? <RefreshCw className="animate-spin" size={18} /> : <ShieldAlert size={18} />}
                            De-Escalate & Polish
                        </button>
                    </div>

                    {/* Output */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-slate-300 relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 p-32 bg-blue-500 rounded-full filter blur-[80px] opacity-20 pointer-events-none"></div>
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Mail size={18} className="text-blue-400"/> Polished Version
                        </h4>
                        
                        {emailResult ? (
                            <div className="prose prose-invert prose-sm overflow-y-auto custom-scrollbar flex-grow animate-fade-in whitespace-pre-wrap leading-relaxed">
                                {emailResult}
                            </div>
                        ) : (
                            <div className="flex-grow flex items-center justify-center text-slate-600 font-medium italic text-center px-8">
                                "The professional version will appear here..."
                            </div>
                        )}

                        {emailResult && (
                            <button 
                                onClick={() => handleCopy(emailResult)}
                                className="mt-4 w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied!' : 'Copy Email'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* --- TOOL 4: WELLNESS TIPS --- */}
            {activeTab === 'wellness' && (
                <WellnessTips companyId="default" />
            )}
        </div>
    </div>
  );
};

export default WorkplaceTools;
