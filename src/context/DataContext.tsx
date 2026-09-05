import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppData, AdminUser, ThemeMode } from '../types';
import { initialSeedData } from '../data/seedData';

interface DataContextType {
  data: AppData;
  isLoading: boolean;
  isSaving: boolean;
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
  login: (username: string, password: string) => Promise<{
    success: boolean;
    requireOtp?: boolean;
    tempToken?: string;
    email?: string;
    otpPreview?: string;
    error?: string;
    isRateLimited?: boolean;
    retryAfterSeconds?: number;
    attemptsLeft?: number;
  }>;
  verifyOtp: (tempToken: string, otpCode: string) => Promise<{
    success: boolean;
    error?: string;
    attemptsLeft?: number;
  }>;
  resendOtp: (tempToken: string) => Promise<{
    success: boolean;
    otpPreview?: string;
    error?: string;
  }>;
  resetRateLimit: () => Promise<void>;
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
const TOKEN_STORAGE_KEY = 'salam_auth_token_v3';
const LANG_STORAGE_KEY = 'salam_active_lang_v3';
const THEME_STORAGE_KEY = 'salam_theme_mode_v3';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

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
  const [isSaving, setIsSaving] = useState<boolean>(false);
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

  // Handle URL hash / routing synchronization - defaults to public developer portfolio
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
      } else {
        // Leaving admin to public portfolio -> immediate auto logout
        const currentToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (currentToken) {
          setCurrentUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
          localStorage.removeItem(TOKEN_STORAGE_KEY);
        }

        if (path.startsWith('/projects/') || hash.startsWith('#project/')) {
          const slug = path.startsWith('/projects/') ? path.replace('/projects/', '') : hash.replace('#project/', '');
          setSelectedSlug(slug);
          setCurrentView('project-detail');
        } else if (path.startsWith('/blog/') || hash.startsWith('#blog/')) {
          const slug = path.startsWith('/blog/') ? path.replace('/blog/', '') : hash.replace('#blog/', '');
          setSelectedSlug(slug);
          setCurrentView('blog-detail');
        } else {
          setCurrentView('portfolio');
        }
      }
    };

    handleLocation();

    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, []);

  // Unified Crimson Precision Theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    setIsDarkMode(false);
  }, []);

  const setActiveLanguage = useCallback((code: string) => {
    setActiveLanguageState(code);
    localStorage.setItem(LANG_STORAGE_KEY, code);
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, []);

  const navigateTo = useCallback((view: 'portfolio' | 'project-detail' | 'blog-detail' | 'admin', slug?: string) => {
    // If leaving admin space to return to public portfolio, immediately log out
    if (currentView === 'admin' && view === 'portfolio') {
      setCurrentUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

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
  }, [currentView]);

  const t = useCallback((key: string, defaultText?: string): string => {
    const langDict = data.translations?.[activeLanguage] || data.translations?.['en'] || {};
    if (langDict[key]) return langDict[key];
    // Fallback to English dictionary
    if (data.translations?.['en']?.[key]) return data.translations['en'][key];
    return defaultText || key;
  }, [data.translations, activeLanguage]);

  const updateData = async (newData: Partial<AppData>) => {
    setIsSaving(true);
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
        headers: getAuthHeaders(),
        body: JSON.stringify(merged)
      });
    } catch (err) {
      console.warn('Could not sync to backend API:', err);
    } finally {
      setTimeout(() => setIsSaving(false), 300);
    }
  };

  const updateModule = async <K extends keyof AppData>(moduleKey: K, payload: AppData[K]) => {
    setIsSaving(true);
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
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn(`Could not sync module ${String(moduleKey)}:`, err);
    } finally {
      setTimeout(() => setIsSaving(false), 300);
    }
  };

  const resetToSeed = async () => {
    setIsSaving(true);
    const freshSeed = JSON.parse(JSON.stringify(initialSeedData));
    setData(freshSeed);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(freshSeed));
    } catch {
      // ignore
    }
    try {
      await fetch('/api/data/reset-seed', {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (err) {
      console.warn('API reset failed:', err);
    } finally {
      setTimeout(() => setIsSaving(false), 300);
    }
  };

  const clearAllData = async () => {
    setIsSaving(true);
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
      await fetch('/api/data/clear', {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (err) {
      console.warn('API clear failed:', err);
    } finally {
      setTimeout(() => setIsSaving(false), 300);
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

  // Secure Server-Only Authentication (Zero hardcoded credentials on client, with 2FA OTP)
  const login = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });

      const resData = await res.json();

      if (res.ok) {
        if (resData.requireOtp) {
          return {
            success: true,
            requireOtp: true,
            tempToken: resData.tempToken,
            email: resData.email,
            otpPreview: resData.otpPreview,
            attemptsLeft: resData.attemptsLeft
          };
        }

        if (resData.user && resData.token) {
          setCurrentUser(resData.user);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(resData.user));
          localStorage.setItem(TOKEN_STORAGE_KEY, resData.token);
          return { success: true };
        }
      }

      return {
        success: false,
        error: resData.error || 'Identifiants invalides.',
        isRateLimited: res.status === 429 || !!resData.isRateLimited,
        retryAfterSeconds: resData.retryAfterSeconds,
        attemptsLeft: resData.attemptsLeft
      };
    } catch (err) {
      console.error('Erreur lors de la tentative de connexion:', err);
      return {
        success: false,
        error: 'Impossible de contacter le serveur de sécurité.'
      };
    }
  };

  const verifyOtp = async (tempToken: string, otpCode: string) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, otpCode: otpCode.trim() })
      });

      const resData = await res.json();

      if (res.ok && resData.user && resData.token) {
        setCurrentUser(resData.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(resData.user));
        localStorage.setItem(TOKEN_STORAGE_KEY, resData.token);
        return { success: true };
      }

      return {
        success: false,
        error: resData.error || 'Code OTP invalide.',
        attemptsLeft: resData.attemptsLeft
      };
    } catch {
      return { success: false, error: 'Erreur réseau lors de la vérification OTP.' };
    }
  };

  const resendOtp = async (tempToken: string) => {
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken })
      });
      const resData = await res.json();
      if (res.ok) {
        return { success: true, otpPreview: resData.otpPreview };
      }
      return { success: false, error: resData.error || 'Impossible de renvoyer le code.' };
    } catch {
      return { success: false, error: 'Erreur réseau lors du renvoi du code.' };
    }
  };

  const resetRateLimit = async () => {
    try {
      await fetch('/api/auth/reset-rate-limit', { method: 'POST' });
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    navigateTo('portfolio');
  };

  return (
    <DataContext.Provider
      value={{
        data,
        isLoading,
        isSaving,
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
        verifyOtp,
        resendOtp,
        resetRateLimit,
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
