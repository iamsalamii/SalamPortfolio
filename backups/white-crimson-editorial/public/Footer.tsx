import React from 'react';
import { useData } from '../../context/DataContext';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { data, activeLanguage } = useData();
  const info = data.personalInfo;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 max-w-5xl mx-auto px-6 sm:px-8 border-t border-slate-200 text-xs font-mono text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div>
          © 2026 Moussa Abdou Salam. {activeLanguage === 'fr' ? 'Développeur Full Stack .NET.' : 'Full Stack .NET Developer.'}
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://linkedin.com/in/abdou-salam-moussa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-600 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-600 transition-colors"
          >
            GitHub
          </a>
          <a
            href={`mailto:${info.email || 'moussasalam86@gmail.com'}`}
            className="hover:text-red-600 transition-colors"
          >
            Email
          </a>
          <button
            onClick={scrollToTop}
            className="hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Haut</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
