import React, { useState } from 'react';
import { useData, getLocalizedField } from '../../context/DataContext';
import { TechLogo } from '../common/TechLogos';
import { Github, ArrowUpRight } from 'lucide-react';

export const Projects: React.FC = () => {
  const { data, navigateTo, activeLanguage } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: activeLanguage === 'fr' ? 'TOUT // ALL' : 'ALL // WORKS' },
    ...(data.projectCategories || []).map(c => {
      const localizedName = getLocalizedField(c, 'name', activeLanguage) || c.name;
      return { ...c, name: localizedName.toUpperCase() };
    })
  ];

  const projects = (data.projects || []).filter(p => p.status === 'published').sort((a, b) => a.order - b.order);

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.categoryId === selectedCategory);

  return (
    <section id="projects" className="py-20 sm:py-28 px-4 sm:px-8 max-w-6xl mx-auto border-t border-zinc-800 font-mono">
      
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-red-500 text-xs font-bold tracking-widest uppercase mb-3">
            <span className="w-2.5 h-2.5 bg-red-500 inline-block" />
            <span>// 03. CASE STUDIES //</span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter">
            {activeLanguage === 'fr' ? 'PROJETS & RÉALISATIONS' : 'PROJECTS & CASE STUDIES'}
          </h2>
        </div>

        {/* Category Filter Tabs */}
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
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Brutalist Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredProjects.map((project, idx) => {
          const title = getLocalizedField(project, 'title', activeLanguage) || project.title;
          const shortDescription = getLocalizedField(project, 'shortDescription', activeLanguage) || project.shortDescription;
          const category = (data.projectCategories || []).find(c => c.id === project.categoryId);
          const categoryName = getLocalizedField(category, 'name', activeLanguage) || project.categoryName || category?.name || 'FULL STACK';
          
          const canShowSourceCode = (project.showSourceCode !== false) && Boolean(project.githubUrl && project.githubUrl.trim().length > 0 && project.githubUrl !== '#');

          return (
            <div
              key={project.id}
              className="group flex flex-col justify-between bg-[#0d0e14] border border-zinc-800 hover:border-red-500 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.9)] hover:shadow-[7px_7px_0px_0px_#ef4444] transition-all duration-200 overflow-hidden"
            >
              {/* Thumbnail Header */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950 border-b border-zinc-800">
                <img
                  src={project.mainImage}
                  alt={title}
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-400 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e14] via-transparent to-transparent opacity-80" />
                
                {/* Category Pill Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 bg-black/80 backdrop-blur-md text-red-400 border border-red-500/40">
                    {categoryName}
                  </span>
                </div>

                {/* Number Watermark */}
                <div className="absolute top-2 right-3 font-mono font-black text-2xl text-white/20 group-hover:text-red-500/40 transition-colors">
                  #{String(idx + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3
                    onClick={() => navigateTo('project-detail', project.slug || project.id)}
                    className="text-base sm:text-lg font-black text-white group-hover:text-red-400 transition-colors cursor-pointer tracking-tight uppercase leading-snug"
                  >
                    {title}
                  </h3>

                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 font-sans font-normal">
                    {shortDescription}
                  </p>
                </div>

                {/* Technologies List */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologyIds.slice(0, 4).map((tid) => {
                      const tech = (data.technologies || []).find(t => t.id === tid);
                      const techName = tech ? tech.name : tid.replace('tech-', '');
                      return (
                        <span
                          key={tid}
                          className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 bg-zinc-950 text-zinc-300 border border-zinc-800"
                        >
                          <TechLogo name={techName} logoUrl={tech?.logoUrl} size={11} className="w-3 h-3 object-contain" />
                          <span>{techName}</span>
                        </span>
                      );
                    })}
                    {project.technologyIds.length > 4 && (
                      <span className="text-[10px] font-mono text-zinc-500 self-center px-1 font-bold">
                        +{project.technologyIds.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Card Action Footers */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    {canShowSourceCode ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-bold text-zinc-400 hover:text-white transition-colors"
                      >
                        <Github className="w-3.5 h-3.5 text-red-500" />
                        <span>{activeLanguage === 'fr' ? 'CODE_SRC' : 'SOURCE'}</span>
                      </a>
                    ) : (
                      <span className="text-zinc-600 text-[10px] font-mono">// PROTECTED</span>
                    )}

                    <div className="flex items-center gap-3">
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-zinc-400 hover:text-white transition-colors text-xs uppercase"
                          title="Visiter le site en direct"
                        >
                          <span>{activeLanguage === 'fr' ? 'DÉMO' : 'DEMO'}</span>
                        </a>
                      )}
                      <button
                        onClick={() => navigateTo('project-detail', project.slug || project.id)}
                        className="inline-flex items-center gap-1 font-extrabold text-white group-hover:text-red-400 transition-colors cursor-pointer text-xs uppercase tracking-wider"
                      >
                        <span>{activeLanguage === 'fr' ? 'DÉTAILS' : 'VIEW'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[3] text-red-500 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
