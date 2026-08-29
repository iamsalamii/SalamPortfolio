import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BlogPost } from '../../types';
import { BookOpen, Plus, Edit3, Trash2, Eye, Calendar, Clock, X, Tag } from 'lucide-react';

export const AdminBlog: React.FC = () => {
  const { data, updateData, navigateTo } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [tagInput, setTagInput] = useState('');

  const posts = data.blogPosts || [];

  const openCreateModal = () => {
    setEditingPost({
      id: `post_${Date.now()}`,
      slug: `csharp-deep-dive-${Date.now().toString().slice(-4)}`,
      title: '',
      summary: '',
      content: '## Executive Overview\n\nDeep architectural write-up on high-performance .NET 9 features...\n\n### Benchmarking\n\n- Zero-allocation memory pools\n- Async ValueTask micro-optimizations',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
      category: 'Architecture',
      tags: ['dotnet9', 'csharp', 'architecture'],
      readTimeMinutes: 5,
      status: 'published',
      publishedAt: new Date().toISOString().split('T')[0],
      author: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: BlogPost) => {
    setEditingPost({ ...p });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this article?')) {
      const next = posts.filter(p => p.id !== id);
      await updateData({ blogPosts: next });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.slug) return;

    let nextPosts: BlogPost[] = [];
    const exists = posts.some(p => p.id === editingPost.id);

    if (exists) {
      nextPosts = posts.map(p => p.id === editingPost.id ? (editingPost as BlogPost) : p);
    } else {
      nextPosts = [...posts, editingPost as BlogPost];
    }

    await updateData({ blogPosts: nextPosts });
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const autoSlug = () => {
    if (editingPost?.title) {
      const slug = editingPost.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setEditingPost({ ...editingPost, slug });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Technical Articles & Architecture Blog</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Publish engineering deep dives, benchmarking comparisons, and system design case studies.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Posts Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-850 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Article</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Published</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/40">
                <td className="py-3 px-4">
                  <div className="font-bold text-white">{p.title}</div>
                  <div className="text-slate-500 text-[11px] font-mono">/{p.slug}</div>
                </td>
                <td className="py-3 px-4 font-medium">{p.category}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    p.status === 'published' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">{p.publishedAt}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => navigateTo('blog-detail', p.slug)}
                      className="p-1.5 text-slate-400 hover:text-white rounded"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 rounded"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded"
                      title="Delete"
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

      {/* Modal */}
      {isModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingPost.title ? `Edit Article` : 'Write Technical Article'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">URL Slug *</label>
                    <button
                      type="button"
                      onClick={autoSlug}
                      className="text-[10px] text-indigo-400 hover:underline"
                    >
                      Auto Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={editingPost.slug || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingPost.category || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    placeholder="e.g. Architecture, .NET 9, Cloud"
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Read Time (minutes)</label>
                  <input
                    type="number"
                    value={editingPost.readTimeMinutes || 5}
                    onChange={(e) => setEditingPost({ ...editingPost, readTimeMinutes: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={editingPost.status}
                    onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editingPost.coverImage || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Summary / Lead Paragraph</label>
                <textarea
                  rows={2}
                  value={editingPost.summary || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, summary: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Article (Markdown)</label>
                <textarea
                  rows={8}
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white uppercase tracking-wider text-[11px] text-indigo-400">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g. dotnet9"
                    className="flex-1 px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tagInput.trim()) {
                        setEditingPost({
                          ...editingPost,
                          tags: [...(editingPost.tags || []), tagInput.trim()]
                        });
                        setTagInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {editingPost.tags?.map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 font-mono">
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...(editingPost.tags || [])];
                          next.splice(i, 1);
                          setEditingPost({ ...editingPost, tags: next });
                        }}
                        className="text-slate-400 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
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
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
