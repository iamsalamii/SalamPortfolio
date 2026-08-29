import React from 'react';
import { useData } from '../../context/DataContext';
import { Navigation, Plus, Trash2, CheckCircle2, Save } from 'lucide-react';

export const AdminNavigation: React.FC = () => {
  const { data, updateData } = useData();
  const items = data.navigationItems || [];

  const toggleItem = async (id: string) => {
    const next = items.map(item => item.id === id ? { ...item, isVisible: !item.isVisible } : item);
    await updateData({ navigationItems: next });
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-red-600" />
            <span>Menu de Navigation</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Activez ou désactivez les liens affichés dans la barre de navigation publique.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 text-sm">{item.label}</span>
              <span className="text-xs font-mono text-slate-400">{item.href}</span>
            </div>

            <button
              onClick={() => toggleItem(item.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                item.isVisible
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {item.isVisible ? 'Visible' : 'Masqué'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
