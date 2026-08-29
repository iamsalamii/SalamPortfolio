import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Experience } from '../../types';
import { Briefcase, Plus, Edit3, Trash2, Calendar, MapPin, X, CheckCircle2 } from 'lucide-react';

export const AdminExperiences: React.FC = () => {
  const { data, updateData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);

  const [respInput, setRespInput] = useState('');
  const [achieveInput, setAchieveInput] = useState('');

  const experiences = data.experiences || [];
  const technologies = data.technologies || [];

  const openCreateModal = () => {
    setEditingExp({
      id: `exp_${Date.now()}`,
      role: '',
      company: '',
      companyUrl: '',
      location: 'Paris, France (Remote)',
      contractType: 'Full-time',
      startDate: '2023-01',
      endDate: '',
      isCurrent: true,
      description: '',
      responsibilities: [],
      achievements: [],
      technologyIds: [],
      order: experiences.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingExp({ ...exp });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this work experience entry?')) {
      const next = experiences.filter(e => e.id !== id);
      await updateData({ experiences: next });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp?.role || !editingExp?.company) return;

    let nextExps: Experience[] = [];
    const exists = experiences.some(e => e.id === editingExp.id);

    if (exists) {
      nextExps = experiences.map(e => e.id === editingExp.id ? (editingExp as Experience) : e);
    } else {
      nextExps = [...experiences, editingExp as Experience];
    }

    await updateData({ experiences: nextExps });
    setIsModalOpen(false);
    setEditingExp(null);
  };

  const toggleTech = (techId: string) => {
    if (!editingExp) return;
    const current = editingExp.technologyIds || [];
    const next = current.includes(techId)
      ? current.filter(id => id !== techId)
      : [...current, techId];
    setEditingExp({ ...editingExp, technologyIds: next });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <span>Work Experience & Engineering Trajectory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your career history, lead roles, technical responsibilities, and quantified achievements.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Work Experience</span>
        </button>
      </div>

      {/* Experience Cards List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-white">{exp.role}</h3>
                <span className="text-xs font-semibold text-indigo-400">@ {exp.company}</span>
                {exp.isCurrent && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Present
                  </span>
                )}
                {exp.contractType && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                    {exp.contractType}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
                {exp.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {exp.location}
                  </span>
                )}
              </div>

              {exp.description && (
                <p className="text-xs text-slate-300 line-clamp-2">{exp.description}</p>
              )}

              <div className="flex flex-wrap gap-1.5 pt-1">
                {exp.technologyIds?.map(tid => {
                  const tech = technologies.find(t => t.id === tid);
                  return (
                    <span key={tid} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      {tech?.name || tid}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 pt-2 md:pt-0">
              <button
                onClick={() => openEditModal(exp)}
                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingExp.role ? `Edit: ${editingExp.role}` : 'Add Work Experience'}
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.role || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    placeholder="e.g. Lead .NET Solutions Architect"
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.company || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contract Type</label>
                  <input
                    type="text"
                    value={editingExp.contractType || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, contractType: e.target.value })}
                    placeholder="e.g. CDI / Freelance / Lead"
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={editingExp.startDate || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                    placeholder="e.g. 2022-01"
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                  <input
                    type="text"
                    disabled={editingExp.isCurrent}
                    value={editingExp.endDate || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                    placeholder="e.g. 2024-06"
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCurrentExp"
                  checked={editingExp.isCurrent || false}
                  onChange={(e) => setEditingExp({ ...editingExp, isCurrent: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-600"
                />
                <label htmlFor="isCurrentExp" className="text-xs font-semibold text-slate-300">
                  I currently work here (Present)
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  value={editingExp.description || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              {/* Responsibilities list */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white uppercase tracking-wider text-[11px] text-indigo-400">
                  Key Technical Responsibilities
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={respInput}
                    onChange={(e) => setRespInput(e.target.value)}
                    placeholder="e.g. Led migration to .NET 9 microservices"
                    className="flex-1 px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (respInput.trim()) {
                          setEditingExp({
                            ...editingExp,
                            responsibilities: [...(editingExp.responsibilities || []), respInput.trim()]
                          });
                          setRespInput('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (respInput.trim()) {
                        setEditingExp({
                          ...editingExp,
                          responsibilities: [...(editingExp.responsibilities || []), respInput.trim()]
                        });
                        setRespInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {editingExp.responsibilities?.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-800 text-xs text-slate-200">
                      <span>• {r}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...(editingExp.responsibilities || [])];
                          next.splice(i, 1);
                          setEditingExp({ ...editingExp, responsibilities: next });
                        }}
                        className="text-slate-400 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements list */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white uppercase tracking-wider text-[11px] text-emerald-400">
                  Key Quantified Achievements
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={achieveInput}
                    onChange={(e) => setAchieveInput(e.target.value)}
                    placeholder="e.g. Cut API p99 latency from 450ms to 45ms"
                    className="flex-1 px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (achieveInput.trim()) {
                          setEditingExp({
                            ...editingExp,
                            achievements: [...(editingExp.achievements || []), achieveInput.trim()]
                          });
                          setAchieveInput('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (achieveInput.trim()) {
                        setEditingExp({
                          ...editingExp,
                          achievements: [...(editingExp.achievements || []), achieveInput.trim()]
                        });
                        setAchieveInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {editingExp.achievements?.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-emerald-950/50 border border-emerald-800/60 text-xs text-emerald-300">
                      <span>✓ {a}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...(editingExp.achievements || [])];
                          next.splice(i, 1);
                          setEditingExp({ ...editingExp, achievements: next });
                        }}
                        className="text-emerald-400 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies association */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white uppercase tracking-wider text-[11px] text-indigo-400">
                  Technologies Used in this Role
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-800 rounded border border-slate-700">
                  {technologies.map(t => {
                    const sel = editingExp.technologyIds?.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTech(t.id)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                          sel ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.name}
                      </button>
                    );
                  })}
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
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
