import React from 'react';
import { Users, ShieldCheck, Lock } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            <span>Comptes Administrateur</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestion du compte d'administration exclusif de Moussa Abdou Salam.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              S
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">Moussa Abdou Salam</p>
              <p className="text-xs font-mono text-slate-500">salam@portfolios.com</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-red-600" />
            <span>Sécurité du mot de passe</span>
          </p>
          <p className="leading-relaxed">
            Le mot de passe administrateur est haché avec Bcrypt et protégé par un rate limiting strict sur le serveur.
          </p>
        </div>
      </div>
    </div>
  );
};
