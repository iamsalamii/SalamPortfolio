import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PersonalInfo, CvItem } from '../../types';
import { 
  Save, 
  User, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  BookOpen,
  FileText
} from 'lucide-react';

export const AdminPersonalInfo: React.FC = () => {
  const { data, updateModule } = useData();
  const [info, setInfo] = useState<PersonalInfo>({ 
    ...data.personalInfo,
    principles: data.personalInfo.principles || [
      { title: "Architecture", description: "Clean Architecture, SOLID, Design Patterns" },
      { title: "Backend", description: "C#, ASP.NET Core, EF Core, SQL Server" },
      { title: "Frontend", description: "React, TypeScript, Tailwind CSS, Flutter" },
      { title: "Méthodologie", description: "Agilité SCRUM, TDD, Git Flow" }
    ]
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [specialtyInput, setSpecialtyInput] = useState('');

  // Handle save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateModule('personalInfo', info);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Add specialty
  const addSpecialty = () => {
    if (specialtyInput.trim() && !info.specialties?.includes(specialtyInput.trim())) {
      setInfo({
        ...info,
        specialties: [...(info.specialties || []), specialtyInput.trim()]
      });
      setSpecialtyInput('');
    }
  };

  // Remove specialty
  const removeSpecialty = (idx: number) => {
    const next = [...(info.specialties || [])];
    next.splice(idx, 1);
    setInfo({ ...info, specialties: next });
  };

  // Principles management
  const addPrinciple = () => {
    setInfo({
      ...info,
      principles: [
        ...(info.principles || []),
        { title: "Nouveau Pilier", description: "Description des compétences et pratiques..." }
      ]
    });
  };

  const updatePrinciple = (idx: number, field: 'title' | 'description', val: string) => {
    const next = [...(info.principles || [])];
    next[idx] = { ...next[idx], [field]: val };
    setInfo({ ...info, principles: next });
  };

  const removePrinciple = (idx: number) => {
    const next = [...(info.principles || [])];
    next.splice(idx, 1);
    setInfo({ ...info, principles: next });
  };

  // CV manager handlers
  const addCv = () => {
    const newCv: CvItem = {
      id: `cv_${Date.now()}`,
      label: 'Curriculum Vitae (PDF)',
      language: 'fr',
      url: '/assets/CV_MOUSSA_ABDOU_SALAM.pdf',
      updatedAt: new Date().toISOString().split('T')[0],
      isDefault: false
    };
    setInfo({
      ...info,
      cvList: [...(info.cvList || []), newCv]
    });
  };

  const updateCv = (index: number, field: keyof CvItem, val: any) => {
    const next = [...(info.cvList || [])];
    next[index] = { ...next[index], [field]: val };
    setInfo({ ...info, cvList: next });
  };

  const removeCv = (index: number) => {
    const next = [...(info.cvList || [])];
    next.splice(index, 1);
    setInfo({ ...info, cvList: next });
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl pb-16">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <User className="w-5 h-5 text-red-600" />
            <span>Profil, Photo &amp; Philosophie (Démarche)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérez votre photo, biographie, démarche technique, coordonnées et principes d'ingénierie.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-[0_4px_15px_rgba(220,38,38,0.25)] transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Sauvegarder les modifications</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profil, photo et philosophie mis à jour avec succès en base de données !</span>
        </div>
      )}

      {/* 1. Photo & Avatar Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
        <h3 className="text-xs font-mono font-bold uppercase text-red-600 tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          <span>Photo de Profil &amp; Avatar</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          
          {/* Photo Preview Frame */}
          <div className="sm:col-span-4 flex flex-col items-center">
            <div className="w-36 h-44 rounded-2xl overflow-hidden bg-slate-100 border-2 border-red-600 shadow-md relative group">
              <img
                src={info.avatarUrl || '/assets/maphotops600.jpg'}
                alt="Aperçu Photo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/maphotops600.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-mono">
                Aperçu Actif
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-500 mt-2 font-semibold">Aperçu en direct</span>
          </div>

          {/* Photo URL & Quick Buttons */}
          <div className="sm:col-span-8 space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Photo de profil (URL ou Fichier Local)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  type="text"
                  value={info.avatarUrl}
                  onChange={(e) => setInfo({ ...info, avatarUrl: e.target.value })}
                  placeholder="/assets/maphotops600.jpg"
                  className="flex-1 w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
                />
                <label className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Importer Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setInfo({ ...info, avatarUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-[11px] text-slate-500">
                Vous pouvez saisir un chemin local (ex: <code className="text-red-600 font-bold">/assets/maphotops600.jpg</code>), une URL HTTPS ou importer directement un fichier image depuis votre ordinateur.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Basic Names & Professional Title */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
        <h3 className="text-xs font-mono font-bold uppercase text-red-600 tracking-wider flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Identité &amp; Titre Principal</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom</label>
            <input
              type="text"
              value={info.firstName}
              onChange={(e) => setInfo({ ...info, firstName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nom</label>
            <input
              type="text"
              value={info.lastName}
              onChange={(e) => setInfo({ ...info, lastName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Titre Professionnel</label>
            <input
              type="text"
              value={info.title}
              onChange={(e) => setInfo({ ...info, title: e.target.value })}
              placeholder="ex: Développeur Full Stack .NET"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Accroche / Headline</label>
            <input
              type="text"
              value={info.headline}
              onChange={(e) => setInfo({ ...info, headline: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email de contact</label>
            <input
              type="email"
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone / WhatsApp</label>
            <input
              type="text"
              value={info.phone}
              onChange={(e) => setInfo({ ...info, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Localisation</label>
            <input
              type="text"
              value={info.location}
              onChange={(e) => setInfo({ ...info, location: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 3. Section "Profil & Démarche" */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
        <h3 className="text-xs font-mono font-bold uppercase text-red-600 tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span>Textes de la Section "Profil &amp; Démarche"</span>
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Paragraphe 1 : Accroche Principale (Introduction)
          </label>
          <textarea
            rows={3}
            value={info.bioShort}
            onChange={(e) => setInfo({ ...info, bioShort: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors resize-none leading-relaxed"
            placeholder="Introduction de votre démarche..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Paragraphe 2 : Philosophie &amp; Expérience chez GROUPE DIRECTSOFT
          </label>
          <textarea
            rows={4}
            value={(info.bioLong || []).join('\n\n')}
            onChange={(e) => setInfo({ ...info, bioLong: e.target.value.split('\n\n').filter(Boolean) })}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors resize-none leading-relaxed"
            placeholder="Détail de votre rôle et philosophie..."
          />
        </div>
      </div>

      {/* 4. Piliers & Principes Logicielles */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase text-red-600 tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Piliers d'Ingénierie &amp; Principes Logicielles</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Les cartes affichées dans la section Profil &amp; Démarche (ex: Architecture, Backend, Frontend, Méthodologie).
            </p>
          </div>

          <button
            type="button"
            onClick={addPrinciple}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter un Pilier</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(info.principles || []).map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-red-600 uppercase">
                  Pilier #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removePrinciple(idx)}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                  title="Supprimer ce pilier"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Titre du Pilier</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updatePrinciple(idx, 'title', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Description / Stack</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updatePrinciple(idx, 'description', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Core Specialties */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase text-red-600 tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Spécialités Techniques &amp; Points Forts</span>
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={specialtyInput}
            onChange={(e) => setSpecialtyInput(e.target.value)}
            placeholder="ex: Architecture Microservices & ASP.NET Core"
            className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSpecialty();
              }
            }}
          />
          <button
            type="button"
            onClick={addSpecialty}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Ajouter
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {info.specialties?.map((spec, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-800 font-medium"
            >
              <span>{spec}</span>
              <button
                type="button"
                onClick={() => removeSpecialty(idx)}
                className="text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 6. CV Downloads */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase text-red-600 tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Fichiers CV Téléchargeables</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Gérez les liens de téléchargement de votre CV.</p>
          </div>
          <button
            type="button"
            onClick={addCv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une version CV</span>
          </button>
        </div>

        <div className="space-y-3">
          {info.cvList?.map((cv, idx) => (
            <div
              key={cv.id || idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
            >
              <div className="sm:col-span-5">
                <label className="block text-[10px] text-slate-500 mb-1 font-semibold">Intitulé du CV</label>
                <input
                  type="text"
                  value={cv.label}
                  onChange={(e) => updateCv(idx, 'label', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-300 text-slate-900"
                />
              </div>

              <div className="sm:col-span-5 space-y-1">
                <label className="block text-[10px] text-slate-500 font-semibold">Chemin URL ou Fichier PDF</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={cv.url}
                    onChange={(e) => updateCv(idx, 'url', e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-300 text-slate-900"
                    placeholder="/assets/mon_cv.pdf ou URL"
                  />
                  <label className="px-2.5 py-1.5 bg-slate-200 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-lg text-[11px] font-bold cursor-pointer transition-colors shrink-0">
                    PDF
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updateCv(idx, 'url', reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeCv(idx)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </form>
  );
};
