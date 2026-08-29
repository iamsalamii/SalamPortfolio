import React from 'react';
import { useData } from '../../context/DataContext';
import { Layers, ArrowUp, ArrowDown } from 'lucide-react';

export const AdminSections: React.FC = () => {
  const { data, updateData } = useData();
  const sections = data.pageSections || [];

  const toggleSection = async (key: string) => {
    const next = sections.map(s => s.sectionKey === key ? { ...s, isEnabled: !s.isEnabled } : s);
    await updateData({ pageSections: next });
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const next = [...sections];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;

    // re-index order
    const updated = next.map((s, idx) => ({ ...s, order: idx + 1 }));
    await updateData({ pageSections: updated });
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-600" />
            <span>Sections &amp; Ordre d'Affichage</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Réorganisez l'ordre des blocs sur la page d'accueil ou désactivez une section.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((section, idx) => (
          <div
            key={section.sectionKey}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center">
                {idx + 1}
              </span>
              <div>
                <p className="font-bold text-slate-950 text-sm">{section.title}</p>
                <p className="text-xs font-mono text-slate-400">{section.sectionKey}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={idx === 0}
                onClick={() => moveOrder(idx, 'up')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                disabled={idx === sections.length - 1}
                onClick={() => moveOrder(idx, 'down')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleSection(section.sectionKey)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  section.isEnabled
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {section.isEnabled ? 'Actif' : 'Désactivé'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
