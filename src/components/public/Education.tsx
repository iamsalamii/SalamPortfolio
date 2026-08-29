import React from 'react';
import { useData } from '../../context/DataContext';

export const Education: React.FC = () => {
  const { data, activeLanguage } = useData();
  const educationList = (data.education || []).sort((a, b) => a.order - b.order);

  if (educationList.length === 0) return null;

  return (
    <section id="education" className="py-20 sm:py-28 max-w-5xl mx-auto px-6 sm:px-8 border-t border-slate-200/70 dark:border-slate-800/70">
      
      {/* Section Header */}
      <div className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
          04 / {activeLanguage === 'fr' ? 'Formation' : 'Education'}
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
          {activeLanguage === 'fr' ? 'Formation & Diplômes' : 'Degrees & Academic Path'}
        </h2>
      </div>

      {/* Editorial Education List */}
      <div className="space-y-10">
        {educationList.map((edu) => (
          <div key={edu.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-8 border-b border-slate-200/60 dark:border-slate-800/60 last:border-0">
            
            {/* Period */}
            <div className="md:col-span-4 space-y-1">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block">
                {edu.endDate || edu.startDate}
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {edu.institution}
              </p>
              {edu.location && (
                <p className="text-xs text-slate-400 font-mono">
                  {edu.location}
                </p>
              )}
            </div>

            {/* Degree & Field */}
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                  {edu.degree}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {edu.status === 'graduated' ? (activeLanguage === 'fr' ? 'Obtenu' : 'Completed') : (activeLanguage === 'fr' ? 'En cours' : 'In Progress')}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {edu.fieldOfStudy}
              </p>
              {edu.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                  {edu.description}
                </p>
              )}
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
