import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageSection } from '../../types';
import { Layers, ArrowUp, ArrowDown, Edit3, X, CheckCircle2, Save } from 'lucide-react';

export const AdminSections: React.FC = () => {
  const { data, updateData } = useData();
  const [sections, setSections] = useState<PageSection[]>([...(data.pageSections || [])]);
  const [savedNotice, setSavedNotice] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);

  const toggleSection = (id: string) => {
    const next = sections.map(s => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s);
    setSections(next);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const next = [...sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= next.length) return;

    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;

    next.forEach((s, i) => s.order = i + 1);
    setSections(next);
  };

  const handleSaveAll = async () => {
    await updateData({ pageSections: sections });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;
    const next = sections.map(s => s.id === editingSection.id ? editingSection : s);
    setSections(next);
    setEditingSection(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Homepage Section Builder & Ordering</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Enable or disable homepage modules, adjust layout presentation sequence, and edit section titles.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Apply Section Changes</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Page sections hierarchy saved successfully!</span>
        </div>
      )}

      {/* Sections Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-850 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Section Identifier</th>
              <th className="py-3 px-4">Display Heading</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sections.map((s, idx) => (
              <tr key={s.id} className="hover:bg-slate-800/40">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === sections.length - 1}
                      onClick={() => moveSection(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-slate-500 ml-1">{s.order}</span>
                  </div>
                </td>

                <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                  {s.sectionKey}
                </td>

                <td className="py-3 px-4">
                  <div className="font-bold text-white">{s.title}</div>
                  <div className="text-[11px] text-slate-500">{s.subtitle}</div>
                </td>

                <td className="py-3 px-4">
                  <button
                    onClick={() => toggleSection(s.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                      s.isEnabled
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                        : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {s.isEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => setEditingSection({ ...s })}
                    className="p-1.5 text-slate-400 hover:text-indigo-400 rounded"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Edit Section: {editingSection.sectionKey}
              </h3>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Section Title</label>
                <input
                  type="text"
                  required
                  value={editingSection.title}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Section Subtitle / Eyebrow</label>
                <input
                  type="text"
                  value={editingSection.subtitle || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <input
                    type="checkbox"
                    checked={editingSection.isEnabled}
                    onChange={(e) => setEditingSection({ ...editingSection, isEnabled: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-600"
                  />
                  <span>Enable Section on Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:bg-slate-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shadow-md"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
