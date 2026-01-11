import React, { useState } from 'react';
import { Company, DashboardView } from '../../types';
import { Shield, MessageSquare, Users, BarChart2, Settings, LogOut, Menu, X, Heart, Trophy, Activity, ClipboardCheck, Brain, UserCircle } from 'lucide-react';
import AiChat from './AiChat';


import AnalyticsDashboard from './InsightsDashboard'; 
import CompanyRankings from './CompanyRankings';
import UserAccount from './UserAccount';
import MoodTracker from './MoodTracker';
import PeerSupport from './PeerSupport';
import CommunityFeed from './CommunityFeed';

interface DashboardLayoutProps {
  company: Company;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ company, onLogout }) => {
  const [activeView, setActiveView] = useState<DashboardView>('checkin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'checkin', label: 'Check-in', icon: ClipboardCheck },
    { id: 'mood', label: 'Mood', icon: Brain },
    { id: 'tribe', label: 'Tribe', icon: Users },
    { id: 'support', label: 'Support', icon: UserCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'rankings', label: 'Leaderboard', icon: Trophy },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'checkin': return <AiChat />;
      case 'mood': return <MoodTracker />;
      case 'tribe': return <CommunityFeed companyId={company.id} />;
      case 'support': return <PeerSupport companyId={company.id} />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'rankings': return <CompanyRankings />;
      case 'settings': return <UserAccount companyName={company.name} onLogout={onLogout} />;
      default: return <AiChat />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
        
        {/* Top Navigation Bar (Glassmorphism) */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                
                {/* Logo & Company */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={onLogout}>
                        <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                            <Heart size={18} fill="currentColor" />
                        </div>
                        <span className="font-extrabold text-slate-900 text-xl tracking-tight hidden md:block group-hover:text-indigo-600 transition-colors">ClearVoice</span>
                    </div>

                    <div className="hidden md:flex items-center gap-3 bg-slate-100/50 py-1.5 px-3 rounded-full border border-slate-200">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm">
                            {company.logo}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{company.name}</span>
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    </div>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/60">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id as DashboardView)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                                    isActive 
                                    ? 'bg-white text-slate-900 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                }`}
                            >
                                <Icon size={18} className={isActive ? 'text-violet-600' : 'text-slate-400'} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <button 
                         onClick={() => setActiveView('settings')}
                         className={`p-2.5 rounded-full transition-colors ${activeView === 'settings' ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-100 text-slate-400'}`}
                    >
                        <Settings size={20} />
                    </button>
                    <button 
                        onClick={onLogout}
                        className="p-2.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-600">
                        {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                    </button>
                </div>
            </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
             <div className="md:hidden fixed inset-0 z-40 bg-white pt-24 px-6 animate-fade-in">
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-slate-700 shadow-sm">
                            {company.logo}
                        </div>
                        <span className="font-bold text-slate-900">{company.name}</span>
                    </div>

                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveView(item.id as DashboardView); setMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold border transition-all ${
                            activeView === item.id
                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                                : 'bg-white border-slate-200 text-slate-500'
                            }`}
                        >
                            <item.icon size={22} />
                            {item.label}
                        </button>
                    ))}
                    
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold border bg-red-50 border-red-100 text-red-600 mt-4"
                    >
                        <LogOut size={22} />
                        Sign Out
                    </button>
                 </div>
             </div>
        )}

        {/* Main Content Area */}
        <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full animate-slide-up print:p-0">
            {renderContent()}
        </main>
    </div>
  );
};

export default DashboardLayout;