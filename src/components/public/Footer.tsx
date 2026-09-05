import React from 'react';
import { useData } from '../../context/DataContext';
import { ArrowUp, Terminal, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { data, activeLanguage } = useData();
  const info = data.personalInfo;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-zinc-800/80 bg-[#07080b] text-zinc-400 font-mono">
      {/* Top Banner with Massive Designer Monospace Brand Mark */}
      <div className="border-b border-zinc-800/60 py-12 px-6 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-red-500 font-bold tracking-widest uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>// DISPATCH &amp; ARCHIVE //</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              SALAM<span className="text-red-500">_</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-3 max-w-md font-medium">
              {activeLanguage === 'fr' 
                ? 'Conception logicielle robuste .NET 9 & architectures fullstack distribuées.'
                : 'Robust .NET 9 software design & distributed fullstack architectures.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 border border-zinc-800 bg-zinc-900/60 rounded-none text-xs">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">SYSTÈME DISPONIBLE</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                DISPONIBLE POUR MISSIONS
              </span>
            </div>

            <button
              onClick={scrollToTop}
              className="px-5 py-3 border-2 border-white bg-white text-black hover:bg-red-600 hover:text-white hover:border-red-600 font-black text-xs uppercase tracking-wider transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#ef4444]"
            >
              <span>HAUT DE PAGE</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation & Links */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <a
            href="https://linkedin.com/in/abdou-salam-moussa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-red-400 uppercase font-bold tracking-wider transition-colors"
          >
            [ LINKEDIN ]
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-red-400 uppercase font-bold tracking-wider transition-colors"
          >
            [ GITHUB ]
          </a>
          <a
            href={`mailto:${info.email || 'moussasalam86@gmail.com'}`}
            className="text-zinc-400 hover:text-red-400 uppercase font-bold tracking-wider transition-colors"
          >
            [ EMAIL ]
          </a>
          <a
            href={`https://wa.me/${(info.phone || '+22797682283').replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-emerald-400 uppercase font-bold tracking-wider transition-colors"
          >
            [ WHATSAPP ]
          </a>
        </div>

        <div className="text-zinc-400 text-center md:text-right font-medium text-[11px]">
          © {new Date().getFullYear()} MOUSSA ABDOU SALAM — GROUPE DIRECTSOFT
        </div>
      </div>
    </footer>
  );
};

