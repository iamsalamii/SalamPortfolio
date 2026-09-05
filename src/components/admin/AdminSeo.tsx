import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { SeoSettings } from '../../types';
import { Search, Save, CheckCircle2, Globe, Image as ImageIcon, Eye, ExternalLink, RefreshCw } from 'lucide-react';

export const AdminSeo: React.FC = () => {
  const { data, updateModule } = useData();
  
  const getInitialKeywords = (kw: any): string => {
    if (Array.isArray(kw)) return kw.join(', ');
    if (typeof kw === 'string') return kw;
    return 'Moussa Abdou Salam, Développeur .NET, C#, ASP.NET Core, React, SQL Server, Abidjan, Portfolio';
  };

  const [seo, setSeo] = useState<SeoSettings>({
    siteTitle: data.seoSettings?.siteTitle || (data.seoSettings as any)?.metaTitle || 'Moussa Abdou Salam — Développeur Full Stack .NET',
    metaDescription: data.seoSettings?.metaDescription || 'Portfolio professionnel de Moussa Abdou Salam, Développeur Full Stack .NET (C#, ASP.NET Core, React) au sein du GROUPE DIRECTSOFT.',
    keywords: getInitialKeywords(data.seoSettings?.keywords),
    ogTitle: data.seoSettings?.ogTitle || 'Moussa Abdou Salam — Développeur Full Stack .NET',
    ogDescription: data.seoSettings?.ogDescription || 'Développeur Full Stack .NET / React concevant des architectures logicielles robustes et performantes.',
    ogImage: data.seoSettings?.ogImage || '/assets/maphotops600.jpg',
    canonicalUrl: data.seoSettings?.canonicalUrl || 'https://moussasalam.dev',
    robotsPolicy: data.seoSettings?.robotsPolicy || 'index, follow'
  });

  // Synchronize when data updates
  useEffect(() => {
    if (data.seoSettings) {
      setSeo({
        siteTitle: data.seoSettings.siteTitle || (data.seoSettings as any)?.metaTitle || 'Moussa Abdou Salam — Développeur Full Stack .NET',
        metaDescription: data.seoSettings.metaDescription || '',
        keywords: getInitialKeywords(data.seoSettings.keywords),
        ogTitle: data.seoSettings.ogTitle || '',
        ogDescription: data.seoSettings.ogDescription || '',
        ogImage: data.seoSettings.ogImage || '/assets/maphotops600.jpg',
        canonicalUrl: data.seoSettings.canonicalUrl || 'https://moussasalam.dev',
        robotsPolicy: data.seoSettings.robotsPolicy || 'index, follow'
      });
    }
  }, [data.seoSettings]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateModule('seoSettings', seo);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-16 max-w-5xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Search className="w-5 h-5 text-red-600" />
            <span>SEO &amp; Référencement Naturel</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Optimisez le positionnement de votre portfolio sur Google, Bing et les réseaux sociaux professionnels.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer les Méta-Tags</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Paramètres SEO et méta-données enregistrés avec succès !</span>
        </div>
      )}

      {/* 1. Meta Tags Form */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase text-red-600 tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span>Balises Méta Principales</span>
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Titre du Site &amp; Page (Meta Title) *
          </label>
          <input
            type="text"
            required
            value={seo.siteTitle}
            onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
            placeholder="Moussa Abdou Salam — Développeur Full Stack .NET"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
          />
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
            <span>Longueur recommandée : 50-60 caractères</span>
            <span className={seo.siteTitle.length > 60 ? 'text-amber-600 font-bold' : 'text-slate-500'}>
              {seo.siteTitle.length} caractères
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Description Principale (Meta Description) *
          </label>
          <textarea
            rows={3}
            required
            value={seo.metaDescription}
            onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
            placeholder="Portfolio professionnel et réalisations techniques..."
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors resize-none leading-relaxed"
          />
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
            <span>Longueur recommandée : 120-160 caractères</span>
            <span className={seo.metaDescription.length > 160 ? 'text-amber-600 font-bold' : 'text-slate-500'}>
              {seo.metaDescription.length} caractères
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mots-clés SEO (Keywords, séparés par des virgules)
          </label>
          <input
            type="text"
            value={seo.keywords}
            onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
            placeholder=".NET, C#, ASP.NET Core, React, SQL Server, Architecture"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">URL Canonique (Canonical URL)</label>
            <input
              type="url"
              value={seo.canonicalUrl}
              onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
              placeholder="https://moussasalam.dev"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Directive Robots (Indexation)</label>
            <select
              value={seo.robotsPolicy}
              onChange={(e) => setSeo({ ...seo, robotsPolicy: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors font-mono"
            >
              <option value="index, follow">index, follow (Recommandé - Indexer et suivre tous les liens)</option>
              <option value="noindex, follow">noindex, follow (Ne pas indexer mais suivre les liens)</option>
              <option value="index, nofollow">index, nofollow (Indexer mais ne pas suivre)</option>
              <option value="noindex, nofollow">noindex, nofollow (Désactiver toute indexation)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. OpenGraph / Social Sharing */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase text-red-600 tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          <span>Partage Réseaux Sociaux (OpenGraph &amp; LinkedIn)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Titre OpenGraph (OG Title)</label>
            <input
              type="text"
              value={seo.ogTitle}
              onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
              placeholder="Moussa Abdou Salam — Développeur Full Stack .NET"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description OpenGraph</label>
            <input
              type="text"
              value={seo.ogDescription}
              onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })}
              placeholder="Développeur Full Stack .NET / React concevant des architectures..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">Image de partage OpenGraph (Image de couverture)</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input
              type="text"
              value={seo.ogImage}
              onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
              placeholder="/assets/maphotops600.jpg ou URL HTTPS"
              className="flex-1 w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
            />
            <label className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Importer Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setSeo({ ...seo, ogImage: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* 3. Live Google SERP Simulation */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase text-slate-700 tracking-wider flex items-center gap-2">
          <Eye className="w-4 h-4 text-red-600" />
          <span>Aperçu en Direct sur Google (SERP Preview)</span>
        </h3>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-2xl space-y-1.5 font-sans">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold">
              🌐
            </div>
            <span className="truncate">{seo.canonicalUrl || 'https://moussasalam.dev'}</span>
            <span className="text-slate-400">› portfolio</span>
          </div>

          <div className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-tight">
            {seo.siteTitle || 'Moussa Abdou Salam — Développeur Full Stack .NET'}
          </div>

          <div className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
            {seo.metaDescription || 'Portfolio professionnel de Moussa Abdou Salam, Développeur Full Stack .NET (C#, ASP.NET Core, React)...'}
          </div>
        </div>
      </div>
    </form>
  );
};

