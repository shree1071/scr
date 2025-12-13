import React, { useState } from 'react';
import { Search, Building2, Plus, Sparkles } from 'lucide-react';
import { Company } from '../../types';

interface CompanyOnboardingProps {
  onComplete: (company: Company) => void;
}

const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'Google', logo: 'G', verified: true },
  { id: '2', name: 'Microsoft', logo: 'M', verified: true },
  { id: '3', name: 'TCS', logo: 'T', verified: true },
  { id: '4', name: 'Infosys', logo: 'I', verified: true },
  { id: '5', name: 'Amazon', logo: 'A', verified: true },
  { id: '6', name: 'Meta', logo: 'M', verified: true },
  { id: '7', name: 'Wipro', logo: 'W', verified: true },
  { id: '8', name: 'Netflix', logo: 'N', verified: true },
  { id: '9', name: 'HCLTech', logo: 'H', verified: true },
];

const CompanyOnboarding: React.FC<CompanyOnboardingProps> = ({ onComplete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const filteredCompanies = MOCK_COMPANIES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDF4FF] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>

      <div className="max-w-xl w-full bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white p-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-violet-200 to-pink-200 rounded-3xl mb-6 shadow-sm transform -rotate-3 hover:rotate-3 transition-transform duration-300">
            <Building2 size={36} className="text-violet-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Find Your Workplace</h2>
          <p className="text-slate-500 text-lg">
            Select your company to access analytics & community. <br/>
            <span className="text-violet-600 font-semibold flex items-center justify-center gap-1 mt-1">
              <Sparkles size={16} /> Anonymous & Verified
            </span>
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl opacity-20 group-focus-within:opacity-50 transition duration-500 blur"></div>
          <div className="relative bg-white rounded-xl flex items-center">
            <Search className="absolute left-4 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search company (e.g. TCS, Google)..."
              className="w-full pl-12 pr-4 py-4 bg-transparent rounded-xl focus:outline-none text-slate-800 font-medium placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar p-2">
          {filteredCompanies.map(company => (
            <button
              key={company.id}
              onClick={() => setSelectedCompany(company)}
              className={`flex items-center p-4 rounded-2xl transition-all duration-300 border-2 text-left group ${
                selectedCompany?.id === company.id 
                  ? 'bg-violet-50 border-violet-500 shadow-md scale-[1.02]' 
                  : 'bg-white border-slate-100 hover:border-violet-200 hover:shadow-sm hover:scale-[1.01]'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl mr-4 shadow-sm transition-colors ${
                 selectedCompany?.id === company.id 
                  ? 'bg-violet-500 text-white' 
                  : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-violet-500'
              }`}>
                {company.logo}
              </div>
              <div>
                <span className="font-bold text-slate-800 block">{company.name}</span>
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  Verified
                </span>
              </div>
            </button>
          ))}
          
          {filteredCompanies.length === 0 && (
             <button className="col-span-full flex items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-violet-400 hover:text-violet-500 transition-colors">
                <Plus size={24} className="mr-2" />
                <span className="font-medium">Add "{searchTerm}" to our database</span>
             </button>
          )}
        </div>

        {/* Action Button */}
        <button
          disabled={!selectedCompany}
          onClick={() => selectedCompany && onComplete(selectedCompany)}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center shadow-lg transition-all duration-300 ${
            selectedCompany 
              ? 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02] cursor-pointer' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Enter Dashboard 🚀
        </button>
      </div>
    </div>
  );
};

export default CompanyOnboarding;