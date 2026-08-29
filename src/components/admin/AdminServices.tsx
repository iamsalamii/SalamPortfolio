import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Service } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { Cpu, Plus, Edit3, Trash2, X, CheckCircle2 } from 'lucide-react';

export const AdminServices: React.FC = () => {
  const { data, updateData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [featureInput, setFeatureInput] = useState('');

  const services = data.services || [];

  const openCreateModal = () => {
    setEditingService({
      id: `srv_${Date.now()}`,
      title: '',
      description: '',
      icon: 'Server',
      features: [],
      ctaText: 'Request Architecture Audit',
      ctaUrl: '#contact',
      isActive: true,
      order: services.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService({ ...s });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this engineering service?')) {
      const next = services.filter(s => s.id !== id);
      await updateData({ services: next });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) return;

    let nextServices: Service[] = [];
    const exists = services.some(s => s.id === editingService.id);

    if (exists) {
      nextServices = services.map(s => s.id === editingService.id ? (editingService as Service) : s);
    } else {
      nextServices = [...services, editingService as Service];
    }

    await updateData({ services: nextServices });
    setIsModalOpen(false);
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Engineering & Architecture Services</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your service offerings, architecture audits, consulting packages, and call-to-action triggers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service Offering</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <div
            key={s.id}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="w-9 h-9 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center">
                  <IconRenderer name={s.icon || 'Server'} className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(s)}
                    className="p-1.5 text-slate-400 hover:text-indigo-400 rounded"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mt-2">{s.title}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{s.description}</p>

              {s.features && s.features.length > 0 && (
                <div className="space-y-1 mt-3">
                  {s.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                  {s.features.length > 3 && (
                    <span className="text-[10px] text-slate-500">+{s.features.length - 3} more items</span>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>CTA: {s.ctaText || '—'}</span>
              <span>{s.isActive ? 'Active' : 'Hidden'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingService.title ? `Edit Service` : 'Add Service Offering'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="e.g. Enterprise .NET & Azure Architecture"
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Lucide Icon Name</label>
                <input
                  type="text"
                  value={editingService.icon || 'Server'}
                  onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                  placeholder="e.g. Server, Gauge, Shield, Cpu, Cloud"
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              {/* Features list */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white uppercase tracking-wider text-[11px] text-indigo-400">
                  Included Features / Deliverables
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="e.g. Microservices refactoring roadmap"
                    className="flex-1 px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (featureInput.trim()) {
                          setEditingService({
                            ...editingService,
                            features: [...(editingService.features || []), featureInput.trim()]
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
                        setEditingService({
                          ...editingService,
                          features: [...(editingService.features || []), featureInput.trim()]
                        });
                        setFeatureInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {editingService.features?.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-800 text-xs text-slate-200">
                      <span>✓ {f}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...(editingService.features || [])];
                          next.splice(i, 1);
                          setEditingService({ ...editingService, features: next });
                        }}
                        className="text-slate-400 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Call to Action Text</label>
                  <input
                    type="text"
                    value={editingService.ctaText || ''}
                    onChange={(e) => setEditingService({ ...editingService, ctaText: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CTA URL</label>
                  <input
                    type="text"
                    value={editingService.ctaUrl || '#contact'}
                    onChange={(e) => setEditingService({ ...editingService, ctaUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveService"
                  checked={editingService.isActive ?? true}
                  onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-600"
                />
                <label htmlFor="isActiveService" className="text-xs font-semibold text-slate-300">
                  Visible in public portfolio
                </label>
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
