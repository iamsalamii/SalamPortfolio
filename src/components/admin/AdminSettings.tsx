import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ThemeConfig } from '../../types';
import { Palette, Save, CheckCircle2, ShieldAlert, Sliders, LayoutTemplate, Monitor, Moon, Sun, Type } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { data, updateData } = useData();
  const [theme, setTheme] = useState<ThemeConfig>({
    mode: 'dark',
    primaryColor: '#6366f1',
    secondaryColor: '#10b981',
    accentColor: '#8b5cf6',
    backgroundColor: '#030712',
    surfaceColor: '#0f172a',
    textColor: '#f8fafc',
    borderRadius: '12px',
    fontFamily: 'JetBrains Mono, system-ui, sans-serif',
    isMaintenanceMode: false,
    maintenanceMessage: 'Portfolio is currently undergoing scheduled architecture updates. Please check back shortly.',
    ...(data.themeConfig || {})
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateData({ themeConfig: theme });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const presetThemes = [
    {
      name: '.NET Modern Indigo (Default)',
      primary: '#6366f1',
      secondary: '#10b981',
      accent: '#8b5cf6',
      bg: '#030712',
      surface: '#0f172a',
      text: '#f8fafc'
    },
    {
      name: 'Microsoft Azure Cobalt',
      primary: '#0078d4',
      secondary: '#00b294',
      accent: '#50e6ff',
      bg: '#050c18',
      surface: '#0d1f38',
      text: '#f3f6fa'
    },
    {
      name: 'Emerald Matrix Terminal',
      primary: '#10b981',
      secondary: '#06b6d4',
      accent: '#34d399',
      bg: '#021009',
      surface: '#062316',
      text: '#ecfdf5'
    },
    {
      name: 'Monochrome High-Contrast',
      primary: '#ffffff',
      secondary: '#94a3b8',
      accent: '#cbd5e1',
      bg: '#000000',
      surface: '#111111',
      text: '#ffffff'
    }
  ];

  const applyPreset = (preset: typeof presetThemes[0]) => {
    setTheme(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
      backgroundColor: preset.bg,
      surfaceColor: preset.surface,
      textColor: preset.text
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-400" />
            <span>Theme, Design System & System Flags</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure dynamic branding colors, typography, border radius tokens, and maintenance mode status.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Apply Theme Configuration</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Theme configuration persisted and live-applied!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Preset Palettes & Color Tokens */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Color Scheme & Design Tokens</span>
          </h3>

          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Quick Archetype Presets</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetThemes.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-white">{preset.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.secondary }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="flex-1 px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="flex-1 px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Background Canvas</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.backgroundColor}
                  onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                  className="flex-1 px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Surface Card Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={theme.surfaceColor}
                  onChange={(e) => setTheme({ ...theme, surfaceColor: e.target.value })}
                  className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.surfaceColor}
                  onChange={(e) => setTheme({ ...theme, surfaceColor: e.target.value })}
                  className="flex-1 px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Corner Radius</label>
              <select
                value={theme.borderRadius}
                onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white"
              >
                <option value="4px">Compact Sharp (4px)</option>
                <option value="8px">Subtle Rounded (8px)</option>
                <option value="12px">Modern Balanced (12px)</option>
                <option value="16px">Smooth Modern (16px)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Font Family</label>
              <input
                type="text"
                value={theme.fontFamily}
                onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-slate-700 text-white font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode & Operations */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Maintenance Mode & Public Accessibility</span>
          </h3>

          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Maintenance Mode Status</h4>
                <p className="text-[11px] text-slate-400">
                  When enabled, visitors are shown a maintenance screen while admin retains full access.
                </p>
              </div>

              <input
                type="checkbox"
                id="isMaintenanceToggle"
                checked={theme.isMaintenanceMode || false}
                onChange={(e) => setTheme({ ...theme, isMaintenanceMode: e.target.checked })}
                className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-amber-500 cursor-pointer"
              />
            </div>

            {theme.isMaintenanceMode && (
              <div className="pt-2 border-t border-slate-800/80">
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  Public Maintenance Announcement
                </label>
                <textarea
                  rows={3}
                  value={theme.maintenanceMessage || ''}
                  onChange={(e) => setTheme({ ...theme, maintenanceMessage: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-slate-800 border border-amber-800/50 text-white"
                />
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Palette Preview</span>
            <div
              className="p-4 rounded-xl border flex items-center justify-between"
              style={{
                backgroundColor: theme.surfaceColor,
                borderColor: theme.primaryColor,
                borderRadius: theme.borderRadius
              }}
            >
              <div>
                <div className="text-xs font-bold" style={{ color: theme.textColor }}>
                  Enterprise .NET Architecture
                </div>
                <div className="text-[10px]" style={{ color: theme.secondaryColor }}>
                  High throughput • Distributed Microservices
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-bold text-white shadow-sm"
                style={{
                  backgroundColor: theme.primaryColor,
                  borderRadius: theme.borderRadius
                }}
              >
                Button Preview
              </button>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
};
