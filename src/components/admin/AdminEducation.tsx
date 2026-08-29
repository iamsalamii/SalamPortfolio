import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Education } from '../../types';
import { GraduationCap, Plus, Edit3, Trash2, Calendar, MapPin, X, Save } from 'lucide-react';

export const AdminEducation: React.FC = () => {
  const { data, updateData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);

  const educationList = data.education || [];

  const openCreateModal = () => {
    setEditingEdu({
      id: `edu_${Date.now()}`,
      degree: 'Master en Ingénierie Logicielle / Informatique',
      institution: 'Université / Institut Supérieur',
      period: '2020 — 2023',
      location: 'Abidjan',
      description: 'Spécialisation en architectures logicielles, génie logiciel et technologies web modernes.',
      order: educationList.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (edu: Education) => {
    setEditingEdu({ ...edu });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu || !editingEdu.degree) return;

    const exists = educationList.some(e => e.id === editingEdu.id);
    let next: Education[];

    if (exists) {
      next = educationList.map(e => e.id === editingEdu.id ? (editingEdu as Education) : e);
    } else {
      next = [...educationList, editingEdu as Education];
    }

    await updateData({ education: next });
    setIsModalOpen(false);
    setEditingEdu(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce diplôme ?')) {
      const next = educationList.filter(e => e.id !== id);
      await updateData({ education: next });
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-red-600" />
            <span>Formations &amp; Diplômes</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérez votre parcours académique et vos diplômes supérieurs.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Diplôme</span>
        </button>
      </div>

      <div className="space-y-4">
        {educationList.map((edu) => (
          <div
            key={edu.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-red-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-slate-950 text-base">{edu.degree}</h3>
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                  {edu.institution}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{edu.period}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{edu.location}</span>
                </span>
              </div>

              {edu.description && (
                <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                  {edu.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openEditModal(edu)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(edu.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-950 text-base">
                {editingEdu.degree ? `Modifier : ${editingEdu.degree}` : 'Ajouter un Diplôme'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Intitulé du Diplôme *</label>
                <input
                  type="text"
                  required
                  value={editingEdu.degree || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Établissement *</label>
                <input
                  type="text"
                  required
                  value={editingEdu.institution || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Période</label>
                  <input
                    type="text"
                    value={editingEdu.period || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, period: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Localisation</label>
                  <input
                    type="text"
                    value={editingEdu.location || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, location: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingEdu.description || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
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
