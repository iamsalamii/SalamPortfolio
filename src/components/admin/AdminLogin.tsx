import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Shield, Lock, User, ArrowLeft, AlertCircle, KeyRound, Loader2, RefreshCw, Mail, CheckCircle2, Send } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, requestOtp, verifyOtp, navigateTo } = useData();
  
  // Step: 'credentials' or 'otp'
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  
  // Credentials state (strictly empty initially, generic placeholder)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP state
  const [tempToken, setTempToken] = useState('');
  const [destinationEmail, setDestinationEmail] = useState('');
  const [otpDispatched, setOtpDispatched] = useState(false);
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
        setDestinationEmail(''); // Starts completely empty as requested
        setOtpDispatched(false);
        setOtpCode('');
        setOtpPreview(null);
        setStep('otp');
        setInfoMsg(res.message || 'Identifiants acceptés. Veuillez renseigner votre email personnel configuré pour recevoir le code OTP.');
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

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationEmail.trim() || !tempToken || isLoading) return;

    setIsLoading(true);
    setError('');
    setInfoMsg('');

    try {
      const res = await requestOtp(tempToken, destinationEmail.trim());
      if (res.success) {
        setOtpDispatched(true);
        setOtpPreview(res.otpPreview || null);
        setInfoMsg(res.message || `Code OTP transmis avec succès à ${destinationEmail.trim()}.`);
      } else {
        setError(res.error || 'Impossible de transmettre le code OTP.');
      }
    } catch {
      setError('Erreur lors de la vérification de l’email personnel.');
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
        </div>

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
              ? 'Accès sécurisé Console de Gestion'
              : !otpDispatched 
                ? 'Renseignez votre email personnel pour recevoir le code'
                : `Code expédié à ${destinationEmail}`}
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
                  placeholder="nom.utilisateur@domaine.com"
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

            {/* Stable Submit Button with Spinner */}
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

        {/* STEP 2: 2FA OTP FLOW */}
        {step === 'otp' && (
          <div className="space-y-4 animate-in fade-in">
            
            {/* Step 2A: Enter Personal Destination Email if not yet dispatched */}
            {!otpDispatched ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-red-500" />
                    <span>// EMAIL PERSONNEL DE RÉCUPÉRATION</span>
                  </label>
                  <input
                    type="email"
                    required
                    autoFocus
                    disabled={isLoading}
                    value={destinationEmail}
                    onChange={(e) => setDestinationEmail(e.target.value)}
                    placeholder="Saisissez votre email personnel configuré..."
                    className="w-full px-4 py-2.5 text-xs bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono"
                  />
                  <p className="text-[10px] text-zinc-500 pt-1">
                    Seul l'email personnel enregistré dans les paramètres CMS peut débloquer et recevoir le code de sécurité.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !destinationEmail.trim()}
                  className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0px_#ffffff] disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>TRANSMISSION EN COURS...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>TRANSMETTRE LE CODE OTP [→]</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2B: Enter 6-digit OTP Code once email verified */
              <form onSubmit={handleOtpSubmit} className="space-y-4 animate-in fade-in">
                <div className="p-3 bg-zinc-950 border border-zinc-800 text-xs flex items-center justify-between">
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-zinc-400 font-bold block uppercase">DESTINATION OTP VÉRIFIÉE :</span>
                    <span className="font-bold text-white text-xs font-mono truncate block">{destinationEmail}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpDispatched(false);
                      setOtpCode('');
                      setOtpPreview(null);
                    }}
                    className="text-red-400 hover:text-red-300 text-[10px] uppercase font-bold underline cursor-pointer shrink-0 ml-2"
                  >
                    [ CHANGER ]
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    // CODE DE VÉRIFICATION (6 CHIFFRES REÇUS PAR EMAIL)
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
                      <span>VALIDER ET ACCÉDER AU CMS</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setOtpCode('');
                  setDestinationEmail('');
                  setOtpDispatched(false);
                  setError('');
                }}
                className="text-zinc-400 hover:text-white uppercase font-bold text-[10px]"
              >
                ← CHANGER D'IDENTIFIANT
              </button>

              {otpDispatched && (
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={isLoading}
                  className="text-red-400 hover:text-red-300 uppercase font-bold text-[10px] flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>RENVOYER CODE</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};


