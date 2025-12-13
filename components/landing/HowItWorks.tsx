import React from 'react';
import { UserCheck, MessageSquarePlus, LineChart } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How ClearVoice Works</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A simple process designed to protect your identity while amplifying your voice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-8xl text-indigo-900 -mr-4 -mt-4 select-none">1</div>
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              <UserCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Sign in with Google</h3>
            <p className="text-slate-600">
              We use Google only to verify you work at a specific company. No public profile is created, and we never post on your behalf.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-8xl text-indigo-900 -mr-4 -mt-4 select-none">2</div>
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              <MessageSquarePlus size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Share via Chat or Post</h3>
            <p className="text-slate-600">
              Answer daily polls, post reviews, or chat with our AI to document incidents. Your inputs are encrypted and anonymized instantly.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-8xl text-indigo-900 -mr-4 -mt-4 select-none">3</div>
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              <LineChart size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Creates Insights</h3>
            <p className="text-slate-600">
              Your data contributes to company-wide health scores. We aggregate feedback to show management where culture needs fixing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;