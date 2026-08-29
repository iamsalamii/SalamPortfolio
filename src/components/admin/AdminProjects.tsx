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
  Eye, 
  X, 
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
      slug: `projet-net-${Date.now().toString().slice(-4)}`,
      title: '',
      shortDescription: '',
      fullDescription: '',
      mainImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
      gallery: [],
      technologyIds: [],
      categoryId: categories[0]?.id || 'cat_backend',
      client: '',
      role: 'Lead Architect',
      duration: '6 Mois',
      status: 'published',
      isFeatured: false,
      features: [],
      challenges: [],
      solutions: [],
      results: [],
      architectureNotes: 'Architecture Clean avec CQRS (MediatR), Domain-Driven Design, EF Core.',
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

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;

    const exists = projects.some(p => p.id === editingProject.id);
    let nextProjects: Project[];

    if (exists) {
      nextProjects = projects.map(p => p.id === editingProject.id ? (editingProject as Project) : p);
    } else {
      nextProjects = [...projects, editingProject as Project];
    }

    await updateData({ projects: nextProjects });
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      const next = projects.filter(p => p.id !== id);
      await updateData({ projects: next });
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
    <div className="space-y-6 pb-12 max-w-6xl">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-red-600" />
            <span>Projets &amp; Réalisations</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérez vos projets publics, descriptions techniques, captures d'écran et associations technologiques.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-[0_4px_15px_rgba(220,38,38,0.25)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Projet</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un projet..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white"
          />
        </div>

        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
          >
            <option value="all">Toutes les Catégories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
          >
            <option value="all">Tous les Statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="archived">Archivé</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 font-mono">
              <tr>
                <th className="py-3.5 px-4">Projet</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4">Rôle &amp; Client</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((p) => {
                const catName = categories.find(c => c.id === p.categoryId)?.name || p.categoryName || 'Général';
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.mainImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=100&q=80'}
                          alt={p.title}
                          className="w-12 h-8 rounded-lg object-cover shrink-0 bg-slate-100 border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-950 text-sm hover:text-red-600 transition-colors cursor-pointer" onClick={() => openEditModal(p)}>
                            {p.title}
                          </div>
                          <div className="text-slate-400 text-[11px] font-mono">{p.slug}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {catName}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{p.role || 'Développeur'}</div>
                      <div className="text-slate-500 text-[11px]">{p.client || 'Projet Interne'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        p.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        p.status === 'draft' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateTo('project-detail', p.slug)}
                          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Voir le projet public"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer"
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
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Aucun projet correspondant aux critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-950">
                  {editingProject.title ? `Modifier : ${editingProject.title}` : 'Créer un Nouveau Projet'}
                </h3>
                <span className="text-xs text-slate-500">Configurez les détails techniques et métriques d'ingénierie</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'details' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                1. Métadonnées
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'content' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                2. Descriptions &amp; Architecture
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tech')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'tech' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                3. Technologies ({editingProject.technologyIds?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('lists')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'lists' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                4. Fonctionnalités &amp; Solutions
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Tab 1: Details */}
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Titre du Projet *</label>
                      <input
                        type="text"
                        required
                        value={editingProject.title || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Slug URL</label>
                      <input
                        type="text"
                        value={editingProject.slug || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
                      <select
                        value={editingProject.categoryId || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, categoryId: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Statut</label>
                      <select
                        value={editingProject.status || 'published'}
                        onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                      >
                        <option value="published">Publié</option>
                        <option value="draft">Brouillon</option>
                        <option value="archived">Archivé</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Rôle</label>
                      <input
                        type="text"
                        value={editingProject.role || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">URL GitHub</label>
                      <input
                        type="text"
                        value={editingProject.githubUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">URL Démo / Site</label>
                      <input
                        type="text"
                        value={editingProject.liveDemoUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, liveDemoUrl: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Image Principale (URL)</label>
                    <input
                      type="text"
                      value={editingProject.mainImage || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, mainImage: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Content */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Courte Description</label>
                    <textarea
                      rows={3}
                      value={editingProject.shortDescription || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Notes d'Architecture</label>
                    <textarea
                      rows={3}
                      value={editingProject.architectureNotes || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, architectureNotes: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Étude de Cas Détaillée (Markdown)</label>
                    <textarea
                      rows={6}
                      value={editingProject.fullDescription || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, fullDescription: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Tech Associations */}
              {activeTab === 'tech' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">Cochez les technologies associées à ce projet :</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
                    {technologies.map(t => {
                      const isSelected = editingProject.technologyIds?.includes(t.id);
                      return (
                        <button
                          type="button"
                          key={t.id}
                          onClick={() => toggleTechId(t.id)}
                          className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-red-50 border-red-500 text-red-700 shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                          }`}
                        >
                          <span>{t.name}</span>
                          <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-red-600' : 'bg-slate-300'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 4: Lists */}
              {activeTab === 'lists' && (
                <div className="space-y-6">
                  {/* Features */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-900 uppercase font-mono">Fonctionnalités Clés</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        placeholder="Ajouter une fonctionnalité..."
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-300"
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
                        className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold"
                      >
                        Ajouter
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {editingProject.features?.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-lg text-xs text-slate-800">
                          <span>{f}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...(editingProject.features || [])];
                              next.splice(i, 1);
                              setEditingProject({ ...editingProject, features: next });
                            }}
                            className="text-slate-400 hover:text-red-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer le Projet</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
