import React from 'react';
import { useData } from '../../context/DataContext';
import { X, FileText, Download, Globe, Calendar } from 'lucide-react';

export const CvModal: React.FC = () => {
  const { data, activeCvModal, setActiveCvModal, activeLanguage } = useData();

  if (!activeCvModal) return null;

  const cvList = data.personalInfo.cvList || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveCvModal(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Info */}
        <div className="space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-950">
            {activeLanguage === 'fr' ? 'Télécharger le Curriculum Vitae' : 'Download Curriculum Vitae'}
          </h3>
          <p className="text-xs text-slate-500">
            {activeLanguage === 'fr' ? 'Sélectionnez la version du CV souhaitée.' : 'Select your preferred CV version.'}
          </p>
        </div>

        {/* CV Versions List */}
        <div className="space-y-3">
          {cvList.map((cv) => (
            <div
              key={cv.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:border-red-500/50 hover:bg-white transition-all shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {cv.label}
                  </span>
                  {cv.isDefault && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700">
                      Défaut
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 uppercase font-semibold">
                    <Globe className="w-3 h-3" />
                    {cv.language}
                  </span>
                  {cv.updatedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Mis à jour {cv.updatedAt}
                    </span>
                  )}
                </div>
              </div>

              <a
                href={cv.url || '#'}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </a>
            </div>
          ))}

          {cvList.length === 0 && (
            <p className="text-xs text-slate-400 py-4 text-center">Aucun CV disponible pour le moment.</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setActiveCvModal(false)}
            className="px-5 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
