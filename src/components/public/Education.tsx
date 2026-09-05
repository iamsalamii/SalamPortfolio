import React from 'react';
import { useData } from '../../context/DataContext';
import { GraduationCap, BookOpen } from 'lucide-react';

export const Education: React.FC = () => {
  const { data, activeLanguage } = useData();
  const educationList = (data.education || []).sort((a, b) => a.order - b.order);

  if (educationList.length === 0) return null;

  return (
    <section id="education" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-8 border-t border-zinc-800 font-mono">
      
      {/* Section Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 text-red-500 text-xs font-bold tracking-widest uppercase mb-3">
          <span className="w-2.5 h-2.5 bg-red-500 inline-block" />
          <span>// 06. ACADEMICS //</span>
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter">
          {activeLanguage === 'fr' ? 'FORMATION & DIPLÔMES' : 'DEGREES & EDUCATION'}
        </h2>
      </div>

      {/* Brutalist Education List */}
      <div className="space-y-6">
        {educationList.map((edu, idx) => (
          <div 
            key={edu.id || idx} 
            className="p-6 sm:p-7 bg-[#0d0e14] border border-zinc-800 hover:border-red-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[5px_5px_0px_0px_#ef4444] transition-all duration-200 group"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-zinc-800/80">
              
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs text-red-500 font-bold uppercase tracking-widest">
                    EDU_0{idx + 1} //
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight group-hover:text-red-400 transition-colors">
                    {edu.degree}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold uppercase tracking-wider">
                    {edu.status === 'graduated' ? (activeLanguage === 'fr' ? 'DIPLÔMÉ' : 'COMPLETED') : (activeLanguage === 'fr' ? 'EN COURS' : 'IN PROGRESS')}
                  </span>
                </div>

                <p className="text-xs font-bold text-red-400 uppercase tracking-wide">
                  {edu.fieldOfStudy}
                </p>
              </div>

              {/* Institution & Period */}
              <div className="md:text-right space-y-1 shrink-0">
                <div className="text-sm font-bold text-zinc-200 uppercase">
                  {edu.institution}
                </div>
                <div className="font-mono text-xs text-zinc-500">
                  {edu.endDate || edu.startDate} {edu.location && `// ${edu.location}`}
                </div>
              </div>

            </div>

            {edu.description && (
              <p className="pt-4 text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                {edu.description}
              </p>
            )}

          </div>
        ))}
      </div>

    </section>
  );
};
