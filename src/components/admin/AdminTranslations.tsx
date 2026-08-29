import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Language } from '../../types';
import { Languages, Plus, Trash2, Search, Save, CheckCircle2, Globe, X } from 'lucide-react';

export const AdminTranslations: React.FC = () => {
  const { data, updateData } = useData();
  const [selectedLang, setSelectedLang] = useState<string>('fr');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({
    ...(data.translations || {})
  });

  const [languages, setLanguages] = useState<Language[]>([...(data.languages || [])]);

  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newKeyVal, setNewKeyVal] = useState('');

  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [newLang, setNewLang] = useState<Partial<Language>>({
    code: '',
    name: '',
    flag: '🌐',
    isDefault: false,
    isActive: true
  });

  // Current language's dictionary
  const currentDict = translations[selectedLang] || {};

  // Filter keys
  const allKeys = Array.from(
    new Set([
      ...Object.keys(translations['fr'] || {}),
      ...Object.keys(translations['en'] || {}),
      ...Object.keys(currentDict)
    ])
  ).sort();

  const filteredKeys = allKeys.filter(k => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const val = (currentDict[k] || '').toLowerCase();
    return k.toLowerCase().includes(q) || val.includes(q);
  });

  const updateTranslationValue = (key: string, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [selectedLang]: {
        ...(prev[selectedLang] || {}),
        [key]: value
      }
    }));
  };

  const handleSaveAll = async () => {
    await updateData({
      translations,
      languages
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleAddKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;

    const k = newKey.trim();
    setTranslations(prev => {
      const next = { ...prev };
      languages.forEach(l => {
        next[l.code] = {
          ...(next[l.code] || {}),
          [k]: l.code === selectedLang ? newKeyVal : (next[l.code]?.[k] || newKeyVal)
        };
      });
      return next;
    });

    setIsKeyModalOpen(false);
    setNewKey('');
    setNewKeyVal('');
  };

  const handleDeleteKey = (key: string) => {
    if (confirm(`Delete translation key "${key}" across all languages?`)) {
      setTranslations(prev => {
        const next: Record<string, Record<string, string>> = {};
        Object.keys(prev).forEach(langCode => {
          next[langCode] = { ...prev[langCode] };
          delete next[langCode][key];
        });
        return next;
      });
    }
  };

  const handleAddLang = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLang.code || !newLang.name) return;

    const code = newLang.code.toLowerCase().trim();
    const l: Language = {
      code,
      name: newLang.name,
      flag: newLang.flag || '🌐',
      isDefault: false,
      isActive: true
    };

    setLanguages([...languages, l]);
    if (!translations[code]) {
      setTranslations(prev => ({
        ...prev,
        [code]: { ...(prev['en'] || prev['fr'] || {}) }
      }));
    }

    setIsLangModalOpen(false);
    setNewLang({ code: '', name: '', flag: '🌐', isDefault: false, isActive: true });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Languages className="w-5 h-5 text-indigo-400" />
            <span>Translations & Multi-Language Dictionary</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-language strings management. Zero hardcoded text.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Key</span>
          </button>

          <button
            onClick={() => setIsLangModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Add Language</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Translations</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Translations database persisted successfully!</span>
        </div>
      )}

      {/* Language Switcher Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setSelectedLang(l.code)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                selectedLang === l.code
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.name}</span>
              <span className="text-[10px] opacity-70 uppercase">({l.code})</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search translation keys..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Dictionary Grid / Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 w-1/3">Translation Key</th>
                <th className="py-3 px-4">Value ({selectedLang.toUpperCase()})</th>
                <th className="py-3 px-4 text-right w-16">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredKeys.map((key) => (
                <tr key={key} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 font-mono font-bold text-indigo-400 align-top pt-3">
                    {key}
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      value={currentDict[key] || ''}
                      onChange={(e) => updateTranslationValue(key, e.target.value)}
                      placeholder={`Enter translation for ${selectedLang.toUpperCase()}...`}
                      className="w-full px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="py-2 px-4 text-right align-top pt-2.5">
                    <button
                      onClick={() => handleDeleteKey(key)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded"
                      title="Delete Key"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Translation Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Translation Key</h3>
              <button onClick={() => setIsKeyModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddKey} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Key Identifier (dot notation) *</label>
                <input
                  type="text"
                  required
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g. hero.cta_audit"
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Default Value ({selectedLang.toUpperCase()}) *</label>
                <input
                  type="text"
                  required
                  value={newKeyVal}
                  onChange={(e) => setNewKeyVal(e.target.value)}
                  placeholder="e.g. Request Architecture Audit"
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:bg-slate-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shadow-md"
                >
                  Add Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Language Modal */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add New Language</h3>
              <button onClick={() => setIsLangModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLang} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Language Code *</label>
                  <input
                    type="text"
                    required
                    value={newLang.code || ''}
                    onChange={(e) => setNewLang({ ...newLang, code: e.target.value })}
                    placeholder="e.g. de, es, it"
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Flag Emoji</label>
                  <input
                    type="text"
                    value={newLang.flag || '🌐'}
                    onChange={(e) => setNewLang({ ...newLang, flag: e.target.value })}
                    placeholder="e.g. 🇩🇪, 🇪🇸"
                    className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Language Name *</label>
                <input
                  type="text"
                  required
                  value={newLang.name || ''}
                  onChange={(e) => setNewLang({ ...newLang, name: e.target.value })}
                  placeholder="e.g. Deutsch, Español"
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLangModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:bg-slate-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shadow-md"
                >
                  Add Language
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
