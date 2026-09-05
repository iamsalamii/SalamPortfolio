import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Shield, Lock, User, ArrowLeft, AlertCircle, KeyRound, Loader2, RefreshCw, Info, CheckCircle2 } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, verifyOtp, resendOtp, resetRateLimit, navigateTo } = useData();
  
  // Step: 'credentials' or 'otp'
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  
  // Credentials state
  const [username, setUsername] = useState('salam@portfolios.com');
  const [password, setPassword] = useState('');
  
  // OTP state
  const [tempToken, setTempToken] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  
  // Status & Feedback state
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Rate limiting lockout state
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutCountdown, setLockoutCountdown] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  
  // Show credentials helper
  const [showHelper, setShowHelper] = useState(false);

  // Live countdown timer for lockout
  useEffect(() => {
    if (lockoutCountdown <= 0) {
      if (isLocked) setIsLocked(false);
      return;
    }
    const timer = setInterval(() => {
      setLockoutCountdown(prev => {
        if (prev <= 1) {
          setIsLocked(false);
          setError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutCountdown, isLocked]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || isLocked || isLoading) return;

    setIsLoading(true);
    setError('');
    setInfoMsg('');

    try {
      const res = await login(username.trim(), password.trim());
      
      if (res.isRateLimited) {
        setIsLocked(true);
        setLockoutCountdown(res.retryAfterSeconds || 900);
        setError(res.error || 'Système verrouillé pour sécurité (5 tentatives infructueuses).');
        setAttemptsLeft(0);
        return;
      }

      if (res.attemptsLeft !== undefined) {
        setAttemptsLeft(res.attemptsLeft);
      }

      if (res.requireOtp && res.tempToken) {
        setTempToken(res.tempToken);
        setOtpPreview(res.otpPreview || null);
        setStep('otp');
        setInfoMsg('Code de sécurité à 6 chiffres généré avec succès.');
        return;
      }

      if (!res.success) {
        setError(res.error || 'Identifiants invalides.');
      }
    } catch {
      setError('Une erreur est survenue lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || !tempToken || isLoading) return;

    setIsLoading(true);
    setError('');
    setInfoMsg('');

    try {
      const res = await verifyOtp(tempToken, otpCode.trim());
      if (!res.success) {
        setError(res.error || 'Code OTP incorrect.');
        if (res.attemptsLeft !== undefined) {
          setAttemptsLeft(res.attemptsLeft);
        }
      }
    } catch {
      setError('Erreur lors de la validation du code OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!tempToken || isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await resendOtp(tempToken);
      if (res.success && res.otpPreview) {
        setOtpPreview(res.otpPreview);
        setInfoMsg('Nouveau code OTP généré.');
      } else {
        setError(res.error || 'Impossible de renvoyer le code.');
      }
    } catch {
      setError('Erreur lors de la régénération du code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetLockout = async () => {
    await resetRateLimit();
    setIsLocked(false);
    setLockoutCountdown(0);
    setError('');
    setAttemptsLeft(5);
    setInfoMsg('Verrouillage réinitialisé avec succès pour les tests.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#08090d] text-zinc-100 relative overflow-hidden font-mono selection:bg-red-600 selection:text-white">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-md w-full p-6 sm:p-8 bg-[#0c0d12] border-2 border-zinc-800 shadow-[8px_8px_0px_#ef4444] relative z-10 space-y-6">
        
        {/* Back to Public Portfolio */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateTo('portfolio')}
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← RETOUR PORTFOLIO</span>
          </button>

          <button
            onClick={() => setShowHelper(!showHelper)}
            className="text-[11px] font-bold text-red-400 hover:text-red-300 uppercase tracking-wider underline cursor-pointer"
          >
            {showHelper ? '[ MASQUER IDS ]' : '[ MÉMO IDENTIFIANTS ]'}
          </button>
        </div>

        {/* Credentials Helper Box */}
        {showHelper && (
          <div className="p-4 bg-zinc-950 border border-zinc-800 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center gap-1.5 text-red-400 font-bold text-[11px] uppercase">
              <Info className="w-3.5 h-3.5" />
              <span>Identifiants d'Administration :</span>
            </div>
            <div className="space-y-1 text-zinc-300 text-[11px]">
              <div><span className="text-zinc-500">Email :</span> <code className="text-white font-bold bg-zinc-900 px-1 py-0.5">salam@portfolios.com</code> (ou <code className="text-white font-bold bg-zinc-900 px-1 py-0.5">salam</code>)</div>
              <div><span className="text-zinc-500">Mot de passe :</span> <code className="text-white font-bold bg-zinc-900 px-1 py-0.5">Adm!n123@</code></div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-red-600/10 text-red-500 border border-red-500/40 flex items-center justify-center mx-auto shadow-[2px_2px_0px_#ef4444]">
            {step === 'credentials' ? <Shield className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            {step === 'credentials' ? '// CONSOLE ADMIN //' : '// VÉRIFICATION 2FA OTP //'}
          </h1>
          <p className="text-xs text-zinc-400">
            {step === 'credentials' 
              ? 'Accès exclusif Moussa Abdou Salam'
              : 'Saisissez le code à 6 chiffres pour valider la session'}
          </p>
        </div>

        {/* Lockout Banner (Rate Limiting Alert) */}
        {isLocked && (
          <div className="p-4 bg-red-950/40 border-2 border-red-600 text-xs text-red-200 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 font-black uppercase text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 animate-pulse" />
              <span>[ BLOCAGE SÉCURITÉ ACTIF ]</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Trop de tentatives erronées consécutives. La console est verrouillée pour votre protection.
            </p>
            <div className="flex items-center justify-between pt-1 font-bold">
              <span>TEMPS RESTANT :</span>
              <span className="text-red-400 text-sm font-mono">{formatCountdown(lockoutCountdown)}</span>
            </div>
            <button
              onClick={handleResetLockout}
              className="mt-2 w-full py-1.5 bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase tracking-wider cursor-pointer"
            >
              [ DÉBLOQUER POUR TESTS ]
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && !isLocked && (
          <div className="p-3 bg-red-950/30 border border-red-500/50 text-xs text-red-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{error}</span>
              {attemptsLeft !== null && attemptsLeft > 0 && (
                <div className="text-[10px] text-zinc-400 mt-1">
                  Tentatives autorisées restantes : <strong>{attemptsLeft}/5</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Message */}
        {infoMsg && (
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/50 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* OTP Code Preview Badge (For instant test verification) */}
        {step === 'otp' && otpPreview && (
          <div className="p-3.5 bg-zinc-950 border-2 border-red-500 text-center space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">
              // CODE OTP SÉCURISÉ GÉNÉRÉ //
            </span>
            <div className="text-2xl sm:text-3xl font-black text-red-500 tracking-[0.3em] font-mono">
              {otpPreview}
            </div>
            <span className="text-[10px] text-zinc-500 block">
              Valable pendant 5 minutes (3 tentatives)
            </span>
          </div>
        )}

        {/* STEP 1: CREDENTIALS FORM */}
        {step === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                // IDENTIFIANT / EMAIL
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  disabled={isLocked || isLoading}
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="salam@portfolios.com ou salam"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                // MOT DE PASSE
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  disabled={isLocked || isLoading}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Stable Submit Button with Spinner (No Form Shaking) */}
            <button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0px_#ffffff] disabled:opacity-50 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>VÉRIFICATION EN COURS...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>CONTINUER VERS 2FA OTP [→]</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: 2FA OTP VERIFICATION FORM */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                // CODE DE VÉRIFICATION (6 CHIFFRES)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  disabled={isLoading}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full pl-10 pr-4 py-3 text-center text-lg tracking-[0.4em] font-black bg-zinc-950 border-2 border-red-500/80 text-white placeholder-zinc-700 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length !== 6}
              className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0px_#ffffff] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>VALIDATION DU CODE...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VALIDER ET ENTRER DANS L'ADMIN</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setOtpCode('');
                  setError('');
                }}
                className="text-zinc-400 hover:text-white uppercase font-bold text-[10px]"
              >
                ← CHANGER D'IDENTIFIANT
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-red-400 hover:text-red-300 uppercase font-bold text-[10px] flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>RENVOYER CODE</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

