import React from 'react';
import { useData } from '../../context/DataContext';
import { ArrowUp, Linkedin, Github, Mail } from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg 
    className={className} 
    fill="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.587 1.961.956 3.162.956 3.181 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.77-5.767-5.772zm3.398 8.235c-.147.417-.745.767-1.025.795-.278.028-.636.143-2.115-.472-1.89-1.002-3.111-2.919-3.205-3.045-.094-.127-.768-1.022-.768-1.95 0-.928.486-1.385.659-1.573.173-.189.378-.236.505-.236.126 0 .252.002.362.008.117.006.273-.044.427.327.158.381.539 1.314.586 1.41.047.095.079.206.016.332-.063.127-.095.206-.189.317-.095.11-.199.247-.284.332-.095.095-.194.198-.083.389.111.19 1.157 1.905 2.514 2.529.351.161.564.133.729-.057.165-.19.708-.824.897-1.109.189-.285.378-.238.63-.143.252.095 1.603.756 1.879.893.276.137.459.206.526.322.067.116.067.674-.08 1.091z" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.981-1.306C8.455 21.543 10.17 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.61 0-3.134-.442-4.453-1.217l-.319-.187-2.964.777.791-2.889-.205-.327C3.993 15.011 3.5 13.551 3.5 12c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z" />
  </svg>
);

export const Footer: React.FC = () => {
  const { data, activeLanguage } = useData();
  const info = data.personalInfo;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappPhone = (info.phone || '2250709837455').replace(/\D/g, '');

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
        <div className="flex items-center gap-3">
          {/* LinkedIn Icon Button */}
          <a
            href={info.linkedinUrl || "https://linkedin.com/in/abdou-salam-moussa"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn - Abdou Salam Moussa"
            className="w-10 h-10 flex items-center justify-center border border-zinc-800 bg-[#0c0d12] text-zinc-400 hover:text-white hover:border-[#0a66c2] hover:bg-[#0a66c2]/10 hover:shadow-[3px_3px_0px_#0a66c2] transition-all duration-150"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          {/* GitHub Icon Button */}
          <a
            href={info.githubUrl || "https://github.com"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
            className="w-10 h-10 flex items-center justify-center border border-zinc-800 bg-[#0c0d12] text-zinc-400 hover:text-white hover:border-zinc-400 hover:bg-zinc-800 hover:shadow-[3px_3px_0px_#ffffff] transition-all duration-150"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Email Icon Button */}
          <a
            href={`mailto:${info.email || 'moussasalam86@gmail.com'}`}
            aria-label="Email"
            title={`Email : ${info.email || 'moussasalam86@gmail.com'}`}
            className="w-10 h-10 flex items-center justify-center border border-zinc-800 bg-[#0c0d12] text-zinc-400 hover:text-red-400 hover:border-red-500 hover:bg-red-500/10 hover:shadow-[3px_3px_0px_#ef4444] transition-all duration-150"
          >
            <Mail className="w-4 h-4" />
          </a>

          {/* WhatsApp Icon Button */}
          <a
            href={`https://wa.me/${whatsappPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            title={`WhatsApp : +${whatsappPhone}`}
            className="w-10 h-10 flex items-center justify-center border border-zinc-800 bg-[#0c0d12] text-zinc-400 hover:text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/10 hover:shadow-[3px_3px_0px_#10b981] transition-all duration-150"
          >
            <WhatsAppIcon className="w-4 h-4" />
          </a>
        </div>

        <div className="text-zinc-400 text-center md:text-right font-medium text-[11px]">
          © {new Date().getFullYear()} MOUSSA ABDOU SALAM — GROUPE DIRECTSOFT
        </div>
      </div>
    </footer>
  );
};


