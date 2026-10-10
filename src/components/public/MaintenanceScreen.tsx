import React from 'react';
import { useData } from '../../context/DataContext';
import { ShieldAlert, Mail, ShieldCheck } from 'lucide-react';

interface MaintenanceScreenProps {
  message?: string;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ message }) => {
  const { data, navigateTo } = useData();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">
          Maintenance Mode
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed">
          {data.siteSettings.maintenanceMessage || 'This portfolio is temporarily undergoing scheduled updates. Please check back shortly.'}
        </p>

        {data.personalInfo.email && (
          <div className="pt-2">
            <a
              href={`mailto:${data.personalInfo.email}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Contact via {data.personalInfo.email}</span>
            </a>
          </div>
        )}

        <div className="pt-8 border-t border-slate-800">
          <button
            onClick={() => navigateTo('admin')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
