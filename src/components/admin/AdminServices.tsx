import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ServiceOffering } from '../../types';
import { Cpu, Plus, Edit3, Trash2, X, Save, CheckCircle2 } from 'lucide-react';

export const AdminServices: React.FC = () => {
  const { data, updateData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<ServiceOffering> | null>(null);

  const services = data.serviceOfferings || [];

  const openCreateModal = () => {
    setEditingService({
      id: `srv_${Date.now()}`,
      title: 'Architecture & Développement .NET',
      shortDescription: 'Conception d’APIs robustes, microservices et applications métier en ASP.NET Core et C#.',
      icon: 'Cpu',
      features: ['Clean Architecture & DDD', 'APIs RESTful & GraphQL', 'Optimisation SQL Server & Entity Framework Core'],
      order: services.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (srv: ServiceOffering) => {
    setEditingService({ ...srv });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) return;

    const exists = services.some(s => s.id === editingService.id);
    let next: ServiceOffering[];

    if (exists) {
      next = services.map(s => s.id === editingService.id ? (editingService as ServiceOffering) : s);
    } else {
      next = [...services, editingService as ServiceOffering];
    }

    await updateData({ serviceOfferings: next });
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce service ?')) {
      const next = services.filter(s => s.id !== id);
      await updateData({ serviceOfferings: next });
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-red-600" />
            <span>Prestations &amp; Services</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérez vos offres de conseil, d'architecture et de développement logiciel.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-red-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <h3 className="font-bold text-slate-950 text-base leading-snug">{srv.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{srv.shortDescription}</p>

              {srv.features && srv.features.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  {srv.features.map((f, i) => (
                    <div key={i} className="text-xs text-slate-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1">
              <button
                onClick={() => openEditModal(srv)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(srv.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-950 text-base">
                {editingService.title ? `Modifier : ${editingService.title}` : 'Ajouter un Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Titre du Service *</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingService.shortDescription || ''}
                  onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
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
