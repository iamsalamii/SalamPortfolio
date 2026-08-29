import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { SeoSettings } from '../../types';
import { Search, Save, CheckCircle2, Globe } from 'lucide-react';

export const AdminSeo: React.FC = () => {
  const { data, updateModule } = useData();
  const [seo, setSeo] = useState<SeoSettings>({
    metaTitle: data.seoSettings?.metaTitle || 'Moussa Abdou Salam — Développeur Full Stack .NET',
    metaDescription: data.seoSettings?.metaDescription || 'Portfolio professionnel de Moussa Abdou Salam, Développeur Full Stack .NET (C#, ASP.NET Core, React).',
    keywords: data.seoSettings?.keywords || ['.NET', 'C#', 'ASP.NET Core', 'React', 'Full Stack', 'SQL Server'],
    ogTitle: data.seoSettings?.ogTitle || 'Moussa Abdou Salam — Développeur Full Stack .NET',
    ogDescription: data.seoSettings?.ogDescription || 'Portfolio professionnel et réalisations logicielles.',
    ogImage: data.seoSettings?.ogImage || '/assets/maphotops600.jpg',
    twitterHandle: data.seoSettings?.twitterHandle || '@moussasalam'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateModule('seoSettings', seo);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Search className="w-5 h-5 text-red-600" />
            <span>SEO &amp; Référencement Naturel</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Optimisez le référencement de votre portfolio pour Google et les réseaux sociaux.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer le SEO</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Paramètres SEO enregistrés avec succès !</span>
        </div>
      )}

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Titre de la Page (Meta Title)</label>
          <input
            type="text"
            value={seo.metaTitle}
            onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description (Meta Description)</label>
          <textarea
            rows={3}
            value={seo.metaDescription}
            onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Mots-clés (séparés par des virgules)</label>
          <input
            type="text"
            value={(seo.keywords || []).join(', ')}
            onChange={(e) => setSeo({ ...seo, keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Image de partage OpenGraph (URL)</label>
          <input
            type="text"
            value={seo.ogImage || ''}
            onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
          />
        </div>
      </div>
    </form>
  );
};
