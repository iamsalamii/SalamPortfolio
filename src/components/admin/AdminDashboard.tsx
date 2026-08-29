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
  Database 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { data, setAdminActiveTab, navigateTo } = useData();

  const totalProjects = data.projects?.length || 0;
  const publishedProjects = (data.projects || []).filter(p => p.status === 'published').length;
  const totalTech = data.technologies?.length || 0;
  const totalExperiences = data.experiences?.length || 0;
  const totalCertifications = data.certifications?.length || 0;
  const totalArticles = data.blogPosts?.length || 0;
  const totalMessages = data.contactMessages?.length || 0;
  const unreadMessages = (data.contactMessages || []).filter(m => !m.isRead).length;

  const recentMessages = (data.contactMessages || []).slice(0, 3);
  const recentLogs = (data.activityLogs || []).slice(0, 5);

  const stats = [
    {
      title: 'Projects & Case Studies',
      value: totalProjects,
      subtitle: `${publishedProjects} Published`,
      icon: FolderGit2,
      tab: 'projects',
      color: 'text-indigo-400',
      bg: 'bg-indigo-950/40 border-indigo-800/60'
    },
    {
      title: 'Tech Stack Ecosystem',
      value: totalTech,
      subtitle: `${(data.techCategories || []).length} Categories`,
      icon: Code2,
      tab: 'technologies',
      color: 'text-blue-400',
      bg: 'bg-blue-950/40 border-blue-800/60'
    },
    {
      title: 'Work Experiences',
      value: totalExperiences,
      subtitle: `${data.personalInfo.yearsOfExperience}+ Years Recorded`,
      icon: Briefcase,
      tab: 'experiences',
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-800/60'
    },
    {
      title: 'Verified Certifications',
      value: totalCertifications,
      subtitle: 'Microsoft & Cloud',
      icon: Award,
      tab: 'certifications',
      color: 'text-amber-400',
      bg: 'bg-amber-950/40 border-amber-800/60'
    },
    {
      title: 'Inquiries & Messages',
      value: totalMessages,
      subtitle: `${unreadMessages} Unread`,
      icon: MessageSquare,
      tab: 'messages',
      color: 'text-purple-400',
      bg: 'bg-purple-950/40 border-purple-800/60'
    },
    {
      title: 'Technical Articles',
      value: totalArticles,
      subtitle: 'Engineering Notes',
      icon: BookOpen,
      tab: 'blog',
      color: 'text-rose-400',
      bg: 'bg-rose-950/40 border-rose-800/60'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-900/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>.NET Portfolio Administration Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {data.personalInfo.firstName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Your CMS database is live and synchronized. Every project, experience, technology, and translation can be dynamically managed below.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setAdminActiveTab('projects')}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            + Add New Project
          </button>
          <button
            onClick={() => navigateTo('portfolio')}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            View Live Portfolio
          </button>
        </div>
      </div>

      {/* Real Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              onClick={() => setAdminActiveTab(stat.tab)}
              className={`p-5 rounded-xl border ${stat.bg} cursor-pointer hover:border-indigo-400/80 transition-all flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-400 block">{stat.title}</span>
                  <div className="text-3xl font-extrabold text-white mt-1">{stat.value}</div>
                </div>
                <div className={`p-3 rounded-xl bg-slate-900/80 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{stat.subtitle}</span>
                <span className="font-semibold text-indigo-400 flex items-center gap-1">
                  Manage <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Messages & Activity Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Contact Messages */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Recent Inquiries</span>
            </h3>
            <button
              onClick={() => setAdminActiveTab('messages')}
              className="text-xs font-semibold text-indigo-400 hover:underline"
            >
              View all ({totalMessages})
            </button>
          </div>

          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setAdminActiveTab('messages')}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-colors cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{msg.name}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs font-medium text-indigo-400">{msg.subject}</div>
                <p className="text-xs text-slate-400 line-clamp-1">{msg.message}</p>
              </div>
            ))}

            {recentMessages.length === 0 && (
              <p className="text-xs text-slate-500 py-6 text-center">No messages received yet.</p>
            )}
          </div>
        </div>

        {/* Recent Activity Audit Logs */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Recent Activity Logs</span>
            </h3>
            <button
              onClick={() => setAdminActiveTab('logs')}
              className="text-xs font-semibold text-indigo-400 hover:underline"
            >
              View audit log
            </button>
          </div>

          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      log.action === 'CREATE' ? 'bg-emerald-950 text-emerald-300' :
                      log.action === 'UPDATE' ? 'bg-indigo-950 text-indigo-300' :
                      log.action === 'RESET' ? 'bg-amber-950 text-amber-300' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-200">{log.entityType}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">{log.details}</div>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {recentLogs.length === 0 && (
              <p className="text-xs text-slate-500 py-6 text-center">No recent log entries.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
