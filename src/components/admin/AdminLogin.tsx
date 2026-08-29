import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Shield, Lock, User, ArrowLeft, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, navigateTo } = useData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const ok = await login(username.trim(), password.trim());
      if (!ok) {
        setError('Identifiants invalides. Veuillez vérifier vos accès.');
      }
    } catch {
      setError('Une erreur est survenue lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#090d16] text-slate-100 relative overflow-hidden font-sans">
      
      {/* Ambient Crimson background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-rose-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-2xl relative z-10">
        
        {/* Back to Public Portfolio */}
        <div>
          <button
            onClick={() => navigateTo('portfolio')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au Portfolio</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center space-y-2.5">
          <div className="w-14 h-14 rounded-2xl bg-red-600/15 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(220,38,38,0.3)]">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Console d'Administration
          </h1>
          <p className="text-xs text-slate-400">
            Espace d'administration réservé à <strong className="text-slate-200">Moussa Abdou Salam</strong>
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-slate-300">
              Email / Identifiant
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-[#080d1a] border border-slate-700 text-white focus:outline-none focus:border-red-500 transition-colors shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-slate-300">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-[#080d1a] border border-slate-700 text-white focus:outline-none focus:border-red-500 transition-colors shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-[0_0_25px_rgba(220,38,38,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98"
          >
            <Shield className="w-4 h-4" />
            <span>{isLoading ? 'Vérification...' : 'Se Connecter'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
