import React from 'react';
import { useData } from '../../context/DataContext';
import { 
  FolderGit2, 
  Code2, 
  Briefcase, 
  Award, 
  MessageSquare, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Database,
  ExternalLink,
  Plus,
  UserCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { data, setAdminActiveTab, navigateTo } = useData();

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
      color: 'text-red-500',
      bg: 'bg-red-950/30 border-red-900/40'
    },
    {
      title: 'Stack & Technologies',
      value: totalTech,
      subtitle: `${(data.techCategories || []).length} Catégories actives`,
      icon: Code2,
      tab: 'technologies',
      color: 'text-rose-400',
      bg: 'bg-rose-950/30 border-rose-900/40'
    },
    {
      title: 'Expériences Pro',
      value: totalExperiences,
      subtitle: `${data.personalInfo.yearsOfExperience}+ Années (DIRECTSOFT)`,
      icon: Briefcase,
      tab: 'experiences',
      color: 'text-amber-400',
      bg: 'bg-amber-950/30 border-amber-900/40'
    },
    {
      title: 'Certifications & Titres',
      value: totalCertifications,
      subtitle: 'Accréditations vérifiées',
      icon: Award,
      tab: 'certifications',
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30 border-emerald-900/40'
    },
    {
      title: 'Messages Reçus',
      value: totalMessages,
      subtitle: `${unreadMessages} Non lu(s)`,
      icon: MessageSquare,
      tab: 'messages',
      color: unreadMessages > 0 ? 'text-red-400 font-bold' : 'text-slate-400',
      bg: unreadMessages > 0 ? 'bg-red-950/50 border-red-800/80 shadow-[0_0_20px_rgba(220,38,38,0.2)]' : 'bg-slate-900 border-slate-800'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl pb-12">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border border-red-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-900/40 text-red-300 border border-red-700/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Console Administrateur .NET Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bienvenue, Moussa Abdou Salam
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Votre portfolio est configuré sous l'identité <strong className="text-red-400 font-semibold">Crimson Precision</strong>. Gérez vos projets, compétences, bio et messages reçus.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setAdminActiveTab('personal')}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Profil &amp; Photo</span>
          </button>
          
          <button
            onClick={() => navigateTo('portfolio')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Voir le site</span>
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
              className={`p-5 rounded-2xl ${stat.bg} border transition-all duration-200 hover:-translate-y-1 hover:border-red-500/60 cursor-pointer flex flex-col justify-between space-y-4`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{stat.title}</span>
                <div className={`p-2 rounded-xl bg-slate-900/80 ${stat.color} border border-white/5`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-black text-white tracking-tight font-display">
                  {stat.value}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
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
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-red-400">
              <MessageSquare className="w-4 h-4" />
              <span>Derniers Messages Reçus ({totalMessages})</span>
            </h2>
            <button
              onClick={() => setAdminActiveTab('messages')}
              className="text-xs text-slate-400 hover:text-red-400 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recentMessages.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-800/40 border border-slate-800 text-slate-400 text-xs">
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
                      ? 'bg-red-950/20 border-red-800/50 hover:border-red-600' 
                      : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{msg.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{new Date(msg.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p className="text-xs text-red-400 font-medium truncate mb-1">{msg.subject || 'Sujet du message'}</p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Audit Logs & System Health */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Audit Logs */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-red-400">
              <Clock className="w-4 h-4" />
              <span>Journal d'Audit &amp; Activités</span>
            </h2>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {recentLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{log.action} • {log.entityType}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-tight">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* System & Database Status */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Persistance des Données</p>
                <p className="text-[11px] text-emerald-400 font-mono">Disque JSON &amp; PostgreSQL Ready</p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

        </div>

      </div>

    </div>
  );
};
