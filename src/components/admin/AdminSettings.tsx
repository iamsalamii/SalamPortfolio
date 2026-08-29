import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Settings, Save, CheckCircle2, RefreshCw } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { data, updateModule } = useData();
  const [theme, setTheme] = useState({
    primaryColor: '#dc2626',
    secondaryColor: '#ef4444',
    accentColor: '#991b1b',
    ...(data.themeSettings || {})
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateModule('themeSettings', theme);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Settings className="w-5 h-5 text-red-600" />
            <span>Paramètres Généraux du Portfolio</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Paramètres d'ambiance et identité visuelle du portfolio.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer les Paramètres</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Paramètres sauvegardés avec succès !</span>
        </div>
      )}

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase text-red-600 tracking-wider">
          Palette Visuelle Crimson Precision
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Couleur Principale</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-1"
              />
              <input
                type="text"
                value={theme.primaryColor}
                onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Couleur Secondaire</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.secondaryColor}
                onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-1"
              />
              <input
                type="text"
                value={theme.secondaryColor}
                onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Couleur d'Accent</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.accentColor}
                onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-1"
              />
              <input
                type="text"
                value={theme.accentColor}
                onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
