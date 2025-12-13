import React, { useState } from 'react';
import { CompanyRanking } from '../../types';
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, DollarSign, Heart, Users, ArrowUp, Star, Flame } from 'lucide-react';

const RANKINGS: CompanyRanking[] = [
  { 
    id: '1', rank: 1, name: 'Google', logo: 'G', score: 94, trend: 'up', tags: ['Best Pay', 'Innovation'],
    categoryScores: { culture: 88, compensation: 98, leadership: 90 }
  },
  { 
    id: '2', rank: 2, name: 'Microsoft', logo: 'M', score: 91, trend: 'up', tags: ['Work-Life Balance'],
    categoryScores: { culture: 95, compensation: 90, leadership: 88 }
  },
  { 
    id: '3', rank: 3, name: 'Nvidia', logo: 'N', score: 89, trend: 'up', tags: ['Growth'],
    categoryScores: { culture: 85, compensation: 96, leadership: 92 }
  },
  { 
    id: '4', rank: 4, name: 'HubSpot', logo: 'H', score: 87, trend: 'stable', tags: ['Culture'],
    categoryScores: { culture: 99, compensation: 80, leadership: 95 }
  },
  { 
    id: '5', rank: 5, name: 'Salesforce', logo: 'S', score: 85, trend: 'down', tags: ['Sales Driven'],
    categoryScores: { culture: 88, compensation: 92, leadership: 80 }
  },
  { 
    id: '6', rank: 6, name: 'Adobe', logo: 'A', score: 82, trend: 'stable', tags: ['Creative'],
    categoryScores: { culture: 90, compensation: 85, leadership: 82 }
  },
  { 
    id: '7', rank: 7, name: 'Netflix', logo: 'N', score: 79, trend: 'down', tags: ['High Performance'],
    categoryScores: { culture: 70, compensation: 99, leadership: 75 }
  },
];

type Category = 'overall' | 'compensation' | 'culture' | 'leadership';

const CompanyRankings: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('overall');

  // Sort function based on category
  const getSortedRankings = () => {
    return [...RANKINGS].sort((a, b) => {
      if (activeCategory === 'overall') return b.score - a.score;
      return b.categoryScores[activeCategory] - a.categoryScores[activeCategory];
    });
  };

  const sortedData = getSortedRankings();
  const top3 = sortedData.slice(0, 3);
  const rest = sortedData.slice(3);

  const getScore = (company: CompanyRanking) => {
    if (activeCategory === 'overall') return company.score;
    return company.categoryScores[activeCategory];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-12">
      
      {/* Header Section */}
      <div className="text-center relative">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Company Leaderboard</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            See who's actually walking the talk. Rankings are updated daily based on verified employee sentiment.
        </p>
        
        {/* Category Toggles */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
            {[
                { id: 'overall', label: 'Overall Health', icon: Trophy },
                { id: 'compensation', label: 'Compensation', icon: DollarSign },
                { id: 'culture', label: 'Culture & Vibes', icon: Heart },
                { id: 'leadership', label: 'Leadership', icon: Users },
            ].map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as Category)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                        activeCategory === cat.id
                        ? 'bg-slate-900 text-white shadow-lg scale-105'
                        : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    <cat.icon size={16} />
                    {cat.label}
                </button>
            ))}
        </div>
      </div>

      {/* The Podium Section */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 px-4 min-h-[350px]">
        {/* Silver (Rank 2) */}
        <div className="order-2 md:order-1 w-full md:w-1/3 flex flex-col items-center">
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 w-full relative group hover:-translate-y-2 transition-transform duration-500">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white shadow-sm z-10">2</div>
                <div className="text-center pt-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center text-3xl font-bold text-slate-700 mb-3 shadow-inner">
                        {top3[1].logo}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{top3[1].name}</h3>
                    <div className="text-4xl font-extrabold text-slate-300 mt-2">{getScore(top3[1])}</div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Score</p>
                </div>
            </div>
            <div className="h-24 w-full bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-3xl mt-4 opacity-50 hidden md:block"></div>
        </div>

        {/* Gold (Rank 1) */}
        <div className="order-1 md:order-2 w-full md:w-1/3 flex flex-col items-center z-10">
            <div className="relative w-full">
                <Crown size={48} className="absolute -top-14 left-1/2 -translate-x-1/2 text-yellow-400 animate-bounce_subtle drop-shadow-lg" fill="currentColor" />
                <div className="bg-gradient-to-b from-yellow-50 to-white p-8 rounded-[2.5rem] shadow-2xl border-2 border-yellow-100 w-full text-center relative hover:-translate-y-2 transition-transform duration-500">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-yellow-400 text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-md z-10">1</div>
                    <div className="pt-6">
                        <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center text-4xl font-bold text-slate-800 mb-4 shadow-lg shadow-yellow-100">
                            {top3[0].logo}
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900">{top3[0].name}</h3>
                        <div className="flex justify-center gap-2 mt-2 mb-4">
                            {top3[0].tags.map(tag => (
                                <span key={tag} className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">{tag}</span>
                            ))}
                        </div>
                        <div className="text-5xl font-extrabold text-slate-900">{getScore(top3[0])}</div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Score</p>
                    </div>
                </div>
            </div>
            <div className="h-32 w-full bg-gradient-to-t from-yellow-100/50 to-slate-50 rounded-t-3xl mt-4 hidden md:block"></div>
        </div>

        {/* Bronze (Rank 3) */}
        <div className="order-3 md:order-3 w-full md:w-1/3 flex flex-col items-center">
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 w-full relative group hover:-translate-y-2 transition-transform duration-500">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white shadow-sm z-10">3</div>
                <div className="text-center pt-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center text-3xl font-bold text-slate-700 mb-3 shadow-inner">
                        {top3[2].logo}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{top3[2].name}</h3>
                    <div className="text-4xl font-extrabold text-slate-300 mt-2">{getScore(top3[2])}</div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Score</p>
                </div>
            </div>
            <div className="h-16 w-full bg-gradient-to-t from-orange-50 to-slate-50 rounded-t-3xl mt-4 opacity-50 hidden md:block"></div>
        </div>
      </div>

      {/* The Rest of the List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        {rest.map((company, index) => (
            <div key={company.id} className="grid grid-cols-12 gap-4 p-6 items-center border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group">
                
                {/* Rank */}
                <div className="col-span-2 md:col-span-1 text-center font-bold text-slate-400 text-lg">
                    #{index + 4}
                </div>

                {/* Company */}
                <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-600">
                        {company.logo}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900">{company.name}</div>
                        <div className="flex items-center gap-2">
                            {company.trend === 'up' && <div className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded"><Flame size={10} className="mr-1"/> Hot Streak</div>}
                        </div>
                    </div>
                </div>

                {/* Score Bar */}
                <div className="col-span-4 md:col-span-4 hidden md:flex flex-col justify-center">
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-400">Category Score</span>
                        <span className="text-slate-700">{getScore(company)}/100</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-800 rounded-full" style={{ width: `${getScore(company)}%` }}></div>
                    </div>
                </div>

                {/* Action */}
                <div className="col-span-4 md:col-span-2 flex justify-end">
                    <button className="text-sm font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-full transition-colors">
                        View Profile
                    </button>
                </div>
            </div>
        ))}
        
        <div className="p-4 bg-slate-50 text-center">
            <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center gap-1 mx-auto">
                View Top 100 <ArrowUp className="rotate-90" size={14} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyRankings;