import React from 'react';
import { Activity, TrendingUp, AlertCircle, Heart } from 'lucide-react';

const AiMetrics: React.FC = () => {
  return (
    <section id="insights" className="py-24 bg-indigo-900 text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-400 via-indigo-900 to-indigo-950"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-800 border border-indigo-700 text-indigo-200 text-xs font-semibold tracking-wide uppercase mb-4">
            For Employees & Leaders
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">AI-Powered Workplace Health Indicators</h2>
          <p className="text-indigo-200 max-w-2xl mx-auto text-lg">
            We don't just collect complaints. Our AI analyzes sentiment, urgency, and patterns to visualize the true health of your organization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Visual Mockup */}
            <div className="bg-indigo-950/50 backdrop-blur-sm border border-indigo-800 rounded-2xl p-6 md:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h4 className="text-lg font-semibold">Department Health Score</h4>
                        <p className="text-sm text-indigo-400">Sales & Marketing • Last 30 Days</p>
                    </div>
                    <div className="text-3xl font-bold text-emerald-400">84<span className="text-base text-indigo-400 font-normal">/100</span></div>
                </div>

                {/* Bars */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="flex items-center gap-2"><Heart size={14} className="text-rose-400"/> Psychological Safety</span>
                            <span className="font-mono text-emerald-400">High</span>
                        </div>
                        <div className="h-2 bg-indigo-900 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[85%] rounded-full"></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="flex items-center gap-2"><Activity size={14} className="text-amber-400"/> Work-Life Balance</span>
                            <span className="font-mono text-amber-400">At Risk</span>
                        </div>
                        <div className="h-2 bg-indigo-900 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 w-[55%] rounded-full"></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="flex items-center gap-2"><TrendingUp size={14} className="text-blue-400"/> Career Growth</span>
                            <span className="font-mono text-blue-400">Stable</span>
                        </div>
                        <div className="h-2 bg-indigo-900 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 w-[72%] rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-indigo-800/50 flex items-start gap-3">
                    <AlertCircle className="text-indigo-400 shrink-0 w-5 h-5" />
                    <p className="text-xs text-indigo-300 leading-relaxed">
                        <strong className="text-indigo-100">AI Insight:</strong> While safety is high, mentions of "burnout" and "overtime" have increased by 15% this week in the Sales channel.
                    </p>
                </div>
            </div>

            {/* Right Column: Text Features */}
            <div className="space-y-8">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-800 flex items-center justify-center shrink-0">
                        <TrendingUp className="text-indigo-300 w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Data-Driven Leverage</h3>
                        <p className="text-indigo-200">
                            Subjective complaints are easy to ignore. Aggregated data charts are undeniable. Use these insights to negotiate for better conditions.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-800 flex items-center justify-center shrink-0">
                        <Activity className="text-indigo-300 w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Real-Time Pulse</h3>
                        <p className="text-indigo-200">
                            See how your company's morale shifts day-to-day. Compare your team's happiness against industry benchmarks.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AiMetrics;