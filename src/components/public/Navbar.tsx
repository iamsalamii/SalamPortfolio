import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { BrandLogo } from '../common/BrandLogo';
import { 
  Menu, 
  X, 
  Shield, 
  Sun, 
  Moon, 
  Globe 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    navigateTo, 
    activeLanguage, 
    setActiveLanguage, 
    setThemeMode, 
    isDarkMode
  } = useData();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: activeLanguage === 'fr' ? 'À propos' : 'About', href: '#about' },
    { label: activeLanguage === 'fr' ? 'Parcours' : 'Experience', href: '#experience' },
    { label: activeLanguage === 'fr' ? 'Stack' : 'Stack', href: '#skills' },
    { label: activeLanguage === 'fr' ? 'Projets' : 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const toggleTheme = () => {
    setThemeMode(isDarkMode ? 'light' : 'dark');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-4 px-6 sm:px-8">
      <div className={`max-w-5xl mx-auto rounded-full px-5 py-2.5 flex items-center justify-between transition-all duration-200 ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xs'
          : 'bg-transparent'
      }`}>
        
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center"
        >
          <BrandLogo size="sm" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Controls: Language, Theme, Admin */}
        <div className="flex items-center gap-2">
          
          {/* Language Switcher */}
          <button
            onClick={() => setActiveLanguage(activeLanguage === 'fr' ? 'en' : 'fr')}
            className="px-2.5 py-1 rounded-full text-xs font-mono font-medium text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
            title="Switch Language"
          >
            {activeLanguage.toUpperCase()}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Admin Gateway Icon */}
          <button
            onClick={() => navigateTo('admin')}
            title="Admin Console"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-600 dark:text-slate-400"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-5xl mx-auto rounded-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 py-1"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
