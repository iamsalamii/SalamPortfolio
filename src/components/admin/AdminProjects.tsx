import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Project } from '../../types';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Github, 
  Star, 
  Eye, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Save 
} from 'lucide-react';

export const AdminProjects: React.FC = () => {
  const { data, updateData, navigateTo } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'content' | 'lists' | 'tech'>('details');

  const [featureInput, setFeatureInput] = useState('');
  const [challengeInput, setChallengeInput] = useState('');
  const [solutionInput, setSolutionInput] = useState('');
  const [resultInput, setResultInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');

  const projects = data.projects || [];
  const categories = data.projectCategories || [];
  const technologies = data.technologies || [];

  const filteredProjects = projects.filter(p => {
    const matchCat = filterCategory === 'all' || p.categoryId === filterCategory;
    const matchStat = filterStatus === 'all' || p.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.client && p.client.toLowerCase().includes(q));
    return matchCat && matchStat && matchSearch;
  });

  const openCreateModal = () => {
    setEditingProject({
      id: `proj_${Date.now()}`,
      slug: `new-csharp-project-${Date.now().toString().slice(-4)}`,
      title: '',
      shortDescription: '',
      fullDescription: '',
      mainImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
      gallery: [],
      technologyIds: [],
      categoryId: categories[0]?.id || 'cat_backend',
      client: '',
      role: 'Lead Architect',
      duration: '6 Months',
      status: 'published',
      isFeatured: false,
      features: [],
      challenges: [],
      solutions: [],
      results: [],
      architectureNotes: 'Clean Architecture with CQRS (MediatR), Domain-Driven Design, EF Core 9.',
      githubUrl: '',
      liveDemoUrl: '',
      order: projects.length + 1,
      publishedAt: new Date().toISOString().split('T')[0]
    });
    setActiveTab('details');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject({ ...p });
    setActiveTab('details');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const next = projects.filter(p => p.id !== id);
      await updateData({ projects: next });
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.slug) {
      alert('Please fill out the Project Title and Slug.');
      return;
    }

    let nextProjects: Project[] = [];
    const exists = projects.some(p => p.id === editingProject.id);

    if (exists) {
      nextProjects = projects.map(p => p.id === editingProject.id ? (editingProject as Project) : p);
    } else {
      nextProjects = [...projects, editingProject as Project];
    }

    await updateData({ projects: nextProjects });
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const autoGenerateSlug = () => {
    if (editingProject?.title) {
      const generated = editingProject.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setEditingProject({ ...editingProject, slug: generated });
    }
  };

  const toggleTechId = (techId: string) => {
    if (!editingProject) return;
    const current = editingProject.technologyIds || [];
    const next = current.includes(techId)
      ? current.filter(id => id !== techId)
      : [...current, techId];
    setEditingProject({ ...editingProject, technologyIds: next });
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-400" />
            <span>Projects & Architecture Case Studies</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage public case studies, high-throughput architectures, metrics, and technology associations.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Case Study</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Role & Client</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProjects.map((p) => {
                const catName = categories.find(c => c.id === p.categoryId)?.name || p.categoryName || 'General';
                return (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.mainImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=100&q=80'}
                          alt={p.title}
                          className="w-12 h-8 rounded object-cover shrink-0 bg-slate-800"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{p.title}</span>
                            {p.isFeatured && (
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">/{p.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-300">
                      {catName}
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{p.role}</div>
                      <div className="text-slate-500 text-[11px]">{p.client || 'Internal Project'}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.status === 'published' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        p.status === 'draft' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateTo('project-detail', p.slug)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                          title="View Case Study"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No projects found matching current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingProject.title ? `Edit: ${editingProject.title}` : 'Create New Project Case Study'}
                </h3>
                <span className="text-xs text-slate-400">Configure comprehensive architecture data and measurable impact</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-850 px-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'details' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                1. General Meta
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`py-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'content' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                2. Descriptions & Architecture
              </button>
              <button
                onClick={() => setActiveTab('tech')}
                className={`py-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'tech' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                3. Technologies ({editingProject.technologyIds?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('lists')}
                className={`py-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'lists' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                4. Features, Challenges & Results
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Tab 1: Details */}
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                      <input
                        type="text"
                        required
                        value={editingProject.title || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-300">URL Slug *</label>
                        <button
                          type="button"
                          onClick={autoGenerateSlug}
                          className="text-[10px] text-indigo-400 hover:underline"
                        >
                          Auto Generate
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={editingProject.slug || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                      <select
                        value={editingProject.categoryId}
                        onChange={(e) => setEditingProject({ ...editingProject, categoryId: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                      <select
                        value={editingProject.status}
                        onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Order</label>
                      <input
                        type="number"
                        value={editingProject.order || 1}
                        onChange={(e) => setEditingProject({ ...editingProject, order: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                      <input
                        type="text"
                        value={editingProject.role || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                        placeholder="e.g. Lead .NET Architect"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Client / Company</label>
                      <input
                        type="text"
                        value={editingProject.client || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                        placeholder="e.g. FinTech Enterprise"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Timeline / Duration</label>
                      <input
                        type="text"
                        value={editingProject.duration || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                        placeholder="e.g. 9 Months"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repo URL</label>
                      <input
                        type="text"
                        value={editingProject.githubUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo / Production URL</label>
                      <input
                        type="text"
                        value={editingProject.liveDemoUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, liveDemoUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Main Cover Image URL</label>
                    <input
                      type="text"
                      value={editingProject.mainImage || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, mainImage: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProject.isFeatured || false}
                        onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                        className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
                      />
                      <span>Mark as Featured Case Study (Highlighted with badge)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Tab 2: Content */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description (Cards)</label>
                    <textarea
                      rows={2}
                      value={editingProject.shortDescription || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Case Study (Markdown Supported)
                    </label>
                    <textarea
                      rows={8}
                      value={editingProject.fullDescription || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, fullDescription: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                      placeholder="Write detailed architecture, problem statement, benchmarking..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Architecture & System Design Notes
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject.architectureNotes || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, architectureNotes: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Technologies */}
              {activeTab === 'tech' && (
                <div className="space-y-4">
                  <span className="text-xs text-slate-400 block">
                    Click to select/deselect the technologies utilized in this project:
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {technologies.map((t) => {
                      const isSelected = editingProject.technologyIds?.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => toggleTechId(t.id)}
                          className={`p-2.5 rounded-lg text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-600/30 border-indigo-500 text-white'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{t.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 4: Lists (Features, Challenges, Solutions, Results) */}
              {activeTab === 'lists' && (
                <div className="space-y-6">
                  {/* Features */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-white uppercase tracking-wider text-[11px] text-indigo-400">
                      Key Engineering Features
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        placeholder="e.g. Sub-millisecond latency trading engine"
                        className="flex-1 px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (featureInput.trim()) {
                              setEditingProject({
                                ...editingProject,
                                features: [...(editingProject.features || []), featureInput.trim()]
                              });
                              setFeatureInput('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (featureInput.trim()) {
                            setEditingProject({
                              ...editingProject,
                              features: [...(editingProject.features || []), featureInput.trim()]
                            });
                            setFeatureInput('');
                          }
                        }}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {editingProject.features?.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-xs text-slate-200">
                          <span>{f}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...(editingProject.features || [])];
                              next.splice(i, 1);
                              setEditingProject({ ...editingProject, features: next });
                            }}
                            className="text-slate-400 hover:text-red-400"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Measurable Results */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-white uppercase tracking-wider text-[11px] text-emerald-400">
                      Measurable Business / Performance Results
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={resultInput}
                        onChange={(e) => setResultInput(e.target.value)}
                        placeholder="e.g. 70% decrease in cloud infrastructure costs"
                        className="flex-1 px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (resultInput.trim()) {
                              setEditingProject({
                                ...editingProject,
                                results: [...(editingProject.results || []), resultInput.trim()]
                              });
                              setResultInput('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (resultInput.trim()) {
                            setEditingProject({
                              ...editingProject,
                              results: [...(editingProject.results || []), resultInput.trim()]
                            });
                            setResultInput('');
                          }
                        }}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {editingProject.results?.map((r, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950 text-xs text-emerald-300 border border-emerald-800">
                          <span>{r}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...(editingProject.results || [])];
                              next.splice(i, 1);
                              setEditingProject({ ...editingProject, results: next });
                            }}
                            className="text-emerald-400 hover:text-red-400"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
                >
                  Save Project Case Study
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
