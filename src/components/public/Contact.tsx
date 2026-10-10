import React, { useState } from 'react';
import { useData, apiUrl } from '../../context/DataContext';
import { Mail, Phone, Copy, Check, Send, ArrowUpRight } from 'lucide-react';

export const Contact: React.FC = () => {
  const { data, activeLanguage } = useData();
  const info = data.personalInfo;
  const currentEmail = info.email || 'moussasalam86@gmail.com';
  const currentPhone = info.phone || '+225 07 09 83 74 55';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: activeLanguage === 'fr' ? 'OPPORTUNITÉ .NET / COLLABORATION' : 'FULL-STACK INQUIRY',
    message: '',
    honeypot: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(currentEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(apiUrl('/api/messages'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const json = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
      } else {
        setStatus('error');
        setErrorMessage(json.error || 'Erreur lors de la transmission du message.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-8 border-t border-zinc-800 font-mono">
      
      {/* Section Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 text-red-500 text-xs font-bold tracking-widest uppercase mb-3">
          <span className="w-2.5 h-2.5 bg-red-500 inline-block" />
          <span>// 08. DISPATCH //</span>
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter">
          {activeLanguage === 'fr' ? 'CONTACT & TRANSMISSION' : 'GET IN TOUCH'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-14 items-start">
        
        {/* Left: Contact Info & Terminal Details */}
        <div className="md:col-span-5 space-y-6">
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
            {activeLanguage === 'fr'
              ? "Disponible pour des opportunités en développement logiciel C# / .NET 9, refonte d'architectures, missions freelance et collaborations techniques."
              : "Available for engineering roles, freelance software contracts, and technical collaborations."}
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-4 bg-[#0d0e14] border border-zinc-800 hover:border-red-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition-all">
              <div>
                <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block">// EMAIL_DIRECT</span>
                <span className="font-mono text-xs sm:text-sm text-white font-bold">{currentEmail}</span>
              </div>
              <button
                onClick={copyEmailToClipboard}
                className="p-2 text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 transition-colors cursor-pointer"
                title="Copier l'email"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-red-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0d0e14] border border-zinc-800 hover:border-red-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition-all">
              <div>
                <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block">// WHATSAPP_TEL</span>
                <span className="font-mono text-xs sm:text-sm text-white font-bold">{currentPhone}</span>
              </div>
              <a
                href={`https://wa.me/${currentPhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 transition-colors"
                title="Ouvrir WhatsApp"
              >
                <ArrowUpRight className="w-4 h-4 text-red-500" />
              </a>
            </div>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-500 space-y-1">
            <div className="font-bold text-zinc-400 uppercase">// TIMEZONE : GMT+0 (ABIDJAN)</div>
            <div>STATUS: ACCUSÉ DE RÉCEPTION SOUS 24H GARANTI</div>
          </div>
        </div>

        {/* Right: Brutalist Monospace Form */}
        <div className="md:col-span-7">
          {status === 'success' ? (
            <div className="p-8 bg-[#0d0e14] border-2 border-red-500 shadow-[6px_6px_0px_0px_#ef4444] text-center space-y-4 font-mono animate-in fade-in">
              <div className="w-12 h-12 bg-red-600 text-white font-black flex items-center justify-center mx-auto text-xl shadow-[0_0_15px_#ef4444]">
                ✓
              </div>
              <p className="text-xl font-black text-white uppercase tracking-tight">
                {activeLanguage === 'fr' ? '// TRANSMISSION RÉUSSIE //' : '// TRANSMISSION RECEIVED //'}
              </p>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-md mx-auto">
                {activeLanguage === 'fr' 
                  ? 'Votre message a été enregistré avec succès. Un accusé de réception a été envoyé et vous recevrez une réponse sous 24 heures.' 
                  : 'Your inquiry has been successfully delivered and logged. You will receive a response within 24 hours.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white border border-red-500 text-xs font-black uppercase tracking-wider cursor-pointer shadow-[3px_3px_0px_#ffffff] transition-all"
                >
                  {activeLanguage === 'fr' ? '[ TRANSMETTRE UN AUTRE MESSAGE ]' : '[ SEND ANOTHER MESSAGE ]'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-mono">
              
              {/* Hidden Honeypot Input for anti-bot validation */}
              <input
                type="text"
                name="honeypot"
                id="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                style={{ display: 'none', position: 'absolute', opacity: 0 }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    // 01. VOTRE NOM *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0d0e14] border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-red-500 focus:shadow-[4px_4px_0px_0px_#ef4444] transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    // 02. VOTRE EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jean@entreprise.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0d0e14] border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-red-500 focus:shadow-[4px_4px_0px_0px_#ef4444] transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  // 03. SUJET DU MESSAGE
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0d0e14] border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-red-500 focus:shadow-[4px_4px_0px_0px_#ef4444] transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  // 04. DÉTAILS DE LA MISSION / QUESTION *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Décrivez votre besoin technique ou projet..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0d0e14] border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-red-500 focus:shadow-[4px_4px_0px_0px_#ef4444] transition-all resize-none placeholder:text-zinc-600"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="brutalist-btn-primary w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {status === 'submitting' 
                    ? (activeLanguage === 'fr' ? 'TRANSMISSION EN COURS...' : 'TRANSMITTING...') 
                    : (activeLanguage === 'fr' ? 'TRANSMETTRE LE MESSAGE' : 'DISPATCH MESSAGE')}
                </span>
              </button>

              {status === 'error' && (
                <div className="p-3 bg-red-950/40 border border-red-500 text-xs text-red-400 font-mono space-y-1 animate-in fade-in">
                  <div className="font-bold uppercase">// ÉCHEC DE TRANSMISSION //</div>
                  <div>{errorMessage}</div>
                </div>
              )}
            </form>
          )}
        </div>

      </div>

    </section>
  );
};
