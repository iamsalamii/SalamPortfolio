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
    setAdminActiveTab,
    isSaving,
    isLoading
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

  const handleExitToPortfolio = () => {
    logout();
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#f8fafc] text-slate-900 font-sans antialiased">
      
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* 100% STATIC FIXED SIDEBAR ON DESKTOP */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 shadow-sm
        lg:static lg:h-screen lg:w-64 lg:shrink-0 lg:translate-x-0 lg:z-auto
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-200 shrink-0">
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

        {/* Navigation Items (Scrollable within static sidebar if screen height is small) */}
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
        <div className="p-3 border-t border-slate-200 bg-slate-50/80 space-y-2 shrink-0">
          {/* View Live Portfolio button -> Auto Log Out */}
          <button
            onClick={handleExitToPortfolio}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-red-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer"
            title="Quitter la console et fermer la session"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-red-600" />
              <span>Voir Portfolio (Déconnexion)</span>
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

      {/* Main Content Area (Independent scroll container) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shrink-0 z-30 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-mono font-bold flex items-center justify-center text-xs shadow-sm">
              MAS
            </div>
            <span className="font-bold text-sm text-slate-950">Console CMS</span>
          </div>
          <div className="flex items-center gap-2">
            {(isSaving || isLoading) && (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            )}
            <button
              onClick={handleExitToPortfolio}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 text-slate-700 hover:text-red-600 border border-slate-200 font-semibold"
            >
              Déconnexion &amp; Portfolio
            </button>
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Top Header Bar (Fixed / Shrink-0 at top of main area) */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white/95 border-b border-slate-200 backdrop-blur-md shrink-0 z-20 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 font-mono">
                Module CMS :
              </span>
              <span className="text-sm font-extrabold text-slate-950 capitalize">
                {adminActiveTab.replace('-', ' ')}
              </span>
            </div>

            {/* Subtle Circular Progress Indicator during save or load */}
            {(isSaving || isLoading) && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200 shadow-xs animate-fadeIn">
                <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="text-[11px]">
                  {isSaving ? 'Enregistrement des modifications...' : 'Actualisation des données...'}
                </span>
              </div>
            )}
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

            {/* Exit to Portfolio -> Auto Logout */}
            <button
              onClick={handleExitToPortfolio}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Retourner au portfolio public et fermer la session"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>← Voir le Portfolio Public (Déconnexion)</span>
            </button>
          </div>
        </header>

        {/* Scrollable Module Content Container */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl w-full mx-auto space-y-6">
            {isLoading && !data?.personalInfo ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono font-semibold text-slate-500">Chargement de la console d'administration...</p>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>

    </div>
  );
};
