import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { SeoConfig } from '../../types';
import { Globe, Save, CheckCircle2, Search, Share2, Shield } from 'lucide-react';

export const AdminSeo: React.FC = () => {
  const { data, updateData } = useData();
  const [seo, setSeo] = useState<SeoConfig>({
    siteTitle: 'Senior C# / .NET Solutions Architect | Enterprise Portfolio',
    metaDescription: 'Senior C# .NET Solutions Architect specializing in ASP.NET Core, Azure Cloud, Microservices, and high-throughput distributed systems.',
    canonicalUrl: 'https://alexandre-dubois.dev',
    keywords: ['c#', 'dotnet', 'aspnetcore', 'azure', 'microservices', 'solutions architect', 'csharp'],
    ogImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    twitterHandle: '@alexandre_dotnet',
    robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://alexandre-dubois.dev/sitemap.xml',
    ...(data.seoConfig || {})
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateData({ seoConfig: seo });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <span>Search Engine Optimization (SEO) & OpenGraph</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimize your portfolio indexing on Google, LinkedIn snippet previews, and Twitter/X metadata cards.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save SEO Settings</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>SEO and OpenGraph metadata updated successfully!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: General Meta */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Search className="w-4 h-4 text-indigo-400" />
            <span>Google Search Listing Meta</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Global Site Title Tag *</label>
            <input
              type="text"
              required
              value={seo.siteTitle || ''}
              onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Recommended length: 50-60 characters</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Description *</label>
            <textarea
              rows={3}
              required
              value={seo.metaDescription || ''}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Recommended length: 140-160 characters</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Canonical Production URL</label>
            <input
              type="text"
              value={seo.canonicalUrl || ''}
              onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white font-mono"
            />
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Target Keywords</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="e.g. dotnet-aspire"
                className="flex-1 px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (keywordInput.trim()) {
                      setSeo({ ...seo, keywords: [...(seo.keywords || []), keywordInput.trim()] });
                      setKeywordInput('');
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (keywordInput.trim()) {
                    setSeo({ ...seo, keywords: [...(seo.keywords || []), keywordInput.trim()] });
                    setKeywordInput('');
                  }
                }}
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {seo.keywords?.map((k, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 font-mono">
                  <span>{k}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...(seo.keywords || [])];
                      next.splice(i, 1);
                      setSeo({ ...seo, keywords: next });
                    }}
                    className="text-slate-400 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Social & Robots */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span>Social Sharing & OpenGraph Preview</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">OpenGraph Share Image URL</label>
            <input
              type="text"
              value={seo.ogImage || ''}
              onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Twitter / X Creator Handle</label>
            <input
              type="text"
              value={seo.twitterHandle || ''}
              onChange={(e) => setSeo({ ...seo, twitterHandle: e.target.value })}
              placeholder="@your_handle"
              className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          {/* Robots.txt */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Virtual Robots.txt Content</span>
            </label>
            <textarea
              rows={4}
              value={seo.robotsTxt || ''}
              onChange={(e) => setSeo({ ...seo, robotsTxt: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white font-mono text-[11px]"
            />
          </div>

          {/* Snippet Preview */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">SERP Preview</span>
            <div className="text-sm font-semibold text-indigo-400 truncate">{seo.siteTitle}</div>
            <div className="text-[11px] text-emerald-400 font-mono truncate">{seo.canonicalUrl}</div>
            <div className="text-xs text-slate-400 line-clamp-2">{seo.metaDescription}</div>
          </div>
        </div>

      </form>

    </div>
  );
};
