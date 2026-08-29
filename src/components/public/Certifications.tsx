import React from 'react';
import { useData } from '../../context/DataContext';
import { Award, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const Certifications: React.FC = () => {
  const { data, activeLanguage } = useData();
  const certs = (data.certifications || []).filter(c => c.isActive).sort((a, b) => a.order - b.order);

  if (certs.length === 0) return null;

  return (
    <section id="certifications" className="py-20 sm:py-28 max-w-5xl mx-auto px-6 sm:px-8 border-t border-slate-200/70 dark:border-slate-800/70">
      
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">
          05 / {activeLanguage === 'fr' ? 'Titres' : 'Credentials'}
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
          {activeLanguage === 'fr' ? 'Attestations & Certifications' : 'Industry Accreditations'}
        </h2>
      </div>

      {/* Compact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {certs.map((cert) => (
          <div
            key={cert.id}
            className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {cert.issuer}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {cert.issueDate || '2024'}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-950 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
                  {cert.name}
                </h3>
                {cert.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cert.description}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Vérifié</span>
              </span>

              <a
                href={cert.credentialUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-slate-900 dark:text-white hover:opacity-75 transition-opacity"
              >
                <span>Consulter</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
