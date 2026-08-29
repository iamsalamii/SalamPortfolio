import React from 'react';
import { useData } from '../../context/DataContext';

export const ExperienceTimeline: React.FC = () => {
  const { data, activeLanguage } = useData();
  const experiences = (data.experiences || []).sort((a, b) => a.order - b.order);

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-20 sm:py-28 max-w-5xl mx-auto px-6 sm:px-8 border-t border-slate-200">
      
      {/* Section Header */}
      <div className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold mb-2">
          02 / {activeLanguage === 'fr' ? 'Parcours' : 'Experience'}
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
          {activeLanguage === 'fr' ? 'Expérience Professionnelle' : 'Work Experience'}
        </h2>
      </div>

      {/* Editorial Timeline List */}
      <div className="space-y-12">
        {experiences.map((exp) => (
          <div key={exp.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-10 border-b border-slate-200 last:border-0">
            
            {/* Left: Period & Status */}
            <div className="md:col-span-4 space-y-1">
              <span className="text-xs font-mono text-slate-500 block">
                {exp.startDate} — {exp.isCurrent ? (activeLanguage === 'fr' ? 'Présent' : 'Present') : exp.endDate}
              </span>
              <p className="text-sm font-bold text-slate-950">
                {exp.company}
              </p>
              {exp.location && (
                <p className="text-xs text-slate-400 font-mono">
                  {exp.location}
                </p>
              )}
            </div>

            {/* Right: Role & Responsibilities */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-950">
                  {exp.role}
                </h3>
                {exp.isCurrent && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-semibold border border-red-200">
                    {activeLanguage === 'fr' ? 'Actuel' : 'Current'}
                  </span>
                )}
              </div>

              {exp.description && (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {exp.description}
                </p>
              )}

              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="space-y-1.5 pt-1">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                      <span className="text-red-500 mt-1 font-bold">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
