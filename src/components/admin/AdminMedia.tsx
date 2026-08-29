import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { MediaItem } from '../../types';
import { Image, Plus, Trash2, Copy, CheckCircle2, Search, X, ExternalLink } from 'lucide-react';

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
    if (confirm('Remove this media asset?')) {
      const next = mediaList.filter(m => m.id !== id);
      await updateData({ mediaItems: next });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Image className="w-5 h-5 text-indigo-400" />
            <span>Media Assets & Architecture Screenshots</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Store and organize high-resolution images, architecture diagrams, benchmark graphs, and certificates.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media Asset</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Media Categories</option>
            <option value="projects">Projects & Diagrams</option>
            <option value="profile">Profile & Avatars</option>
            <option value="certifications">Certificates</option>
            <option value="blog">Blog Covers</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMedia.map((m) => (
          <div
            key={m.id}
            className="group relative rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between"
          >
            <div className="aspect-video w-full bg-slate-950 overflow-hidden relative">
              <img
                src={m.url}
                alt={m.altText || m.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-slate-300 backdrop-blur-xs">
                {m.category}
              </span>
            </div>

            <div className="p-3 space-y-1">
              <div className="font-bold text-white text-xs truncate">{m.title}</div>
              <div className="text-[10px] text-slate-500 truncate">{m.url}</div>
            </div>

            <div className="p-3 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-1">
              <button
                onClick={() => handleCopy(m.id, m.url)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
              >
                {copiedId === m.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDelete(m.id)}
                className="p-1 text-slate-500 hover:text-red-400 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredMedia.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-slate-500 bg-slate-900 rounded-xl border border-slate-800">
            No media assets found.
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Media Asset</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title / Caption *</label>
                <input
                  type="text"
                  required
                  value={newMedia.title || ''}
                  onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                  placeholder="e.g. Distributed CQRS Architecture Diagram"
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={newMedia.url || ''}
                  onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newMedia.category}
                  onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                >
                  <option value="projects">Projects & Diagrams</option>
                  <option value="profile">Profile & Avatars</option>
                  <option value="certifications">Certificates</option>
                  <option value="blog">Blog Covers</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Alt Text (Accessibility)</label>
                <input
                  type="text"
                  value={newMedia.altText || ''}
                  onChange={(e) => setNewMedia({ ...newMedia, altText: e.target.value })}
                  placeholder="e.g. Architectural schema of Kafka event stream"
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
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
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
