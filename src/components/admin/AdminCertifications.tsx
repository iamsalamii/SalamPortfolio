import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Certification } from '../../types';
import { Award, Plus, Edit3, Trash2, ShieldCheck, ArrowUpRight, X, Save } from 'lucide-react';

export const AdminCertifications: React.FC = () => {
  const { data, updateData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Partial<Certification> | null>(null);

  const certs = data.certifications || [];

  const openCreateModal = () => {
    setEditingCert({
      id: `cert_${Date.now()}`,
      name: 'Certification Microsoft .NET & C#',
      issuer: 'Microsoft',
      issueDate: '2024',
      expirationDate: '2027',
      credentialId: 'MS-891024',
      credentialUrl: 'https://learn.microsoft.com',
      badgeImageUrl: '',
      description: 'Validation des compétences en développement cloud, architecture et APIs RESTful avec ASP.NET Core.',
      isActive: true,
      order: certs.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Certification) => {
    setEditingCert({ ...c });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert || !editingCert.name) return;

    const exists = certs.some(c => c.id === editingCert.id);
    let next: Certification[];

    if (exists) {
      next = certs.map(c => c.id === editingCert.id ? (editingCert as Certification) : c);
    } else {
      next = [...certs, editingCert as Certification];
    }

    await updateData({ certifications: next });
    setIsModalOpen(false);
    setEditingCert(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette certification ?')) {
      const next = certs.filter(c => c.id !== id);
      await updateData({ certifications: next });
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Award className="w-5 h-5 text-red-600" />
            <span>Accréditations &amp; Certifications</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérez vos certifications officielles et liens d'accréditation.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Certification</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-red-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200">
                  {c.issuer}
                </span>
                <span className="text-xs text-slate-400 font-mono">{c.issueDate}</span>
              </div>

              <h3 className="font-bold text-slate-950 text-sm leading-snug">{c.name}</h3>

              {c.description && (
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Validé</span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(c)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-950 text-base">
                {editingCert.name ? `Modifier : ${editingCert.name}` : 'Ajouter une Certification'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom de la Certification *</label>
                <input
                  type="text"
                  required
                  value={editingCert.name || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Organisme Émetteur *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.issuer || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Année d'obtention</label>
                  <input
                    type="text"
                    value={editingCert.issueDate || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lien de Vérification (URL)</label>
                <input
                  type="text"
                  value={editingCert.credentialUrl || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCert.description || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
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
