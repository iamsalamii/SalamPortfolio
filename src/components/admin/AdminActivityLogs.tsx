import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { History, Trash2, Search, Download } from 'lucide-react';

export const AdminActivityLogs: React.FC = () => {
  const { data, updateData } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const logs = data.activityLogs || [];

  const filteredLogs = logs.filter(log => {
    const matchAction = filterAction === 'all' || log.action === filterAction;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || log.entityType.toLowerCase().includes(q) || log.details.toLowerCase().includes(q) || log.userName.toLowerCase().includes(q);
    return matchAction && matchSearch;
  });

  const handleClearLogs = async () => {
    if (confirm('Voulez-vous réinitialiser le journal d’audit ?')) {
      await updateData({ activityLogs: [] });
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <History className="w-5 h-5 text-red-600" />
            <span>Journal d'Audit &amp; Activités</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Traçabilité complète des actions administratives effectuées sur votre CMS.
          </p>
        </div>

        <button
          onClick={handleClearLogs}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Vider le journal</span>
        </button>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 font-mono">
              <tr>
                <th className="py-3.5 px-4">Date &amp; Heure</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Détails</th>
                <th className="py-3.5 px-4">Utilisateur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {new Date(l.timestamp).toLocaleString('fr-FR')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-50 text-red-600 border border-red-200">
                      {l.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 font-mono">
                    {l.entityType}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {l.details}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {l.userName}
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Aucune entrée dans le journal d'audit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
