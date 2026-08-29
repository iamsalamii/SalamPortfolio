import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ContactMessage } from '../../types';
import { MessageSquare, Mail, Trash2, CheckCircle2, Search, Calendar, User } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const { data, updateData } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const messages = data.contactMessages || [];

  const filteredMessages = messages.filter(m => {
    const q = searchQuery.toLowerCase().trim();
    return !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || (m.subject && m.subject.toLowerCase().includes(q)) || m.message.toLowerCase().includes(q);
  });

  const toggleReadStatus = async (msg: ContactMessage) => {
    const next = messages.map(m => m.id === msg.id ? { ...m, isRead: !m.isRead } : m);
    await updateData({ contactMessages: next });
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage({ ...selectedMessage, isRead: !selectedMessage.isRead });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce message ?')) {
      const next = messages.filter(m => m.id !== id);
      await updateData({ contactMessages: next });
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-red-600" />
            <span>Messages Reçus</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Consultez les demandes de contact envoyées depuis votre portfolio public.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, email..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 shadow-xs focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredMessages.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMessage(m)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                  selectedMessage?.id === m.id
                    ? 'bg-red-50/60 border-red-500 shadow-sm'
                    : !m.isRead
                    ? 'bg-white border-red-200 hover:border-red-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs ${!m.isRead ? 'font-black text-slate-950' : 'font-semibold text-slate-700'}`}>
                    {m.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(m.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className="text-xs text-red-600 font-medium truncate mb-1">{m.subject || 'Opportunité technique'}</p>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{m.message}</p>
              </div>
            ))}

            {filteredMessages.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
                Aucun message trouvé.
              </div>
            )}
          </div>
        </div>

        {/* Selected Message Detail */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-950 text-base">{selectedMessage.subject || 'Message de contact'}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedMessage.name}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono text-red-600">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{selectedMessage.email}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReadStatus(selectedMessage)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 transition-colors"
                    title={selectedMessage.isRead ? 'Marquer comme non lu' : 'Marquer comme lu'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                {selectedMessage.message}
              </div>

              <div className="flex justify-end">
                <a
                  href={`mailto:${selectedMessage.email}?subject=RE: ${encodeURIComponent(selectedMessage.subject || 'Votre message')}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Répondre par Email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs text-xs text-slate-400">
              Sélectionnez un message dans la liste à gauche pour consulter son contenu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
