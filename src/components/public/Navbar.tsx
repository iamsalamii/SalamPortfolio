import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { BrandLogo } from '../common/BrandLogo';
import { 
  Menu, 
  X, 
  Shield, 
  Globe 
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

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-4 px-6 sm:px-8">
      <div className={`max-w-5xl mx-auto rounded-full px-5 py-2.5 flex items-center justify-between transition-all duration-200 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border border-slate-200 shadow-xs'
          : 'bg-white/60 backdrop-blur-xs border border-transparent'
      }`}>
        
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2"
        >
          <BrandLogo size="sm" />
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slate-600 hover:text-red-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Controls: Language, Admin */}
        <div className="flex items-center gap-2">
          
          {/* Language Switcher */}
          <button
            onClick={() => setActiveLanguage(activeLanguage === 'fr' ? 'en' : 'fr')}
            className="px-2.5 py-1 rounded-full text-xs font-mono font-bold text-slate-700 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
            title="Changer de langue"
          >
            {activeLanguage.toUpperCase()}
          </button>

          {/* Admin Gateway Icon */}
          <button
            onClick={() => navigateTo('admin')}
            title="Espace Administration"
            className="p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-700 hover:text-red-600"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-5xl mx-auto p-4 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-800 hover:text-red-600 py-1"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

    </header>
  );
};
