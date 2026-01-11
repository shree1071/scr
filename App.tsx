import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
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
import TypeSelection from './components/auth/TypeSelection';
import BMSITSurvey from './components/bmsit/BMSITSurvey';
import BMSITResults from './components/bmsit/BMSITResults';
import DashboardLayout from './components/dashboard/DashboardLayout';
import { AppView, Company, UserType } from './types';

const LandingPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
    <Navbar />
    
    <main className="flex-grow">
      <Hero />
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
  const [userType, setUserType] = useState<UserType | null>(null);
  const { isSignedIn, isLoaded } = useUser();

  // Redirect to type selection when user signs in
  useEffect(() => {
    if (isLoaded && isSignedIn && currentView === 'landing') {
      setCurrentView('type-selection');
    }
  }, [isSignedIn, isLoaded, currentView]);

  const handleTypeSelection = (type: UserType) => {
    setUserType(type);
    if (type === 'company') {
      setCurrentView('onboarding');
    } else if (type === 'bmsit') {
      setCurrentView('bmsit-survey');
    }
  };

  const handleCompanySelection = (company: Company) => {
    setUserCompany(company);
    setCurrentView('dashboard');
  };

  const handleBMSITSurveyComplete = () => {
    setCurrentView('bmsit-results');
  };

  const handleBMSITBack = () => {
    setCurrentView('bmsit-survey');
  };

  const handleLogout = () => {
    setUserCompany(null);
    setUserType(null);
    setCurrentView('landing');
  };

  // Show loading state while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (currentView === 'type-selection') {
    return <TypeSelection onSelect={handleTypeSelection} />;
  }

  if (currentView === 'onboarding') {
    return <CompanyOnboarding onComplete={handleCompanySelection} />;
  }

  if (currentView === 'bmsit-survey') {
    return <BMSITSurvey onComplete={handleBMSITSurveyComplete} />;
  }

  if (currentView === 'bmsit-results') {
    return <BMSITResults onBack={handleBMSITBack} />;
  }

  if (currentView === 'dashboard' && userCompany) {
    return <DashboardLayout company={userCompany} onLogout={handleLogout} />;
  }

  return <LandingPage />;
};

export default App;