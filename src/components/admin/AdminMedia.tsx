import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { MediaItem } from '../../types';
import { Image, Plus, Trash2, Copy, CheckCircle2, Search, X } from 'lucide-react';

export const AdminMedia: React.FC = () => {
  const { data, updateData } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMedia, setNewMedia] = useState<Partial<MediaItem>>({
    title: '',
    url: '',
    altText: '',
    category: 'projects'
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mediaList = data.mediaItems || [];

  const filteredMedia = mediaList.filter(m => {
    const matchCat = filterCategory === 'all' || m.category === filterCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || m.title.toLowerCase().includes(q) || (m.altText && m.altText.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.url || !newMedia.title) return;

    const item: MediaItem = {
      id: `media_${Date.now()}`,
      title: newMedia.title,
      url: newMedia.url,
      altText: newMedia.altText || newMedia.title,
      category: (newMedia.category as any) || 'general',
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    await updateData({ mediaItems: [item, ...mediaList] });
    setIsModalOpen(false);
    setNewMedia({ title: '', url: '', altText: '', category: 'projects' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce média ?')) {
      const next = mediaList.filter(m => m.id !== id);
      await updateData({ mediaItems: next });
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Image className="w-5 h-5 text-red-600" />
            <span>Médiathèque &amp; Images</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Stockez et organisez les images de projets, schémas d'architecture et attestations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Image</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une image..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600"
          />
        </div>

        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-red-600"
          >
            <option value="all">Toutes les Catégories</option>
            <option value="projects">Projets &amp; Schémas</option>
            <option value="profile">Profil &amp; Avatar</option>
            <option value="certifications">Certificats</option>
            <option value="blog">Couvertures d'Articles</option>
            <option value="general">Général</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMedia.map((m) => (
          <div
            key={m.id}
            className="group relative rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-red-500/50 hover:shadow-md transition-all"
          >
            <div className="aspect-video w-full bg-slate-100 overflow-hidden relative">
              <img
                src={m.url}
                alt={m.altText || m.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                {m.category}
              </span>
            </div>

            <div className="p-3 space-y-1">
              <div className="font-bold text-slate-950 text-xs truncate">{m.title}</div>
              <div className="text-[10px] text-slate-400 truncate font-mono">{m.url}</div>
            </div>

            <div className="p-3 pt-0 flex items-center justify-between border-t border-slate-100 mt-1">
              <button
                onClick={() => handleCopy(m.id, m.url)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-red-600 cursor-pointer"
              >
                {copiedId === m.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier l'URL</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDelete(m.id)}
                className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-950 text-base">Ajouter un Média</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Titre / Description *</label>
                <input
                  type="text"
                  required
                  value={newMedia.title}
                  onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL de l'image *</label>
                <input
                  type="text"
                  required
                  value={newMedia.url}
                  onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
                <select
                  value={newMedia.category}
                  onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value as any })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                >
                  <option value="projects">Projets &amp; Schémas</option>
                  <option value="profile">Profil &amp; Avatar</option>
                  <option value="certifications">Certificats</option>
                  <option value="blog">Couvertures d'Articles</option>
                  <option value="general">Général</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
