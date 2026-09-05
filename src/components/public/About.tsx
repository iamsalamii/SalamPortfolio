import React from 'react';
import { useData } from '../../context/DataContext';
import { ShieldCheck, Code, Server, Cpu } from 'lucide-react';

export const About: React.FC = () => {
  const { data, activeLanguage } = useData();
  const info = data.personalInfo;

  const defaultPrinciples = [
    { title: "CLEAN ARCHITECTURE", description: "DDD, SOLID, CQRS, découpage modulaire et scalabilité", icon: Server },
    { title: "BACKEND ROBUSTE", description: "C# 13, ASP.NET Core, Entity Framework Core, SQL Server / PostgreSQL", icon: Code },
    { title: "FRONTEND MODERNE", description: "React, TypeScript, Tailwind CSS, performances et composants réactifs", icon: Cpu },
    { title: "QUALITÉ & TESTS", description: "xUnit, TDD, Clean Code, CI/CD, Git Flow et revues rigoureuses", icon: ShieldCheck }
  ];

  const principles = (info.principles && info.principles.length > 0) ? info.principles : defaultPrinciples;

  return (
    <section id="about" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-8 border-t border-zinc-800 font-mono">
      
      {/* Section Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 text-red-500 text-xs font-bold tracking-widest uppercase mb-3">
          <span className="w-2.5 h-2.5 bg-red-500 inline-block" />
          <span>// 01. DOSSIER TECHNIQUE //</span>
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter">
          {activeLanguage === 'fr' ? 'PROFIL & PHILOSOPHIE' : 'ENGINEERING PHILOSOPHY'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-start">
        
        {/* Photo Column with Brutalist Shadow */}
        <div className="md:col-span-5">
          <div className="p-3 bg-[#0d0e14] border border-zinc-800 shadow-[6px_6px_0px_0px_#ef4444] group">
            <div className="aspect-[4/5] overflow-hidden bg-zinc-950 border border-zinc-800/80">
              <img
                src={info.avatarUrl || '/assets/maphotops600.jpg'}
                alt={`${info.firstName} ${info.lastName}`}
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider">
              <span>{info.firstName} {info.lastName}</span>
              <span className="text-red-500">INGÉNIERIE .NET</span>
            </div>
          </div>
        </div>

        {/* Biography & Principles Column */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-5 sm:p-6 bg-[#0d0e14] border border-zinc-800 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.06)]">
            <p className="text-base sm:text-lg text-zinc-100 leading-relaxed font-semibold">
              {info.bioShort || (activeLanguage === 'fr' 
                ? "Développeur Full Stack .NET passionné par la conception de systèmes fiables, modulaires et performants. J'interviens sur l'ensemble de la chaîne technique, de la modélisation de base de données jusqu'à l'expérience utilisateur finale."
                : "Full Stack .NET Developer dedicated to engineering reliable, modular, and high-performance software systems.")}
            </p>

            <div className="mt-4 pt-4 border-t border-zinc-800 text-sm text-zinc-400 leading-relaxed space-y-3">
              {info.bioLong && info.bioLong.length > 0 ? (
                info.bioLong.map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <p>
                  {activeLanguage === 'fr'
                    ? "Au sein du GROUPE DIRECTSOFT, je participe au développement de modules ERP critiques, à l'optimisation des requêtes LINQ / SQL et à l'implémentation de principes d'architecture logicielle (SOLID, Injection de dépendances, Tests unitaires)."
                    : "At GROUPE DIRECTSOFT, I contribute to enterprise ERP modules, LINQ / SQL query optimizations, and strict software design patterns (SOLID, Dependency Injection, Unit Testing)."}
                </p>
              )}
            </div>
          </div>

          {/* Key Dynamic Principles Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {principles.map((item, idx) => (
              <div 
                key={idx} 
                className="p-4 bg-[#0d0e14] border border-zinc-800 hover:border-red-500 hover:shadow-[4px_4px_0px_0px_#ef4444] transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-red-500 font-bold tracking-widest uppercase">
                    [P_0{idx + 1}]
                  </span>
                </div>
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-1 group-hover:text-red-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
};
