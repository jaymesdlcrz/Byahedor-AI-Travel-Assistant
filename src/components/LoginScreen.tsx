import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  UserPlus,
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Compass,
  Palmtree,
  Coins,
  Ship,
  Sun,
  Moon,
  Check,
  KeyRound,
  RotateCcw,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../firebase/context';
import { ByahedorLogo } from './ByahedorLogo';

interface LoginScreenProps {
  onContinueAsGuest: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot' | 'otp';
type SignInMethod = 'password' | 'otp';

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onContinueAsGuest,
  darkMode,
  onToggleDarkMode
}) => {
  const { 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    resetPassword,
    requestPasswordResetOtp,
    resetPasswordWithOtp,
    authError, 
    clearAuthError 
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [activeOtpCode, setActiveOtpCode] = useState<string>('');
  const [otpResendCountdown, setOtpResendCountdown] = useState<number>(60);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | null>(null);
  const [isRealEmailSent, setIsRealEmailSent] = useState<boolean>(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Resend Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (mode === 'otp' && otpResendCountdown > 0) {
      interval = setInterval(() => {
        setOtpResendCountdown(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, otpResendCountdown]);

  // Auto-focus first OTP input when entering OTP mode
  useEffect(() => {
    if (mode === 'otp') {
      const timer = setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  const handleGoogleSignIn = async () => {
    clearAuthError();
    setValidationError(null);
    setIsGoogleSubmitting(true);
    try {
      await signInWithGoogle();
    } catch {
      // Errors handled in context
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    const next = [...otpDigits];

    if (!clean) {
      next[index] = '';
      setOtpDigits(next);
      return;
    }

    next[index] = clean.slice(-1);
    setOtpDigits(next);
    if (validationError) setValidationError(null);

    // Auto advance to next box
    if (index < 5 && clean) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!paste) return;
    const next = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      next[i] = paste[i] || '';
    }
    setOtpDigits(next);
    if (paste.length === 6) {
      otpInputRefs.current[5]?.focus();
    } else {
      otpInputRefs.current[paste.length]?.focus();
    }
  };

  const handleFillOtp = (code: string) => {
    if (!code || code.length !== 6) return;
    setOtpDigits(code.split(''));
    setValidationError(null);
    otpInputRefs.current[5]?.focus();
  };

  const handleResendOtp = async () => {
    if (otpResendCountdown > 0 || isSubmitting) return;
    setIsSubmitting(true);
    setValidationError(null);
    clearAuthError();
    try {
      const res = await requestPasswordResetOtp(email.trim().toLowerCase());
      setActiveOtpCode(res.code);
      setEmailPreviewUrl(res.previewUrl || null);
      setIsRealEmailSent(Boolean(res.isReal));
      setOtpResendCountdown(60);
      setOtpSuccessMessage(res.message || `A new 6-digit password reset code was sent via email to ${email.trim()}`);
      setTimeout(() => setOtpSuccessMessage(null), 5000);
    } catch (err: any) {
      setValidationError(err?.message || 'Failed to resend password reset code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setValidationError(null);
    const code = otpDigits.join('');

    if (code.length !== 6) {
      setValidationError('Please enter the full 6-digit OTP code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setValidationError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setValidationError('Passwords do not match. Please verify your new password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPasswordWithOtp(email.trim().toLowerCase(), code, newPassword);
      setOtpSuccessMessage('Password successfully updated! You can now sign in with your new password.');
      setPassword('');
      setConfirmPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setMode('signin');
      setTimeout(() => setOtpSuccessMessage(null), 6000);
    } catch (err: any) {
      setValidationError(err?.message || 'Invalid or expired OTP code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setValidationError(null);
    setResetSent(false);

    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    if (mode === 'forgot') {
      if (!cleanEmail) {
        setValidationError('Please enter your registered email address.');
        return;
      }
      if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        setValidationError('Please enter a valid email address (e.g. maria@example.com).');
        return;
      }

      setIsSubmitting(true);
      try {
        // OTP ONLY WORKS FOR FORGOT PASSWORD IN EXISTING ACCOUNTS
        const res = await requestPasswordResetOtp(cleanEmail);
        setActiveOtpCode(res.code);
        setEmailPreviewUrl(res.previewUrl || null);
        setIsRealEmailSent(Boolean(res.isReal));
        setOtpDigits(['', '', '', '', '', '']);
        setNewPassword('');
        setConfirmNewPassword('');
        setOtpResendCountdown(60);
        setMode('otp');
      } catch (err: any) {
        // Error from checkAccountExists or sending
        setValidationError(err?.message || `No existing account found with "${cleanEmail}". OTP code is only available for existing accounts.`);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'signin') {
      if (!cleanEmail) {
        setValidationError('Please enter your email address.');
        return;
      }
      if (!cleanEmail.includes('@')) {
        setValidationError('Please enter a valid email address.');
        return;
      }

      // Standard password sign-in (No OTP on login)
      if (!cleanPass) {
        setValidationError('Please enter your password.');
        return;
      }
      setIsSubmitting(true);
      try {
        await signInWithEmail(cleanEmail, cleanPass);
      } catch {
        // Error handled in context
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'signup') {
      const cleanName = fullName.trim();
      if (!cleanName || cleanName.length < 2) {
        setValidationError('Please enter your full name (minimum 2 characters).');
        return;
      }
      if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        setValidationError('Please enter a valid email address for your new account.');
        return;
      }
      if (!cleanPass || cleanPass.length < 6) {
        setValidationError('Password must be at least 6 characters long.');
        return;
      }
      if (cleanPass !== confirmPassword.trim()) {
        setValidationError('Passwords do not match. Please verify your confirm password.');
        return;
      }
      if (!agreeTerms) {
        setValidationError('Please accept the responsible travel pledge to continue.');
        return;
      }

      // Standard direct signup (No OTP on new sign up)
      setIsSubmitting(true);
      try {
        await signUpWithEmail(cleanEmail, cleanPass, cleanName);
      } catch {
        // Error handled in context
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    clearAuthError();
    setValidationError(null);
    setResetSent(false);
    setOtpSuccessMessage(null);
  };

  return (
    <div className="min-h-screen min-h-dvh bg-gradient-to-br from-[#F0F7FA] via-[#F5FAFC] to-[#E3F2F8] dark:from-[#071322] dark:via-[#09182a] dark:to-[#0c1f35] text-[#102A43] dark:text-slate-100 flex flex-col transition-colors selection:bg-[#087EA4] selection:text-white relative overflow-x-hidden">
      
      {/* Subtle Background Archipelago decorative shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-15">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#087EA4]/20 to-[#39A96B]/20 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] rounded-full bg-gradient-to-tl from-[#FFB84D]/15 to-[#087EA4]/15 blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-5 flex items-center justify-between">
        <ByahedorLogo size="md" showTagline={true} animated={true} />

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Mode Switch */}
          <button
            onClick={onToggleDarkMode}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-[#E4E9F0] dark:border-slate-700/80 text-slate-600 hover:text-[#087EA4] dark:text-slate-300 dark:hover:text-[#4DB8E8] flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer backdrop-blur-xs"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Quick Continue as Guest Link */}
          <button
            onClick={onContinueAsGuest}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#087EA4] dark:text-[#4DB8E8] hover:bg-[#087EA4]/10 dark:hover:bg-[#4DB8E8]/10 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
          >
            <span>Explore as Guest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14">
        
        {/* Left Column: Philippine Travel Brand Pitch & Features */}
        <div className="w-full lg:w-1/2 space-y-4 sm:space-y-5 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-[#087EA4]/20 text-[#087EA4] dark:text-[#4DB8E8] text-xs font-bold shadow-2xs backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Mabuhay! Authentic Philippine Travel Assistant</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#102A43] dark:text-white font-heading leading-tight">
            Discover 7,100+ Islands with <span className="bg-gradient-to-r from-[#087EA4] via-[#39A96B] to-[#FF8C42] bg-clip-text text-transparent">Byahedor</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-[#486581] dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Sign in with email verification (OTP) or Google to create custom Philippine itineraries, itemize real ₱ budgets, navigate island ferries, and auto-sync your trips securely across all devices.
          </p>

          {/* 4 Core Value Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 text-left max-w-xl mx-auto lg:mx-0">
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-[#E4E9F0] dark:border-slate-700/60 shadow-2xs flex items-start gap-2.5 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-[#087EA4] dark:text-[#4DB8E8] flex items-center justify-center shrink-0">
                <Palmtree className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#102A43] dark:text-white font-heading">82 Provinces Curated</h4>
                <p className="text-[11px] text-[#627D98] dark:text-slate-400 leading-tight">
                  Secret beaches, tidal lagoons, and heritage wonders.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-[#E4E9F0] dark:border-slate-700/60 shadow-2xs flex items-start gap-2.5 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#39A96B] flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#102A43] dark:text-white font-heading">AI Trip Concierge</h4>
                <p className="text-[11px] text-[#627D98] dark:text-slate-400 leading-tight">
                  Personalized advice in English, Tagalog, or Bisaya.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-[#E4E9F0] dark:border-slate-700/60 shadow-2xs flex items-start gap-2.5 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#FF8C42] flex items-center justify-center shrink-0">
                <Coins className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#102A43] dark:text-white font-heading">Itemized ₱ Budgets</h4>
                <p className="text-[11px] text-[#627D98] dark:text-slate-400 leading-tight">
                  Local tricycle fares, eco-fees, and food hacks.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-[#E4E9F0] dark:border-slate-700/60 shadow-2xs flex items-start gap-2.5 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Ship className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#102A43] dark:text-white font-heading">Archipelago Transit</h4>
                <p className="text-[11px] text-[#627D98] dark:text-slate-400 leading-tight">
                  OceanJet, fastcraft, RORO, and bangka sea lanes.
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="hidden sm:flex items-center gap-3 pt-1 text-xs text-[#627D98] dark:text-slate-400">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900">SG</div>
              <div className="w-7 h-7 rounded-full bg-[#087EA4] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900">MNL</div>
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900">CEB</div>
            </div>
            <span>Trusted by thousands of Filipino & international travelers across the archipelago.</span>
          </div>
        </div>

        {/* Right Column: High-Contrast, Polished Authentication Card */}
        <div className="w-full lg:w-[460px] shrink-0">
          <div className="bg-white/95 dark:bg-[#0f233a]/95 rounded-3xl p-5 sm:p-7 border border-[#E4E9F0] dark:border-slate-800 shadow-xl backdrop-blur-md relative overflow-hidden">
            
            {/* Mode Switch Tabs (Sign In with Email / Create New Account) */}
            {mode !== 'forgot' && mode !== 'otp' && (
              <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl mb-5 text-xs font-bold gap-1">
                <button
                  type="button"
                  id="login-screen-tab-signin"
                  onClick={() => switchMode('signin')}
                  className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-white dark:bg-[#087EA4] text-[#087EA4] dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  id="login-screen-tab-signup"
                  onClick={() => switchMode('signup')}
                  className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white dark:bg-[#087EA4] text-[#087EA4] dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 shrink-0" />
                  <span>Create Account</span>
                </button>
              </div>
            )}

            {/* Back Button for OTP or Forgot Mode */}
            {(mode === 'otp' || mode === 'forgot') && (
              <button
                type="button"
                onClick={() => switchMode(mode === 'otp' ? 'forgot' : 'signin')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#087EA4] dark:text-[#4DB8E8] hover:underline mb-3 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to {mode === 'otp' ? 'Forgot Password' : 'Sign In'}</span>
              </button>
            )}

            {/* Title / Description */}
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#102A43] dark:text-white font-heading">
                {mode === 'signin' && 'Sign In to Byahedor'}
                {mode === 'signup' && 'Create Your Byahedor Account'}
                {mode === 'otp' && 'Verify OTP & Reset Password'}
                {mode === 'forgot' && 'Reset Your Password (Existing Accounts)'}
              </h2>
              <p className="text-xs text-[#627D98] dark:text-slate-400 mt-1">
                {mode === 'signin' && 'Enter your registered email and password to access your saved trips and custom budgets.'}
                {mode === 'signup' && 'Create your free explorer profile to sync Philippine itineraries across all your devices.'}
                {mode === 'otp' && (
                  <span>
                    Enter the 6-digit OTP code sent to <strong className="font-semibold text-[#087EA4] dark:text-[#4DB8E8]">{email}</strong> and set your new password.
                  </span>
                )}
                {mode === 'forgot' && 'Enter your registered email address. A 6-digit OTP code will be sent to reset your password (existing accounts only).'}
              </p>
            </div>

            {/* Validation Alert Box */}
            {validationError && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <div className="flex-1 leading-relaxed">{validationError}</div>
                <button 
                  type="button"
                  onClick={() => setValidationError(null)}
                  className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-200 text-xs font-bold cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Server / Firebase Auth Error Alert Box */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <div className="flex-1 leading-relaxed">{authError}</div>
                <button 
                  type="button"
                  onClick={clearAuthError}
                  className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 text-xs font-bold cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* OTP Success / Resent Toast Message */}
            {otpSuccessMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                <div className="leading-relaxed">{otpSuccessMessage}</div>
              </div>
            )}

            {/* Password Reset Sent Success Alert */}
            {resetSent && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                <div className="leading-relaxed">
                  Reset link sent to <strong className="font-semibold">{email}</strong>. Please check your inbox or spam folder.
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* OTP VERIFICATION MODE (Password Reset for Existing Accounts) */}
            {/* ========================================================================= */}
            {mode === 'otp' ? (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                
                {/* Email Delivery Status Banner */}
                <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-[#132c4a] border border-[#087EA4]/30 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#087EA4] to-[#0284c7] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Mail className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          OTP Sent via Email
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                          {isRealEmailSent ? 'Delivered' : 'Dispatched'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        Check inbox for: <strong>{email}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Mailbox shortcut actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                    {email.toLowerCase().includes('@gmail.com') && (
                      <a
                        href="https://mail.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#087EA4] dark:hover:text-[#4DB8E8] font-semibold border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs text-[11px]"
                      >
                        <ExternalLink className="w-3 h-3 text-[#EA4335]" />
                        <span>Open Gmail</span>
                      </a>
                    )}
                    {emailPreviewUrl && (
                      <a
                        href={emailPreviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors shadow-2xs text-[11px]"
                      >
                        <ExternalLink className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Open Sent Email Preview</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Active OTP Preview & One-Click Auto-Fill Banner */}
                {activeOtpCode && (
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-[#087EA4]/10 via-[#39A96B]/10 to-[#FFB84D]/10 border border-[#087EA4]/25 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#087EA4] to-[#39A96B] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                          Instant One-Time Code
                        </span>
                        <span className="font-mono text-base sm:text-lg font-black text-[#087EA4] dark:text-[#4DB8E8] tracking-widest block truncate">
                          {activeOtpCode}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      id="otp-auto-fill-btn"
                      onClick={() => handleFillOtp(activeOtpCode)}
                      className="px-3 py-1.5 rounded-xl bg-[#087EA4] hover:bg-[#076c8c] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-95 cursor-pointer shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Auto-Fill</span>
                    </button>
                  </div>
                )}

                {/* 6 Individual Digit Input Boxes */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-2 text-center">
                    Enter the 6-Digit Code
                  </label>
                  <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        ref={el => { otpInputRefs.current[index] = el; }}
                        id={`login-otp-digit-${index}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={otpDigits[index]}
                        onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-10 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-[#102A43] dark:text-white focus:border-[#087EA4] focus:ring-2 focus:ring-[#087EA4]/25 outline-none transition-all shadow-2xs"
                        autoComplete="one-time-code"
                      />
                    ))}
                  </div>
                </div>

                {/* New Password Input */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087EA4]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Confirm New Password
                    </label>
                    {newPassword && confirmNewPassword && (
                      <span className={`text-[10px] font-semibold ${newPassword === confirmNewPassword ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {newPassword === confirmNewPassword ? 'Passwords match' : 'Passwords do not match'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(e) => {
                        setConfirmNewPassword(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087EA4]"
                    />
                  </div>
                </div>

                {/* Verify & Reset Button */}
                <button
                  type="submit"
                  id="login-screen-verify-otp-btn"
                  disabled={isSubmitting || otpDigits.join('').length !== 6 || !newPassword || !confirmNewPassword}
                  className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#087EA4] to-[#0A6C8C] hover:from-[#096d8e] hover:to-[#085a75] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify OTP &amp; Reset Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Resend and Edit Email Controls */}
                <div className="flex items-center justify-between text-xs pt-1 px-1">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={otpResendCountdown > 0 || isSubmitting}
                    className={`font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      otpResendCountdown > 0
                        ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        : 'text-[#087EA4] dark:text-[#4DB8E8] hover:underline'
                    }`}
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                    <span>{otpResendCountdown > 0 ? `Resend code in ${otpResendCountdown}s` : 'Resend 6-Digit Code'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:underline cursor-pointer"
                  >
                    ← Back to Forgot Password
                  </button>
                </div>

              </form>
            ) : (
              <>
                {/* Prominent Google Sign-In Button */}
                {mode !== 'forgot' && (
                  <div className="space-y-3 mb-4">
                    <button
                      type="button"
                      id="login-screen-google-btn"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleSubmitting || isSubmitting}
                      className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 text-[#102A43] dark:text-white font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-3 active:scale-98 cursor-pointer disabled:opacity-50"
                    >
                      {isGoogleSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#087EA4]" />
                          <span>Connecting to Google...</span>
                        </>
                      ) : (
                        <>
                          {/* Official Google 4-Color Icon */}
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                          <span>
                            {mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}
                          </span>
                        </>
                      )}
                    </button>

                    {/* Divider */}
                    <div className="relative flex items-center justify-center my-3">
                      <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                      <span className="bg-white dark:bg-[#0f233a] px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                        {mode === 'signup' ? 'or register with email' : 'or sign in with email'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Email / Password / Sign-in Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Full Name field for Sign Up */}
                  {mode === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span>Full Name</span>
                        <span className="text-[10px] text-slate-400 font-normal">Required</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type="text"
                          id="signup-fullname-input"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (validationError) setValidationError(null);
                          }}
                          placeholder="e.g. Maria Santos"
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#102A43] dark:text-white placeholder-slate-400 outline-none focus:border-[#087EA4] focus:ring-1 focus:ring-[#087EA4] transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email field */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Email Address</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {mode === 'signin' ? 'Registered Email' : 'Work or Personal'}
                      </span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="email"
                        id="auth-email-input"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (validationError) setValidationError(null);
                        }}
                        placeholder="traveler@example.com"
                        autoComplete="email"
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#102A43] dark:text-white placeholder-slate-400 outline-none focus:border-[#087EA4] focus:ring-1 focus:ring-[#087EA4] transition-all"
                      />
                    </div>
                  </div>

                  {/* Password field (Only if not in forgot mode) */}
                  {mode !== 'forgot' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {mode === 'signup' ? 'Create Password' : 'Password'}
                        </label>
                        {mode === 'signin' && (
                          <button
                            type="button"
                            onClick={() => switchMode('forgot')}
                            className="text-[11px] text-[#087EA4] dark:text-[#4DB8E8] hover:underline cursor-pointer"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="auth-password-input"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (validationError) setValidationError(null);
                          }}
                          placeholder="At least 6 characters"
                          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-9 py-2.5 text-xs text-[#102A43] dark:text-white placeholder-slate-400 outline-none focus:border-[#087EA4] focus:ring-1 focus:ring-[#087EA4] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                          title={showPassword ? "Hide password" : "Show password"}
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirm Password field for Sign Up */}
                  {mode === 'signup' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          Confirm Password
                        </label>
                        {confirmPassword && password && (
                          <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                            password === confirmPassword ? 'text-emerald-500' : 'text-rose-500'
                          }`}>
                            {password === confirmPassword ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Passwords match</span>
                              </>
                            ) : (
                              <span>Passwords do not match</span>
                            )}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="signup-confirmpassword-input"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (validationError) setValidationError(null);
                          }}
                          placeholder="Re-enter your password"
                          autoComplete="new-password"
                          className={`w-full bg-slate-50 dark:bg-slate-800/80 border rounded-xl pl-9 pr-9 py-2.5 text-xs text-[#102A43] dark:text-white placeholder-slate-400 outline-none transition-all ${
                            confirmPassword && password !== confirmPassword
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-400'
                              : 'border-slate-200 dark:border-slate-700 focus:border-[#087EA4] focus:ring-1 focus:ring-[#087EA4]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                          title={showConfirmPassword ? "Hide password" : "Show password"}
                          aria-label="Toggle confirm password visibility"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Responsible travel pledge for Sign Up */}
                  {mode === 'signup' && (
                    <label className="flex items-start gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-3.5 h-3.5 mt-0.5 rounded border-slate-300 text-[#087EA4] focus:ring-[#087EA4] cursor-pointer"
                      />
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        I pledge to practice <em>Leave No Trace</em> and respect indigenous cultures & coastal habitats across the 7,100+ islands.
                      </span>
                    </label>
                  )}

                  {/* Remember me checkbox for Sign In */}
                  {mode === 'signin' && (
                    <label className="flex items-center gap-2 cursor-pointer pt-0.5">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-[#087EA4] focus:ring-[#087EA4] cursor-pointer"
                      />
                      <span className="text-xs text-slate-500 dark:text-slate-400">Keep me signed in</span>
                    </label>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="login-screen-submit-btn"
                    disabled={isSubmitting || isGoogleSubmitting}
                    className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#087EA4] to-[#0A6C8C] hover:from-[#096d8e] hover:to-[#085a75] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Please wait...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {mode === 'signin' && 'Sign In to Byahedor'}
                          {mode === 'signup' && 'Create Free Account'}
                          {mode === 'forgot' && 'Send Reset Code via Email'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Clear Mode Switcher at bottom of form */}
                <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
                  {mode === 'signin' && (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      New to Byahedor?{' '}
                      <button
                        type="button"
                        id="switch-to-signup-bottom-link"
                        onClick={() => switchMode('signup')}
                        className="font-bold text-[#087EA4] dark:text-[#4DB8E8] hover:underline cursor-pointer inline-flex items-center gap-0.5"
                      >
                        <span>Create Free Account</span>
                        <ArrowRight className="w-3 h-3 inline" />
                      </button>
                    </p>
                  )}

                  {mode === 'signup' && (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Already have an account?{' '}
                      <button
                        type="button"
                        id="switch-to-signin-bottom-link"
                        onClick={() => switchMode('signin')}
                        className="font-bold text-[#087EA4] dark:text-[#4DB8E8] hover:underline cursor-pointer inline-flex items-center gap-0.5"
                      >
                        <span>Sign in with your email</span>
                        <ArrowRight className="w-3 h-3 inline" />
                      </button>
                    </p>
                  )}

                  {mode === 'forgot' && (
                    <button
                      type="button"
                      onClick={() => switchMode('signin')}
                      className="text-xs text-[#087EA4] dark:text-[#4DB8E8] font-bold hover:underline cursor-pointer"
                    >
                      ← Back to Sign In
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Guest Mode Direct Access Option */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 text-center space-y-1.5">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Want to look around the maps, itineraries, and food guide first?
              </p>
              <button
                type="button"
                id="login-screen-guest-btn"
                onClick={onContinueAsGuest}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#102A43] dark:text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
              >
                <span>Continue to Main Interface as Guest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Firebase Security Assurance */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Secured by Google Firebase Authentication & Zero-Trust OTP</span>
            </div>

          </div>
        </div>

      </main>

      {/* Footer Travel Note */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-[11px] text-[#627D98] dark:text-slate-400">
        <p>
          <em>"Ang hindi marunong lumingon sa pinanggalingan, hindi makararating sa paroroonan."</em> • Explore the Philippines with respect, heart, and Bayanihan spirit.
        </p>
      </footer>
    </div>
  );
};
