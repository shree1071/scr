import React from 'react';
import { Building2, GraduationCap, ArrowRight } from 'lucide-react';
import { UserType } from '../../types';

interface TypeSelectionProps {
  onSelect: (type: UserType) => void;
}

const TypeSelection: React.FC<TypeSelectionProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-[#FDF4FF] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Choose Your Path</h2>
          <p className="text-slate-600 text-lg">Select how you'd like to use ClearVoice</p>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Company Option */}
          <button
            onClick={() => onSelect('company')}
            className="group relative bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white p-8 hover:scale-[1.02] transition-all duration-300 text-left"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-violet-200 to-pink-200 rounded-3xl mb-6 shadow-sm transform group-hover:rotate-3 transition-transform duration-300">
              <Building2 size={32} className="text-violet-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Company</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Join your company's anonymous feedback platform. Share experiences, view analytics, and contribute to workplace culture improvements.
            </p>
            <div className="flex items-center text-violet-600 font-semibold group-hover:translate-x-2 transition-transform">
              Continue <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </button>

          {/* BMSIT Option */}
          <button
            onClick={() => onSelect('bmsit')}
            className="group relative bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white p-8 hover:scale-[1.02] transition-all duration-300 text-left"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-200 to-cyan-200 rounded-3xl mb-6 shadow-sm transform group-hover:rotate-3 transition-transform duration-300">
              <GraduationCap size={32} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">BMSIT</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Complete the BMSIT lecturer exit survey. Share your feedback about teaching experience, college culture, and institutional support.
            </p>
            <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
              Start Survey <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypeSelection;

