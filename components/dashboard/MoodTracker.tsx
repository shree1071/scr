import React, { useState, useEffect } from 'react';
import { Heart, Brain, TrendingUp, Calendar, Smile, Frown, Meh, Zap, Sun, Cloud, CloudRain } from 'lucide-react';

interface MoodEntry {
  id: string;
  mood: number; // 1-5 scale
  emoji: string;
  note: string;
  timestamp: Date;
  sentiment?: {
    score: number;
    label: string;
    insights: string[];
  };
}

interface MoodTrackerProps {
  companyId: string;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ companyId }) => {
  const [selectedMood, setSelectedMood] = useState<number>(0);
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const moods = [
    { value: 1, emoji: '😢', label: 'Struggling', color: 'text-red-500' },
    { value: 2, emoji: '😔', label: 'Down', color: 'text-orange-500' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
    { value: 4, emoji: '😊', label: 'Good', color: 'text-green-500' },
    { value: 5, emoji: '😄', label: 'Thriving', color: 'text-emerald-500' }
  ];

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem(`mood-entries-${companyId}`);
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      setEntries(parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })));
    }
  }, [companyId]);

  const analyzeSentiment = async (text: string, moodValue: number) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, moodValue })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.sentiment;
      }
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
    }
    setIsAnalyzing(false);
    return null;
  };

  const handleSubmit = async () => {
    if (selectedMood === 0) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      emoji: moods.find(m => m.value === selectedMood)?.emoji || '😐',
      note,
      timestamp: new Date()
    };

    // Analyze sentiment if there's a note
    if (note.trim()) {
      const sentiment = await analyzeSentiment(note, selectedMood);
      if (sentiment) {
        newEntry.sentiment = sentiment;
      }
    }

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem(`mood-entries-${companyId}`, JSON.stringify(updatedEntries));
    
    // Reset form
    setSelectedMood(0);
    setNote('');
    setIsAnalyzing(false);
  };

  const getMoodTrend = () => {
    if (entries.length < 2) return null;
    const recent = entries.slice(0, 7);
    const avg = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;
    const prevAvg = entries.slice(7, 14).reduce((sum, entry) => sum + entry.mood, 0) / Math.min(entries.length - 7, 7);
    return avg - prevAvg;
  };

  const getWeeklyStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekEntries = entries.filter(entry => entry.timestamp > weekAgo);
    
    if (weekEntries.length === 0) return null;
    
    const avg = weekEntries.reduce((sum, entry) => sum + entry.mood, 0) / weekEntries.length;
    const mostCommon = moods.find(mood => 
      weekEntries.filter(e => e.mood === mood.value).length > 0
    )?.value || 3;

    return { avg, mostCommon, count: weekEntries.length };
  };

  const stats = getWeeklyStats();
  const trend = getMoodTrend();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Brain className="text-violet-600" size={24} />
              Mood Tracker
            </h3>
            <p className="text-slate-600 mt-1">Track your emotional wellbeing daily</p>
          </div>
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="px-4 py-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            {showInsights ? 'Hide' : 'Show'} Insights
          </button>
        </div>
      </div>

      {/* Weekly Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Weekly Average</p>
                <p className="text-lg font-bold text-slate-900">{stats.avg.toFixed(1)}/5</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Calendar className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Check-ins</p>
                <p className="text-lg font-bold text-slate-900">{stats.count}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-lg">
                {moods.find(m => m.value === stats.mostCommon)?.emoji}
              </div>
              <div>
                <p className="text-sm text-slate-500">Most Common</p>
                <p className="text-lg font-bold text-slate-900">
                  {moods.find(m => m.value === stats.mostCommon)?.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mood Input */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-4">How are you feeling today?</h4>
        
        <div className="flex justify-around mb-6">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                selectedMood === mood.value 
                  ? 'bg-violet-50 border-2 border-violet-300 scale-110' 
                  : 'hover:bg-slate-50 border-2 border-transparent'
              }`}
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className={`text-xs font-medium ${mood.color}`}>{mood.label}</span>
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional: Add a note about your day..."
          className="w-full p-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
          rows={3}
        />

        <button
          onClick={handleSubmit}
          disabled={selectedMood === 0 || isAnalyzing}
          className="mt-4 w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? 'Analyzing...' : 'Save Check-in'}
        </button>
      </div>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-4">Recent Check-ins</h4>
          <div className="space-y-3">
            {entries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <span className="text-2xl">{entry.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900">
                      {moods.find(m => m.value === entry.mood)?.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      {entry.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-sm text-slate-600">{entry.note}</p>
                  )}
                  {entry.sentiment && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <strong>Sentiment:</strong> {entry.sentiment.label} (Score: {entry.sentiment.score})
                      </p>
                      {entry.sentiment.insights.length > 0 && (
                        <ul className="mt-1 text-xs text-blue-600 list-disc list-inside">
                          {entry.sentiment.insights.map((insight, i) => (
                            <li key={i}>{insight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
