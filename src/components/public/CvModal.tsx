import React from 'react';
import { useData } from '../../context/DataContext';
import { X, FileText, Download, Globe, Calendar } from 'lucide-react';

export const CvModal: React.FC = () => {
  const { data, activeCvModal, setActiveCvModal, activeLanguage } = useData();

  if (!activeCvModal) return null;

  const cvList = data.personalInfo.cvList || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-mono">
      <div 
        className="relative w-full max-w-lg bg-[#0c0d12] border-2 border-zinc-700 shadow-[8px_8px_0px_#ef4444] p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 text-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveCvModal(false)}
          className="absolute top-5 right-5 p-2 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Info */}
        <div className="space-y-1">
          <div className="w-10 h-10 bg-red-600/10 text-red-500 border border-red-500/40 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            {activeLanguage === 'fr' ? '// CURRICULUM VITAE //' : '// RESUME ARCHIVE //'}
          </h3>
          <p className="text-xs text-zinc-400 font-normal">
            {activeLanguage === 'fr' ? 'Sélectionnez la version du CV souhaitée en téléchargement direct.' : 'Select preferred CV version for instant download.'}
          </p>
        </div>

        {/* CV Versions List */}
        <div className="space-y-3">
          {cvList.map((cv) => (
            <div
              key={cv.id}
              className="p-4 bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3 hover:border-red-500 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {cv.label}
                  </span>
                  {cv.isDefault && (
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-red-600/20 text-red-400 border border-red-500/30">
                      PRINCIPAL
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1 uppercase font-bold text-zinc-400">
                    <Globe className="w-3 h-3" />
                    {cv.language}
                  </span>
                  {cv.updatedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {cv.updatedAt}
                    </span>
                  )}
                </div>
              </div>

              <a
                href={cv.url || '#'}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-600 text-black hover:text-white font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_#ef4444] shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </a>
            </div>
          ))}

          {cvList.length === 0 && (
            <p className="text-xs text-zinc-500 py-4 text-center">[ AUCUN FICHIER CV DISPONIBLE ]</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setActiveCvModal(false)}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 bg-zinc-900 cursor-pointer"
          >
            [ FERMER ]
          </button>
        </div>

      </div>
    </div>
  );
};

