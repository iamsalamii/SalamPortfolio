import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppData, AdminUser, ThemeMode } from '../types';
import { initialSeedData } from '../data/seedData';

interface DataContextType {
  data: AppData;
  isLoading: boolean;
  activeLanguage: string;
  setActiveLanguage: (code: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDarkMode: boolean;
  t: (key: string, defaultText?: string) => string;
  updateData: (newData: Partial<AppData>) => Promise<void>;
  updateModule: <K extends keyof AppData>(moduleKey: K, payload: AppData[K]) => Promise<void>;
  resetToSeed: () => Promise<void>;
  resetToDefault: () => Promise<void>;
  clearAllData: () => Promise<void>;
  sendContactMessage: (msg: { name: string; email: string; subject?: string; message: string; honeypot?: string }) => Promise<{ success: boolean; error?: string }>;
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  currentView: 'portfolio' | 'project-detail' | 'blog-detail' | 'admin';
  selectedSlug: string | null;
  navigateTo: (view: 'portfolio' | 'project-detail' | 'blog-detail' | 'admin', slug?: string) => void;
  activeCvModal: boolean;
  setActiveCvModal: (open: boolean) => void;
  adminActiveTab: string;
  setAdminActiveTab: (tab: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'salam_dotnet_portfolio_v3';
const AUTH_STORAGE_KEY = 'salam_admin_user_v3';
const LANG_STORAGE_KEY = 'salam_active_lang_v3';
const THEME_STORAGE_KEY = 'salam_theme_mode_v3';

const sanitizeAppData = (loadedData: AppData): AppData => {
  if (!loadedData || !loadedData.personalInfo) return initialSeedData;
  return loadedData;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.personalInfo?.firstName === 'Abdou Salam') {
          return sanitizeAppData(parsed);
        }
      }
    } catch {
      // fallback to initial seed
    }
    return initialSeedData;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeLanguage, setActiveLanguageState] = useState<string>(() => {
    return localStorage.getItem(LANG_STORAGE_KEY) || 'fr';
  });
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || 'system';
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const userStr = localStorage.getItem(AUTH_STORAGE_KEY);
      if (userStr) return JSON.parse(userStr);
    } catch {
      // ignore
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<'portfolio' | 'project-detail' | 'blog-detail' | 'admin'>('portfolio');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [activeCvModal, setActiveCvModal] = useState<boolean>(false);
  const [adminActiveTab, setAdminActiveTab] = useState<string>('dashboard');

  // Load from API on mount
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const json = await res.json();
          if (json && json.personalInfo) {
            const sanitized = sanitizeAppData(json);
            setData(sanitized);
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
            } catch {
              // ignore
            }
          }
        }
      } catch (err) {
        console.warn('Backend API offline or initial startup, using local data store:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApiData();
  }, []);

  // Handle URL hash / routing synchronization - defaults strictly to public portfolio on initial load
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      // Only enter admin if explicitly requested via #admin in hash or /admin path
      if (hash.startsWith('#admin') || path === '/admin') {
        setCurrentView('admin');
        const tabMatch = hash.match(/#admin\/(.+)/);
        if (tabMatch && tabMatch[1]) {
          setAdminActiveTab(tabMatch[1]);
        }
      } else if (path.startsWith('/projects/') || hash.startsWith('#project/')) {
        const slug = path.startsWith('/projects/') ? path.replace('/projects/', '') : hash.replace('#project/', '');
        setSelectedSlug(slug);
        setCurrentView('project-detail');
      } else {
        // Default unconditionally to public portfolio
        setCurrentView('portfolio');
      }
    };

    // On initial mount, if hash is just '#admin' from a past session, clean it to land directly on portfolio
    if (window.location.hash === '#admin') {
      try {
        history.replaceState(null, '', window.location.pathname);
      } catch {
        window.location.hash = '';
      }
      setCurrentView('portfolio');
    } else {
      handleLocation();
    }

    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, []);

  // Theme calculation & application
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateDarkClass = () => {
      let dark = false;
      if (themeMode === 'dark') {
        dark = true;
      } else if (themeMode === 'light') {
        dark = false;
      } else {
        dark = mediaQuery.matches;
      }

      setIsDarkMode(dark);
      if (dark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    updateDarkClass();
    mediaQuery.addEventListener('change', updateDarkClass);

    // Apply custom CSS colors if set in themeSettings
    if (data.themeSettings) {
      if (data.themeSettings.primaryColor) {
        root.style.setProperty('--color-primary', data.themeSettings.primaryColor);
      }
      if (data.themeSettings.secondaryColor) {
        root.style.setProperty('--color-secondary', data.themeSettings.secondaryColor);
      }
      if (data.themeSettings.accentColor) {
        root.style.setProperty('--color-accent', data.themeSettings.accentColor);
      }
    }

    return () => mediaQuery.removeEventListener('change', updateDarkClass);
  }, [themeMode, data.themeSettings]);

  const setActiveLanguage = useCallback((code: string) => {
    setActiveLanguageState(code);
    localStorage.setItem(LANG_STORAGE_KEY, code);
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, []);

  const navigateTo = useCallback((view: 'portfolio' | 'project-detail' | 'blog-detail' | 'admin', slug?: string) => {
    setCurrentView(view);
    if (slug) setSelectedSlug(slug);

    if (view === 'admin') {
      window.location.hash = slug ? `#admin/${slug}` : '#admin';
    } else if (view === 'project-detail' && slug) {
      window.location.hash = `#project/${slug}`;
    } else if (view === 'blog-detail' && slug) {
      window.location.hash = `#blog/${slug}`;
    } else {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const t = useCallback((key: string, defaultText?: string): string => {
    const langDict = data.translations?.[activeLanguage] || data.translations?.['en'] || {};
    if (langDict[key]) return langDict[key];
    // Fallback to English dictionary
    if (data.translations?.['en']?.[key]) return data.translations['en'][key];
    return defaultText || key;
  }, [data.translations, activeLanguage]);

  const updateData = async (newData: Partial<AppData>) => {
    const merged: AppData = { ...data, ...newData };
    setData(merged);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // ignore
    }

    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
    } catch (err) {
      console.warn('Could not sync to backend API:', err);
    }
  };

  const updateModule = async <K extends keyof AppData>(moduleKey: K, payload: AppData[K]) => {
    const merged: AppData = { ...data, [moduleKey]: payload };
    setData(merged);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // ignore
    }

    try {
      await fetch(`/api/module/${String(moduleKey)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn(`Could not sync module ${String(moduleKey)}:`, err);
    }
  };

  const resetToSeed = async () => {
    const freshSeed = JSON.parse(JSON.stringify(initialSeedData));
    setData(freshSeed);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(freshSeed));
    } catch {
      // ignore
    }
    try {
      await fetch('/api/data/reset-seed', { method: 'POST' });
    } catch (err) {
      console.warn('API reset failed:', err);
    }
  };

  const clearAllData = async () => {
    const cleared: AppData = {
      ...data,
      projects: [],
      technologies: [],
      experiences: [],
      education: [],
      certifications: [],
      services: [],
      blogPosts: [],
      contactMessages: [],
      mediaItems: [],
      activityLogs: []
    };
    setData(cleared);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleared));
    } catch {
      // ignore
    }
    try {
      await fetch('/api/data/clear', { method: 'POST' });
    } catch (err) {
      console.warn('API clear failed:', err);
    }
  };

  const sendContactMessage = async (msg: { name: string; email: string; subject?: string; message: string; honeypot?: string }) => {
    if (msg.honeypot) {
      return { success: true };
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      name: msg.name,
      email: msg.email,
      subject: msg.subject || 'General Inquiry',
      message: msg.message,
      createdAt: new Date().toISOString(),
      isRead: false,
      isArchived: false
    };

    const updatedMessages = [newMsg, ...(data.contactMessages || [])];
    await updateModule('contactMessages', updatedMessages);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      });
      if (!res.ok) {
        const errJson = await res.json();
        return { success: false, error: errJson.error || 'Server error' };
      }
      return { success: true };
    } catch {
      // Succeeded locally
      return { success: true };
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const resData = await res.json();
        setCurrentUser(resData.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(resData.user));
        return true;
      }
    } catch {
      // local fallback
    }

    // Client fallback validation (strictly salam@portfolios.com and Adm!n123@)
    const cleanU = username.trim().toLowerCase();
    const cleanP = password.trim();
    if (cleanU === 'salam@portfolios.com' && cleanP === 'Adm!n123@') {
      const localUser: AdminUser = {
        id: 'usr-salam',
        username: 'salam@portfolios.com',
        name: 'Moussa Abdou Salam',
        email: 'salam@portfolios.com',
        role: 'Super Admin',
        avatarUrl: '/assets/maphotops600.jpg'
      };
      setCurrentUser(localUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(localUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    navigateTo('portfolio');
  };

  return (
    <DataContext.Provider
      value={{
        data,
        isLoading,
        activeLanguage,
        setActiveLanguage,
        themeMode,
        setThemeMode,
        isDarkMode,
        t,
        updateData,
        updateModule,
        resetToSeed,
        resetToDefault: resetToSeed,
        clearAllData,
        sendContactMessage,
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        currentView,
        selectedSlug,
        navigateTo,
        activeCvModal,
        setActiveCvModal,
        adminActiveTab,
        setAdminActiveTab
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
