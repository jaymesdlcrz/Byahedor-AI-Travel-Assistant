import React, { useState } from 'react';
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
  Zap,
  Check
} from 'lucide-react';
import { useAuth } from '../firebase/context';
import { ByahedorLogo } from './ByahedorLogo';

interface LoginScreenProps {
  onContinueAsGuest: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onContinueAsGuest,
  darkMode,
  onToggleDarkMode
}) => {
  const { 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    signInDemoAccount,
    resetPassword, 
    authError, 
    clearAuthError 
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  const handleDemoLogin = async () => {
    clearAuthError();
    setValidationError(null);
    setIsDemoSubmitting(true);
    try {
      await signInDemoAccount();
    } catch {
      // Errors handled in context
    } finally {
      setIsDemoSubmitting(false);
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
        setValidationError('Please enter your email address to receive a password reset link.');
        return;
      }
      if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        setValidationError('Please enter a valid email address (e.g. maria@example.com).');
        return;
      }
      setIsSubmitting(true);
      try {
        await resetPassword(cleanEmail);
        setResetSent(true);
      } catch {
        // Error handled in context
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'signin') {
      if (!cleanEmail) {
        setValidationError('Please enter your registered email address.');
        return;
      }
      if (!cleanEmail.includes('@')) {
        setValidationError('Please enter a valid email address.');
        return;
      }
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
            Sign in with your email or Google to create custom Philippine itineraries, itemize real ₱ budgets, navigate island ferries, and auto-sync your trips securely across all devices.
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
            
            {/* Quick 1-Click Demo Option */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isDemoSubmitting || isSubmitting || isGoogleSubmitting}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-300 dark:border-amber-800/60 hover:border-amber-400 text-amber-800 dark:text-amber-200 text-xs font-bold transition-all flex items-center justify-between group active:scale-98 cursor-pointer shadow-2xs"
                title="Instant one-click login as Juan dela Cruz (VIP Demo)"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0 fill-amber-400" />
                  <span>⚡ <strong>Quick Preview:</strong> 1-Click Demo Account</span>
                </div>
                {isDemoSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                ) : (
                  <span className="text-[11px] underline group-hover:text-amber-900 dark:group-hover:text-white">
                    Sign in as Juan →
                  </span>
                )}
              </button>
            </div>

            {/* Mode Switch Tabs (Sign In with Email / Create New Account) */}
            {mode !== 'forgot' && (
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
                  <span>Sign In with Email</span>
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
                  <span>Create New Account</span>
                </button>
              </div>
            )}

            {/* Title / Description */}
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#102A43] dark:text-white font-heading">
                {mode === 'signin' && 'Sign In with Email'}
                {mode === 'signup' && 'Create Your Byahedor Account'}
                {mode === 'forgot' && 'Reset Your Password'}
              </h2>
              <p className="text-xs text-[#627D98] dark:text-slate-400 mt-1">
                {mode === 'signin' && 'Enter your email and password to access your saved trips and custom budgets.'}
                {mode === 'signup' && 'Register your email in seconds to save multi-day itineraries and sync across devices.'}
                {mode === 'forgot' && 'Enter your registered email address and we will send you a password reset link.'}
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

            {/* Password Reset Sent Success Alert */}
            {resetSent && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                <div className="leading-relaxed">
                  Reset link sent to <strong className="font-semibold">{email}</strong>. Please check your inbox or spam folder.
                </div>
              </div>
            )}

            {/* Prominent Google Sign-In Button */}
            {mode !== 'forgot' && (
              <div className="space-y-3 mb-4">
                <button
                  type="button"
                  id="login-screen-google-btn"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleSubmitting || isSubmitting || isDemoSubmitting}
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

            {/* Email / Password Form */}
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

              {/* Password field */}
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
                disabled={isSubmitting || isGoogleSubmitting || isDemoSubmitting}
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
                      {mode === 'forgot' && 'Send Password Reset Email'}
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
                  Don't have a Byahedor account yet?{' '}
                  <button
                    type="button"
                    id="switch-to-signup-bottom-link"
                    onClick={() => switchMode('signup')}
                    className="font-bold text-[#087EA4] dark:text-[#4DB8E8] hover:underline cursor-pointer inline-flex items-center gap-0.5"
                  >
                    <span>Create a New Account</span>
                    <ArrowRight className="w-3 h-3 inline" />
                  </button>
                </p>
              )}

              {mode === 'signup' && (
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Already have a Byahedor account?{' '}
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
              <span>Secured by Google Firebase Authentication & Firestore</span>
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
