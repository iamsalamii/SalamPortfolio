import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Database, Download, Upload, RefreshCw, AlertTriangle, CheckCircle2, FileJson, Server } from 'lucide-react';

export const AdminSeedManager: React.FC = () => {
  const { data, updateData, resetToSeed } = useData();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats
  const stats = [
    { label: 'Architectural Projects', count: data.projects?.length || 0 },
    { label: 'Ecosystem Technologies', count: data.technologies?.length || 0 },
    { label: 'Career Experiences', count: data.experiences?.length || 0 },
    { label: 'Technical Articles', count: data.blogPosts?.length || 0 },
    { label: 'Certifications', count: data.certifications?.length || 0 },
    { label: 'Media Assets', count: data.mediaItems?.length || 0 },
    { label: 'Inquiry Messages', count: data.contactMessages?.length || 0 },
    { label: 'Active Languages', count: data.languages?.length || 0 }
  ];

  // Export JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dotnet-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setStatusMessage({ type: 'success', text: 'Portfolio database exported successfully to JSON backup.' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      setIsProcessing(true);
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = async (event) => {
        try {
          const parsedData = JSON.parse(event.target?.result as string);
          if (!parsedData.personalInfo || !parsedData.projects) {
            throw new Error('Invalid portfolio schema format.');
          }
          await updateData(parsedData);
          setStatusMessage({ type: 'success', text: 'Portfolio backup imported and database successfully restored!' });
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: `Failed to restore backup: ${err.message || 'Invalid JSON'}` });
        } finally {
          setIsProcessing(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          setTimeout(() => setStatusMessage(null), 5000);
        }
      };
    }
  };

  // Reset to initial C# seed
  const handleResetToSeed = async () => {
    if (confirm('CRITICAL WARNING: This will overwrite current database records with the initial C# / .NET Senior Architect dataset. Proceed?')) {
      setIsProcessing(true);
      try {
        await resetToSeed();
        setStatusMessage({ type: 'success', text: 'Database successfully re-seeded with comprehensive C# / .NET architecture data!' });
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: 'Failed to reset seed.' });
      } finally {
        setIsProcessing(false);
        setTimeout(() => setStatusMessage(null), 5000);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <span>Database Backup, Seed Manager & JSON Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full data mobility: export complete snapshots, import custom backups, or re-initialize production C#/.NET datasets.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
          statusMessage.type === 'success'
            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
            : 'bg-red-950/60 border-red-800 text-red-300'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Database Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 font-medium">{stat.label}</div>
            <div className="text-2xl font-bold text-white font-mono">{stat.count}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Export Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Export Database Backup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download a complete JSON snapshot containing all personal data, projects, translations, and theme configurations.
            </p>
          </div>

          <button
            onClick={handleExportJson}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            <FileJson className="w-4 h-4" />
            <span>Download JSON Backup</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Restore from Backup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload a previously exported JSON portfolio backup file to immediately restore your system state.
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors disabled:opacity-50"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>{isProcessing ? 'Processing...' : 'Upload JSON File'}</span>
            </button>
          </div>
        </div>

        {/* Reset Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-red-900/40 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-red-950 text-red-400 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Reset to C#/.NET Seed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Re-populate the database with the pristine high-level C# / .NET Architect seed data package.
            </p>
          </div>

          <button
            onClick={handleResetToSeed}
            disabled={isProcessing}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 font-bold text-xs border border-red-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>Reset Database Seed</span>
          </button>
        </div>

      </div>

    </div>
  );
};
