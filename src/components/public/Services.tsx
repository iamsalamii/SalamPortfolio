import React from 'react';
import { useData, getLocalizedField } from '../../context/DataContext';
import { Server, Database, Layout, ShieldCheck, Sparkles, Bot } from 'lucide-react';

export const Services: React.FC = () => {
  const { data, activeLanguage } = useData();

  const defaultServices = [
    {
      num: '01',
      title: activeLanguage === 'fr' ? 'ARCHITECTURE BACKEND & C#/.NET' : '.NET BACKEND ARCHITECTURE',
      desc: activeLanguage === 'fr'
        ? "Conception d'APIs REST modulaires, résilientes et scalables avec C# 13, ASP.NET Core, Entity Framework Core, respect rigoureux des principes SOLID, Clean Architecture et Domain-Driven Design."
        : "Engineering modular, resilient REST APIs and microservices using C# 13, ASP.NET Core, EF Core, SOLID patterns, and Domain-Driven Design.",
      techs: ['C# 13', '.NET 9', 'ASP.NET Core', 'Clean Architecture', 'REST APIs'],
      icon: Server
    },
    {
      num: '02',
      title: activeLanguage === 'fr' ? 'ERP, DATA & BASES DE DONNÉES' : 'ERP & DATABASE ENGINEERING',
      desc: activeLanguage === 'fr'
        ? "Modélisation relationnelle de données métier sous SQL Server et PostgreSQL. Optimisation de requêtes LINQ / SQL volumineuses, indexation ciblée, intégrité transactionnelle et migrations EF Core."
        : "Relational database modeling under SQL Server & PostgreSQL. High-volume LINQ / SQL query optimizations, indexing strategies, transactional integrity and EF Core migrations.",
      techs: ['PostgreSQL', 'SQL Server', 'EF Core', 'Migrations', 'Transactions'],
      icon: Database
    },
    {
      num: '03',
      title: activeLanguage === 'fr' ? 'FRONTEND RÉACTIF & MODERNE' : 'MODERN REACT & TS FRONTEND',
      desc: activeLanguage === 'fr'
        ? "Développement d'interfaces web réactives, ergonomiques et ultra-rapides avec React, TypeScript et Tailwind CSS. Intégration fluide et typée avec les contrôleurs d'API .NET."
        : "Developing high-performance, fluid web applications with React, TypeScript, and Tailwind CSS. Seamless, strongly-typed integration with .NET API controllers.",
      techs: ['React', 'TypeScript', 'Tailwind CSS', 'State Mgmt', 'Vite'],
      icon: Layout
    },
    {
      num: '04',
      title: activeLanguage === 'fr' ? 'INGÉNIERIE IA & WORKFLOWS AGENTIQUES' : 'AI ENGINEERING & AGENTIC WORKFLOWS',
      desc: activeLanguage === 'fr'
        ? "Conception de workflows de développement assistés par l'IA générative, orchestration d'outils et intégration de services d'agents IA (Semantic Kernel, APIs LLM) avec sas de validation rigoureux et contrôle qualité systématique."
        : "Designing AI-assisted development workflows, tool orchestration, and agentic integrations (Semantic Kernel, LLM APIs) with strict quality gates and automated validation.",
      techs: ['Semantic Kernel', 'OpenAI', 'Claude', 'Agent Orchestration', 'Prompt Eng.'],
      icon: Bot
    },
    {
      num: '05',
      title: activeLanguage === 'fr' ? 'QUALITÉ, TDD & SÉCURITÉ' : 'QUALITY, TDD & SECURITY',
      desc: activeLanguage === 'fr'
        ? "Automatisation des suites de tests unitaires et d'intégration avec xUnit, pipelines CI/CD, conteneurisation Docker et sécurisation des endpoints contre les vulnérabilités OWASP Top 10."
        : "Automated unit & integration testing via xUnit, CI/CD pipelines, Docker deployment containers, and OWASP Top 10 security mitigations.",
      techs: ['xUnit', 'TDD', 'Docker', 'CI/CD', 'OWASP Top 10'],
      icon: ShieldCheck
    }
  ];

  const services = (data.services && data.services.length > 0)
    ? data.services.map((s, idx) => ({
        num: String(idx + 1).padStart(2, '0'),
        title: getLocalizedField(s, 'title', activeLanguage) || s.title,
        desc: getLocalizedField(s, 'description', activeLanguage) || s.description,
        techs: s.features || [],
        icon: idx === 0 ? Server : idx === 1 ? Database : idx === 2 ? Layout : idx === 3 ? Bot : ShieldCheck
      }))
    : defaultServices;

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

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                <h3 className="text-lg sm:text-xl font-black text-white mb-3 uppercase tracking-tight group-hover:text-red-400 transition-colors">
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

