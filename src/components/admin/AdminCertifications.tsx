import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Certification } from '../../types';
import { Award, Plus, Edit3, Trash2, ExternalLink, Calendar, X, CheckCircle2 } from 'lucide-react';

export const AdminCertifications: React.FC = () => {
  const { data, updateData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Partial<Certification> | null>(null);

  const certs = data.certifications || [];

  const openCreateModal = () => {
    setEditingCert({
      id: `cert_${Date.now()}`,
      name: '',
      issuer: 'Microsoft',
      issueDate: '2024-01',
      expiryDate: '2026-01',
      credentialId: '',
      credentialUrl: '',
      description: '',
      isActive: true,
      order: certs.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Certification) => {
    setEditingCert({ ...c });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this certification?')) {
      const next = certs.filter(c => c.id !== id);
      await updateData({ certifications: next });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert?.name || !editingCert?.issuer) return;

    let nextCerts: Certification[] = [];
    const exists = certs.some(c => c.id === editingCert.id);

    if (exists) {
      nextCerts = certs.map(c => c.id === editingCert.id ? (editingCert as Certification) : c);
    } else {
      nextCerts = [...certs, editingCert as Certification];
    }

    await updateData({ certifications: nextCerts });
    setIsModalOpen(false);
    setEditingCert(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <span>Certifications & Verified Credentials</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage Microsoft Certified credentials, Azure badges, and verification links.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{c.issuer}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-1 text-slate-400 hover:text-indigo-400 rounded"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1 text-slate-400 hover:text-red-400 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug mt-1">{c.name}</h3>

              {c.credentialId && (
                <div className="text-[11px] font-mono text-slate-500 mt-1">
                  ID: {c.credentialId}
                </div>
              )}

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-2">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>Issued: {c.issueDate} {c.expiryDate ? `• Exp: ${c.expiryDate}` : ''}</span>
              </div>

              {c.description && (
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{c.description}</p>
              )}
            </div>

            {c.credentialUrl && (
              <div className="pt-2 border-t border-slate-800">
                <a
                  href={c.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:underline"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingCert.name ? `Edit Certification` : 'Add Certification'}
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Certification Name *</label>
                <input
                  type="text"
                  required
                  value={editingCert.name || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                  placeholder="e.g. Microsoft Certified: Azure Solutions Architect Expert"
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Issuer Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.issuer || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    placeholder="e.g. Microsoft, AWS, CNCF"
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Credential ID</label>
                  <input
                    type="text"
                    value={editingCert.credentialId || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                    placeholder="e.g. MS-AZ-305-..."
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={editingCert.issueDate || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                    placeholder="e.g. 2024-03"
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={editingCert.expiryDate || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, expiryDate: e.target.value })}
                    placeholder="e.g. 2026-03"
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Verification URL</label>
                <input
                  type="text"
                  value={editingCert.credentialUrl || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                  placeholder="https://learn.microsoft.com/en-us/users/.../credentials/..."
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  value={editingCert.description || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveCert"
                  checked={editingCert.isActive ?? true}
                  onChange={(e) => setEditingCert({ ...editingCert, isActive: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-600"
                />
                <label htmlFor="isActiveCert" className="text-xs font-semibold text-slate-300">
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
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
