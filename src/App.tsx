import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';

// Public Components
import { PagePreloader } from './components/common/PagePreloader';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { About } from './components/public/About';
import { TechStack } from './components/public/TechStack';
import { Projects } from './components/public/Projects';
import { ProjectDetail } from './components/public/ProjectDetail';
import { ExperienceTimeline } from './components/public/ExperienceTimeline';
import { Education } from './components/public/Education';
import { Certifications } from './components/public/Certifications';
import { Services } from './components/public/Services';
import { BlogList } from './components/public/BlogList';
import { BlogPostDetail } from './components/public/BlogPostDetail';
import { Contact } from './components/public/Contact';
import { CvModal } from './components/public/CvModal';
import { Footer } from './components/public/Footer';
import { MaintenanceScreen } from './components/public/MaintenanceScreen';
import { SectionDivider } from './components/public/SectionDivider';
import { ScrollToTop } from './components/public/ScrollToTop';
import { LiquidParticlesBackground } from './components/3d/LiquidParticlesBackground';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminPersonalInfo } from './components/admin/AdminPersonalInfo';
import { AdminProjects } from './components/admin/AdminProjects';
import { AdminTechnologies } from './components/admin/AdminTechnologies';
import { AdminExperiences } from './components/admin/AdminExperiences';
import { AdminEducation } from './components/admin/AdminEducation';
import { AdminCertifications } from './components/admin/AdminCertifications';
import { AdminServices } from './components/admin/AdminServices';
import { AdminBlog } from './components/admin/AdminBlog';
import { AdminMedia } from './components/admin/AdminMedia';
import { AdminMessages } from './components/admin/AdminMessages';
import { AdminNavigation } from './components/admin/AdminNavigation';
import { AdminSections } from './components/admin/AdminSections';
import { AdminTranslations } from './components/admin/AdminTranslations';
import { AdminSeo } from './components/admin/AdminSeo';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminSeedManager } from './components/admin/AdminSeedManager';
import { AdminActivityLogs } from './components/admin/AdminActivityLogs';

const MainAppContent: React.FC = () => {
  const { data, currentView, selectedSlug, isAuthenticated, adminActiveTab } = useData();
  const [hasLoaded, setHasLoaded] = useState(() => {
    if (typeof window !== 'undefined') {
      // If currently on admin hash/route, never show landing page preloader
      if (window.location.hash.startsWith('#admin') || window.location.pathname.startsWith('/admin')) {
        return true;
      }
      // If preloader was already completed in this session, skip
      return sessionStorage.getItem('portfolio_preloader_done') === 'true';
    }
    return false;
  });

  // Dynamic Page Title & Meta Tags Synchronization
  useEffect(() => {
    if (data.seoSettings?.siteTitle) {
      document.title = data.seoSettings.siteTitle;
    }
  }, [data.seoSettings]);

  // 1. MAINTENANCE SCREEN
  if (data.siteSettings?.maintenanceMode && !isAuthenticated) {
    return <MaintenanceScreen message={data.siteSettings.maintenanceMessage} />;
  }

  // 2. ADMIN PORTAL ROUTING
  if (currentView === 'admin') {
    if (!isAuthenticated) {
      return <AdminLogin />;
    }

    const renderAdminTabContent = () => {
      switch (adminActiveTab) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'personal':
          return <AdminPersonalInfo />;
        case 'projects':
          return <AdminProjects />;
        case 'technologies':
          return <AdminTechnologies />;
        case 'experience':
        case 'experiences':
          return <AdminExperiences />;
        case 'education':
          return <AdminEducation />;
        case 'certifications':
          return <AdminCertifications />;
        case 'services':
          return <AdminServices />;
        case 'blog':
          return <AdminBlog />;
        case 'media':
          return <AdminMedia />;
        case 'messages':
          return <AdminMessages />;
        case 'navigation':
          return <AdminNavigation />;
        case 'sections':
          return <AdminSections />;
        case 'translations':
          return <AdminTranslations />;
        case 'seo':
          return <AdminSeo />;
        case 'settings':
          return <AdminSettings />;
        case 'users':
          return <AdminUsers />;
        case 'seeds':
          return <AdminSeedManager />;
        case 'logs':
          return <AdminActivityLogs />;
        default:
          return <AdminDashboard />;
      }
    };

    return (
      <AdminLayout activeTab={adminActiveTab}>
        {renderAdminTabContent()}
      </AdminLayout>
    );
  }

  // 3. SINGLE PROJECT DEEP DIVE VIEW
  if (currentView === 'project-detail' && selectedSlug) {
    const project = (data.projects || []).find(p => p.slug === selectedSlug);
    if (project) {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors relative overflow-x-hidden">
          <Navbar />
          <main className="flex-1 relative z-10 pt-20">
            <ProjectDetail project={project} />
          </main>
          <Footer />
          <CvModal />
        </div>
      );
    }
  }

  // 4. MAIN PUBLIC PORTFOLIO (DATA-DRIVEN SECTION SEQUENCE WITH CHAPTER TRANSITIONS)
  const sections = (data.pageSections || [])
    .filter(s => s.isEnabled && s.sectionKey !== 'blog')
    .sort((a, b) => a.order - b.order);

  const totalSections = sections.length;

  const sectionMetadata: Record<string, { title: string; tag: string }> = {
    hero: { title: "INITIALISATION & PRÉSENTATION", tag: "SYS.CORE" },
    about: { title: "DÉMARCHE & PHILOSOPHIE LOGICIELLE", tag: "PROFILE.READY" },
    technologies: { title: "ARSENAL TECHNIQUE & CORE STACK", tag: "STACK.v2026" },
    tech_stack: { title: "ARSENAL TECHNIQUE & CORE STACK", tag: "STACK.v2026" },
    projects: { title: "ÉTUDES DE CAS & PROJETS .NET", tag: "PORTFOLIO.DEPLOY" },
    experience: { title: "PARCOURS & EXPÉRIENCES PRO", tag: "CAREER.LOGS" },
    education: { title: "FORMATION & DIPLÔMES", tag: "ACADEMIC.SYS" },
    certifications: { title: "ACCRÉDITATIONS & TITRES", tag: "CERTIFIED.OK" },
    services: { title: "PRESTATIONS & SERVICES", tag: "SERVICES.ACTIVE" },
    contact: { title: "CANAL DE COMMUNICATION & CONTACT", tag: "OPEN.DISCUSS" }
  };

  const renderSectionByKey = (sectionKey: string, index: number) => {
    const meta = sectionMetadata[sectionKey] || { title: sectionKey.toUpperCase(), tag: "MODULE.OK" };
    const showDivider = sectionKey !== 'hero';

    return (
      <React.Fragment key={sectionKey}>
        {showDivider && (
          <SectionDivider
            chapterIndex={index + 1}
            totalChapters={totalSections}
            title={meta.title}
            tag={meta.tag}
          />
        )}
        {(() => {
          switch (sectionKey) {
            case 'hero':
              return <Hero />;
            case 'about':
              return <About />;
            case 'experience':
              return <ExperienceTimeline />;
            case 'education':
              return <Education />;
            case 'tech_stack':
            case 'technologies':
              return <TechStack />;
            case 'projects':
              return <Projects />;
            case 'certifications':
              return <Certifications />;
            case 'services':
              return <Services />;
            case 'contact':
              return <Contact />;
            default:
              return null;
          }
        })()}
      </React.Fragment>
    );
  };

  return (
    <>
      {!hasLoaded && currentView === 'portfolio' && (
        <PagePreloader
          onComplete={() => {
            setHasLoaded(true);
            try {
              sessionStorage.setItem('portfolio_preloader_done', 'true');
            } catch {
              // ignore
            }
          }}
        />
      )}
      <div className="min-h-screen flex flex-col bg-[#060709] text-zinc-100 relative overflow-x-hidden font-mono bg-grid-dark selection:bg-red-600 selection:text-white">
        <LiquidParticlesBackground />
        <Navbar />
        <main className="flex-1 relative z-10">
          {sections.map((s, idx) => renderSectionByKey(s.sectionKey, idx))}
        </main>
        <Footer />
        <CvModal />
      </div>
    </>
  );
};

export default function App() {
  return (
    <DataProvider>
      <MainAppContent />
    </DataProvider>
  );
}
