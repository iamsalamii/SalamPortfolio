import React from 'react';
import { useData } from '../../context/DataContext';
import { 
  FolderGit2, 
  Code2, 
  Briefcase, 
  Award, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Database,
  ExternalLink,
  UserCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { data, setAdminActiveTab, logout } = useData();

  const totalProjects = data.projects?.length || 0;
  const publishedProjects = (data.projects || []).filter(p => p.status === 'published').length;
  const totalTech = data.technologies?.length || 0;
  const totalExperiences = data.experiences?.length || 0;
  const totalCertifications = data.certifications?.length || 0;
  const totalMessages = data.contactMessages?.length || 0;
  const unreadMessages = (data.contactMessages || []).filter(m => !m.isRead).length;

  const recentMessages = (data.contactMessages || []).slice(0, 4);
  const recentLogs = (data.activityLogs || []).slice(0, 6);

  const stats = [
    {
      title: 'Projets & Réalisations',
      value: totalProjects,
      subtitle: `${publishedProjects} Publié(s)`,
      icon: FolderGit2,
      tab: 'projects',
      color: 'text-red-600',
      bg: 'bg-white border-slate-200'
    },
    {
      title: 'Stack & Technologies',
      value: totalTech,
      subtitle: `${(data.techCategories || []).length} Catégories actives`,
      icon: Code2,
      tab: 'technologies',
      color: 'text-red-600',
      bg: 'bg-white border-slate-200'
    },
    {
      title: 'Expériences Pro',
      value: totalExperiences,
      subtitle: `${data.personalInfo.yearsOfExperience}+ Années (DIRECTSOFT)`,
      icon: Briefcase,
      tab: 'experiences',
      color: 'text-red-600',
      bg: 'bg-white border-slate-200'
    },
    {
      title: 'Certifications & Titres',
      value: totalCertifications,
      subtitle: 'Accréditations vérifiées',
      icon: Award,
      tab: 'certifications',
      color: 'text-emerald-600',
      bg: 'bg-white border-slate-200'
    },
    {
      title: 'Messages Reçus',
      value: totalMessages,
      subtitle: `${unreadMessages} Non lu(s)`,
      icon: MessageSquare,
      tab: 'messages',
      color: unreadMessages > 0 ? 'text-red-600 font-bold' : 'text-slate-500',
      bg: unreadMessages > 0 ? 'bg-red-50 border-red-200 shadow-xs' : 'bg-white border-slate-200'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl pb-12">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Console Administrateur .NET Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Bienvenue, Moussa Abdou Salam
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            Votre portfolio est configuré sous l'identité <strong className="text-red-600 font-semibold">Crimson Precision</strong>. Gérez vos projets, compétences, bio et messages reçus.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setAdminActiveTab('personal')}
            className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-[0_4px_15px_rgba(220,38,38,0.25)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Profil &amp; Photo</span>
          </button>
          
          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition-all flex items-center gap-2 cursor-pointer"
            title="Retourner au portfolio public et fermer la session"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Voir le site (Déconnexion)</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => setAdminActiveTab(stat.tab)}
              className={`p-5 rounded-2xl ${stat.bg} border transition-all duration-200 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-md cursor-pointer flex flex-col justify-between space-y-4 shadow-xs`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">{stat.title}</span>
                <div className={`p-2 rounded-xl bg-slate-50 ${stat.color} border border-slate-200`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-black text-slate-950 tracking-tight font-display">
                  {stat.value}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  {stat.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Quick Actions & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Messages */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wider flex items-center gap-2 text-red-600 font-mono">
              <MessageSquare className="w-4 h-4" />
              <span>Derniers Messages Reçus ({totalMessages})</span>
            </h2>
            <button
              onClick={() => setAdminActiveTab('messages')}
              className="text-xs text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recentMessages.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
              Aucun message reçu pour le moment.
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setAdminActiveTab('messages')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    !msg.isRead 
                      ? 'bg-red-50/50 border-red-200 hover:border-red-500' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-950">{msg.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{new Date(msg.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p className="text-xs text-red-600 font-semibold truncate mb-1">{msg.subject || 'Sujet du message'}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Audit Logs & System Health */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Audit Logs */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wider flex items-center gap-2 text-red-600 font-mono">
              <Clock className="w-4 h-4" />
              <span>Journal d'Audit &amp; Activités</span>
            </h2>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {recentLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{log.action} • {log.entityType}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-tight">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* System & Database Status */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-950">Persistance des Données</p>
                <p className="text-[11px] text-emerald-600 font-mono">Disque JSON &amp; PostgreSQL Ready</p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

        </div>

      </div>

    </div>
  );
};
