import React from 'react';
import { useData } from '../../context/DataContext';

export const About: React.FC = () => {
  const { data, activeLanguage } = useData();
  const info = data.personalInfo;

  const defaultPrinciples = [
    { title: "Architecture", description: "Clean Architecture, SOLID, Design Patterns" },
    { title: "Backend", description: "C#, ASP.NET Core, EF Core, SQL Server" },
    { title: "Frontend", description: "React, TypeScript, Tailwind CSS, Flutter" },
    { title: "Méthodologie", description: "Agilité SCRUM, TDD, Git Flow" }
  ];

  const principles = (info.principles && info.principles.length > 0) ? info.principles : defaultPrinciples;

  return (
    <section id="about" className="py-20 sm:py-28 max-w-5xl mx-auto px-6 sm:px-8 border-t border-slate-200">
      
      {/* Section Header */}
      <div className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-red-600 mb-2 font-bold">
          01 / {activeLanguage === 'fr' ? 'À propos' : 'About'}
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
          {activeLanguage === 'fr' ? 'Profil & Démarche' : 'Profile & Philosophy'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-14 items-start">
        
        {/* Photo Column */}
        <div className="md:col-span-5">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group shadow-sm">
            <img
              src={info.avatarUrl || '/assets/maphotops600.jpg'}
              alt={`${info.firstName} ${info.lastName}`}
              className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{info.firstName} {info.lastName}</span>
            <span>2026</span>
          </div>
        </div>

        {/* Biography & Principles Column */}
        <div className="md:col-span-7 space-y-6">
          <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
            {info.bioShort || (activeLanguage === 'fr' 
              ? "Développeur Full Stack .NET passionné par la conception de systèmes fiables, modulaires et performants. J'interviens sur l'ensemble de la chaîne technique, de la modélisation de base de données jusqu'à l'expérience utilisateur finale."
              : "Full Stack .NET Developer dedicated to engineering reliable, modular, and high-performance software systems.")}
          </p>

          {info.bioLong && info.bioLong.length > 0 ? (
            info.bioLong.map((para, i) => (
              <p key={i} className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {para}
              </p>
            ))
          ) : (
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {activeLanguage === 'fr'
                ? "Au sein du GROUPE DIRECTSOFT, je participe au développement de modules ERP critiques, à l'optimisation des requêtes LINQ / SQL et à l'implémentation de principes d'architecture logicielle (SOLID, Injection de dépendances, Tests unitaires)."
                : "At GROUPE DIRECTSOFT, I contribute to enterprise ERP modules, LINQ / SQL query optimizations, and strict software design patterns (SOLID, Dependency Injection, Unit Testing)."}
            </p>
          )}

          {/* Key Dynamic Principles Checklist */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-slate-600">
            {principles.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-500/50 hover:bg-red-50/20 transition-all">
                <span className="font-bold text-slate-950 block mb-1">{item.title}</span>
                <span className="text-slate-500">{item.description}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
