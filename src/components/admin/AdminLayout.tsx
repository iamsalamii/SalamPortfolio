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
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck 
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
      group: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null }
      ]
    },
    {
      group: 'Content & Portfolio',
      items: [
        { id: 'personal', label: 'Profil, Photo & Philosophie', icon: User, badge: null },
        { id: 'projects', label: 'Projects & Case Studies', icon: FolderGit2, badge: data.projects?.length || 0 },
        { id: 'technologies', label: 'Tech Stack & Categories', icon: Code2, badge: data.technologies?.length || 0 },
        { id: 'experiences', label: 'Work Experience', icon: Briefcase, badge: data.experiences?.length || 0 },
        { id: 'education', label: 'Education', icon: GraduationCap, badge: null },
        { id: 'certifications', label: 'Certifications', icon: Award, badge: data.certifications?.length || 0 },
        { id: 'services', label: 'Engineering Services', icon: Cpu, badge: null },
        { id: 'blog', label: 'Articles & Blog', icon: BookOpen, badge: data.blogPosts?.length || 0 },
        { id: 'media', label: 'Media Library', icon: Image, badge: null }
      ]
    },
    {
      group: 'Communications',
      items: [
        { id: 'messages', label: 'Contact Messages', icon: MessageSquare, badge: unreadMessagesCount > 0 ? `${unreadMessagesCount} new` : null, badgeColor: 'bg-emerald-500 text-white' }
      ]
    },
    {
      group: 'Structure & Localization',
      items: [
        { id: 'navigation', label: 'Public Navigation Menu', icon: Navigation, badge: null },
        { id: 'sections', label: 'Page Sections', icon: Layers, badge: null },
        { id: 'translations', label: 'Languages & Translations', icon: Languages, badge: `${data.languages?.length || 2} langs` }
      ]
    },
    {
      group: 'System & Configuration',
      items: [
        { id: 'seo', label: 'SEO & Meta Tags', icon: Search, badge: null },
        { id: 'settings', label: 'Site & Appearance Settings', icon: Settings, badge: null },
        { id: 'users', label: 'Admin Users & Roles', icon: Users, badge: null },
        { id: 'seed', label: 'Seed & Data Manager', icon: Database, badge: null },
        { id: 'logs', label: 'Audit Activity Logs', icon: History, badge: null }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans antialiased">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-xs">
            ASM
          </div>
          <span className="font-bold text-sm text-white">Administration Portfolio</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('portfolio')}
            className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:text-white"
          >
            Site Public
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 lg:static
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-mono font-bold flex items-center justify-center text-sm shadow-sm">
                ASM
              </div>
              <div>
                <h1 className="font-bold text-white text-sm tracking-tight">
                  Espace Administration
                </h1>
                <span className="text-[11px] text-indigo-400 font-medium block">
                  Gestion du Portfolio
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== null && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          item.badgeColor || (isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400')
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
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 space-y-2">
          {/* View Live Portfolio button */}
          <button
            onClick={() => navigateTo('portfolio')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              <span>View Public Portfolio</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* User pill & logout */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser?.name ? currentUser.name[0] : 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-white truncate">
                  {currentUser?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {currentUser?.role || 'Super Admin'}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-xs sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              CMS Module:
            </span>
            <span className="text-sm font-bold text-white capitalize">
              {adminActiveTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {unreadMessagesCount > 0 && (
              <button
                onClick={() => setAdminActiveTab('messages')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 text-xs font-semibold hover:bg-emerald-900/60 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{unreadMessagesCount} unread message{unreadMessagesCount > 1 ? 's' : ''}</span>
              </button>
            )}

            <button
              onClick={() => navigateTo('portfolio')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
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
