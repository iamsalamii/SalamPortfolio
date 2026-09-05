import React from 'react';
import { useData } from '../../context/DataContext';
import { Download, ExternalLink } from 'lucide-react';

export const Certifications: React.FC = () => {
  const { data, activeLanguage } = useData();
  const certs = (data.certifications || []).filter(c => c.isActive).sort((a, b) => a.order - b.order);

  if (certs.length === 0) return null;

  // Fallback visual mockups from assets if not set in DB
  const defaultImages = [
    '/assets/certi.jpeg',
    '/assets/murf-ai.jpeg',
    '/assets/workshop.jpeg'
  ];

  return (
    <section id="certifications" className="py-24 sm:py-32 max-w-7xl mx-auto px-6 sm:px-12 bg-white font-sans">
      
      {/* Header */}
      <div className="mb-14">
        <div className="inline-block border border-gray-300 rounded-full px-5 py-1.5 text-xs text-gray-600 font-bold mb-4 shadow-xs bg-white uppercase tracking-widest">
          {activeLanguage === 'fr' ? 'Titres & Certificats' : 'System Badges'}
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-[1.1] relative">
          {activeLanguage === 'fr' ? 'Attestations & Certifications' : 'Professional Credentials'}
          <span className="block mt-2 w-20 h-1 bg-[#ff2a2a] rounded-full" />
        </h2>
      </div>

      {/* Grid of Visual Certification Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8">
        {certs.map((cert, idx) => {
          const imageSrc = (cert as any).imageUrl || defaultImages[idx % defaultImages.length];
          const badgeText = cert.issuer || 'CREDENTIAL';
          const numStr = String(idx + 1).padStart(2, '0');

          return (
            <div
              key={cert.id}
              className="group relative bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] hover:border-gray-300 transition-all duration-500 flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="relative h-48 md:h-52 overflow-hidden bg-gray-100">
                <img
                  src={imageSrc}
                  alt={cert.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md font-mono">
                      {badgeText}
                    </span>
                    <span className="text-xs font-bold text-gray-300 tracking-widest font-mono">
                      {numStr}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 mb-1 leading-snug tracking-tight group-hover:text-[#ff2a2a] transition-colors duration-300">
                    {cert.name}
                  </h3>

                  {cert.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {cert.description}
                    </p>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">
                    {cert.issueDate || '2024'}
                  </span>

                  <a
                    href={cert.credentialUrl || imageSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-xs font-bold hover:bg-[#ff2a2a] transition-all duration-300 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{activeLanguage === 'fr' ? 'Consulter' : 'Download'}</span>
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
