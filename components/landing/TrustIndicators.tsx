import React from 'react';
import { Fingerprint, CheckCircle2, ShieldCheck } from 'lucide-react';

const TrustIndicators: React.FC = () => {
  return (
    <section className="py-12 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left p-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
              <Fingerprint className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Anonymous by Design</h3>
            <p className="text-slate-600 leading-relaxed">
              Your name, email, and identity are stripped at the source. We use zero-knowledge proofs for verification.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left p-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Employees Only</h3>
            <p className="text-slate-600 leading-relaxed">
              Google Sign-In ensures every voice is real. No bots, no fake reviews, just actual colleagues.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left p-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">AI-Protected Conversations</h3>
            <p className="text-slate-600 leading-relaxed">
              Harmful content and PII are filtered automatically by our AI before it ever reaches the platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;