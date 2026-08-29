import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { NavigationItem } from '../../types';
import { Navigation, Plus, Edit3, Trash2, ArrowUp, ArrowDown, X } from 'lucide-react';

export const AdminNavigation: React.FC = () => {
  const { data, updateData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNav, setEditingNav] = useState<Partial<NavigationItem> | null>(null);

  const navItems = data.navigationItems || [];

  const openCreateModal = () => {
    setEditingNav({
      id: `nav_${Date.now()}`,
      label: 'New Link',
      url: '#',
      order: navItems.length + 1,
      isActive: true,
      openInNewTab: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: NavigationItem) => {
    setEditingNav({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this navigation link?')) {
      const next = navItems.filter(n => n.id !== id);
      await updateData({ navigationItems: next });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNav?.label || !editingNav?.url) return;

    let nextNav: NavigationItem[] = [];
    const exists = navItems.some(n => n.id === editingNav.id);

    if (exists) {
      nextNav = navItems.map(n => n.id === editingNav.id ? (editingNav as NavigationItem) : n);
    } else {
      nextNav = [...navItems, editingNav as NavigationItem];
    }

    await updateData({ navigationItems: nextNav });
    setIsModalOpen(false);
    setEditingNav(null);
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const next = [...navItems];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= next.length) return;

    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;

    // reindex order
    next.forEach((item, i) => item.order = i + 1);
    await updateData({ navigationItems: next });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-indigo-400" />
            <span>Public Navigation Bar Menu</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure header navigation anchors, order, translations, and external redirection links.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Nav Link</span>
        </button>
      </div>

      {/* Navigation Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-850 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Label</th>
              <th className="py-3 px-4">Destination URL / Anchor</th>
              <th className="py-3 px-4">Active</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {navItems.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-800/40">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveOrder(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === navItems.length - 1}
                      onClick={() => moveOrder(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-slate-500 ml-1">{item.order}</span>
                  </div>
                </td>

                <td className="py-3 px-4 font-bold text-white">
                  {item.label}
                </td>

                <td className="py-3 px-4 font-mono text-indigo-400">
                  {item.url}
                </td>

                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.isActive ? 'Visible' : 'Hidden'}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && editingNav && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingNav.label ? `Edit Navigation Link` : 'Add Navigation Link'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Label *</label>
                <input
                  type="text"
                  required
                  value={editingNav.label || ''}
                  onChange={(e) => setEditingNav({ ...editingNav, label: e.target.value })}
                  placeholder="e.g. Projects or nav.projects"
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target URL / Anchor *</label>
                <input
                  type="text"
                  required
                  value={editingNav.url || ''}
                  onChange={(e) => setEditingNav({ ...editingNav, url: e.target.value })}
                  placeholder="e.g. #projects or https://..."
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <input
                    type="checkbox"
                    checked={editingNav.isActive ?? true}
                    onChange={(e) => setEditingNav({ ...editingNav, isActive: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-600"
                  />
                  <span>Active Link</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <input
                    type="checkbox"
                    checked={editingNav.openInNewTab || false}
                    onChange={(e) => setEditingNav({ ...editingNav, openInNewTab: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-600"
                  />
                  <span>Open in New Tab</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:bg-slate-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shadow-md"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
