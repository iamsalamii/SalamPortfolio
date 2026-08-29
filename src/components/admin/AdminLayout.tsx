import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  LayoutDashboard, 
  User, 
  FolderGit2, 
  Code2, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Cpu, 
  BookOpen, 
  MessageSquare, 
  Image, 
  Navigation, 
  Layers, 
  Languages, 
  Search, 
  Settings, 
  Users, 
  Database, 
  History, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight 
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { 
    data, 
    currentUser, 
    logout, 
    navigateTo, 
    adminActiveTab, 
    setAdminActiveTab 
  } = useData();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const unreadMessagesCount = (data.contactMessages || []).filter(m => !m.isRead).length;

  const navGroups = [
    {
      group: 'Vue d’ensemble',
      items: [
        { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard, badge: null }
      ]
    },
    {
      group: 'Contenu & Portfolio',
      items: [
        { id: 'personal', label: 'Profil, Photo & Philosophie', icon: User, badge: null },
        { id: 'projects', label: 'Projets & Études de Cas', icon: FolderGit2, badge: data.projects?.length || 0 },
        { id: 'technologies', label: 'Stack & Technologies', icon: Code2, badge: data.technologies?.length || 0 },
        { id: 'experiences', label: 'Expériences Pro', icon: Briefcase, badge: data.experiences?.length || 0 },
        { id: 'education', label: 'Formations & Diplômes', icon: GraduationCap, badge: null },
        { id: 'certifications', label: 'Certifications', icon: Award, badge: data.certifications?.length || 0 },
        { id: 'services', label: 'Prestations & Services', icon: Cpu, badge: null },
        { id: 'blog', label: 'Articles & Blog', icon: BookOpen, badge: data.blogPosts?.length || 0 },
        { id: 'media', label: 'Médiathèque', icon: Image, badge: null }
      ]
    },
    {
      group: 'Communications',
      items: [
        { id: 'messages', label: 'Messages Reçus', icon: MessageSquare, badge: unreadMessagesCount > 0 ? `${unreadMessagesCount} nouveau(x)` : null, badgeColor: 'bg-red-600 text-white font-bold' }
      ]
    },
    {
      group: 'Structure & Système',
      items: [
        { id: 'navigation', label: 'Menu de Navigation', icon: Navigation, badge: null },
        { id: 'sections', label: 'Sections & Ordre', icon: Layers, badge: null },
        { id: 'seo', label: 'SEO & Méta-Tags', icon: Search, badge: null },
        { id: 'settings', label: 'Paramètres Généraux', icon: Settings, badge: null },
        { id: 'users', label: 'Comptes Admin', icon: Users, badge: null },
        { id: 'logs', label: 'Journal d’Audit', icon: History, badge: null }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col lg:flex-row font-sans antialiased">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-mono font-bold flex items-center justify-center text-xs shadow-sm">
            MAS
          </div>
          <span className="font-bold text-sm text-slate-950">Administration Portfolio</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('portfolio')}
            className="px-2.5 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200"
          >
            Site Public
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 lg:static shadow-sm
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-[0_4px_12px_rgba(220,38,38,0.3)]">
                MAS
              </div>
              <div>
                <h1 className="font-extrabold text-slate-950 text-sm tracking-tight">
                  Console CMS
                </h1>
                <span className="text-[11px] text-red-600 font-semibold block">
                  Moussa Abdou Salam
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                {group.group}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = adminActiveTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setAdminActiveTab(item.id);
                        setMobileSidebarOpen(false);
                        window.location.hash = `#admin/${item.id}`;
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-red-600 text-white shadow-[0_2px_10px_rgba(220,38,38,0.25)]'
                          : 'text-slate-600 hover:text-red-600 hover:bg-red-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== null && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          item.badgeColor || (isActive ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-600')
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer: User profile & Actions */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80 space-y-2">
          {/* View Live Portfolio button */}
          <button
            onClick={() => navigateTo('portfolio')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-red-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-red-600" />
              <span>Voir le Portfolio Public</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User pill & logout */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                S
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-900 truncate">
                  Moussa Abdou Salam
                </div>
                <div className="text-[10px] text-red-600 font-semibold truncate">
                  Super Admin
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Se déconnecter"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] overflow-y-auto">
        {/* Top Header Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white/90 border-b border-slate-200 backdrop-blur-md sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 font-mono">
              Module CMS :
            </span>
            <span className="text-sm font-extrabold text-slate-950 capitalize">
              {adminActiveTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {unreadMessagesCount > 0 && (
              <button
                onClick={() => setAdminActiveTab('messages')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{unreadMessagesCount} nouveau(x) message(s)</span>
              </button>
            )}

            <button
              onClick={() => navigateTo('portfolio')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>← Voir le Portfolio Public</span>
            </button>
          </div>
        </header>

        {/* Module Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>

    </div>
  );
};
