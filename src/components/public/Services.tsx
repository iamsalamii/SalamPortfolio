import React from 'react';
import { useData } from '../../context/DataContext';
import { Server, Database, Layout, ShieldCheck } from 'lucide-react';

export const Services: React.FC = () => {
  const { activeLanguage } = useData();

  const services = [
    {
      num: '01',
      title: activeLanguage === 'fr' ? 'ARCHITECTURE BACKEND .NET' : '.NET BACKEND ARCHITECTURE',
      desc: activeLanguage === 'fr'
        ? "Conception d'APIs REST modulaires et scalables avec C# 13, ASP.NET Core, EF Core, respect rigoureux des principes SOLID, Clean Architecture et Domain-Driven Design."
        : "Engineering modular, resilient REST APIs and microservices using C# 13, ASP.NET Core, EF Core, SOLID patterns, and Domain-Driven Design.",
      techs: ['C#', '.NET 9', 'ASP.NET Core', 'Clean Architecture', 'RESTful API'],
      icon: Server
    },
    {
      num: '02',
      title: activeLanguage === 'fr' ? 'ERP & BASES DE DONNÉES' : 'ERP & DATABASE ENGINEERING',
      desc: activeLanguage === 'fr'
        ? "Modélisation relationnelle de données métier sous SQL Server et PostgreSQL. Optimisation de requêtes LINQ / SQL, indexation et intégrité transactionnelle."
        : "Relational database schema modeling under SQL Server & PostgreSQL. LINQ / SQL query optimizations, indexing strategies, and transactional integrity.",
      techs: ['SQL Server', 'PostgreSQL', 'EF Core', 'Migrations', 'Transactions'],
      icon: Database
    },
    {
      num: '03',
      title: activeLanguage === 'fr' ? 'FRONTEND RÉACTIF & MODERNE' : 'MODERN REACT & TS FRONTEND',
      desc: activeLanguage === 'fr'
        ? "Développement d'interfaces web réactives, ergonomiques et rapides avec React, TypeScript et Tailwind CSS. Intégration fluide avec les APIs .NET."
        : "Developing high-performance, fluid web applications with React, TypeScript, and Tailwind CSS. Seamless synchronization with .NET backend APIs.",
      techs: ['React', 'TypeScript', 'Tailwind CSS', 'State Mgmt', 'Vite'],
      icon: Layout
    },
    {
      num: '04',
      title: activeLanguage === 'fr' ? 'QUALITÉ, TDD & SÉCURITÉ' : 'QUALITY, TDD & SECURITY',
      desc: activeLanguage === 'fr'
        ? "Couverture de tests unitaires et d'intégration avec xUnit, pipelines CI/CD, conteneurisation Docker et sécurisation des endpoints contre les risques OWASP."
        : "Automated unit & integration testing via xUnit, CI/CD pipelines, Docker deployment containers, and OWASP security vulnerability mitigations.",
      techs: ['xUnit', 'TDD', 'Docker', 'CI/CD', 'OWASP Top 10'],
      icon: ShieldCheck
    }
  ];

  return (
    <section id="services" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-8 border-t border-zinc-800 font-mono">
      
      {/* Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 text-red-500 text-xs font-bold tracking-widest uppercase mb-3">
          <span className="w-2.5 h-2.5 bg-red-500 inline-block" />
          <span>// 07. SERVICES & PRESTATIONS //</span>
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter">
          {activeLanguage === 'fr' ? 'DOMAINES D’EXPERTISE' : 'SPECIALIZATION FIELDS'}
        </h2>
      </div>

      {/* Services Grid (2x2 Brutalist) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((srv) => {
          const Icon = srv.icon;
          return (
            <div
              key={srv.num}
              className="p-6 sm:p-8 bg-[#0d0e14] border border-zinc-800 hover:border-red-500 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.9)] hover:shadow-[7px_7px_0px_0px_#ef4444] transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-zinc-800/80 pb-3">
                  <span className="text-2xl sm:text-3xl font-black text-red-500 font-mono tracking-widest">
                    #{srv.num}
                  </span>
                  <div className="p-2.5 bg-zinc-950 border border-zinc-800 group-hover:border-red-500/60 transition-colors">
                    <Icon className="w-5 h-5 text-zinc-300 group-hover:text-red-400" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white mb-3 uppercase tracking-tight group-hover:text-red-400 transition-colors">
                  {srv.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                  {srv.desc}
                </p>
              </div>

              {/* Tag Badges */}
              <div className="pt-6 mt-6 border-t border-zinc-800/80 flex flex-wrap gap-1.5">
                {srv.techs.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
