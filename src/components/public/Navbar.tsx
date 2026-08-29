import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { BrandLogo } from '../common/BrandLogo';
import { 
  Menu, 
  X, 
  Shield 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    navigateTo, 
    activeLanguage, 
    setActiveLanguage 
  } = useData();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
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

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-4 px-4 sm:px-8">
      <div className={`max-w-5xl mx-auto rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border border-slate-300/90 shadow-lg shadow-slate-950/5'
          : 'bg-white/90 backdrop-blur-lg border border-slate-200 shadow-md shadow-slate-950/5'
      }`}>
        
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 hover:opacity-85 transition-opacity"
        >
          <BrandLogo size="sm" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-bold">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slate-800 hover:text-red-600 transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Controls: Language, Admin */}
        <div className="flex items-center gap-3">
          
          {/* Language Switcher Button */}
          <button
            onClick={() => setActiveLanguage(activeLanguage === 'fr' ? 'en' : 'fr')}
            className="px-3 py-1 rounded-lg text-xs font-mono font-bold text-slate-900 hover:text-red-600 bg-slate-100 hover:bg-red-50 border border-slate-300 transition-all cursor-pointer shadow-xs"
            title="Changer de langue"
          >
            {activeLanguage.toUpperCase()}
          </button>

          {/* Admin Gateway Icon */}
          <button
            onClick={() => navigateTo('admin')}
            title="Espace Administration"
            className="p-2 rounded-lg text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-red-50 border border-slate-300 transition-all cursor-pointer shadow-xs"
          >
            <Shield className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-900 hover:text-red-600 bg-slate-100 rounded-lg border border-slate-300"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-5xl mx-auto p-5 rounded-2xl bg-white border border-slate-300 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-slate-900 hover:text-red-600 py-1.5"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

    </header>
  );
};
