import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Technology, TechCategory } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { 
  Code2, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Search, 
  Layers, 
  X, 
  CheckCircle2, 
  Tag 
} from 'lucide-react';

export const AdminTechnologies: React.FC = () => {
  const { data, updateData } = useData();
  const [activeTab, setActiveTab] = useState<'tech' | 'categories'>('tech');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Partial<Technology> | null>(null);

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Partial<TechCategory> | null>(null);

  const technologies = data.technologies || [];
  const categories = data.techCategories || [];

  const filteredTech = technologies.filter(t => {
    const matchCat = selectedCategoryFilter === 'all' || t.categoryId === selectedCategoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  // Open Tech Modal
  const openCreateTechModal = () => {
    setEditingTech({
      id: `tech_${Date.now()}`,
      name: '',
      categoryId: categories[0]?.id || 'cat_languages',
      icon: 'Code2',
      brandColor: '#512BD4',
      description: '',
      officialDocsUrl: 'https://learn.microsoft.com/dotnet/',
      isPrimary: false,
      isActive: true,
      order: technologies.length + 1
    });
    setIsTechModalOpen(true);
  };

  const openEditTechModal = (tech: Technology) => {
    setEditingTech({ ...tech });
    setIsTechModalOpen(true);
  };

  const handleDeleteTech = async (id: string) => {
    if (confirm('Delete this technology?')) {
      const next = technologies.filter(t => t.id !== id);
      await updateData({ technologies: next });
    }
  };

  const handleSaveTech = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTech?.name) return;

    let nextTech: Technology[] = [];
    const exists = technologies.some(t => t.id === editingTech.id);

    if (exists) {
      nextTech = technologies.map(t => t.id === editingTech.id ? (editingTech as Technology) : t);
    } else {
      nextTech = [...technologies, editingTech as Technology];
    }

    await updateData({ technologies: nextTech });
    setIsTechModalOpen(false);
    setEditingTech(null);
  };

  // Open Category Modal
  const openCreateCatModal = () => {
    setEditingCat({
      id: `cat_${Date.now()}`,
      name: '',
      key: `category_${Date.now()}`,
      order: categories.length + 1,
      description: ''
    });
    setIsCatModalOpen(true);
  };

  const openEditCatModal = (cat: TechCategory) => {
    setEditingCat({ ...cat });
    setIsCatModalOpen(true);
  };

  const handleDeleteCat = async (id: string) => {
    if (confirm('Delete this category? Associated technologies might need reassignment.')) {
      const next = categories.filter(c => c.id !== id);
      await updateData({ techCategories: next });
    }
  };

  const handleSaveCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat?.name) return;

    let nextCats: TechCategory[] = [];
    const exists = categories.some(c => c.id === editingCat.id);

    if (exists) {
      nextCats = categories.map(c => c.id === editingCat.id ? (editingCat as TechCategory) : c);
    } else {
      nextCats = [...categories, editingCat as TechCategory];
    }

    await updateData({ techCategories: nextCats });
    setIsCatModalOpen(false);
    setEditingCat(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <span>Technologies & Ecosystem Stack</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your runtime stacks, frameworks, libraries, brand colors, documentation links, and categorized groupings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'tech' ? (
            <button
              onClick={openCreateTechModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Technology</span>
            </button>
          ) : (
            <button
              onClick={openCreateCatModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('tech')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'tech' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Technologies ({technologies.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'categories' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Categories ({categories.length})
        </button>
      </div>

      {/* VIEW 1: Technologies Tab */}
      {activeTab === 'tech' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technologies..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tech Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTech.map((tech) => {
              const catName = categories.find(c => c.id === tech.categoryId)?.name || 'General';
              return (
                <div
                  key={tech.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: tech.brandColor || '#512BD4' }}
                      >
                        <IconRenderer name={tech.icon || 'Code2'} className="w-4 h-4" />
                      </div>

                      <div className="flex items-center gap-1">
                        {tech.isPrimary && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                            Primary
                          </span>
                        )}
                        {!tech.isActive && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-400">
                            Hidden
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="font-bold text-white text-sm">{tech.name}</h4>
                    <span className="text-[11px] text-slate-500 block mb-1">{catName}</span>
                    <p className="text-xs text-slate-400 line-clamp-2">{tech.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-[10px] text-slate-500 font-mono">
                      Order: {tech.order}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditTechModal(tech)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTech(tech.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-850 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4">Key / Identifier</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">{c.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{c.key || c.id}</td>
                    <td className="py-3 px-4 text-slate-400">{c.description || '—'}</td>
                    <td className="py-3 px-4 font-mono">{c.order}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditCatModal(c)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCat(c.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tech Edit Modal */}
      {isTechModalOpen && editingTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingTech.name ? `Edit: ${editingTech.name}` : 'Add Technology'}
              </h3>
              <button
                onClick={() => setIsTechModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTech} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tech Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTech.name || ''}
                    onChange={(e) => setEditingTech({ ...editingTech, name: e.target.value })}
                    placeholder="e.g. ASP.NET Core 9"
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={editingTech.categoryId}
                    onChange={(e) => setEditingTech({ ...editingTech, categoryId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lucide Icon Name</label>
                  <input
                    type="text"
                    value={editingTech.icon || 'Code2'}
                    onChange={(e) => setEditingTech({ ...editingTech, icon: e.target.value })}
                    placeholder="e.g. Server, Database, Cloud, Terminal"
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Hex Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editingTech.brandColor || '#512BD4'}
                      onChange={(e) => setEditingTech({ ...editingTech, brandColor: e.target.value })}
                      className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingTech.brandColor || '#512BD4'}
                      onChange={(e) => setEditingTech({ ...editingTech, brandColor: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Specialty</label>
                <textarea
                  rows={2}
                  value={editingTech.description || ''}
                  onChange={(e) => setEditingTech({ ...editingTech, description: e.target.value })}
                  placeholder="e.g. Enterprise RESTful API design, Minimal APIs, Middleware pipelines..."
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Docs URL</label>
                <input
                  type="text"
                  value={editingTech.officialDocsUrl || ''}
                  onChange={(e) => setEditingTech({ ...editingTech, officialDocsUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <input
                    type="checkbox"
                    checked={editingTech.isPrimary || false}
                    onChange={(e) => setEditingTech({ ...editingTech, isPrimary: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-600"
                  />
                  <span>Primary Competency</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <input
                    type="checkbox"
                    checked={editingTech.isActive ?? true}
                    onChange={(e) => setEditingTech({ ...editingTech, isActive: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-600"
                  />
                  <span>Active (Visible in portfolio)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTechModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:bg-slate-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shadow-md"
                >
                  Save Technology
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Edit Modal */}
      {isCatModalOpen && editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingCat.name ? `Edit: ${editingCat.name}` : 'Add Tech Category'}
              </h3>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCat} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCat.name || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  placeholder="e.g. Distributed Systems & Messaging"
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Key / Identifier</label>
                <input
                  type="text"
                  value={editingCat.key || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, key: e.target.value })}
                  placeholder="e.g. cat_distributed"
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={editingCat.description || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Display Order</label>
                <input
                  type="number"
                  value={editingCat.order || 1}
                  onChange={(e) => setEditingCat({ ...editingCat, order: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:bg-slate-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
