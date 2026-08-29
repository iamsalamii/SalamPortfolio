import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ContactMessage } from '../../types';
import { MessageSquare, Mail, Trash2, CheckCircle2, Search, Reply, Archive, Eye } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const { data, updateData } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const messages = data.contactMessages || [];

  const filteredMessages = messages.filter(m => {
    const q = searchQuery.toLowerCase().trim();
    return !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.message.toLowerCase().includes(q);
  });

  const toggleReadStatus = async (id: string, current: boolean) => {
    const next = messages.map(m => m.id === id ? { ...m, isRead: !current } : m);
    await updateData({ contactMessages: next });
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, isRead: !current });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this inquiry message?')) {
      const next = messages.filter(m => m.id !== id);
      await updateData({ contactMessages: next });
      if (selectedMessage?.id === id) setSelectedMessage(null);
    }
  };

  const handleOpenMessage = async (m: ContactMessage) => {
    setSelectedMessage(m);
    if (!m.isRead) {
      await toggleReadStatus(m.id, false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <span>Contact Messages & Inquiries Inbox</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            View and respond to client inquiries, recruiter proposals, and architecture consultation requests.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Main Inbox View: List + Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Messages List */}
        <div className="lg:col-span-5 space-y-2">
          {filteredMessages.map((m) => {
            const isSelected = selectedMessage?.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => handleOpenMessage(m)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  isSelected
                    ? 'bg-slate-850 border-indigo-500 shadow-md'
                    : m.isRead
                    ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-850/60'
                    : 'bg-slate-900 border-indigo-900/80 hover:border-indigo-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!m.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                    <span className={`text-xs font-bold ${m.isRead ? 'text-slate-300' : 'text-white'}`}>
                      {m.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-xs font-semibold text-indigo-400 truncate">
                  {m.subject || 'No Subject'}
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {m.message}
                </p>
              </div>
            );
          })}

          {filteredMessages.length === 0 && (
            <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-500">
              No inquiries found.
            </div>
          )}
        </div>

        {/* Selected Message Detail Drawer */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              
              {/* Header Actions */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Inquiry Details</span>
                  <h3 className="text-lg font-bold text-white leading-snug">{selectedMessage.subject}</h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleReadStatus(selectedMessage.id, selectedMessage.isRead)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs"
                    title={selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${selectedMessage.isRead ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sender info */}
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{selectedMessage.name}</div>
                  <a href={`mailto:${selectedMessage.email}`} className="text-indigo-400 hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="text-slate-400 text-right">
                  <div>Received on</div>
                  <div className="font-medium text-slate-300">{new Date(selectedMessage.createdAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Message Content</label>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Quick Reply Trigger */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply via Email ({selectedMessage.email})</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[300px] flex items-center justify-center p-8 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
              Select an inquiry message from the list to view full conversation details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
