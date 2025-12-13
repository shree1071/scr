import React from 'react';
import { InsightMetric } from '../../types';
import { Minus, Sparkles, BarChart3, Activity, PieChart, ArrowUpRight } from 'lucide-react';

const METRICS: InsightMetric[] = [
  { key: 'burnout', label: 'Burnout Risk', score: 72, description: 'High levels detected in Engineering', riskLevel: 'high' },
  { key: 'toxicity', label: 'Culture & Vibes', score: 34, description: 'Generally healthy & supportive', riskLevel: 'low' },
  { key: 'wlb', label: 'Work-Life Balance', score: 45, description: 'Weekend work is creeping up', riskLevel: 'medium' },
  { key: 'safety', label: 'Psychological Safety', score: 68, description: 'People feel safe speaking up', riskLevel: 'medium' },
  { key: 'growth', label: 'Growth & Learning', score: 55, description: 'Middle management feels stuck', riskLevel: 'medium' },
];

// --- SVG Chart Components ---

const MoodLineChart = () => {
  // Mock data points
  const points = [40, 60, 55, 30, 80, 75, 65]; 
  const max = 100;
  const width = 300;
  const height = 100;
  
  // Calculate SVG points
  const svgPoints = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - (val / max) * height;
    return `${x},${y}`;
  }).join(' ');

  // Create area path
  const areaPath = `M0,${height} ${svgPoints} L${width},${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      {/* Gradient Defs */}
      <defs>
        <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Area */}
      <path d={areaPath} fill="url(#moodGradient)" />
      
      {/* Line */}
      <polyline 
        fill="none" 
        stroke="#8b5cf6" 
        strokeWidth="3" 
        points={svgPoints} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Points */}
      {points.map((val, idx) => {
         const x = (idx / (points.length - 1)) * width;
         const y = height - (val / max) * height;
         return (
             <circle key={idx} cx={x} cy={y} r="4" fill="white" stroke="#8b5cf6" strokeWidth="2" />
         );
      })}
    </svg>
  );
};

const DonutChart = () => {
  const data = [
      { label: 'Eng', val: 35, color: '#3b82f6' },
      { label: 'Sales', val: 25, color: '#f43f5e' },
      { label: 'Mkt', val: 20, color: '#10b981' },
      { label: 'HR', val: 20, color: '#8b5cf6' }
  ];
  
  let cumulative = 0;
  
  return (
    <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
            {data.map((d, i) => {
                const start = cumulative;
                cumulative += d.val;
                const dashArray = `${d.val} ${100 - d.val}`;
                const offset = 100 - start;
                
                return (
                    <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={d.color}
                        strokeWidth="12"
                        strokeDasharray={dashArray}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                    />
                );
            })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold text-slate-700">64%</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Avg Score</span>
        </div>
    </div>
  );
}

const AnalyticsDashboard: React.FC = () => {
  const getTheme = (score: number, inverse = false) => {
    const isBad = inverse ? score > 60 : score < 40;
    const isMid = inverse ? (score <= 60 && score > 30) : (score >= 40 && score < 70);
    
    if (isBad) return { color: 'text-red-500', bg: 'bg-red-500', light: 'bg-red-50', border: 'border-red-100', emoji: '🥵' };
    if (isMid) return { color: 'text-orange-500', bg: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-100', emoji: '😐' };
    return { color: 'text-emerald-500', bg: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-100', emoji: '😎' };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Top Level Summary Card */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-50%] left-[-10%] w-96 h-96 bg-violet-500 opacity-20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
                    <Activity size={12} /> Company Pulse
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight">Health Score</h2>
                <p className="text-slate-300 text-lg opacity-90 max-w-md font-medium">
                    Aggregated analysis from 1,240 verified employees.
                </p>
            </div>
            
            <div className="flex items-end gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-3xl border border-white/10">
                <div className="text-6xl font-extrabold tracking-tighter">64</div>
                <div className="flex flex-col pb-2">
                    <span className="text-sm font-bold opacity-60">OUT OF 100</span>
                    <div className="flex items-center gap-1 text-emerald-300 text-sm font-bold bg-emerald-500/20 px-2 py-0.5 rounded-lg">
                        <Minus size={14} /> Stable
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Key Metrics (2/3 width on large) */}
        <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between mb-2">
                 <h3 className="text-xl font-bold text-slate-800">Key Performance Indicators</h3>
                 <button className="text-sm font-bold text-violet-600 hover:text-violet-700">View Details</button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {METRICS.map((metric) => {
                    const isInverse = metric.key === 'burnout' || metric.key === 'toxicity';
                    const theme = getTheme(metric.score, isInverse);
                    
                    return (
                        <div key={metric.key} className={`bg-white rounded-3xl p-6 border-2 shadow-sm transition-all duration-300 hover:shadow-md ${theme.border}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-700">{metric.label}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{metric.riskLevel} Risk</p>
                                </div>
                                <div className={`text-2xl`}>{theme.emoji}</div>
                            </div>
                            
                            {/* Bar */}
                            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-3">
                                <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${theme.bg}`} style={{ width: `${metric.score}%` }}></div>
                            </div>

                            <p className={`text-xs font-medium ${theme.color}`}>{metric.description}</p>
                        </div>
                    );
                })}
             </div>

             {/* Graph Section: Department Breakdown */}
             <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
                <div className="flex-grow">
                     <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <PieChart size={20} className="text-slate-400" />
                        Department Sentiment
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">Comparison of happiness scores by department.</p>
                    <div className="space-y-3">
                        {[
                            { label: 'Engineering', val: 35, color: 'bg-blue-500' },
                            { label: 'Sales', val: 25, color: 'bg-rose-500' },
                            { label: 'Marketing', val: 20, color: 'bg-emerald-500' },
                            { label: 'HR', val: 20, color: 'bg-violet-500' }
                        ].map((d, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${d.color}`}></div>
                                <span className="text-sm font-bold text-slate-600 flex-grow">{d.label}</span>
                                <span className="text-xs font-bold text-slate-400">{d.val}%</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="shrink-0">
                    <DonutChart />
                </div>
             </div>
        </div>

        {/* Right Column: Mood History & Comparison */}
        <div className="space-y-6">
            
            {/* Daily Mood Graph */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                    Mood History
                    <span className="text-xs font-bold bg-violet-50 text-violet-600 px-2 py-1 rounded-lg">7 Days</span>
                </h3>
                <div className="h-32 w-full px-2">
                   <MoodLineChart />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-4 px-2">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                </div>
            </div>

            {/* Industry Comparison */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                 <h3 className="text-lg font-bold text-slate-800 mb-4">Culture vs Industry</h3>
                 <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-600">Your Company</span>
                            <span className="text-slate-900">64/100</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-900 w-[64%] rounded-full"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-400">Industry Avg</span>
                            <span className="text-slate-500">58/100</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-400 w-[58%] rounded-full"></div>
                        </div>
                    </div>
                 </div>
                 <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <ArrowUpRight size={14} /> Top 15% of Tech Sector
                 </div>
            </div>

            {/* AI Summary */}
            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-700 rounded-3xl p-6 text-white shadow-lg">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                    <Sparkles size={16} /> AI Summary
                </h3>
                <div className="space-y-4 text-sm opacity-90 leading-relaxed">
                    <p>
                        <strong>Observation:</strong> "Unpaid overtime" mentions are up 15% this week. Engineering seems to be feeling the heat.
                    </p>
                    <div className="h-px bg-white/20"></div>
                    <p>
                        <strong>Positive:</strong> Junior roles are loving the new mentorship program. "Learning" scores are trending up!
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;