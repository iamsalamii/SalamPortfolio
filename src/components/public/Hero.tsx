import React from 'react';
import { useData } from '../../context/DataContext';
import { ArrowUpRight, Download, Mail, Github, Linkedin, MapPin } from 'lucide-react';

export const Hero: React.FC = () => {
  const { data, activeLanguage } = useData();
  const info = data.personalInfo;

  return (
    <section id="home" className="pt-36 pb-20 sm:pt-44 sm:pb-28 max-w-5xl mx-auto px-6 sm:px-8">
      
      <div className="space-y-8">
        
        {/* Availability / Location Tag */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse" />
            <span className="text-slate-900 font-semibold">
              {activeLanguage === 'fr' ? 'Disponible pour missions & opportunités' : 'Available for opportunities'}
            </span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Abidjan, Côte d'Ivoire</span>
          </span>
        </div>

        {/* Big Editorial Headline with Crimson Accent */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-tight leading-[1.08]">
            {activeLanguage === 'fr' ? (
              <>
                Moussa Abdou Salam — Développeur <span className="underline decoration-red-600 decoration-4 underline-offset-8">Full Stack .NET</span>
              </>
            ) : (
              <>
                Moussa Abdou Salam — <span className="underline decoration-red-600 decoration-4 underline-offset-8">Full Stack .NET</span> Engineer
              </>
            )}
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal pt-2">
            {activeLanguage === 'fr' 
              ? "Développeur chez GROUPE DIRECTSOFT avec +2 ans d'expérience. Je conçois des architectures logicielles modulaires en C#, ASP.NET Core, Entity Framework Core et des interfaces modernes en React."
              : "Software Engineer at GROUPE DIRECTSOFT with +2 years of experience crafting scalable .NET Core backends, robust database architectures, and reactive React applications."}
          </p>
        </div>

        {/* Clean Direct Actions */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-[0_4px_20px_rgba(220,38,38,0.25)] hover:shadow-[0_6px_25px_rgba(220,38,38,0.35)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>{activeLanguage === 'fr' ? 'Voir mes réalisations' : 'View Projects'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <a
            href="/assets/CV_MOUSSA_ABDOU_SALAM.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{activeLanguage === 'fr' ? 'Télécharger CV' : 'Download CV'}</span>
          </a>

          <a
            href="mailto:moussasalam86@gmail.com"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-200 hover:border-slate-400 text-slate-700 text-sm font-medium transition-colors"
          >
            <Mail className="w-4 h-4 text-slate-400" />
            <span>moussasalam86@gmail.com</span>
          </a>
        </div>

        {/* Social Links Bar */}
        <div className="flex items-center gap-6 pt-4 text-xs font-mono text-slate-500">
          <a
            href="https://linkedin.com/in/abdou-salam-moussa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-600 transition-colors flex items-center gap-1.5"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-600 transition-colors flex items-center gap-1.5"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <span>•</span>
          <span>Abidjan, CI</span>
        </div>

      </div>

    </section>
  );
};
