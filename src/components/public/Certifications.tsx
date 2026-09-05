import React from 'react';
import { useData } from '../../context/DataContext';
import { Download, Award } from 'lucide-react';

export const Certifications: React.FC = () => {
  const { data, activeLanguage } = useData();
  const certs = (data.certifications || []).filter(c => c.isActive).sort((a, b) => a.order - b.order);

  if (certs.length === 0) return null;

  const defaultImages = [
    '/assets/certi.jpeg',
    '/assets/murf-ai.jpeg',
    '/assets/workshop.jpeg'
  ];

  return (
    <section id="certifications" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-8 border-t border-zinc-800 font-mono">
      
      {/* Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 text-red-500 text-xs font-bold tracking-widest uppercase mb-3">
          <span className="w-2.5 h-2.5 bg-red-500 inline-block" />
          <span>// 05. CREDENTIALS //</span>
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter">
          {activeLanguage === 'fr' ? 'CERTIFICATIONS & TITRES' : 'PROFESSIONAL CREDENTIALS'}
        </h2>
      </div>

      {/* Grid of Brutalist Certification Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((cert, idx) => {
          const imageSrc = (cert as any).imageUrl || defaultImages[idx % defaultImages.length];
          const badgeText = cert.issuer || 'CREDENTIAL';
          const numStr = String(idx + 1).padStart(2, '0');

          return (
            <div
              key={cert.id}
              className="bg-[#0d0e14] border border-zinc-800 hover:border-red-500 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.9)] hover:shadow-[7px_7px_0px_0px_#ef4444] transition-all duration-200 overflow-hidden flex flex-col justify-between group"
            >
              {/* Image Preview */}
              <div className="relative h-48 overflow-hidden bg-zinc-950 border-b border-zinc-800">
                <img
                  src={imageSrc}
                  alt={cert.name}
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e14] via-transparent to-transparent opacity-70" />
                <div className="absolute top-3 right-3 font-mono font-black text-xl text-white/30 group-hover:text-red-500 transition-colors">
                  #{numStr}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-red-400 bg-red-950/40 border border-red-500/40 px-2 py-0.5">
                      {badgeText}
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      {cert.issueDate || '2024'}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white mb-1.5 uppercase leading-snug tracking-tight group-hover:text-red-400 transition-colors">
                    {cert.name}
                  </h3>

                  {cert.description && (
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {cert.description}
                    </p>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-bold">
                    VERIFIED // AUTH
                  </span>

                  <a
                    href={cert.credentialUrl || imageSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-red-600 text-white border border-zinc-700 hover:border-red-500 text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{activeLanguage === 'fr' ? 'VOIR' : 'VIEW'}</span>
                  </a>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
