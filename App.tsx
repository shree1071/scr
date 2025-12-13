import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/landing/Hero';
import TrustIndicators from './components/landing/TrustIndicators';
import HowItWorks from './components/landing/HowItWorks';
import CompanyLogos from './components/landing/CompanyLogos';
import CommunityPreview from './components/landing/CommunityPreview';
import AiMetrics from './components/landing/AiMetrics';
import PrivacySection from './components/landing/PrivacySection';
import Footer from './components/Footer';
import CompanyOnboarding from './components/auth/CompanyOnboarding';
import DashboardLayout from './components/dashboard/DashboardLayout';
import { ArrowRight } from 'lucide-react';
import { AppView, Company } from './types';

// Reusing the Google Button logic for the final CTA
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const LandingPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
    <Navbar onLogin={onLogin} />
    
    <main className="flex-grow">
      <Hero onLogin={onLogin} />
      <TrustIndicators />
      <HowItWorks />
      <CompanyLogos />
      <CommunityPreview />
      <AiMetrics />
      <PrivacySection />

      {/* Final CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Ready to speak freely?
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals improving their workplace culture today.
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={onLogin}
              className="flex items-center justify-center px-8 py-4 bg-white border border-slate-200 rounded-full shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <GoogleIcon />
              <span className="text-lg font-medium text-slate-700 group-hover:text-slate-900">
                Continue with Google
              </span>
              <ArrowRight className="w-5 h-5 ml-2 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>
            
            <p className="text-sm text-slate-500 font-medium mt-4">
              No ads. No tracking. No retaliation.
            </p>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [userCompany, setUserCompany] = useState<Company | null>(null);

  const handleLogin = () => {
    setCurrentView('onboarding');
  };

  const handleCompanySelection = (company: Company) => {
    setUserCompany(company);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUserCompany(null);
    setCurrentView('landing');
  };

  if (currentView === 'onboarding') {
    return <CompanyOnboarding onComplete={handleCompanySelection} />;
  }

  if (currentView === 'dashboard' && userCompany) {
    return <DashboardLayout company={userCompany} onLogout={handleLogout} />;
  }

  return <LandingPage onLogin={handleLogin} />;
};

export default App;