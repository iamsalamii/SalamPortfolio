import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ActivityLog } from '../../types';
import { History, Trash2, Search, Filter, ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';

export const AdminActivityLogs: React.FC = () => {
  const { data, updateData } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const logs = data.activityLogs || [];

  const filteredLogs = logs.filter(log => {
    const matchAction = filterAction === 'all' || log.action.toLowerCase() === filterAction.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const userStr = (log.userName || log.user || '').toLowerCase();
    const targetStr = (log.target || log.entityType || '').toLowerCase();
    const matchSearch = !q || log.details.toLowerCase().includes(q) || userStr.includes(q) || targetStr.includes(q);
    return matchAction && matchSearch;
  });

  const handleClearLogs = async () => {
    if (confirm('Clear all audit logs?')) {
      await updateData({ activityLogs: [] });
    }
  };

  const getActionBadge = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'update':
        return 'bg-indigo-950 text-indigo-300 border-indigo-800';
      case 'delete':
        return 'bg-red-950 text-red-300 border-red-800';
      case 'login':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <span>Audit Trail & Activity Logs</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable tracking of content updates, authentication events, deployments, and database mutations.
          </p>
        </div>

        <button
          onClick={handleClearLogs}
          disabled={logs.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
          <span>Clear Logs</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity by keyword, user, or entity..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Action Types</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login / Auth</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-850 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Operator</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target Entity</th>
              <th className="py-3 px-4">Audit Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40">
                <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                  {log.userName || log.user || 'Administrator'}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getActionBadge(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-indigo-400">
                  {log.target || log.entityType || 'General'}
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-500">
            No activity records matching query.
          </div>
        )}
      </div>

    </div>
  );
};
