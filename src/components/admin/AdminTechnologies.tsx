import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Technology, TechCategory } from '../../types';
import { TechLogo } from '../common/TechLogos';
import { 
  Code2, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  X, 
  Save 
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

  const openCreateTechModal = () => {
    setEditingTech({
      id: `tech_${Date.now()}`,
      name: '',
      categoryId: categories[0]?.id || 'cat_backend',
      icon: 'Code2',
      brandColor: '#dc2626',
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

  const handleSaveTech = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTech || !editingTech.name) return;

    const exists = technologies.some(t => t.id === editingTech.id);
    let nextTech: Technology[];

    if (exists) {
      nextTech = technologies.map(t => t.id === editingTech.id ? (editingTech as Technology) : t);
    } else {
      nextTech = [...technologies, editingTech as Technology];
    }

    await updateData({ technologies: nextTech });
    setIsTechModalOpen(false);
    setEditingTech(null);
  };

  const handleDeleteTech = async (id: string) => {
    if (confirm('Voulez-vous supprimer cette technologie ?')) {
      const next = technologies.filter(t => t.id !== id);
      await updateData({ technologies: next });
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-red-600" />
            <span>Stack &amp; Technologies</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérez vos compétences techniques, logos officiels et catégories (.NET, React, Bases de données, etc.).
          </p>
        </div>

        <button
          onClick={openCreateTechModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-[0_4px_15px_rgba(220,38,38,0.25)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Technologie</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une technologie..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600"
          />
        </div>

        <div>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-red-600"
          >
            <option value="all">Toutes les Catégories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tech Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTech.map((t) => {
          const cat = categories.find(c => c.id === t.categoryId);
          return (
            <div
              key={t.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-red-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    <TechLogo name={t.name} size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950 text-sm leading-snug">{t.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{cat?.name || 'Général'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditTechModal(t)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTech(t.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {t.description && (
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Tech Edit Modal */}
      {isTechModalOpen && editingTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-950 text-base">
                {editingTech.name ? `Modifier : ${editingTech.name}` : 'Ajouter une Technologie'}
              </h3>
              <button onClick={() => setIsTechModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTech} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom de la Technologie *</label>
                <input
                  type="text"
                  required
                  value={editingTech.name || ''}
                  onChange={(e) => setEditingTech({ ...editingTech, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
                <select
                  value={editingTech.categoryId || ''}
                  onChange={(e) => setEditingTech({ ...editingTech, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingTech.description || ''}
                  onChange={(e) => setEditingTech({ ...editingTech, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsTechModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
