import React from 'react';

const CompanyLogos: React.FC = () => {
  const companies = [
    { name: "Google", color: "text-slate-600" },
    { name: "Amazon", color: "text-slate-600" },
    { name: "Microsoft", color: "text-slate-600" },
    { name: "Meta", color: "text-slate-600" },
    { name: "Infosys", color: "text-slate-500" },
    { name: "TCS", color: "text-slate-500" },
    { name: "Accenture", color: "text-slate-500" },
    { name: "Flipkart", color: "text-slate-500" },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-8">
          Trusted voices from employees at top companies
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center opacity-70 hover:opacity-100 transition-opacity duration-300">
            {companies.map((company) => (
                <div key={company.name} className="flex justify-center">
                    <span className={`text-xl md:text-2xl font-bold ${company.color}`}>{company.name}</span>
                </div>
            ))}
        </div>
        <p className="mt-8 text-xs text-slate-400">
          *Logos are property of their respective owners. ClearVoice is an independent platform.
        </p>
      </div>
    </section>
  );
};

export default CompanyLogos;