import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ContactMessage } from '../../types';
import { MessageSquare, Mail, Trash2, CheckCircle2, Search, Calendar, User, Copy, Check, Send, CornerDownLeft } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const { data, updateModule } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySentSuccess, setReplySentSuccess] = useState(false);

  const messages = data.contactMessages || [];

  const filteredMessages = messages.filter(m => {
    const q = searchQuery.toLowerCase().trim();
    return !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || (m.subject && m.subject.toLowerCase().includes(q)) || m.message.toLowerCase().includes(q);
  });

  const selectedMessage = messages.find(m => m.id === selectedMessageId) || (filteredMessages.length > 0 ? filteredMessages[0] : null);

  const toggleReadStatus = async (msg: ContactMessage) => {
    const next = messages.map(m => m.id === msg.id ? { ...m, isRead: !m.isRead } : m);
    await updateModule('contactMessages', next);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce message ?')) {
      const next = messages.filter(m => m.id !== id);
      await updateModule('contactMessages', next);
      if (selectedMessageId === id) {
        setSelectedMessageId(null);
      }
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSendQuickReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    const mailtoUrl = `mailto:${selectedMessage.email}?subject=RE: ${encodeURIComponent(selectedMessage.subject || 'Votre message')}&body=${encodeURIComponent(replyText.trim())}`;
    window.open(mailtoUrl, '_blank');
    setReplySentSuccess(true);
    setTimeout(() => {
      setReplySentSuccess(false);
      setReplyText('');
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-red-600" />
            <span>Messages Reçus &amp; Contacts</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Consultez les demandes de contact envoyées depuis votre portfolio public et répondez rapidement.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500 font-semibold">
          Total : <strong className="text-slate-900">{messages.length}</strong> message(s) ({messages.filter(m => !m.isRead).length} non lu(s))
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List (Left Column) */}
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

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredMessages.map((m) => {
              const isSelected = selectedMessage?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMessageId(m.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-red-50/70 border-red-500 shadow-sm ring-1 ring-red-400'
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
                  <p className="text-xs text-red-600 font-semibold truncate mb-1">{m.subject || 'Opportunité technique'}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{m.message}</p>
                </div>
              );
            })}

            {filteredMessages.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
                Aucun message trouvé.
              </div>
            )}
          </div>
        </div>

        {/* Selected Message Detail (Right Column) */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-950 text-base">{selectedMessage.subject || 'Message de contact'}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedMessage.name}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono text-red-600 font-semibold">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{selectedMessage.email}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-400 text-[11px]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReadStatus(selectedMessage)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 transition-colors cursor-pointer"
                    title={selectedMessage.isRead ? 'Marquer comme non lu' : 'Marquer comme lu'}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${selectedMessage.isRead ? 'text-emerald-600' : 'text-slate-400'}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                {selectedMessage.message}
              </div>

              {/* Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleCopyEmail(selectedMessage.email)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer border border-slate-200"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Email copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copier l'Email ({selectedMessage.email})</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${selectedMessage.email}?subject=RE: ${encodeURIComponent(selectedMessage.subject || 'Votre message sur SALAM.DEV')}`}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Ouvrir dans Messagerie</span>
                </a>
              </div>

              {/* Quick Reply Form */}
              <form onSubmit={handleSendQuickReply} className="pt-4 border-t border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase font-mono flex items-center gap-1.5">
                  <CornerDownLeft className="w-3.5 h-3.5 text-red-600" />
                  <span>Réponse Rapide à {selectedMessage.name}</span>
                </label>

                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Bonjour ${selectedMessage.name},\n\nMerci pour votre message...`}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white resize-none"
                />

                <div className="flex items-center justify-between">
                  {replySentSuccess ? (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Client email ouvert avec votre réponse !</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      Génère un email pré-rempli vers <strong className="text-slate-700">{selectedMessage.email}</strong>
                    </span>
                  )}

                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer la réponse</span>
                  </button>
                </div>
              </form>

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

