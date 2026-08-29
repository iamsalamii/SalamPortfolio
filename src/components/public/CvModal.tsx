import React from 'react';
import { useData } from '../../context/DataContext';
import { X, FileText, Download, CheckCircle2, Globe, Calendar } from 'lucide-react';

export const CvModal: React.FC = () => {
  const { data, activeCvModal, setActiveCvModal, t } = useData();

  if (!activeCvModal) return null;

  const cvList = data.personalInfo.cvList || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveCvModal(false)}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Info */}
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('cv_modal.title', 'Download Curriculum Vitae')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('cv_modal.desc', 'Select a CV version tailored to your preferred language.')}
          </p>
        </div>

        {/* CV Versions List */}
        <div className="space-y-3">
          {cvList.map((cv) => (
            <div
              key={cv.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 hover:border-indigo-400 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {cv.label}
                  </span>
                  {cv.isDefault && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 uppercase font-semibold">
                    <Globe className="w-3 h-3" />
                    {cv.language}
                  </span>
                  {cv.updatedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Updated {cv.updatedAt}
                    </span>
                  )}
                </div>
              </div>

              <a
                href={cv.url || '#'}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (!cv.url || cv.url.startsWith('#')) {
                    alert('Demo CV download simulated for ' + cv.label);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('cv_modal.download', 'PDF')}</span>
              </a>
            </div>
          ))}

          {cvList.length === 0 && (
            <p className="text-xs text-slate-400 py-4 text-center">No CV versions uploaded yet.</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setActiveCvModal(false)}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {t('cv_modal.close', 'Close')}
          </button>
        </div>

      </div>
    </div>
  );
};
