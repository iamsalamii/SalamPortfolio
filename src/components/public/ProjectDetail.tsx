import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { useData } from '../../context/DataContext';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Layers 
} from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { data, selectedSlug, navigateTo, activeLanguage } = useData();
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const project = (data.projects || []).find(p => p.slug === selectedSlug || p.id === selectedSlug);

  if (!project) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto px-4 font-mono">
        <h2 className="text-2xl font-black text-white mb-4">// PROJET INTROUVABLE //</h2>
        <p className="text-sm text-zinc-400 mb-6">Le projet sélectionné n'a pas pu être chargé.</p>
        <button
          onClick={() => navigateTo('portfolio')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#ffffff] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{activeLanguage === 'fr' ? 'Retour aux projets' : 'Back to Projects'}</span>
        </button>
      </div>
    );
  }

  const category = (data.projectCategories || []).find(c => c.id === project.categoryId);
  const technologies = (data.technologies || []).filter(tech => project.technologyIds?.includes(tech.id));
  const images = [project.mainImage, ...(project.gallery || [])].filter(Boolean);

  return (
    <article className="py-12 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 font-mono text-zinc-300">
      <div className="space-y-12">
        
        {/* Navigation & Back Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <button
            onClick={() => navigateTo('portfolio')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-bold uppercase tracking-wider border border-zinc-700 transition-all cursor-pointer shadow-[2px_2px_0px_#ef4444]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{activeLanguage === 'fr' ? '← RETOUR PROJETS' : '← BACK TO PROJECTS'}</span>
          </button>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_#ffffff]"
              >
                <Github className="w-4 h-4" />
                <span>CODE_SOURCE</span>
              </a>
            )}
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-[3px_3px_0px_#ffffff]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>DÉMO EN LIGNE</span>
              </a>
            )}
          </div>
        </div>

        {/* Hero Meta Header */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {category && (
              <span className="px-3 py-1 text-xs font-black uppercase tracking-widest bg-red-600/10 text-red-400 border border-red-500/40">
                // {category.name}
              </span>
            )}
            {project.status && (
              <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest bg-zinc-900 text-zinc-300 border border-zinc-800">
                STATUS: {project.status}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-4xl font-normal">
            {project.shortDescription}
          </p>

          {/* Quick Details Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#0a0b0f] border border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">// RÔLE</span>
              <span className="font-bold text-white text-sm mt-0.5 block">{project.role}</span>
            </div>
            {project.client && (
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">// CLIENT / ORGANISATION</span>
                <span className="font-bold text-white text-sm mt-0.5 block">{project.client}</span>
              </div>
            )}
            {project.duration && (
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">// DURÉE</span>
                <span className="font-bold text-white text-sm mt-0.5 block">{project.duration}</span>
              </div>
            )}
            {project.publishedAt && (
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">// DATE LIVRAISON</span>
                <span className="font-bold text-white text-sm mt-0.5 block">{project.publishedAt}</span>
              </div>
            )}
          </div>
        </div>

        {/* Gallery / Main Preview */}
        {images.length > 0 && (
          <div className="space-y-4">
            <div className="aspect-video w-full overflow-hidden bg-black border-2 border-zinc-800 shadow-[6px_6px_0px_#ef4444]">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-28 h-18 overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-red-500 ring-2 ring-red-500/40'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Capture ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Full Case Study Content */}
        {project.fullDescription && (
          <div className="bg-[#0a0b0f] p-6 sm:p-10 border border-zinc-800">
            <div className="markdown-body text-zinc-200 leading-relaxed font-normal">
              <Markdown>{project.fullDescription}</Markdown>
            </div>
          </div>
        )}

        {/* Architecture Notes */}
        {project.architectureNotes && (
          <div className="p-6 sm:p-8 bg-zinc-950/80 border-l-4 border-l-red-500 border border-zinc-800">
            <h3 className="text-sm font-black text-white mb-2 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />
              <span>// ARCHITECTURE &amp; CONCEPTION SYSTÈME //</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-mono">
              {project.architectureNotes}
            </p>
          </div>
        )}

        {/* Key Features */}
        {project.features && project.features.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-red-500" />
              <span>// FONCTIONNALITÉS CLÉS //</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.features.map((feat, i) => (
                <div key={i} className="p-4 bg-[#0a0b0f] border border-zinc-800 text-sm text-zinc-200 flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0">[✓]</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenges & Solutions */}
        {((project.challenges && project.challenges.length > 0) || (project.solutions && project.solutions.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.challenges && project.challenges.length > 0 && (
              <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>// DÉFIS TECHNIQUES //</span>
                </h4>
                <ul className="space-y-2 text-sm text-zinc-300">
                  {project.challenges.map((chal, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-amber-400">[!]</span>
                      <span>{chal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.solutions && project.solutions.length > 0 && (
              <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>// SOLUTIONS DÉPLOYÉES //</span>
                </h4>
                <ul className="space-y-2 text-sm text-zinc-300">
                  {project.solutions.map((sol, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-emerald-400">[✓]</span>
                      <span>{sol}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Measurable Results */}
        {project.results && project.results.length > 0 && (
          <div className="p-6 sm:p-8 bg-[#0a0b0f] border border-zinc-800 space-y-4">
            <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-500" />
              <span>// IMPACT &amp; MÉTRIQUES //</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {project.results.map((res, i) => (
                <div key={i} className="p-4 bg-zinc-900/60 border border-zinc-800 text-sm font-bold text-white">
                  {res}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Chips */}
        {technologies.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              // ARSENAL TECHNIQUE DU PROJET //
            </h4>
            <div className="flex flex-wrap gap-2">
              {technologies.map(tech => (
                <span
                  key={tech.id}
                  className="px-3 py-1 text-xs font-bold bg-zinc-900 text-zinc-200 border border-zinc-800"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
};

