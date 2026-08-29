import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Education } from '../../types';
import { GraduationCap, Plus, Edit3, Trash2, Calendar, MapPin, X } from 'lucide-react';

export const AdminEducation: React.FC = () => {
  const { data, updateData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);

  const educationList = data.education || [];

  const openCreateModal = () => {
    setEditingEdu({
      id: `edu_${Date.now()}`,
      degree: "Master's in Computer Science & Software Engineering",
      institution: '',
      institutionUrl: '',
      fieldOfStudy: 'Distributed Systems & Software Engineering',
      location: 'Paris, France',
      startDate: '2013',
      endDate: '2016',
      description: '',
      order: educationList.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (edu: Education) => {
    setEditingEdu({ ...edu });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this education entry?')) {
      const next = educationList.filter(e => e.id !== id);
      await updateData({ education: next });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu?.degree || !editingEdu?.institution) return;

    let nextEdu: Education[] = [];
    const exists = educationList.some(e => e.id === editingEdu.id);

    if (exists) {
      nextEdu = educationList.map(e => e.id === editingEdu.id ? (editingEdu as Education) : e);
    } else {
      nextEdu = [...educationList, editingEdu as Education];
    }

    await updateData({ education: nextEdu });
    setIsModalOpen(false);
    setEditingEdu(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>Academic Background & Degrees</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage university degrees, engineering schools, and academic distinctions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Academic Degree</span>
        </button>
      </div>

      {/* Education Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {educationList.map((edu) => (
          <div
            key={edu.id}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-white leading-snug">{edu.degree}</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(edu)}
                    className="p-1.5 text-slate-400 hover:text-indigo-400 rounded"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs font-semibold text-indigo-400 mt-1">{edu.fieldOfStudy}</div>
              <div className="text-xs text-slate-300 font-medium">{edu.institution}</div>

              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {edu.startDate} — {edu.endDate || 'Present'}
                </span>
                {edu.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {edu.location}
                  </span>
                )}
              </div>

              {edu.description && (
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{edu.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingEdu.degree ? `Edit Degree` : 'Add Academic Degree'}
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Degree Title *</label>
                <input
                  type="text"
                  required
                  value={editingEdu.degree || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                  placeholder="e.g. Master of Science in Computer Science"
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Field of Study</label>
                <input
                  type="text"
                  value={editingEdu.fieldOfStudy || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, fieldOfStudy: e.target.value })}
                  placeholder="e.g. Software Architecture & Distributed Systems"
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Institution Name *</label>
                  <input
                    type="text"
                    required
                    value={editingEdu.institution || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingEdu.location || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, location: e.target.value })}
                    placeholder="e.g. Paris, France"
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Year</label>
                  <input
                    type="text"
                    value={editingEdu.startDate || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    value={editingEdu.endDate || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Institution Website URL</label>
                <input
                  type="text"
                  value={editingEdu.institutionUrl || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institutionUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Honors</label>
                <textarea
                  rows={2}
                  value={editingEdu.description || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
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
                  Save Academic Degree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
