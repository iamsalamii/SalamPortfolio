import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { useData } from '../../context/DataContext';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Layers, 
  Calendar, 
  Building, 
  UserCheck 
} from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { data, selectedSlug, navigateTo, t } = useData();
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const project = (data.projects || []).find(p => p.slug === selectedSlug || p.id === selectedSlug);

  if (!project) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Case Study Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">The requested project case study could not be loaded.</p>
        <button
          onClick={() => navigateTo('portfolio')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('projects.back_to_projects', 'Back to Projects')}</span>
        </button>
      </div>
    );
  }

  const category = (data.projectCategories || []).find(c => c.id === project.categoryId);
  const technologies = (data.technologies || []).filter(tech => project.technologyIds?.includes(tech.id));
  const images = [project.mainImage, ...(project.gallery || [])].filter(Boolean);

  return (
    <article className="py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Navigation & Back Action */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateTo('portfolio')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('projects.back_to_projects', 'Back to Projects')}</span>
          </button>

          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>{t('projects.source_code', 'GitHub Repo')}</span>
              </a>
            )}
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t('projects.live_demo', 'Live Demo')}</span>
              </a>
            )}
          </div>
        </div>

        {/* Hero Meta Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {category.name}
              </span>
            )}
            {project.status && (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                {project.status}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
            {project.shortDescription}
          </p>

          {/* Quick Details Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Role</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{project.role}</span>
            </div>
            {project.client && (
              <div>
                <span className="text-slate-400 font-medium block">Client / Organization</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{project.client}</span>
              </div>
            )}
            {project.duration && (
              <div>
                <span className="text-slate-400 font-medium block">Timeline</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{project.duration}</span>
              </div>
            )}
            {project.publishedAt && (
              <div>
                <span className="text-slate-400 font-medium block">Delivered</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{project.publishedAt}</span>
              </div>
            )}
          </div>
        </div>

        {/* Gallery / Main Preview */}
        {images.length > 0 && (
          <div className="space-y-3">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={project.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/20'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* In-depth Full Case Study Content */}
        {project.fullDescription && (
          <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="markdown-body text-slate-800 dark:text-slate-200">
              <Markdown>{project.fullDescription}</Markdown>
            </div>
          </div>
        )}

        {/* Architecture Notes */}
        {project.architectureNotes && (
          <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60">
            <h3 className="text-base font-bold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>{t('projects.architecture', 'Architecture & System Design')}</span>
            </h3>
            <p className="text-sm text-indigo-950 dark:text-indigo-300 leading-relaxed font-mono">
              {project.architectureNotes}
            </p>
          </div>
        )}

        {/* Key Features Grid */}
        {project.features && project.features.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{t('projects.key_features', 'Key Engineering Features')}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.features.map((feat, i) => (
                <div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
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
              <div className="p-6 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
                <h4 className="text-base font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>Technical Challenges</span>
                </h4>
                <ul className="space-y-2 text-sm text-amber-950 dark:text-amber-300">
                  {project.challenges.map((chal, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>{chal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.solutions && project.solutions.length > 0 && (
              <div className="p-6 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-3">
                <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Engineered Solutions</span>
                </h4>
                <ul className="space-y-2 text-sm text-emerald-950 dark:text-emerald-300">
                  {project.solutions.map((sol, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold">•</span>
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
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 text-white shadow-lg space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>{t('projects.results_impact', 'Measurable Business & Engineering Impact')}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {project.results.map((res, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-200">
                  {res}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Chips */}
        {technologies.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('projects.technologies_used', 'Technologies Used')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {technologies.map(tech => (
                <span
                  key={tech.id}
                  className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
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
