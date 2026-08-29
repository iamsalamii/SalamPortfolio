import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { TechLogo } from '../common/TechLogos';
import { 
  Github, 
  ArrowUpRight 
} from 'lucide-react';

export const Projects: React.FC = () => {
  const { data, navigateTo, activeLanguage } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: activeLanguage === 'fr' ? 'Tout' : 'All' },
    ...(data.projectCategories || [])
  ];

  const projects = (data.projects || []).filter(p => p.status === 'published').sort((a, b) => a.order - b.order);

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.categoryId === selectedCategory);

  return (
    <section id="projects" className="py-20 sm:py-28 px-6 sm:px-8 max-w-5xl mx-auto border-t border-slate-200">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div className="space-y-1.5">
          <p className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold">
            05 / {activeLanguage === 'fr' ? 'Projets' : 'Works'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            {activeLanguage === 'fr' ? 'Réalisations & Solutions ERP' : 'Selected Works'}
          </h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white font-semibold shadow-xs'
                  : 'bg-transparent text-slate-600 hover:text-red-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Compact 3-Column Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-red-500/50 transition-all duration-200 transform hover:-translate-y-1 flex flex-col justify-between shadow-xs hover:shadow-lg"
          >
            {/* Top Media Thumbnail */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
              <img
                src={project.mainImage}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-25 transition-opacity" />
              
              {/* Category Tag */}
              <div className="absolute top-3 left-3">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15">
                  {project.categoryName || 'Full Stack'}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
              
              <div className="space-y-1.5">
                <h3
                  onClick={() => navigateTo('project-detail', project.slug)}
                  className="text-base font-bold text-slate-950 group-hover:text-red-600 transition-colors cursor-pointer tracking-tight leading-snug"
                >
                  {project.title}
                </h3>

                <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                  {project.shortDescription}
                </p>
              </div>

              {/* Technologies with Brand Logos */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {project.technologyIds.slice(0, 4).map((tid) => {
                    const tech = (data.technologies || []).find(t => t.id === tid);
                    const techName = tech ? tech.name : tid.replace('tech-', '');
                    return (
                      <span
                        key={tid}
                        className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200"
                      >
                        <TechLogo name={techName} size={12} className="w-3 h-3" />
                        <span>{techName}</span>
                      </span>
                    );
                  })}
                  {project.technologyIds.length > 4 && (
                    <span className="text-[10px] font-mono text-slate-400 self-center px-1">
                      +{project.technologyIds.length - 4}
                    </span>
                  )}
                </div>

                {/* Card Action Links */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href={project.githubUrl || 'https://github.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Code</span>
                  </a>

                  <button
                    onClick={() => navigateTo('project-detail', project.slug)}
                    className="inline-flex items-center gap-1 font-bold text-slate-900 hover:text-red-600 transition-colors cursor-pointer text-xs"
                  >
                    <span>{activeLanguage === 'fr' ? 'Détails' : 'View'}</span>
                    <ArrowUpRight className="w-3 h-3 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
