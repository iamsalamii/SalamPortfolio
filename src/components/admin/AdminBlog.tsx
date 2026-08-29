import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BlogPost } from '../../types';
import { BookOpen, Plus, Edit3, Trash2, Search, X, Save } from 'lucide-react';

export const AdminBlog: React.FC = () => {
  const { data, updateData } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

  const posts = data.blogPosts || [];

  const filteredPosts = posts.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    return !q || p.title.toLowerCase().includes(q) || (p.summary && p.summary.toLowerCase().includes(q));
  });

  const openCreateModal = () => {
    setEditingPost({
      id: `post_${Date.now()}`,
      slug: `article-net-${Date.now().toString().slice(-4)}`,
      title: '',
      summary: '',
      content: '## Introduction\n\nRédigez votre article en Markdown ici...',
      category: 'Architecture',
      readTimeMinutes: 5,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
      status: 'published',
      publishedAt: new Date().toISOString().split('T')[0],
      author: 'Moussa Abdou Salam',
      tags: ['.NET', 'Architecture']
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: BlogPost) => {
    setEditingPost({ ...p });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title) return;

    const exists = posts.some(p => p.id === editingPost.id);
    let next: BlogPost[];

    if (exists) {
      next = posts.map(p => p.id === editingPost.id ? (editingPost as BlogPost) : p);
    } else {
      next = [...posts, editingPost as BlogPost];
    }

    await updateData({ blogPosts: next });
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cet article ?')) {
      const next = posts.filter(p => p.id !== id);
      await updateData({ blogPosts: next });
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-600" />
            <span>Articles &amp; Publications</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérez vos articles de veille technique et notes d'ingénierie.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Article</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-red-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                  {post.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">{post.publishedAt}</span>
              </div>

              <h3 className="font-bold text-slate-950 text-base leading-snug">{post.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{post.summary}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">{post.readTimeMinutes} min</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(post)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-950 text-base">
                {editingPost.title ? `Modifier : ${editingPost.title}` : 'Nouvel Article'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Titre de l'Article *</label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
                  <input
                    type="text"
                    value={editingPost.category || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Temps de lecture (minutes)</label>
                  <input
                    type="number"
                    value={editingPost.readTimeMinutes || 5}
                    onChange={(e) => setEditingPost({ ...editingPost, readTimeMinutes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Résumé</label>
                <textarea
                  rows={2}
                  value={editingPost.summary || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, summary: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contenu (Markdown)</label>
                <textarea
                  rows={8}
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 font-mono"
                />
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
