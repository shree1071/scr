import React, { useState, useEffect } from 'react';
import { Lightbulb, Heart, Brain, Zap, Clock, Star, TrendingUp, RefreshCw } from 'lucide-react';

interface WellnessTip {
  title: string;
  description: string;
  category: 'breathing' | 'mindfulness' | 'movement' | 'social' | 'productivity';
  timeRequired: string;
  difficulty: 'easy' | 'medium' | 'challenging';
}

interface WellnessTipsResponse {
  tips: WellnessTip[];
  moodInsight: string;
  recommendedAction: string;
}

interface WellnessTipsProps {
  companyId: string;
}

const WellnessTips: React.FC<WellnessTipsProps> = ({ companyId }) => {
  const [tips, setTips] = useState<WellnessTipsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState(3);
  const [stressLevel, setStressLevel] = useState(3);
  const [workContext, setWorkContext] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

  const categoryIcons = {
    breathing: { icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50' },
    mindfulness: { icon: Heart, color: 'text-purple-600', bg: 'bg-purple-50' },
    movement: { icon: Zap, color: 'text-green-600', bg: 'bg-green-50' },
    social: { icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    productivity: { icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' }
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    challenging: 'bg-red-100 text-red-700'
  };

  const availablePreferences = [
    'Quick exercises', 'Meditation', 'Social activities', 
    'Productivity tips', 'Stress management', 'Work-life balance'
  ];

  useEffect(() => {
    generateTips();
  }, []);

  const generateTips = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/wellness-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          stressLevel,
          workContext,
          preferences
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTips(data);
      }
    } catch (error) {
      console.error('Failed to generate tips:', error);
    }
    setLoading(false);
  };

  const togglePreference = (pref: string) => {
    setPreferences(prev => 
      prev.includes(pref) 
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="text-emerald-600" size={24} />
              Personalized Wellness Tips
            </h3>
            <p className="text-slate-600 mt-1">AI-powered recommendations for your wellbeing</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            {showForm ? 'Hide' : 'Customize'} Tips
          </button>
        </div>
      </div>

      {/* Customization Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-4">Personalize Your Tips</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Mood (1-5)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>😢 Low</span>
                <span>😄 High</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Stress Level (1-5)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>😌 Low</span>
                <span>😰 High</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Work Context
            </label>
            <textarea
              value={workContext}
              onChange={(e) => setWorkContext(e.target.value)}
              placeholder="e.g., Working from home, busy office environment, high-pressure project..."
              className="w-full p-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={2}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Preferences
            </label>
            <div className="flex flex-wrap gap-2">
              {availablePreferences.map(pref => (
                <button
                  key={pref}
                  onClick={() => togglePreference(pref)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    preferences.includes(pref)
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateTips}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Generating Tips...
              </>
            ) : (
              <>
                <Lightbulb size={18} />
                Generate Personalized Tips
              </>
            )}
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
          <RefreshCw size={32} className="animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600">Generating personalized wellness tips...</p>
        </div>
      )}

      {/* Tips Display */}
      {tips && !loading && (
        <>
          {/* Mood Insight */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start gap-3">
              <Brain className="text-blue-600 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Insight</h4>
                <p className="text-slate-700">{tips.moodInsight}</p>
                <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">
                    💡 Recommended Action: {tips.recommendedAction}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.tips.map((tip, index) => {
              const category = categoryIcons[tip.category];
              return (
                <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 ${category.bg} rounded-lg flex items-center justify-center`}>
                      <category.icon className={category.color} size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{tip.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[tip.difficulty]}`}>
                          {tip.difficulty}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={12} />
                          {tip.timeRequired}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{tip.description}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default WellnessTips;
