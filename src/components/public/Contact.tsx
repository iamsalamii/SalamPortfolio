import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Mail, Phone, ArrowUpRight, Copy, Check, Send } from 'lucide-react';

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
    <section id="contact" className="py-20 sm:py-28 max-w-5xl mx-auto px-6 sm:px-8 border-t border-slate-200/70 dark:border-slate-800/70">
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16">
        
        {/* Left: Contact Info */}
        <div className="md:col-span-5 space-y-6">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
            05 / Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
            {activeLanguage === 'fr' ? 'Travaillons ensemble.' : 'Let’s work together.'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {activeLanguage === 'fr'
              ? "Disponible pour des opportunités en développement logiciel, missions freelance et collaborations techniques."
              : "Available for engineering roles, freelance software contracts, and technical collaborations."}
          </p>

          <div className="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-sm">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-mono text-xs text-slate-900 dark:text-white">{currentEmail}</span>
              <button
                onClick={copyEmailToClipboard}
                className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-mono text-xs text-slate-900 dark:text-white">{currentPhone}</span>
              <span className="text-[11px] text-slate-400 font-mono">WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Right: Clean Minimal Form */}
        <div className="md:col-span-7">
          {status === 'success' ? (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-3">
              <p className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                {activeLanguage === 'fr' ? 'Message envoyé avec succès !' : 'Message received successfully!'}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                {activeLanguage === 'fr' ? 'Je vous répondrai dès que possible.' : 'I will get back to you shortly.'}
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 underline cursor-pointer"
              >
                {activeLanguage === 'fr' ? 'Envoyer un autre message' : 'Send another message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1.5">
                    {activeLanguage === 'fr' ? 'Nom' : 'Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@domaine.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={activeLanguage === 'fr' ? 'Votre message...' : 'Your message...'}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3 rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{status === 'submitting' ? (activeLanguage === 'fr' ? 'Envoi...' : 'Sending...') : (activeLanguage === 'fr' ? 'Envoyer' : 'Send Message')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>

    </section>
  );
};
