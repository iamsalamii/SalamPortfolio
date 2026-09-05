import React from 'react';
import { useData } from '../../context/DataContext';
import { Briefcase, Building2, MapPin } from 'lucide-react';

export const ExperienceTimeline: React.FC = () => {
  const { data, activeLanguage } = useData();
  const experiences = (data.experiences || []).sort((a, b) => a.order - b.order);

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-8 border-t border-zinc-800 font-mono">
      
      {/* Section Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 text-red-500 text-xs font-bold tracking-widest uppercase mb-3">
          <span className="w-2.5 h-2.5 bg-red-500 inline-block" />
          <span>// 04. TRACK RECORD //</span>
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter">
          {activeLanguage === 'fr' ? 'PARCOURS EN ENTREPRISE' : 'CAREER & EXPERIENCE'}
        </h2>
      </div>

      {/* Brutalist Timeline Cards List */}
      <div className="space-y-6">
        {experiences.map((exp, idx) => (
          <div 
            key={exp.id || idx} 
            className={`p-6 sm:p-8 bg-[#0d0e14] border transition-all duration-200 group ${
              exp.isCurrent 
                ? 'border-red-500/80 shadow-[6px_6px_0px_0px_#ef4444]' 
                : 'border-zinc-800 hover:border-red-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[5px_5px_0px_0px_#ef4444]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-zinc-800/80">
              
              {/* Role & Company */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs text-red-500 font-bold tracking-widest uppercase">
                    EXP_0{idx + 1} //
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight group-hover:text-red-400 transition-colors">
                    {exp.role}
                  </h3>
                  {exp.isCurrent && (
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-red-600 text-white font-black uppercase tracking-wider">
                      {activeLanguage === 'fr' ? 'POSTE ACTUEL' : 'ACTIVE'}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5 font-bold text-zinc-200">
                    <Building2 className="w-3.5 h-3.5 text-red-500" />
                    <span>{exp.company}</span>
                  </span>
                  {exp.location && (
                    <>
                      <span className="text-zinc-600">•</span>
                      <span className="flex items-center gap-1 text-zinc-400">
                        <MapPin className="w-3.5 h-3.5 text-red-500/70" />
                        <span>{exp.location}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Period Pill */}
              <div className="shrink-0 font-mono text-xs font-bold text-red-400 px-3 py-1.5 bg-zinc-950 border border-zinc-800">
                {exp.startDate} → {exp.isCurrent ? (activeLanguage === 'fr' ? 'PRÉSENT' : 'PRESENT') : exp.endDate}
              </div>

            </div>

            {/* Description & Tasks */}
            <div className="pt-4 space-y-3 text-sm text-zinc-300 leading-relaxed">
              {exp.description && (
                <p className="text-zinc-300 font-normal">
                  {exp.description}
                </p>
              )}

              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">
                    // MISSIONS PRINCIPALES :
                  </span>
                  <ul className="space-y-1.5">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="text-xs text-zinc-400 flex items-start gap-2.5">
                        <span className="text-red-500 font-bold shrink-0">[&gt;]</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
