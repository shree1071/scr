import React from 'react';
import { MessageSquare, ThumbsUp, BarChart2 } from 'lucide-react';

const CommunityPreview: React.FC = () => {
  return (
    <section id="community" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Real conversations, real impact.</h2>
            <p className="text-lg text-slate-600">
              See what others are dealing with. Our moderated spaces ensure support, not toxicity.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            142 verified employees online now
          </div>
        </div>

        <div className="relative">
          {/* Blur Overlay for non-logged in users */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-50 to-transparent z-20 pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-90">
            {/* Post Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                <div>
                  <div className="h-4 w-24 bg-slate-200 rounded mb-1"></div>
                  <div className="h-3 w-16 bg-slate-100 rounded"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                 <p className="text-slate-800 font-medium">Does anyone else feel completely burned out by the new sprint expectations?</p>
                 <p className="text-slate-500 text-sm">I've been working 12 hour days for 3 weeks straight...</p>
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-sm border-t border-slate-100 pt-4">
                <span className="flex items-center gap-1"><ThumbsUp size={16}/> 24</span>
                <span className="flex items-center gap-1"><MessageSquare size={16}/> 8 replies</span>
              </div>
            </div>

            {/* Poll Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-bl-lg text-xs font-bold">LIVE POLL</div>
               <h3 className="font-semibold text-slate-900 mb-4 mt-2">Do you feel supported by your direct manager?</h3>
               <div className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="text-sm text-slate-700">Yes, fully</span>
                    <span className="text-xs text-slate-400">12%</span>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 flex justify-between items-center ring-1 ring-indigo-200">
                    <span className="text-sm text-indigo-900 font-medium">Somewhat</span>
                    <span className="text-xs text-indigo-600 font-bold">54%</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="text-sm text-slate-700">Not at all</span>
                    <span className="text-xs text-slate-400">34%</span>
                  </div>
               </div>
               <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                 <BarChart2 size={14} /> 458 votes collected
               </div>
            </div>

             {/* Post Card 2 */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 filter blur-[2px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                <div>
                  <div className="h-4 w-32 bg-slate-200 rounded mb-1"></div>
                  <div className="h-3 w-20 bg-slate-100 rounded"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                 <div className="h-4 w-full bg-slate-200 rounded"></div>
                 <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                 <div className="h-4 w-4/6 bg-slate-200 rounded"></div>
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-sm border-t border-slate-100 pt-4">
                <span className="flex items-center gap-1"><ThumbsUp size={16}/> --</span>
                <span className="flex items-center gap-1"><MessageSquare size={16}/> --</span>
              </div>
            </div>

          </div>
          
          <div className="flex justify-center mt-8 relative z-30">
            <button className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-medium py-2 px-6 rounded-full shadow-sm transition-colors text-sm">
              Sign in to see full discussion
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityPreview;