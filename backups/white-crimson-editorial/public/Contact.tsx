import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Mail, Phone, Copy, Check, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const { data, activeLanguage } = useData();
  const info = data.personalInfo;
  const currentEmail = info.email || 'moussasalam86@gmail.com';
  const currentPhone = info.phone || '+225 07 09 83 74 55';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: activeLanguage === 'fr' ? 'Opportunité .NET / Full-Stack' : 'Full-Stack Collaboration Inquiry',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(currentEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 max-w-5xl mx-auto px-6 sm:px-8 border-t border-slate-200">
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16">
        
        {/* Left: Contact Info */}
        <div className="md:col-span-5 space-y-6">
          <p className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold">
            07 / Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
            {activeLanguage === 'fr' ? 'Travaillons ensemble.' : 'Let’s work together.'}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {activeLanguage === 'fr'
              ? "Disponible pour des opportunités en développement logiciel .NET, missions freelance et collaborations techniques."
              : "Available for engineering roles, freelance software contracts, and technical collaborations."}
          </p>

          <div className="space-y-3 pt-4 border-t border-slate-200 text-sm">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-mono text-xs text-slate-950">{currentEmail}</span>
              <button
                onClick={copyEmailToClipboard}
                className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                title="Copier l'email"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-mono text-xs text-slate-950">{currentPhone}</span>
              <span className="text-[11px] text-slate-400 font-mono">WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Right: Clean Minimal Form */}
        <div className="md:col-span-7">
          {status === 'success' ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <p className="text-lg font-bold text-emerald-900">
                {activeLanguage === 'fr' ? 'Message envoyé avec succès !' : 'Message received successfully!'}
              </p>
              <p className="text-xs text-emerald-700">
                {activeLanguage === 'fr' ? 'Je vous répondrai dès que possible.' : 'I will get back to you shortly.'}
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-2 text-xs font-semibold text-emerald-800 underline cursor-pointer"
              >
                {activeLanguage === 'fr' ? 'Envoyer un autre message' : 'Send another message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                    {activeLanguage === 'fr' ? 'Votre nom' : 'Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-950 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-950 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                  {activeLanguage === 'fr' ? 'Sujet' : 'Subject'}
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-950 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-950 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(220,38,38,0.25)] hover:shadow-[0_6px_25px_rgba(220,38,38,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{status === 'submitting' ? (activeLanguage === 'fr' ? 'Envoi...' : 'Sending...') : (activeLanguage === 'fr' ? 'Envoyer le message' : 'Send Message')}</span>
              </button>

              {status === 'error' && (
                <p className="text-xs text-red-600 mt-2 font-mono">
                  {activeLanguage === 'fr' ? "Erreur lors de l'envoi. Veuillez réessayer." : 'Error sending message. Please try again.'}
                </p>
              )}
            </form>
          )}
        </div>

      </div>

    </section>
  );
};
