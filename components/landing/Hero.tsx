import React from 'react';
import { Lock, Heart, MessageCircle, Shield } from 'lucide-react';
import { SignUpButton } from '@clerk/clerk-react';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Hero: React.FC = () => {
  return (
    <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
      {/* Playful Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-purple-700 text-sm font-bold mb-8 shadow-sm animate-float">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Your safe space for workplace feelings 💜
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
          Speak Freely. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
            Be Heard. Be Happy.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl leading-relaxed font-medium">
          The friendly, anonymous place to share your work life. 
          Verified employees, real support, and <span className="text-indigo-600 font-bold decoration-wavy underline decoration-indigo-300">zero risk</span>.
        </p>

        {/* Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-6 relative">
          
          {/* Decorative floating icons */}
          <div className="absolute -left-12 top-0 animate-bounce_subtle hidden md:block text-pink-400 transform -rotate-12">
            <Heart size={32} fill="currentColor" className="opacity-80"/>
          </div>
          <div className="absolute -right-12 bottom-0 animate-bounce_subtle hidden md:block text-blue-400 transform rotate-12" style={{animationDelay: '1s'}}>
            <MessageCircle size={32} fill="currentColor" className="opacity-80"/>
          </div>

          <SignUpButton mode="modal">
            <button className="group relative flex items-center justify-center w-full px-8 py-5 bg-slate-900 text-white rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center bg-white rounded-xl px-6 py-3 w-[calc(100%-8px)] h-[calc(100%-8px)] group-hover:bg-transparent group-hover:text-white transition-colors">
                   <div className="group-hover:hidden"><GoogleIcon /></div>
                   <span className="text-lg font-bold text-slate-800 group-hover:text-white mx-auto">Continue with Google</span>
              </div>
            </button>
          </SignUpButton>
          
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>100% Anonymous & Secure</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;