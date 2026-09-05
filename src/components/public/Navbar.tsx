import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { BrandLogo } from '../common/BrandLogo';
import { Menu, X, Shield } from 'lucide-react';

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
    { num: '01', label: activeLanguage === 'fr' ? 'À PROPOS' : 'ABOUT', href: '#about' },
    { num: '02', label: activeLanguage === 'fr' ? 'PARCOURS' : 'EXP', href: '#experience' },
    { num: '03', label: 'STACK', href: '#skills' },
    { num: '04', label: activeLanguage === 'fr' ? 'PROJETS' : 'PROJECTS', href: '#projects' },
    { num: '05', label: 'CONTACT', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-4 px-4 sm:px-8 transition-all">
      <div className={`max-w-6xl mx-auto px-5 py-3 flex items-center justify-between transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0d0e14]/95 backdrop-blur-md border border-zinc-800 shadow-[4px_4px_0px_0px_#ef4444]'
          : 'bg-[#0d0e14]/75 backdrop-blur-xs border border-zinc-800/80 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]'
      }`}>
        
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <BrandLogo size="sm" />
          <span className="hidden sm:inline-block text-[10px] font-mono text-zinc-400 px-2 py-0.5 border border-zinc-800 bg-zinc-900/90 ml-1">
            C# // .NET 9
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-bold">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-zinc-300 hover:text-red-400 transition-colors tracking-wider group flex items-center gap-1.5"
            >
              <span className="text-zinc-600 text-[10px] group-hover:text-red-500 font-normal">{link.num}.</span>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Controls: Language, Admin */}
        <div className="flex items-center gap-2.5">
          
          {/* Language Switcher */}
          <button
            onClick={() => setActiveLanguage(activeLanguage === 'fr' ? 'en' : 'fr')}
            className="px-2.5 py-1 text-xs font-mono font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-red-500 transition-all cursor-pointer"
            title="Changer de langue"
          >
            [{activeLanguage.toUpperCase()}]
          </button>

          {/* Admin Gateway Icon */}
          <button
            onClick={() => navigateTo('admin')}
            title="Espace Administration"
            className="p-1.5 text-zinc-300 hover:text-red-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-red-500 transition-all cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-zinc-200 hover:text-red-400 bg-zinc-900 border border-zinc-700"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-6xl mx-auto p-4 bg-[#0d0e14] border border-zinc-800 shadow-[6px_6px_0px_0px_#ef4444] space-y-2 font-mono">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-red-950/40 border border-transparent hover:border-red-500/40 font-bold"
            >
              <span className="text-red-500 mr-2">{link.num} //</span>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
