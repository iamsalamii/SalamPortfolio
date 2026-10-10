import React, { useState } from 'react';
import { useData, apiUrl } from '../../context/DataContext';
import { Project, ProjectCategory } from '../../types';
import { TechLogo } from '../common/TechLogos';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  Save,
  Image as ImageIcon,
  Camera,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Globe2,
  Code2,
  ChevronDown,
  Check
} from 'lucide-react';

export const AdminProjects: React.FC = () => {
  const { data, updateData, navigateTo } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'content' | 'tech' | 'lists' | 'translations'>('details');

  // Custom Category State
  const [categoryInputValue, setCategoryInputValue] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Lists Input States (FR)
  const [featureInput, setFeatureInput] = useState('');
  const [challengeInput, setChallengeInput] = useState('');
  const [solutionInput, setSolutionInput] = useState('');
  const [resultInput, setResultInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');

  // Lists Input States (EN)
  const [featureInputEn, setFeatureInputEn] = useState('');
  const [challengeInputEn, setChallengeInputEn] = useState('');
  const [solutionInputEn, setSolutionInputEn] = useState('');
  const [resultInputEn, setResultInputEn] = useState('');

  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState('');
  const [captureSuccess, setCaptureSuccess] = useState('');

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
    const initialCategory = categories[0]?.name || 'Architecture & Backend';
    setCategoryInputValue(initialCategory);
    setEditingProject({
      id: `proj_${Date.now()}`,
      slug: `projet-net-${Date.now().toString().slice(-4)}`,
      title: '',
      shortDescription: '',
      fullDescription: '',
      mainImage: '',
      gallery: [],
      technologyIds: [],
      categoryId: categories[0]?.id || 'cat_backend',
      categoryName: initialCategory,
      client: '',
      role: '',
      duration: '',
      status: 'published',
      isFeatured: false,
      showSourceCode: true,
      features: [],
      challenges: [],
      solutions: [],
      results: [],
      architectureNotes: '',
      githubUrl: '',
      liveDemoUrl: '',
      order: projects.length + 1,
      publishedAt: new Date().toISOString().split('T')[0],
      translations: {
        en: {
          title: '',
          shortDescription: '',
          fullDescription: '',
          role: '',
          duration: '',
          architectureNotes: '',
          features: [],
          challenges: [],
          solutions: [],
          results: []
        }
      }
    });
    setCaptureError('');
    setCaptureSuccess('');
    setFeatureInput('');
    setChallengeInput('');
    setSolutionInput('');
    setResultInput('');
    setGalleryInput('');
    setFeatureInputEn('');
    setChallengeInputEn('');
    setSolutionInputEn('');
    setResultInputEn('');
    setActiveTab('details');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    const currentCategory = categories.find(c => c.id === p.categoryId)?.name || p.categoryName || '';
    setCategoryInputValue(currentCategory);
    setEditingProject({
      ...p,
      showSourceCode: p.showSourceCode !== false,
      gallery: p.gallery || [],
      features: p.features || [],
      challenges: p.challenges || [],
      solutions: p.solutions || [],
      results: p.results || [],
      technologyIds: p.technologyIds || [],
      translations: p.translations || {
        en: {
          title: '',
          shortDescription: '',
          fullDescription: '',
          role: '',
          duration: '',
          architectureNotes: '',
          features: [],
          challenges: [],
          solutions: [],
          results: []
        }
      }
    });
    setCaptureError('');
    setCaptureSuccess('');
    setFeatureInput('');
    setChallengeInput('');
    setSolutionInput('');
    setResultInput('');
    setGalleryInput('');
    setFeatureInputEn('');
    setChallengeInputEn('');
    setSolutionInputEn('');
    setResultInputEn('');
    setActiveTab('details');
    setIsModalOpen(true);
  };

  const handleCapturePreview = async () => {
    const targetUrl = editingProject?.liveDemoUrl || editingProject?.githubUrl;
    if (!targetUrl || !targetUrl.trim().startsWith('http')) {
      setCaptureError('Veuillez renseigner une URL publique valide (ex: https://mon-site.com) dans le champ URL Démo ou GitHub.');
      return;
    }

    setIsCapturing(true);
    setCaptureError('');
    setCaptureSuccess('');

    try {
      const token = localStorage.getItem('salam_auth_token_v3') || localStorage.getItem('portfolio_auth_token') || '';
      const res = await fetch(apiUrl('/api/admin/capture-preview'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: targetUrl.trim() })
      });

      const json = await res.json();
      if (res.ok && json.success && json.imageUrl) {
        setEditingProject(prev => prev ? { ...prev, mainImage: json.imageUrl } : null);
        setCaptureSuccess('Aperçu du site capturé et enregistré avec succès !');
      } else {
        setCaptureError(json.error || 'Échec de la capture du site. Vous pouvez importer une image manuellement.');
      }
    } catch {
      setCaptureError('Erreur de connexion au serveur lors de la capture.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;

    // Resolve Category: Match existing by case-insensitive name, or create new category if custom typed
    let targetCategoryId = editingProject.categoryId || '';
    let targetCategoryName = (categoryInputValue || '').trim();
    let updatedCategories = [...categories];

    if (targetCategoryName) {
      const existingMatch = categories.find(c => c.name.trim().toLowerCase() === targetCategoryName.toLowerCase());
      if (existingMatch) {
        targetCategoryId = existingMatch.id;
        targetCategoryName = existingMatch.name;
      } else {
        // Create new category dynamically
        const newSlug = targetCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
        const newCategory: ProjectCategory = {
          id: `cat_${newSlug}`,
          name: targetCategoryName,
          slug: newSlug,
          order: categories.length + 1
        };
        targetCategoryId = newCategory.id;
        targetCategoryName = newCategory.name;
        updatedCategories.push(newCategory);
      }
    } else {
      targetCategoryId = categories[0]?.id || 'cat_backend';
      targetCategoryName = categories[0]?.name || 'Architecture & Backend';
    }

    // Clean empty strings / nulls
    const cleanedProject: Project = {
      id: editingProject.id || `proj_${Date.now()}`,
      title: editingProject.title.trim(),
      slug: (editingProject.slug || editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim(),
      shortDescription: (editingProject.shortDescription || '').trim(),
      fullDescription: (editingProject.fullDescription || '').trim(),
      mainImage: (editingProject.mainImage || '').trim(),
      gallery: (editingProject.gallery || []).filter(g => Boolean(g && g.trim())),
      technologyIds: editingProject.technologyIds || [],
      categoryId: targetCategoryId,
      categoryName: targetCategoryName,
      client: (editingProject.client || '').trim(),
      role: (editingProject.role || '').trim(),
      duration: (editingProject.duration || '').trim(),
      status: editingProject.status || 'published',
      isFeatured: Boolean(editingProject.isFeatured),
      showSourceCode: editingProject.showSourceCode !== false,
      order: Number(editingProject.order) || projects.length + 1,
      features: (editingProject.features || []).filter(f => Boolean(f && f.trim())),
      challenges: (editingProject.challenges || []).filter(c => Boolean(c && c.trim())),
      solutions: (editingProject.solutions || []).filter(s => Boolean(s && s.trim())),
      results: (editingProject.results || []).filter(r => Boolean(r && r.trim())),
      architectureNotes: (editingProject.architectureNotes || '').trim(),
      githubUrl: (editingProject.githubUrl || '').trim(),
      liveDemoUrl: (editingProject.liveDemoUrl || '').trim(),
      publishedAt: (editingProject.publishedAt || '').trim(),
      translations: editingProject.translations || {}
    };

    const exists = projects.some(p => p.id === cleanedProject.id);
    let nextProjects: Project[];

    if (exists) {
      nextProjects = projects.map(p => p.id === cleanedProject.id ? cleanedProject : p);
    } else {
      nextProjects = [...projects, cleanedProject];
    }

    try {
      await updateData({ 
        projects: nextProjects,
        projectCategories: updatedCategories
      });
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err: any) {
      alert(`Erreur d'enregistrement du projet : ${err?.message || 'Échec de synchronisation'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      const next = projects.filter(p => p.id !== id);
      try {
        await updateData({ projects: next });
      } catch (err: any) {
        alert(`Erreur de suppression du projet : ${err?.message || 'Échec de synchronisation'}`);
      }
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
            Gérez vos projets publics, capturez les aperçus, configurez les catégories personnalisées et les traductions.
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

      {/* Projects Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Projet &amp; Visuel</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4">Technologies &amp; Date</th>
                <th className="py-3.5 px-4">Statut &amp; Code</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProjects.map((project) => {
                const category = categories.find(c => c.id === project.categoryId);
                const projectTechs = technologies.filter(t => project.technologyIds?.includes(t.id));

                return (
                  <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {project.mainImage ? (
                            <img src={project.mainImage} alt={project.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-900 truncate flex items-center gap-2">
                            <span>{project.title}</span>
                            {project.isFeatured && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 shrink-0">
                                Vedette
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate">
                            /{project.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                        {category?.name || project.categoryName || 'Non classé'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {projectTechs.slice(0, 3).map(t => (
                            <span key={t.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-700">
                              <TechLogo name={t.name} logoUrl={t.logoUrl} size={11} className="w-3 h-3" />
                              <span>{t.name}</span>
                            </span>
                          ))}
                          {projectTechs.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-bold text-slate-600">
                              +{projectTechs.length - 3}
                            </span>
                          )}
                        </div>
                        {project.publishedAt && (
                          <div className="text-[11px] text-slate-400 font-mono">
                            {project.publishedAt}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          project.status === 'published' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : project.status === 'draft' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {project.status === 'published' ? 'Publié' : project.status === 'draft' ? 'Brouillon' : 'Archivé'}
                        </span>
                        <div>
                          {project.showSourceCode !== false && project.githubUrl ? (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                              <Code2 className="w-3 h-3" /> GitHub public
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">GitHub masqué</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateTo('project-detail', project.slug)}
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                          title="Voir sur le site public"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Modifier"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
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
                <span className="text-xs text-slate-500">Configurez les informations réelles, la capture d'écran, les catégories et traductions</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-bold overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'details' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                1. Métadonnées &amp; Capture
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'content' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                2. Descriptions &amp; Architecture
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tech')}
                className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'tech' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                3. Technologies ({editingProject.technologyIds?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('lists')}
                className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'lists' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                4. Listes &amp; Métriques
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('translations')}
                className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'translations' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>5. Traductions (EN)</span>
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
                        placeholder="Ex: RAW/FORM"
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Slug URL</label>
                      <input
                        type="text"
                        value={editingProject.slug || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                        placeholder="raw-form"
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  {/* Category Selection + Free Text Input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Catégorie (Sélection ou Saisie Libre) *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={categoryInputValue}
                          onFocus={() => setIsCategoryDropdownOpen(true)}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCategoryInputValue(val);
                            setIsCategoryDropdownOpen(true);
                            const match = categories.find(c => c.name.toLowerCase() === val.toLowerCase());
                            if (match) {
                              setEditingProject({ ...editingProject, categoryId: match.id, categoryName: match.name });
                            } else {
                              setEditingProject({ ...editingProject, categoryName: val });
                            }
                          }}
                          placeholder="Sélectionnez ou tapez une catégorie..."
                          className="w-full px-3.5 py-2 pr-10 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title="Afficher les suggestions de catégories"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180 text-red-600' : ''}`} />
                        </button>

                        {/* Floating Suggestions Dropdown */}
                        {isCategoryDropdownOpen && (
                          <>
                            {/* Backdrop overlay for outside clicks */}
                            <div 
                              className="fixed inset-0 z-20" 
                              onClick={() => setIsCategoryDropdownOpen(false)}
                            />
                            <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-56 overflow-y-auto p-1.5 space-y-1">
                              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Suggestions de catégories existantes ({categories.length})
                              </div>
                              {categories
                                .filter(c => !categoryInputValue.trim() || c.name.toLowerCase().includes(categoryInputValue.toLowerCase().trim()))
                                .map(c => {
                                  const isSelected = (editingProject?.categoryId === c.id) || (categoryInputValue.toLowerCase().trim() === c.name.toLowerCase().trim());
                                  return (
                                    <button
                                      type="button"
                                      key={c.id}
                                      onClick={() => {
                                        setCategoryInputValue(c.name);
                                        setEditingProject({ ...editingProject, categoryId: c.id, categoryName: c.name });
                                        setIsCategoryDropdownOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                                        isSelected
                                          ? 'bg-red-50 text-red-700 font-bold'
                                          : 'text-slate-700 hover:bg-slate-50 font-medium'
                                      }`}
                                    >
                                      <span>{c.name}</span>
                                      {isSelected && <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                                    </button>
                                  );
                                })}

                              {categoryInputValue.trim() && !categories.some(c => c.name.toLowerCase().trim() === categoryInputValue.toLowerCase().trim()) && (
                                <div className="pt-1 border-t border-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingProject({ ...editingProject, categoryName: categoryInputValue.trim() });
                                      setIsCategoryDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs rounded-xl bg-slate-900 text-white font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 transition-colors"
                                  >
                                    <Plus className="w-3.5 h-3.5 text-red-400" />
                                    <span>Créer la nouvelle catégorie &laquo; {categoryInputValue.trim()} &raquo;</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Astuce : cliquez sur la flèche pour dérouler les catégories existantes ou tapez un nouveau nom.
                      </span>
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
                  </div>

                  {/* Role & Client */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Rôle / Poste (Facultatif)</label>
                      <input
                        type="text"
                        placeholder="Ex: Développeur Full Stack .NET"
                        value={editingProject.role || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Client / Organisation (Facultatif)</label>
                      <input
                        type="text"
                        placeholder="Ex: Entreprise X ou Personnel"
                        value={editingProject.client || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  {/* Duration & Delivery Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Durée du Projet (Facultatif)</label>
                      <input
                        type="text"
                        placeholder="Ex: 3 Mois ou En cours"
                        value={editingProject.duration || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Date de Livraison / Publication (Facultatif)</label>
                      <input
                        type="text"
                        placeholder="Ex: 2026-03 ou Mars 2026"
                        value={editingProject.publishedAt || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, publishedAt: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  {/* URLs & Source Code Button Toggle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">URL Démo / Site Public</label>
                      <input
                        type="url"
                        placeholder="https://mon-projet-en-ligne.com"
                        value={editingProject.liveDemoUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, liveDemoUrl: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">URL GitHub (Code Source)</label>
                      <input
                        type="url"
                        placeholder="https://github.com/mon-compte/mon-depot"
                        value={editingProject.githubUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 font-mono"
                      />
                    </div>
                  </div>

                  {/* Options: Source Code visibility & Featured */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="showSourceCodeCheck"
                          checked={editingProject.showSourceCode !== false}
                          onChange={(e) => setEditingProject({ ...editingProject, showSourceCode: e.target.checked })}
                          className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                        />
                        <label htmlFor="showSourceCodeCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                          Afficher le bouton « Code source »
                        </label>
                      </div>
                      <p className="text-[10px] text-slate-500 pl-7">
                        Si coché, le bouton apparaîtra uniquement si une URL GitHub valide est renseignée. Si décoché, le bouton restera masqué.
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="isFeaturedCheck"
                          checked={Boolean(editingProject.isFeatured)}
                          onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                          className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                        />
                        <label htmlFor="isFeaturedCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                          Mettre en vedette
                        </label>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Ordre</label>
                        <input
                          type="number"
                          min="1"
                          value={editingProject.order || 1}
                          onChange={(e) => setEditingProject({ ...editingProject, order: parseInt(e.target.value, 10) || 1 })}
                          className="w-16 px-2.5 py-1 text-xs rounded-lg bg-white border border-slate-300 text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Main Image & Capture Section */}
                  <div className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800">
                        Image Principale du Projet
                      </label>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Aperçu réel ou capture automatique
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <input
                        type="text"
                        placeholder="URL de l'image (ex: /uploads/projects/preview-xyz.png)"
                        value={editingProject.mainImage || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, mainImage: e.target.value })}
                        className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 font-mono"
                      />

                      {/* Capture Preview Button */}
                      <button
                        type="button"
                        onClick={handleCapturePreview}
                        disabled={isCapturing}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
                        title="Générer automatiquement une capture d'écran à partir de l'URL publique du site"
                      >
                        {isCapturing ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Capture en cours...</span>
                          </>
                        ) : (
                          <>
                            <Camera className="w-3.5 h-3.5 text-red-400" />
                            <span>Capturer Aperçu (URL)</span>
                          </>
                        )}
                      </button>

                      {/* Manual Upload Button */}
                      <label className="px-4 py-2 bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-xs">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Importer Fichier</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEditingProject({ ...editingProject, mainImage: reader.result as string });
                                setCaptureSuccess('Image principale importée manuellement.');
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Live Feedback Messages */}
                    {captureSuccess && (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{captureSuccess}</span>
                      </div>
                    )}
                    {captureError && (
                      <div className="flex items-center gap-2 text-xs font-medium text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                        <span>{captureError}</span>
                      </div>
                    )}

                    {/* Preview Image Card */}
                    {editingProject.mainImage && (
                      <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                        <img 
                          src={editingProject.mainImage} 
                          alt="Aperçu projet" 
                          className="w-24 h-16 object-cover rounded-lg border border-slate-200 shadow-xs bg-black" 
                        />
                        <div className="min-w-0 flex-1 text-xs">
                          <div className="font-bold text-slate-900">Aperçu principal configuré</div>
                          <div className="text-slate-500 font-mono truncate">{editingProject.mainImage.substring(0, 80)}...</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, mainImage: '' })}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Supprimer l'image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Secondary Images / Gallery Section */}
                  <div className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-800">
                      Galerie d'Images Secondaires (Facultatif)
                    </label>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <input
                        type="text"
                        placeholder="URL de l'image secondaire"
                        value={galleryInput}
                        onChange={(e) => setGalleryInput(e.target.value)}
                        className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (galleryInput.trim()) {
                            setEditingProject({
                              ...editingProject,
                              gallery: [...(editingProject.gallery || []), galleryInput.trim()]
                            });
                            setGalleryInput('');
                          }
                        }}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Ajouter à la Galerie
                      </button>
                      <label className="px-4 py-2 bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center justify-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Importer Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEditingProject({
                                  ...editingProject,
                                  gallery: [...(editingProject.gallery || []), reader.result as string]
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {editingProject.gallery && editingProject.gallery.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {editingProject.gallery.map((imgUrl, gIdx) => (
                          <div key={gIdx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-black">
                            <img src={imgUrl} alt={`Galerie ${gIdx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...(editingProject.gallery || [])];
                                next.splice(gIdx, 1);
                                setEditingProject({ ...editingProject, gallery: next });
                              }}
                              className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-red-600 text-white rounded-md cursor-pointer transition-colors"
                              title="Supprimer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* Tab 2: Content */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Courte Description (Carte)</label>
                    <textarea
                      rows={3}
                      value={editingProject.shortDescription || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                      placeholder="Résumé succinct pour les cartes du portfolio..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Notes d'Architecture &amp; Conception (Facultatif)</label>
                    <textarea
                      rows={3}
                      value={editingProject.architectureNotes || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, architectureNotes: e.target.value })}
                      placeholder="Ex: Clean Architecture, DDD, CQRS, PostgreSQL, Redis..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Étude de Cas Détaillée (Markdown, Facultatif)</label>
                    <textarea
                      rows={6}
                      value={editingProject.fullDescription || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, fullDescription: e.target.value })}
                      placeholder="Détails complets de la conception, des modules et résultats..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Tech Associations with Live Logo Preview */}
              {activeTab === 'tech' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">Sélectionnez les technologies associées à ce projet :</p>
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
                          <div className="flex items-center gap-2 min-w-0">
                            <TechLogo name={t.name} logoUrl={t.logoUrl} size={16} className="shrink-0" />
                            <span className="truncate">{t.name}</span>
                          </div>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-red-600' : 'bg-slate-300'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 4: Lists & Metrics (FR) */}
              {activeTab === 'lists' && (
                <div className="space-y-6">
                  
                  {/* 1. Features */}
                  <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-red-600" />
                      <span>Fonctionnalités Clés</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        placeholder="Ex: Architecture modulaire avec injection de dépendances"
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-300"
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
                        className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Ajouter
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {editingProject.features?.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 shadow-xs">
                          <span>{f}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...(editingProject.features || [])];
                              next.splice(i, 1);
                              setEditingProject({ ...editingProject, features: next });
                            }}
                            className="text-slate-400 hover:text-red-600 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 2. Challenges */}
                  <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span>Défis Techniques</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={challengeInput}
                        onChange={(e) => setChallengeInput(e.target.value)}
                        placeholder="Ex: Optimiser des requêtes volumineuses sur la chaîne de production"
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (challengeInput.trim()) {
                            setEditingProject({
                              ...editingProject,
                              challenges: [...(editingProject.challenges || []), challengeInput.trim()]
                            });
                            setChallengeInput('');
                          }
                        }}
                        className="px-4 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Ajouter
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {editingProject.challenges?.map((c, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 shadow-xs">
                          <span>{c}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...(editingProject.challenges || [])];
                              next.splice(i, 1);
                              setEditingProject({ ...editingProject, challenges: next });
                            }}
                            className="text-slate-400 hover:text-red-600 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 3. Solutions */}
                  <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Solutions Déployées</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={solutionInput}
                        onChange={(e) => setSolutionInput(e.target.value)}
                        placeholder="Ex: Indexation ciblée des tables SQL et refactoring LINQ"
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (solutionInput.trim()) {
                            setEditingProject({
                              ...editingProject,
                              solutions: [...(editingProject.solutions || []), solutionInput.trim()]
                            });
                            setSolutionInput('');
                          }
                        }}
                        className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Ajouter
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {editingProject.solutions?.map((s, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 shadow-xs">
                          <span>{s}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...(editingProject.solutions || [])];
                              next.splice(i, 1);
                              setEditingProject({ ...editingProject, solutions: next });
                            }}
                            className="text-slate-400 hover:text-red-600 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 4. Impact & Metrics */}
                  <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-red-600" />
                      <span>Impact &amp; Métriques (Résultats Mesurables)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={resultInput}
                        onChange={(e) => setResultInput(e.target.value)}
                        placeholder="Ex: -40% temps de réponse, +99.9% disponibilité"
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-300"
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
                        className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Ajouter
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {editingProject.results?.map((r, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 shadow-xs font-bold">
                          <span>{r}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...(editingProject.results || [])];
                              next.splice(i, 1);
                              setEditingProject({ ...editingProject, results: next });
                            }}
                            className="text-slate-400 hover:text-red-600 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 5: Multilingual Translations (English) */}
              {activeTab === 'translations' && (
                <div className="space-y-5">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                    <strong>Traductions Anglaises :</strong> Renseignez les versions anglaises des textes pour ce projet. Si un champ est laissé vide, la version française originale sera affichée en repli (fallback).
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Titre (EN)</label>
                      <input
                        type="text"
                        value={editingProject.translations?.en?.title || ''}
                        onChange={(e) => {
                          const en = { ...(editingProject.translations?.en || {}), title: e.target.value };
                          setEditingProject({ ...editingProject, translations: { ...editingProject.translations, en } });
                        }}
                        placeholder="English project title..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Rôle / Poste (EN)</label>
                      <input
                        type="text"
                        value={editingProject.translations?.en?.role || ''}
                        onChange={(e) => {
                          const en = { ...(editingProject.translations?.en || {}), role: e.target.value };
                          setEditingProject({ ...editingProject, translations: { ...editingProject.translations, en } });
                        }}
                        placeholder="Ex: Lead .NET Engineer"
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Courte Description (EN)</label>
                    <textarea
                      rows={2}
                      value={editingProject.translations?.en?.shortDescription || ''}
                      onChange={(e) => {
                        const en = { ...(editingProject.translations?.en || {}), shortDescription: e.target.value };
                        setEditingProject({ ...editingProject, translations: { ...editingProject.translations, en } });
                      }}
                      placeholder="Brief English summary for cards..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Notes d'Architecture (EN)</label>
                    <textarea
                      rows={2}
                      value={editingProject.translations?.en?.architectureNotes || ''}
                      onChange={(e) => {
                        const en = { ...(editingProject.translations?.en || {}), architectureNotes: e.target.value };
                        setEditingProject({ ...editingProject, translations: { ...editingProject.translations, en } });
                      }}
                      placeholder="English architecture and design notes..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Étude de Cas Détaillée (Markdown, EN)</label>
                    <textarea
                      rows={5}
                      value={editingProject.translations?.en?.fullDescription || ''}
                      onChange={(e) => {
                        const en = { ...(editingProject.translations?.en || {}), fullDescription: e.target.value };
                        setEditingProject({ ...editingProject, translations: { ...editingProject.translations, en } });
                      }}
                      placeholder="Full markdown case study in English..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 font-mono"
                    />
                  </div>

                  {/* English Features */}
                  <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-red-600" />
                      <span>Key Features (EN)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={featureInputEn}
                        onChange={(e) => setFeatureInputEn(e.target.value)}
                        placeholder="Ex: Modular clean architecture with dependency injection"
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (featureInputEn.trim()) {
                            const currentEn = editingProject.translations?.en || {};
                            const nextList = [...(currentEn.features || []), featureInputEn.trim()];
                            setEditingProject({
                              ...editingProject,
                              translations: { ...editingProject.translations, en: { ...currentEn, features: nextList } }
                            });
                            setFeatureInputEn('');
                          }
                        }}
                        className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Add EN
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {editingProject.translations?.en?.features?.map((f: string, i: number) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 shadow-xs">
                          <span>{f}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const currentEn = editingProject.translations?.en || {};
                              const nextList = [...(currentEn.features || [])];
                              nextList.splice(i, 1);
                              setEditingProject({
                                ...editingProject,
                                translations: { ...editingProject.translations, en: { ...currentEn, features: nextList } }
                              });
                            }}
                            className="text-slate-400 hover:text-red-600 cursor-pointer"
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
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400 font-mono">
                  {editingProject.id}
                </div>
                <div className="flex items-center gap-3">
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
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
