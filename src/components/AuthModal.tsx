import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  UserPlus,
  ArrowRight, 
  ShieldCheck, 
  CloudCheck, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  PlaneTakeoff,
  Compass,
  Heart,
  Check,
  KeyRound,
  RotateCcw,
  ArrowLeft,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth, AuthModalMode } from '../firebase/context';
import { ByahedorLogo } from './ByahedorLogo';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuthModal, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    sendPasswordResetLink,
    verifyResetCode,
    confirmResetPassword,
    authError, 
    clearAuthError 
  } = useAuth();

  const [mode, setMode] = useState<AuthModalMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Email Reset Link State (No OTP required)
  const [resetActionCode, setResetActionCode] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState<number>(0);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Sync mode with context
  useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
      setValidationError(null);
    }
  }, [authModalMode]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // Resend Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (mode === 'reset_sent' && resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, resendCountdown]);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    clearAuthError();
    setValidationError(null);
    setIsGoogleSubmitting(true);
    try {
      await signInWithGoogle();
      // Modal closes automatically on success in context
    } catch {
      // Error handled in context
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleSendResetLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearAuthError();
    setValidationError(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setValidationError('Please enter a valid email address (e.g. maria@example.com).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendPasswordResetLink(cleanEmail);
      setResetSuccessMessage(res.message);
      setResendCountdown(60);
      setMode('reset_sent');
    } catch (err: any) {
      setValidationError(err?.message || 'Failed to send password reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendResetLink = async () => {
    if (resendCountdown > 0 || isSubmitting) return;
    await handleSendResetLink();
  };

  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setValidationError(null);

    if (!newPassword || newPassword.length < 6) {
      setValidationError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setValidationError('Passwords do not match. Please verify your new password.');
      return;
    }
    if (!resetActionCode) {
      setValidationError('Missing reset code. Please click the link in your email again.');
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmResetPassword(resetActionCode, newPassword);
      setResetSuccessMessage('Password successfully updated! You can now sign in with your new password.');
      setPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setMode('signin');
      setTimeout(() => setResetSuccessMessage(null), 7000);
    } catch (err: any) {
      setValidationError(err?.message || 'Failed to update password. The reset link may have expired.');
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
      await handleSendResetLink();
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
    } else if (mode === 'signup') {
      const cleanName = fullName.trim();
      if (!cleanName || cleanName.length < 2) {
        setValidationError('Please enter your full name (at least 2 characters).');
        return;
      }
      if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        setValidationError('Please enter a valid email address.');
        return;
      }
      if (!cleanPass || cleanPass.length < 6) {
        setValidationError('Password must be at least 6 characters.');
        return;
      }
      if (cleanPass !== confirmPassword.trim()) {
        setValidationError('Passwords do not match. Please verify your confirm password.');
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

  const switchMode = (newMode: AuthModalMode) => {
    clearAuthError();
    setValidationError(null);
    setResetSent(false);
    setMode(newMode);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#0f233a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner with Tropical Gradient */}
        <div className="relative bg-gradient-to-br from-[#087EA4] via-[#0284c7] to-[#39A96B] p-5 sm:p-6 text-white overflow-hidden shrink-0">
          {/* Subtle geometric circles */}
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/35 text-white/90 hover:text-white transition-colors cursor-pointer"
            title="Close"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2 mb-2">
            <ByahedorLogo size="md" />
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wider uppercase">
              Cloud Sync
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">
            {mode === 'signin' && 'Welcome Back, Byahedor!'}
            {mode === 'signup' && 'Start Your PH Journey'}
            {mode === 'forgot' && 'Reset Your Password'}
            {mode === 'reset_sent' && 'Check Your Email Inbox'}
            {mode === 'reset_password' && 'Create New Password'}
          </h2>

          <p className="text-xs text-white/85 font-medium mt-1 leading-relaxed">
            {mode === 'signin' && 'Sign in to access your cloud-saved itineraries, Philippine travel blueprints, and packing lists.'}
            {mode === 'signup' && 'Create your free account to sync travel blueprints across all your devices.'}
            {mode === 'forgot' && 'Enter your registered email. We will send an official password reset link directly to your inbox.'}
            {mode === 'reset_sent' && `We sent a secure password reset link to ${email || 'your email'}. Check your inbox to set your new password.`}
            {mode === 'reset_password' && 'Enter and confirm your new password below to secure your account.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">Input Required</span>
                <span className="text-[11px] leading-relaxed">{validationError}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setValidationError(null)}
                className="text-amber-500 hover:text-amber-700 text-xs font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Global Error Banner */}
          {authError && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">Authentication Notice</span>
                <span className="text-[11px] leading-relaxed">{authError}</span>
              </div>
              <button 
                type="button" 
                onClick={clearAuthError}
                className="text-rose-400 hover:text-rose-600 text-xs font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Success / Resend Toast */}
          {resetSuccessMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Notification</span>
                <span className="text-[11px] leading-relaxed">{resetSuccessMessage}</span>
              </div>
            </div>
          )}

          {/* Password Reset Success Banner */}
          {resetSent && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Reset link sent!</span>
                <span className="text-[11px] leading-relaxed">
                  We sent instructions to <strong>{email}</strong>. Check your inbox or spam folder.
                </span>
              </div>
            </div>
          )}

          {/* RESET SENT CONFIRMATION VIEW - EMAIL ONLY, NO OTP */}
          {mode === 'reset_sent' ? (
            <div className="space-y-4">
              {/* Back to Edit Email */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>
                <span className="text-[11px] text-slate-400 font-medium truncate max-w-[190px]">
                  {email}
                </span>
              </div>

              {/* Email Delivery Confirmation Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-emerald-50/50 dark:from-[#132c4a] dark:to-[#0d3434]/50 border border-[#087EA4]/30 shadow-xs flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#087EA4] to-[#0284c7] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Password Reset Link Sent!
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                        Delivered
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      We sent a secure password reset link to <strong className="text-[#087EA4] dark:text-[#4DB8E8]">{email}</strong>. Works automatically for all email providers (Gmail, Yahoo, Outlook, etc.) without any setup.
                    </p>
                  </div>
                </div>

                {/* 3 Step Instruction */}
                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-2">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>How to reset your password:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    <li>Open your email inbox (also check <strong>Spam</strong> or <strong>Promotions</strong>).</li>
                    <li>Click the secure link from <strong>Google / Byahedor</strong> to enter your new password.</li>
                    <li>Once updated, click the button below to sign in immediately!</li>
                  </ol>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#087EA4] to-[#0A6C8C] hover:from-[#096d8e] hover:to-[#085a75] text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Sign In with New Password</span>
                  </button>

                  {email.toLowerCase().includes('@gmail.com') && (
                    <a
                      href="https://mail.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#087EA4] dark:hover:text-[#4DB8E8] font-bold border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs text-xs flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#EA4335]" />
                      <span>Open Gmail</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Resend Link & Back to Signin */}
              <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={handleResendResetLink}
                  disabled={resendCountdown > 0 || isSubmitting}
                  className="inline-flex items-center gap-1.5 font-bold text-[#087EA4] dark:text-[#4DB8E8] hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>
                    {resendCountdown > 0 
                      ? `Resend link in ${resendCountdown}s` 
                      : 'Resend Reset Link'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          ) : mode === 'reset_password' ? (
            /* In-app Password Reset Form */
            <form onSubmit={handleSaveNewPassword} className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-sky-50/60 dark:bg-slate-800/40 border border-sky-100 dark:border-slate-850 text-xs text-slate-700 dark:text-slate-300">
                Create a strong new password for your account.
              </div>

              {/* New Password Field */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
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
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087EA4] focus:bg-white dark:focus:bg-[#0f233a] transition-all"
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

              {/* Confirm New Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  {newPassword && confirmNewPassword && (
                    <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                      newPassword === confirmNewPassword ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {newPassword === confirmNewPassword ? (
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
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="Re-enter your new password"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087EA4] focus:bg-white dark:focus:bg-[#0f233a] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !newPassword || !confirmNewPassword}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#087EA4] hover:bg-[#076c8c] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Save New Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <>
              {/* Primary Option: Google Sign In (for signin & signup modes) */}
              {mode !== 'forgot' && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleSubmitting || isSubmitting}
                    className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl bg-white dark:bg-[#132c4a] hover:bg-slate-50 dark:hover:bg-[#183659] text-slate-700 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center gap-3 transition-all hover:shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
                  >
                    {isGoogleSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#087EA4]" />
                    ) : (
                      /* Official Google G Logo SVG */
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12c0 2.02.46 3.84 1.26 5.42l4.02-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                    )}
                    <span>
                      {mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
                    </span>
                  </button>

                  {/* Or Divider */}
                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                    <span className="bg-white dark:bg-[#0f233a] px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
                      {mode === 'signup' ? 'or register with email' : 'or sign in with email'}
                    </span>
                    <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                  </div>
                </div>
              )}

              {/* Email / Password Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Mode Switcher Tabs */}
                {mode !== 'forgot' && (
                  <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold gap-1">
                    <button
                      type="button"
                      onClick={() => switchMode('signin')}
                      className={`py-1.5 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        mode === 'signin'
                          ? 'bg-white dark:bg-[#087EA4] text-[#087EA4] dark:text-white shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className={`py-1.5 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        mode === 'signup'
                          ? 'bg-white dark:bg-[#087EA4] text-[#087EA4] dark:text-white shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Create Account</span>
                    </button>
                  </div>
                )}

                {/* Full Name Field (Registration only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
                      Full Name / Explorer Alias
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (validationError) setValidationError(null);
                        }}
                        placeholder="e.g. Maria Santos"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087EA4] focus:bg-white dark:focus:bg-[#0f233a] transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087EA4] focus:bg-white dark:focus:bg-[#0f233a] transition-all"
                    />
                  </div>
                </div>

                {/* Password Field (for signin & signup) */}
                {mode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                        {mode === 'signup' ? 'Create Password' : 'Password'}
                      </label>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => switchMode('forgot')}
                          className="text-[11px] font-bold text-[#087EA4] dark:text-[#4DB8E8] hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (validationError) setValidationError(null);
                        }}
                        placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087EA4] focus:bg-white dark:focus:bg-[#0f233a] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirm Password Field (for signup) */}
                {mode === 'signup' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
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
                      <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (validationError) setValidationError(null);
                        }}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087EA4] focus:bg-white dark:focus:bg-[#0f233a] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        title={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember Me Checkbox */}
                {mode === 'signin' && (
                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-[#087EA4] focus:ring-[#087EA4]"
                      />
                      <span>Keep me signed in</span>
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isGoogleSubmitting}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#087EA4] hover:bg-[#076c8c] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {mode === 'signin' && 'Sign In to Byahedor'}
                        {mode === 'signup' && 'Create Free Account'}
                        {mode === 'forgot' && 'Send Password Reset Link'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Mode Switcher Bottom Links */}
              <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                {mode === 'signin' && (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
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
                    Already have an account?{' '}
                    <button
                      type="button"
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
                    className="text-xs font-bold text-[#087EA4] dark:text-[#4DB8E8] hover:underline cursor-pointer"
                  >
                    ← Back to Sign In
                  </button>
                )}
              </div>
            </>
          )}

          {/* Account Benefits Footer Card */}
          <div className="pt-2">
            <div className="p-3 rounded-2xl bg-sky-50/60 dark:bg-slate-800/40 border border-sky-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#087EA4] dark:text-[#4DB8E8]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Byahedor Cloud Sync Benefits</span>
              </div>
              <ul className="grid grid-cols-2 gap-1 text-[10px]">
                <li className="flex items-center gap-1">
                  <CloudCheck className="w-3 h-3 text-[#39A96B]" />
                  <span>Cross-device sync</span>
                </li>
                <li className="flex items-center gap-1">
                  <Compass className="w-3 h-3 text-[#39A96B]" />
                  <span>Saved AI itineraries</span>
                </li>
                <li className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-[#39A96B]" />
                  <span>Favorite destinations</span>
                </li>
                <li className="flex items-center gap-1">
                  <PlaneTakeoff className="w-3 h-3 text-[#39A96B]" />
                  <span>Offline day plans</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Dismiss as Guest button */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={closeAuthModal}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Continue exploring as guest &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
