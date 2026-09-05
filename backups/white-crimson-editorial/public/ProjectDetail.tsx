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
      <div className="py-24 text-center max-w-xl mx-auto px-4">
        <h2 className="text-2xl font-extrabold text-slate-950 mb-4">Projet introuvable</h2>
        <p className="text-sm text-slate-500 mb-6">Le projet sélectionné n'a pas pu être chargé.</p>
        <button
          onClick={() => navigateTo('portfolio')}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
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
    <article className="py-12 md:py-20 max-w-5xl mx-auto px-6 sm:px-8">
      <div className="space-y-12">
        
        {/* Navigation & Back Action */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateTo('portfolio')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-semibold border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{activeLanguage === 'fr' ? 'Retour aux projets' : 'Back to Projects'}</span>
          </button>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-red-600 transition-colors shadow-xs"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Code Source</span>
              </a>
            )}
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Démo en ligne</span>
              </a>
            )}
          </div>
        </div>

        {/* Hero Meta Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200">
                {category.name}
              </span>
            )}
            {project.status && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 uppercase tracking-wider text-[10px]">
                {project.status}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
            {project.shortDescription}
          </p>

          {/* Quick Details Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-slate-200 text-xs shadow-xs">
            <div>
              <span className="text-slate-400 font-mono text-[11px] block">Rôle</span>
              <span className="font-bold text-slate-900 text-sm">{project.role}</span>
            </div>
            {project.client && (
              <div>
                <span className="text-slate-400 font-mono text-[11px] block">Client / Entreprise</span>
                <span className="font-bold text-slate-900 text-sm">{project.client}</span>
              </div>
            )}
            {project.duration && (
              <div>
                <span className="text-slate-400 font-mono text-[11px] block">Durée</span>
                <span className="font-bold text-slate-900 text-sm">{project.duration}</span>
              </div>
            )}
            {project.publishedAt && (
              <div>
                <span className="text-slate-400 font-mono text-[11px] block">Livraison</span>
                <span className="font-bold text-slate-900 text-sm">{project.publishedAt}</span>
              </div>
            )}
          </div>
        </div>

        {/* Gallery / Main Preview */}
        {images.length > 0 && (
          <div className="space-y-3">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
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
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-red-600 ring-2 ring-red-500/20'
                        : 'border-transparent opacity-60 hover:opacity-100'
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
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="markdown-body text-slate-800 leading-relaxed">
              <Markdown>{project.fullDescription}</Markdown>
            </div>
          </div>
        )}

        {/* Architecture Notes */}
        {project.architectureNotes && (
          <div className="p-6 sm:p-8 rounded-3xl bg-red-50/50 border border-red-200 shadow-xs">
            <h3 className="text-base font-bold text-red-950 mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-600" />
              <span>Architecture &amp; Conception Système</span>
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-mono">
              {project.architectureNotes}
            </p>
          </div>
        )}

        {/* Key Features */}
        {project.features && project.features.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-red-600" />
              <span>Fonctionnalités Clés &amp; Ingénierie</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.features.map((feat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 flex items-start gap-3 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-red-600 shrink-0 mt-1.5" />
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
              <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-200 space-y-3 shadow-xs">
                <h4 className="text-base font-bold text-amber-950 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>Défis Techniques</span>
                </h4>
                <ul className="space-y-2 text-sm text-amber-900">
                  {project.challenges.map((chal, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-amber-600">•</span>
                      <span>{chal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.solutions && project.solutions.length > 0 && (
              <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-200 space-y-3 shadow-xs">
                <h4 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Solutions Apportées</span>
                </h4>
                <ul className="space-y-2 text-sm text-emerald-900">
                  {project.solutions.map((sol, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600">•</span>
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
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <span>Impact &amp; Résultats Métriques</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {project.results.map((res, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900">
                  {res}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Chips */}
        {technologies.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Technologies Utilisées
            </h4>
            <div className="flex flex-wrap gap-2">
              {technologies.map(tech => (
                <span
                  key={tech.id}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-xs"
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
