import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { TechLogo } from '../common/TechLogos';

export const TechStack: React.FC = () => {
  const { data, activeLanguage } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = activeLanguage === 'fr' ? [
    { id: 'all', label: 'Toutes les technologies' },
    { id: 'tc-backend', label: 'Backend & .NET' },
    { id: 'tc-frontend', label: 'Frontend' },
    { id: 'tc-database', label: 'Bases de données' },
    { id: 'tc-tools', label: 'Outils & DevOps' }
  ] : [
    { id: 'all', label: 'All Technologies' },
    { id: 'tc-backend', label: 'Backend & .NET' },
    { id: 'tc-frontend', label: 'Frontend' },
    { id: 'tc-database', label: 'Databases' },
    { id: 'tc-tools', label: 'Tools & DevOps' }
  ];

  const technologies = data.technologies || [];

  const filteredTechs = selectedCategory === 'all'
    ? technologies
    : technologies.filter((tech) => tech.categoryId === selectedCategory);

  return (
    <section id="skills" className="py-20 sm:py-28 max-w-5xl mx-auto px-6 sm:px-8 border-t border-slate-200/70 dark:border-slate-800/70">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
            03 / {activeLanguage === 'fr' ? 'Compétences' : 'Stack'}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            {activeLanguage === 'fr' ? 'Technologies & Outils' : 'Technologies & Tools'}
          </h2>
        </div>

        {/* Minimal Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-medium'
                  : 'bg-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Designer Logo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
        {filteredTechs.map((tech) => (
          <div
            key={tech.id}
            className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-400 dark:hover:border-slate-700 transition-all duration-200 flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center p-2 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <TechLogo name={tech.name} size={22} className="w-5 h-5 object-contain" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {tech.name}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {tech.categoryName || 'Framework'}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
