import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useData, getLocalizedField } from '../../context/DataContext';
import { Project } from '../../types';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Layers 
} from 'lucide-react';
import { TechLogo } from '../common/TechLogos';

interface ProjectDetailProps {
  project?: Project;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project: propProject }) => {
  const { data, selectedSlug, navigateTo, activeLanguage, t } = useData();
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const project = propProject || (data.projects || []).find(p => p.slug === selectedSlug || p.id === selectedSlug);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [selectedSlug]);

  if (!project) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto px-4 font-mono">
        <h2 className="text-2xl font-black text-white mb-4">// PROJET INTROUVABLE //</h2>
        <p className="text-sm text-zinc-400 mb-6">
          {activeLanguage === 'fr' ? 'Le projet sélectionné n\'a pas pu être chargé.' : 'The selected project could not be found.'}
        </p>
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

  // Multilingual Dynamic Field Extraction
  const title = getLocalizedField(project, 'title', activeLanguage) || project.title;
  const shortDescription = getLocalizedField(project, 'shortDescription', activeLanguage) || project.shortDescription;
  const fullDescription = getLocalizedField(project, 'fullDescription', activeLanguage) || project.fullDescription;
  const architectureNotes = getLocalizedField(project, 'architectureNotes', activeLanguage) || project.architectureNotes;
  const role = getLocalizedField(project, 'role', activeLanguage) || project.role;
  const client = getLocalizedField(project, 'client', activeLanguage) || project.client;
  const duration = getLocalizedField(project, 'duration', activeLanguage) || project.duration;
  const publishedAt = getLocalizedField(project, 'publishedAt', activeLanguage) || project.publishedAt;
  
  const rawFeatures = getLocalizedField(project, 'features', activeLanguage);
  const features: string[] = Array.isArray(rawFeatures) ? rawFeatures : (project.features || []);

  const rawChallenges = getLocalizedField(project, 'challenges', activeLanguage);
  const challenges: string[] = Array.isArray(rawChallenges) ? rawChallenges : (project.challenges || []);

  const rawSolutions = getLocalizedField(project, 'solutions', activeLanguage);
  const solutions: string[] = Array.isArray(rawSolutions) ? rawSolutions : (project.solutions || []);

  const rawResults = getLocalizedField(project, 'results', activeLanguage);
  const results: string[] = Array.isArray(rawResults) ? rawResults : (project.results || []);

  const category = (data.projectCategories || []).find(c => c.id === project.categoryId);
  const categoryName = getLocalizedField(category, 'name', activeLanguage) || project.categoryName || category?.name;
  const technologies = (data.technologies || []).filter(tech => project.technologyIds?.includes(tech.id));

  // Gallery deduplication: main image + gallery items, filtered for non-empty strings and unique items
  const rawImages = [project.mainImage, ...(project.gallery || [])].filter((img): img is string => Boolean(img && typeof img === 'string' && img.trim().length > 0));
  const images = Array.from(new Set(rawImages));

  const hasQuickDetails = Boolean(
    (role && role.trim()) || 
    (client && client.trim()) || 
    (duration && duration.trim()) || 
    (publishedAt && publishedAt.trim())
  );

  const canShowSourceCode = (project.showSourceCode !== false) && Boolean(project.githubUrl && project.githubUrl.trim().length > 0 && project.githubUrl !== '#');

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
            {canShowSourceCode && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_#ffffff]"
              >
                <Github className="w-4 h-4 text-red-500" />
                <span>{activeLanguage === 'fr' ? 'CODE_SOURCE' : 'SOURCE_CODE'}</span>
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
                <span>{activeLanguage === 'fr' ? 'VISITER LE SITE' : 'LIVE DEMO'}</span>
              </a>
            )}
          </div>
        </div>

        {/* Hero Meta Header */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {categoryName && (
              <span className="px-3 py-1 text-xs font-black uppercase tracking-widest bg-red-600/10 text-red-400 border border-red-500/40">
                // {categoryName}
              </span>
            )}
            {project.status && (
              <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest bg-zinc-900 text-zinc-300 border border-zinc-800">
                STATUS: {project.status}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight">
            {title}
          </h1>

          {shortDescription && (
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-4xl font-normal">
              {shortDescription}
            </p>
          )}

          {/* Quick Details Bar */}
          {hasQuickDetails && (
            <div className="flex flex-wrap gap-4 p-5 bg-[#0a0b0f] border border-zinc-800 text-xs">
              {role && (
                <div className="min-w-[140px]">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">
                    {activeLanguage === 'fr' ? '// RÔLE' : '// ROLE'}
                  </span>
                  <span className="font-bold text-white text-sm mt-0.5 block">{role}</span>
                </div>
              )}
              {client && (
                <div className="min-w-[140px]">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">
                    {activeLanguage === 'fr' ? '// CLIENT / ORGANISATION' : '// CLIENT / ORGANIZATION'}
                  </span>
                  <span className="font-bold text-white text-sm mt-0.5 block">{client}</span>
                </div>
              )}
              {duration && (
                <div className="min-w-[140px]">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">
                    {activeLanguage === 'fr' ? '// DURÉE' : '// DURATION'}
                  </span>
                  <span className="font-bold text-white text-sm mt-0.5 block">{duration}</span>
                </div>
              )}
              {publishedAt && (
                <div className="min-w-[140px]">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">
                    {activeLanguage === 'fr' ? '// DATE LIVRAISON' : '// RELEASE DATE'}
                  </span>
                  <span className="font-bold text-white text-sm mt-0.5 block">{publishedAt}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Gallery / Main Preview */}
        {images.length > 0 && (
          <div className="space-y-4">
            <div className="aspect-video w-full overflow-hidden bg-black border-2 border-zinc-800 shadow-[6px_6px_0px_#ef4444]">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={title}
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
        {fullDescription && (
          <div className="bg-[#0a0b0f] p-6 sm:p-10 border border-zinc-800">
            <div className="markdown-body text-zinc-200 leading-relaxed font-normal">
              <Markdown>{fullDescription}</Markdown>
            </div>
          </div>
        )}

        {/* Architecture Notes */}
        {architectureNotes && (
          <div className="p-6 sm:p-8 bg-zinc-950/80 border-l-4 border-l-red-500 border border-zinc-800">
            <h3 className="text-sm font-black text-white mb-2 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />
              <span>
                {activeLanguage === 'fr' 
                  ? '// ARCHITECTURE & CONCEPTION SYSTÈME //' 
                  : '// SYSTEM ARCHITECTURE & DESIGN //'}
              </span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-mono">
              {architectureNotes}
            </p>
          </div>
        )}

        {/* Key Features */}
        {features && features.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-red-500" />
              <span>
                {activeLanguage === 'fr' ? '// FONCTIONNALITÉS CLÉS //' : '// KEY FEATURES //'}
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feat, i) => (
                <div key={i} className="p-4 bg-[#0a0b0f] border border-zinc-800 text-sm text-zinc-200 flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0">[✓]</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenges & Solutions */}
        {((challenges && challenges.length > 0) || (solutions && solutions.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges && challenges.length > 0 && (
              <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>
                    {activeLanguage === 'fr' ? '// DÉFIS TECHNIQUES //' : '// TECHNICAL CHALLENGES //'}
                  </span>
                </h4>
                <ul className="space-y-2 text-sm text-zinc-300">
                  {challenges.map((chal, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-amber-400">[!]</span>
                      <span>{chal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {solutions && solutions.length > 0 && (
              <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    {activeLanguage === 'fr' ? '// SOLUTIONS DÉPLOYÉES //' : '// DEPLOYED SOLUTIONS //'}
                  </span>
                </h4>
                <ul className="space-y-2 text-sm text-zinc-300">
                  {solutions.map((sol, idx) => (
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
        {results && results.length > 0 && (
          <div className="p-6 sm:p-8 bg-[#0a0b0f] border border-zinc-800 space-y-4">
            <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-500" />
              <span>
                {activeLanguage === 'fr' ? '// IMPACT & MÉTRIQUES //' : '// IMPACT & METRICS //'}
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {results.map((res, i) => (
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
              {activeLanguage === 'fr' 
                ? '// ARSENAL TECHNIQUE DU PROJET //' 
                : '// PROJECT TECHNICAL ARSENAL //'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {technologies.map(tech => (
                <span
                  key={tech.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-[#0d0e14] text-zinc-200 border border-zinc-800 shadow-[2px_2px_0px_rgba(0,0,0,0.8)]"
                >
                  <TechLogo name={tech.name} logoUrl={tech.logoUrl} size={14} className="w-3.5 h-3.5 shrink-0 object-contain" />
                  <span>{tech.name}</span>
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
};
