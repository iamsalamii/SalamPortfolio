import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { TechLogo } from '../common/TechLogos';
import { Cpu } from 'lucide-react';

export const TechStack: React.FC = () => {
  const { data, activeLanguage } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = activeLanguage === 'fr' ? [
    { id: 'all', label: 'TOUT // ALL' },
    { id: 'tc-backend', label: 'BACKEND .NET' },
    { id: 'tc-frontend', label: 'FRONTEND REACT' },
    { id: 'tc-database', label: 'DATA & STORAGE' },
    { id: 'tc-tools', label: 'DEVOPS & TOOLS' }
  ] : [
    { id: 'all', label: 'ALL // CORE' },
    { id: 'tc-backend', label: 'BACKEND .NET' },
    { id: 'tc-frontend', label: 'FRONTEND REACT' },
    { id: 'tc-database', label: 'DATA & STORAGE' },
    { id: 'tc-tools', label: 'DEVOPS & TOOLS' }
  ];

  const technologies = data.technologies || [];

  const filteredTechs = selectedCategory === 'all'
    ? technologies
    : technologies.filter((tech) => tech.categoryId === selectedCategory);

  return (
    <section id="skills" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-8 border-t border-zinc-800 font-mono">
      
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 text-red-500 text-xs font-bold tracking-widest uppercase mb-3">
            <span className="w-2.5 h-2.5 bg-red-500 inline-block" />
            <span>// 02. ARSENAL //</span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter">
            {activeLanguage === 'fr' ? 'TECH MATRIX & STACK' : 'TECH MATRIX & STACK'}
          </h2>
        </div>

        {/* Brutalist Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-mono font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white border border-red-400 shadow-[4px_4px_0px_0px_#ffffff] -translate-x-0.5 -translate-y-0.5'
                  : 'bg-[#0d0e14] text-zinc-400 hover:text-white border border-zinc-800 hover:border-red-500 hover:shadow-[3px_3px_0px_0px_#ef4444]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brutalist Tech Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {filteredTechs.map((tech, idx) => (
          <div
            key={tech.id || idx}
            className="p-4 bg-[#0d0e14] border border-zinc-800 hover:border-red-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[5px_5px_0px_0px_#ef4444] transition-all duration-200 group flex items-center justify-between"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-zinc-950 border border-zinc-800 flex items-center justify-center p-2 shrink-0 group-hover:border-red-500/60 transition-colors">
                <TechLogo name={tech.name} size={20} className="w-5 h-5 object-contain" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-extrabold text-white truncate group-hover:text-red-400 transition-colors tracking-tight">
                  {tech.name}
                </h3>
                <p className="text-[10px] text-zinc-500 truncate font-mono uppercase tracking-wider">
                  {tech.categoryName || 'PRO'}
                </p>
              </div>
            </div>

            <span className="text-[10px] text-zinc-600 group-hover:text-red-500 font-mono font-bold shrink-0 ml-2">
              #{String(idx + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>

      {/* Tech Highlight Footer Banner */}
      <div className="mt-8 p-4 bg-[#0d0e14] border border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-red-500" />
          <span className="font-bold text-white uppercase tracking-wider">ARCHITECTURE CORE :</span>
          <span>ASP.NET Core 9 / Entity Framework Core / SQL Server / PostgreSQL</span>
        </div>
        <div className="text-[11px] text-zinc-500 font-mono">
          STATUS: PRODUCTION READY
        </div>
      </div>

    </section>
  );
};
