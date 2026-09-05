import React from 'react';
import { useData } from '../../context/DataContext';
import { ArrowUpRight, Download, Mail, Github, Linkedin, MapPin, Terminal, Code2, Database, Layers } from 'lucide-react';

export const Hero: React.FC = () => {
  const { data, activeLanguage } = useData();
  const info = data.personalInfo;

  const tickerItems = [
    'C# 13',
    '.NET 9.0',
    'ASP.NET CORE',
    'ENTITY FRAMEWORK CORE',
    'POSTGRESQL',
    'SQL SERVER',
    'CLEAN ARCHITECTURE',
    'RESTFUL APIS',
    'REACT',
    'TYPESCRIPT',
    'TAILWIND CSS',
    'DOCKER',
    'DDD & CQRS'
  ];

  return (
    <section id="home" className="pt-32 pb-16 sm:pt-40 sm:pb-24 max-w-6xl mx-auto px-4 sm:px-8 relative font-mono">
      
      {/* Top Meta Status Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-10 text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-2.5 py-1 bg-red-950/40 border border-red-500/60 text-red-400 font-bold text-[11px] tracking-wider uppercase">
            <span className="w-2 h-2 bg-red-500 rounded-none animate-ping" />
            {activeLanguage === 'fr' ? 'DISPONIBLE // MISSIONS & CDI' : 'ACTIVE // OPEN TO OFFERS'}
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>ABIDJAN, CÔTE D'IVOIRE</span>
          </span>
        </div>
      </div>

      {/* Main Editorial Block: GIANT BOLD MONOSPACE TYPOGRAPHY */}
      <div className="space-y-6">
        
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-bold tracking-widest text-red-500 uppercase">
            // SENIOR PROFILE ARCHIVE
          </p>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-[0.88] select-none">
            MOUSSA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-zinc-100">
              ABDOU SALAM
            </span>
          </h1>
        </div>

        {/* Sub-headline / Role Statement */}
        <div className="border-l-4 border-red-600 pl-4 sm:pl-6 py-2 my-6">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-zinc-100 tracking-tight uppercase">
            FULL STACK .NET 9 & REACT ENGINEER
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed pt-2">
            {activeLanguage === 'fr' 
              ? (info?.bio?.fr || "Développeur chez GROUPE DIRECTSOFT (+2 ans). Spécialiste de la conception d'architectures logicielles scalables en C#, ASP.NET Core, EF Core, SQL Server / PostgreSQL et d'interfaces web réactives haute performance.")
              : (info?.bio?.en || "Software Engineer at GROUPE DIRECTSOFT (+2 yrs). Specialized in architecting scalable, resilient backends with C#, ASP.NET Core, EF Core, SQL Server / PostgreSQL alongside high-octane React frontends.")}
          </p>
        </div>

        {/* Action Buttons: Brutalist High Impact */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <a
            href="#projects"
            className="brutalist-btn-primary"
          >
            <span>{activeLanguage === 'fr' ? 'EXPLORER LES PROJETS' : 'VIEW PROJECTS'}</span>
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
          </a>

          <a
            href={info?.cvUrl || "/assets/CV_MOUSSA_ABDOU_SALAM.pdf"}
            target="_blank"
            rel="noopener noreferrer"
            className="brutalist-btn-secondary"
          >
            <Download className="w-4 h-4 text-red-400 stroke-[2.5]" />
            <span>{activeLanguage === 'fr' ? 'TÉLÉCHARGER CV (PDF)' : 'DOWNLOAD CV'}</span>
          </a>

          <a
            href={`mailto:${info?.email || 'moussasalam86@gmail.com'}`}
            className="inline-flex items-center gap-2 px-5 py-3.5 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Mail className="w-4 h-4 text-red-500" />
            <span>{info?.email || 'moussasalam86@gmail.com'}</span>
          </a>
        </div>

        {/* Social Network Access Line */}
        <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-zinc-400 border-t border-zinc-800/80">
          <span className="text-zinc-500 uppercase tracking-wider text-[11px] font-bold">// CONNECT:</span>
          
          <a
            href={info?.linkedinUrl || "https://linkedin.com/in/abdou-salam-moussa"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400 transition-colors flex items-center gap-1.5 font-bold"
          >
            <Linkedin className="w-3.5 h-3.5 text-red-500" />
            <span>LINKEDIN</span>
          </a>

          <a
            href={info?.githubUrl || "https://github.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400 transition-colors flex items-center gap-1.5 font-bold"
          >
            <Github className="w-3.5 h-3.5 text-red-500" />
            <span>GITHUB</span>
          </a>

          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 text-[11px]">NET 9.0 LTS // CLEAN DDD</span>
        </div>

      </div>

      {/* Brutalist Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 pt-6 border-t border-zinc-800">
        <div className="p-4 bg-[#0d0e14] border border-zinc-800 shadow-[3px_3px_0px_0px_#ef4444] group hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">01 // EXP</span>
            <Terminal className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">+2 ANS</div>
          <div className="text-[11px] text-zinc-400 uppercase tracking-wider mt-1">DIRECTSOFT INGÉNIERIE</div>
        </div>

        <div className="p-4 bg-[#0d0e14] border border-zinc-800 shadow-[3px_3px_0px_0px_#ef4444] group hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">02 // STACK</span>
            <Code2 className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">.NET 9</div>
          <div className="text-[11px] text-zinc-400 uppercase tracking-wider mt-1">C# & ASP.NET CORE</div>
        </div>

        <div className="p-4 bg-[#0d0e14] border border-zinc-800 shadow-[3px_3px_0px_0px_#ef4444] group hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">03 // DATA</span>
            <Database className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">SQL + PG</div>
          <div className="text-[11px] text-zinc-400 uppercase tracking-wider mt-1">EF CORE & SCHEMAS</div>
        </div>

        <div className="p-4 bg-[#0d0e14] border border-zinc-800 shadow-[3px_3px_0px_0px_#ef4444] group hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">04 // FRONT</span>
            <Layers className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">REACT+TS</div>
          <div className="text-[11px] text-zinc-400 uppercase tracking-wider mt-1">MODERN UI CLIENT</div>
        </div>
      </div>

      {/* Infinite Running Marquee Ribbon */}
      <div className="mt-14 overflow-hidden border-y border-zinc-800 bg-[#0a0b10] py-3 -mx-4 sm:-mx-8">
        <div className="animate-marquee whitespace-nowrap text-xs font-bold tracking-widest text-zinc-400 uppercase">
          {tickerItems.concat(tickerItems).map((tech, idx) => (
            <span key={idx} className="mx-4 flex items-center gap-3">
              <span className="text-red-500 font-mono">■</span>
              <span className="hover:text-white transition-colors">{tech}</span>
            </span>
          ))}
        </div>
      </div>

    </section>
  );
};
