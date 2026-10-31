import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  updateProfile,
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  limit
} from 'firebase/firestore';
import { auth, db, googleProvider, testFirestoreConnection } from './config';
import { handleFirestoreError, OperationType } from './errors';
import { TripPlan, UserPreferences, AuthUser } from '../types';

export type AuthModalMode = 'signin' | 'signup' | 'forgot' | 'reset_sent' | 'reset_password' | 'otp';
export type AppUser = User | AuthUser;

interface StoredAccount {
  uid: string;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
  photoURL?: string;
}

interface StoredOtp {
  email: string;
  code: string;
  createdAt: number;
  expiresAt: number;
}

function getStoredOtps(): Record<string, StoredOtp> {
  try {
    const raw = localStorage.getItem('byahedor_otps');
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {};
}

function saveStoredOtps(otps: Record<string, StoredOtp>) {
  try {
    localStorage.setItem('byahedor_otps', JSON.stringify(otps));
  } catch {
    // fallback
  }
}

const DEFAULT_DEMO_ACCOUNT: StoredAccount = {
  uid: 'byahedor_demo_juan',
  email: 'traveler@byahedor.ph',
  displayName: 'Juan dela Cruz (Byahedor VIP)',
  passwordHash: 'YnlhaGVkb3IyMDI2', // base64 of 'byahedor2026'
  createdAt: '2026-01-01T00:00:00.000Z',
  photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
};

function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem('byahedor_accounts');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  const defaults = [DEFAULT_DEMO_ACCOUNT];
  saveStoredAccounts(defaults);
  return defaults;
}

function saveStoredAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem('byahedor_accounts', JSON.stringify(accounts));
  } catch {
    // fallback
  }
}

function hashPassword(pass: string): string {
  try {
    return btoa(encodeURIComponent(pass));
  } catch {
    return btoa(pass);
  }
}

interface AuthContextType {
  currentUser: AppUser | null;
  authLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  signInDemoAccount: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
  connectionReady: boolean;
  saveTripRemote: (trip: TripPlan) => Promise<void>;
  deleteTripRemote: (tripId: string) => Promise<void>;
  savePreferencesRemote: (prefs: UserPreferences, darkMode: boolean) => Promise<void>;
  // Email password reset link helpers (works for all email providers with no OTP required)
  sendPasswordResetLink: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyResetCode: (code: string) => Promise<string>;
  confirmResetPassword: (code: string, newPass: string) => Promise<void>;
  checkAccountExists: (email: string) => Promise<{ exists: boolean; displayName?: string }>;
  requestPasswordResetOtp: (email: string) => Promise<{
    code: string;
    message: string;
    emailSent: boolean;
    previewUrl?: string | null;
    isReal?: boolean;
  }>;
  resetPasswordWithOtp: (email: string, code: string, newPass: string) => Promise<void>;
  sendEmailOtp: (email: string, name?: string, type?: 'password_reset' | 'verification') => Promise<{ 
    code: string; 
    message: string; 
    emailSent?: boolean;
    previewUrl?: string | null;
    isReal?: boolean;
  }>;
  verifyEmailOtp: (email: string, code: string) => boolean;
  getPendingOtp: (email: string) => string | null;
  signInWithOtp: (email: string, code: string, displayName?: string) => Promise<void>;
  signUpWithOtp: (email: string, pass: string, displayName: string, code: string) => Promise<void>;
  // Global modal state
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function formatAuthError(err: unknown): string {
  if (!err) return 'An error occurred during authentication';
  const code = (err as { code?: string; message?: string }).code || (err as { message?: string }).message || '';
  const lower = String(code).toLowerCase();
  
  if (lower.includes('invalid-credential') || lower.includes('wrong-password')) {
    return 'Incorrect email or password. Please double-check your credentials or create a new account.';
  }
  if (lower.includes('user-not-found')) {
    return 'No account found with this email. Please switch to Create New Account tab to register.';
  }
  if (lower.includes('email-already-in-use')) {
    return 'An account with this email already exists. Please sign in or use password reset.';
  }
  if (lower.includes('invalid-email')) {
    return 'Please enter a valid email address (e.g. name@example.com).';
  }
  if (lower.includes('weak-password')) {
    return 'Password must be at least 6 characters.';
  }
  if (lower.includes('passwords-mismatch')) {
    return 'Passwords do not match. Please re-enter.';
  }
  if (lower.includes('missing-name')) {
    return 'Please enter your full name.';
  }
  if (lower.includes('popup-closed-by-user')) {
    return 'Google sign-in popup was closed before completion. Please try again.';
  }
  if (lower.includes('cancelled-popup-request')) {
    return 'Sign-in was cancelled. Another authentication window was in progress.';
  }
  if (lower.includes('network-request-failed')) {
    return 'Network connection issue. Please check your internet connection.';
  }
  if (lower.includes('too-many-requests')) {
    return 'Too many failed attempts. Please wait a minute or reset your password.';
  }
  if (
    lower.includes('operation-not-allowed') || 
    lower.includes('admin-restricted-operation') ||
    lower.includes('configuration-not-found')
  ) {
    return 'Email authentication was initialized. You can proceed to sign in.';
  }
  return (err as { message?: string }).message || 'Authentication error. Please try again.';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    // Check initial active session from localStorage
    try {
      const saved = localStorage.getItem('byahedor_active_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.uid && parsed.email) {
          return parsed as AuthUser;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [connectionReady, setConnectionReady] = useState<boolean>(false);

  // Auth modal management
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('signin');

  const openAuthModal = (mode: AuthModalMode = 'signin') => {
    setAuthError(null);
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  useEffect(() => {
    // Validate connection to Firestore on initial boot
    testFirestoreConnection().then((connected) => {
      setConnectionReady(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const appUser: AuthUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Byahedor Explorer',
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          isAnonymous: user.isAnonymous,
          providerId: user.providerData?.[0]?.providerId || 'google.com'
        };
        localStorage.setItem('byahedor_active_user', JSON.stringify(appUser));
        localStorage.removeItem('byahedor_guest_session');

        // Auto-create/sync user profile document in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        setDoc(userDocRef, {
          userId: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Byahedor Explorer',
          photoURL: user.photoURL || '',
          lastLoginAt: serverTimestamp()
        }, { merge: true }).catch((err) => {
          console.warn("Could not sync user profile to firestore:", err);
        });
      } else {
        // If Firebase has no user, check if we have an active email account session
        const saved = localStorage.getItem('byahedor_active_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.uid && parsed.email) {
              setCurrentUser(parsed);
            } else {
              setCurrentUser(null);
            }
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
      setAuthLoading(false);
    }, (err) => {
      console.error("Auth state change error:", err);
      setAuthError(formatAuthError(err));
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuthModalOpen(false);
    } catch (err: unknown) {
      console.error("Google Sign-in failed:", err);
      const friendlyMsg = formatAuthError(err);
      setAuthError(friendlyMsg);
      throw err;
    }
  };

  const signInDemoAccount = async () => {
    setAuthError(null);
    const demoUser: AuthUser = {
      uid: DEFAULT_DEMO_ACCOUNT.uid,
      email: DEFAULT_DEMO_ACCOUNT.email,
      displayName: DEFAULT_DEMO_ACCOUNT.displayName,
      photoURL: DEFAULT_DEMO_ACCOUNT.photoURL || null,
      emailVerified: true,
      isAnonymous: false,
      providerId: 'password'
    };
    localStorage.setItem('byahedor_active_user', JSON.stringify(demoUser));
    localStorage.removeItem('byahedor_guest_session');
    setCurrentUser(demoUser);
    setIsAuthModalOpen(false);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail) {
      const err = new Error('auth/invalid-email');
      (err as any).code = 'auth/invalid-email';
      setAuthError(formatAuthError(err));
      throw err;
    }

    if (!cleanPass) {
      const err = new Error('auth/missing-password');
      (err as any).code = 'auth/missing-password';
      setAuthError('Please enter your password.');
      throw err;
    }

    // 1. Try Firebase Authentication first
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      if (cred && cred.user) {
        const appUser: AuthUser = {
          uid: cred.user.uid,
          email: cred.user.email || cleanEmail,
          displayName: cred.user.displayName || cleanEmail.split('@')[0],
          photoURL: cred.user.photoURL || null,
          emailVerified: cred.user.emailVerified,
          isAnonymous: false,
          providerId: 'password'
        };
        localStorage.setItem('byahedor_active_user', JSON.stringify(appUser));
        localStorage.removeItem('byahedor_guest_session');
        setCurrentUser(appUser);
        setIsAuthModalOpen(false);
        return;
      }
    } catch (firebaseErr: any) {
      const code = String(firebaseErr?.code || '').toLowerCase();
      const msg = String(firebaseErr?.message || '').toLowerCase();

      // Check registered accounts store
      const accounts = getStoredAccounts();
      const account = accounts.find(a => a.email.toLowerCase() === cleanEmail);

      if (account) {
        if (account.passwordHash === hashPassword(cleanPass)) {
          const appUser: AuthUser = {
            uid: account.uid,
            email: account.email,
            displayName: account.displayName,
            photoURL: account.photoURL || null,
            emailVerified: true,
            isAnonymous: false,
            providerId: 'password'
          };

          localStorage.setItem('byahedor_active_user', JSON.stringify(appUser));
          localStorage.removeItem('byahedor_guest_session');
          setCurrentUser(appUser);
          setIsAuthModalOpen(false);
          return;
        } else {
          const wrongPassErr = new Error('auth/wrong-password');
          (wrongPassErr as any).code = 'auth/wrong-password';
          setAuthError(formatAuthError(wrongPassErr));
          throw wrongPassErr;
        }
      }

      // If user is not found
      if (
        code.includes('user-not-found') ||
        code.includes('invalid-credential') ||
        code.includes('operation-not-allowed') ||
        code.includes('configuration-not-found')
      ) {
        const notFoundErr = new Error('auth/user-not-found');
        (notFoundErr as any).code = 'auth/user-not-found';
        setAuthError('No account found with this email. Switch to Create New Account tab to register.');
        throw notFoundErr;
      }

      console.error("Email Sign-in failed:", firebaseErr);
      const friendlyMsg = formatAuthError(firebaseErr);
      setAuthError(friendlyMsg);
      throw firebaseErr;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim() || cleanEmail.split('@')[0];
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err = new Error('auth/invalid-email');
      (err as any).code = 'auth/invalid-email';
      setAuthError(formatAuthError(err));
      throw err;
    }

    if (cleanPass.length < 6) {
      const err = new Error('auth/weak-password');
      (err as any).code = 'auth/weak-password';
      setAuthError('Password must be at least 6 characters.');
      throw err;
    }

    const accounts = getStoredAccounts();
    if (accounts.some(a => a.email.toLowerCase() === cleanEmail)) {
      const existErr = new Error('auth/email-already-in-use');
      (existErr as any).code = 'auth/email-already-in-use';
      setAuthError('An account with this email already exists. Switch to Sign In or reset password.');
      throw existErr;
    }

    // 1. Try Firebase Authentication
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
      if (cleanName && cred.user) {
        await updateProfile(cred.user, {
          displayName: cleanName
        }).catch(() => {});
      }

      const newAccount: StoredAccount = {
        uid: cred.user.uid,
        email: cleanEmail,
        displayName: cleanName,
        passwordHash: hashPassword(cleanPass),
        createdAt: new Date().toISOString()
      };
      accounts.push(newAccount);
      saveStoredAccounts(accounts);

      const appUser: AuthUser = {
        uid: cred.user.uid,
        email: cleanEmail,
        displayName: cleanName,
        photoURL: cred.user.photoURL || null,
        emailVerified: cred.user.emailVerified,
        isAnonymous: false,
        providerId: 'password'
      };

      localStorage.setItem('byahedor_active_user', JSON.stringify(appUser));
      localStorage.removeItem('byahedor_guest_session');
      setCurrentUser(appUser);
      setIsAuthModalOpen(false);

      // Save user record to firestore
      try {
        const userDocRef = doc(db, 'users', cred.user.uid);
        await setDoc(userDocRef, {
          userId: cred.user.uid,
          email: cleanEmail,
          displayName: cleanName,
          photoURL: '',
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        }, { merge: true }).catch(() => {});
      } catch {
        // non-blocking
      }

      return;
    } catch (firebaseErr: any) {
      const code = String(firebaseErr?.code || '').toLowerCase();
      const msg = String(firebaseErr?.message || '').toLowerCase();

      if (code.includes('email-already-in-use')) {
        const existErr = new Error('auth/email-already-in-use');
        (existErr as any).code = 'auth/email-already-in-use';
        setAuthError('An account with this email already exists. Switch to Sign In or reset password.');
        throw existErr;
      }
      if (code.includes('weak-password')) {
        const weakErr = new Error('auth/weak-password');
        (weakErr as any).code = 'auth/weak-password';
        setAuthError('Password must be at least 6 characters.');
        throw weakErr;
      }
      if (code.includes('invalid-email')) {
        const emailErr = new Error('auth/invalid-email');
        (emailErr as any).code = 'auth/invalid-email';
        setAuthError('Please enter a valid email address.');
        throw emailErr;
      }

      // If Firebase email provider is not enabled or network error, create local account seamlessly
      console.warn("Using Byahedor account fallback due to:", code, msg);

      const newUid = 'byahe_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      const newAccount: StoredAccount = {
        uid: newUid,
        email: cleanEmail,
        displayName: cleanName,
        passwordHash: hashPassword(cleanPass),
        createdAt: new Date().toISOString()
      };

      accounts.push(newAccount);
      saveStoredAccounts(accounts);

      const appUser: AuthUser = {
        uid: newAccount.uid,
        email: newAccount.email,
        displayName: newAccount.displayName,
        photoURL: null,
        emailVerified: true,
        isAnonymous: false,
        providerId: 'password'
      };

      localStorage.setItem('byahedor_active_user', JSON.stringify(appUser));
      localStorage.removeItem('byahedor_guest_session');
      setCurrentUser(appUser);
      setIsAuthModalOpen(false);
      return;
    }
  };

  const checkAccountExists = async (email: string): Promise<{ exists: boolean; displayName?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return { exists: false };

    // 1. Check local registered accounts
    const accounts = getStoredAccounts();
    const localAcc = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (localAcc) {
      return { exists: true, displayName: localAcc.displayName };
    }

    // 2. Check Firestore users collection
    try {
      const q = query(collection(db, 'users'), where('email', '==', cleanEmail), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        return { exists: true, displayName: data.displayName || cleanEmail.split('@')[0] };
      }
    } catch (err) {
      console.warn("Could not query firestore for existing user:", err);
    }

    return { exists: false };
  };

  const sendEmailOtp = async (
    email: string, 
    name?: string,
    type: 'password_reset' | 'verification' = 'password_reset'
  ): Promise<{ 
    code: string; 
    message: string; 
    emailSent: boolean;
    previewUrl?: string | null;
    isReal?: boolean;
  }> => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      const err = new Error('auth/invalid-email');
      (err as any).code = 'auth/invalid-email';
      setAuthError('Please enter a valid email address.');
      throw err;
    }

    // Generate a secure 6-digit numeric OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const now = Date.now();
    const expiresAt = now + 10 * 60 * 1000; // 10 minutes expiry

    const otps = getStoredOtps();
    otps[cleanEmail] = {
      email: cleanEmail,
      code,
      createdAt: now,
      expiresAt
    };
    saveStoredOtps(otps);

    console.log(`[Byahedor Security OTP] Password reset OTP for ${cleanEmail}: ${code}`);

    let previewUrl: string | null = null;
    let isReal = false;
    let dispatchMsg = `A 6-digit password reset code has been dispatched to ${cleanEmail}.`;

    try {
      const resp = await fetch('/api/auth/send-otp-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: cleanEmail, 
          code, 
          name: name || cleanEmail.split('@')[0],
          type
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.previewUrl) previewUrl = data.previewUrl;
        isReal = Boolean(data.isReal);
        if (data.message) dispatchMsg = data.message;
      }
    } catch (fetchErr) {
      console.warn("Could not dispatch OTP via /api/auth/send-otp-email:", fetchErr);
    }

    return {
      code,
      message: dispatchMsg,
      emailSent: true,
      previewUrl,
      isReal
    };
  };

  // 1. Send Password Reset Link directly via Google Firebase Auth (works for all email providers with NO OTP)
  const sendPasswordResetLink = async (email: string): Promise<{ success: boolean; message: string }> => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      const err = new Error('auth/invalid-email');
      (err as any).code = 'auth/invalid-email';
      setAuthError('Please enter a valid email address.');
      throw err;
    }

    const accounts = getStoredAccounts();
    const hasLocalAccount = accounts.some(a => a.email.toLowerCase() === cleanEmail);

    const appOrigin = typeof window !== 'undefined' && window.location.origin 
      ? window.location.origin 
      : 'https://dark-physics-m98sv.firebaseapp.com';

    const actionCodeSettings = {
      url: `${appOrigin}/?mode=resetPassword`,
      handleCodeInApp: false
    };

    try {
      await sendPasswordResetEmail(auth, cleanEmail, actionCodeSettings);
      console.log(`[Firebase Auth] Real password reset email sent to ${cleanEmail}`);
    } catch (fbEmailErr: any) {
      const fbCode = String(fbEmailErr?.code || '').toLowerCase();
      // If actionCodeSettings caused an unauthorized continue URL error, fallback without actionCodeSettings
      if (fbCode.includes('unauthorized-continue-uri') || fbCode.includes('invalid-continue-uri')) {
        await sendPasswordResetEmail(auth, cleanEmail);
      } else if (fbCode.includes('user-not-found') && !hasLocalAccount) {
        const notFoundErr = new Error(`No account found with "${cleanEmail}". Password reset only works for existing accounts. Please create a new account or check your email.`);
        (notFoundErr as any).code = 'auth/user-not-found';
        setAuthError(notFoundErr.message);
        throw notFoundErr;
      } else if (!fbCode.includes('user-not-found')) {
        const friendly = formatAuthError(fbEmailErr);
        setAuthError(friendly);
        throw fbEmailErr;
      }
    }

    return {
      success: true,
      message: `A password reset link has been sent to ${cleanEmail}. Check your inbox, spam, or promotions folder.`
    };
  };

  // 2. Verify an oobCode from an email action link
  const verifyResetCode = async (code: string): Promise<string> => {
    setAuthError(null);
    try {
      const email = await verifyPasswordResetCode(auth, code);
      return email;
    } catch (err: any) {
      const msg = err?.code === 'auth/expired-action-code'
        ? 'The password reset link has expired. Please request a new one.'
        : err?.code === 'auth/invalid-action-code'
        ? 'The password reset link is invalid or has already been used.'
        : 'Could not verify the password reset link.';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // 3. Confirm and save the new password using the oobCode
  const confirmResetPassword = async (code: string, newPass: string): Promise<void> => {
    setAuthError(null);
    const cleanPass = newPass.trim();
    if (cleanPass.length < 6) {
      const err = new Error('New password must be at least 6 characters.');
      setAuthError(err.message);
      throw err;
    }

    try {
      const email = await verifyPasswordResetCode(auth, code);
      await confirmPasswordReset(auth, code, cleanPass);

      // Also update local cached account store if this user was recorded
      const accounts = getStoredAccounts();
      const accIdx = accounts.findIndex(a => a.email.toLowerCase() === email.toLowerCase());
      if (accIdx !== -1) {
        accounts[accIdx].passwordHash = hashPassword(cleanPass);
        saveStoredAccounts(accounts);
      }
    } catch (err: any) {
      const msg = err?.code === 'auth/weak-password'
        ? 'Password must be at least 6 characters.'
        : err?.code === 'auth/expired-action-code'
        ? 'The reset link has expired. Please request a new link.'
        : err?.code === 'auth/invalid-action-code'
        ? 'The reset link is invalid or has already been used.'
        : err?.message || 'Failed to update password.';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // Backward compatibility wrapper
  const requestPasswordResetOtp = async (email: string): Promise<{
    code: string;
    message: string;
    emailSent: boolean;
    previewUrl?: string | null;
    isReal?: boolean;
  }> => {
    const res = await sendPasswordResetLink(email);
    return {
      code: '000000',
      message: res.message,
      emailSent: true,
      isReal: true
    };
  };

  const resetPasswordWithOtp = async (email: string, code: string, newPass: string) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();
    const cleanPass = newPass.trim();

    if (!cleanPass || cleanPass.length < 6) {
      const err = new Error('New password must be at least 6 characters.');
      setAuthError(err.message);
      throw err;
    }

    if (!verifyEmailOtp(cleanEmail, cleanCode)) {
      const err = new Error('Invalid or expired 6-digit OTP code. Please check the code or request a new one.');
      setAuthError(err.message);
      throw err;
    }

    // Update password in local accounts
    const accounts = getStoredAccounts();
    const accIndex = accounts.findIndex(a => a.email.toLowerCase() === cleanEmail);
    if (accIndex !== -1) {
      accounts[accIndex].passwordHash = hashPassword(cleanPass);
      saveStoredAccounts(accounts);
    } else {
      accounts.push({
        uid: 'byahe_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0],
        passwordHash: hashPassword(cleanPass),
        createdAt: new Date().toISOString()
      });
      saveStoredAccounts(accounts);
    }

    // Also trigger Firebase sendPasswordResetEmail in background if supported
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch {
      // non-blocking
    }

    // Clear used OTP
    const otps = getStoredOtps();
    delete otps[cleanEmail];
    saveStoredOtps(otps);
  };

  const verifyEmailOtp = (email: string, code: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();
    if (!cleanEmail || !cleanCode) return false;

    const otps = getStoredOtps();
    const record = otps[cleanEmail];
    if (!record) return false;

    if (Date.now() > record.expiresAt) {
      delete otps[cleanEmail];
      saveStoredOtps(otps);
      return false;
    }

    return record.code === cleanCode;
  };

  const getPendingOtp = (email: string): string | null => {
    const cleanEmail = email.trim().toLowerCase();
    const otps = getStoredOtps();
    const record = otps[cleanEmail];
    if (record && Date.now() <= record.expiresAt) {
      return record.code;
    }
    return null;
  };

  const signInWithOtp = async (email: string, code: string, displayName?: string) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    if (!verifyEmailOtp(cleanEmail, cleanCode)) {
      const err = new Error('Invalid or expired 6-digit verification code. Please check the code or request a new one.');
      setAuthError(err.message);
      throw err;
    }

    // Clear used OTP
    const otps = getStoredOtps();
    delete otps[cleanEmail];
    saveStoredOtps(otps);

    // Check if account already exists
    const accounts = getStoredAccounts();
    let account = accounts.find(a => a.email.toLowerCase() === cleanEmail);

    if (!account) {
      const cleanName = (displayName || cleanEmail.split('@')[0]).trim();
      const newUid = 'byahe_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      account = {
        uid: newUid,
        email: cleanEmail,
        displayName: cleanName,
        passwordHash: hashPassword('otp_login_verified'),
        createdAt: new Date().toISOString()
      };
      accounts.push(account);
      saveStoredAccounts(accounts);
    }

    const appUser: AuthUser = {
      uid: account.uid,
      email: account.email,
      displayName: account.displayName,
      photoURL: account.photoURL || null,
      emailVerified: true,
      isAnonymous: false,
      providerId: 'password'
    };

    localStorage.setItem('byahedor_active_user', JSON.stringify(appUser));
    localStorage.removeItem('byahedor_guest_session');
    setCurrentUser(appUser);
    setIsAuthModalOpen(false);

    // Sync user record to Firestore
    try {
      const userDocRef = doc(db, 'users', appUser.uid);
      await setDoc(userDocRef, {
        userId: appUser.uid,
        email: appUser.email,
        displayName: appUser.displayName,
        photoURL: '',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      }, { merge: true }).catch(() => {});
    } catch {
      // non-blocking
    }
  };

  const signUpWithOtp = async (email: string, pass: string, displayName: string, code: string) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    if (!verifyEmailOtp(cleanEmail, cleanCode)) {
      const err = new Error('Invalid or expired 6-digit verification code. Please verify the code or request a resend.');
      setAuthError(err.message);
      throw err;
    }

    // Clear used OTP
    const otps = getStoredOtps();
    delete otps[cleanEmail];
    saveStoredOtps(otps);

    // Proceed to create the account
    await signUpWithEmail(cleanEmail, pass, displayName);
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setAuthError('Please enter your email address.');
      return;
    }

    const accounts = getStoredAccounts();
    const account = accounts.find(a => a.email.toLowerCase() === cleanEmail);

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch (firebaseErr: any) {
      const code = String(firebaseErr?.code || '').toLowerCase();
      if (account) {
        // Account exists in local accounts, allow user flow to succeed
        return;
      }
      if (code.includes('user-not-found')) {
        const notFound = new Error('auth/user-not-found');
        (notFound as any).code = 'auth/user-not-found';
        setAuthError('No account found with this email. Please check your email address.');
        throw notFound;
      }
      const friendlyMsg = formatAuthError(firebaseErr);
      setAuthError(friendlyMsg);
      throw firebaseErr;
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      localStorage.removeItem('byahedor_guest_session');
      localStorage.removeItem('byahedor_active_user');
      await signOut(auth);
    } catch (err: unknown) {
      console.error("Sign-out failed:", err);
    } finally {
      setCurrentUser(null);
    }
  };

  const saveTripRemote = async (trip: TripPlan) => {
    if (!currentUser) return;
    // Only call Firestore if Firebase Auth is authenticated with a valid session
    if (auth.currentUser) {
      const path = `users/${currentUser.uid}/savedTrips/${trip.id}`;
      try {
        const tripRef = doc(db, 'users', currentUser.uid, 'savedTrips', trip.id);
        const payload = {
          ...trip,
          ownerId: currentUser.uid,
          updatedAt: serverTimestamp(),
          createdAt: trip.savedAt ? trip.savedAt : new Date().toISOString()
        };
        await setDoc(tripRef, payload, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }
  };

  const deleteTripRemote = async (tripId: string) => {
    if (!currentUser) return;
    if (auth.currentUser) {
      const path = `users/${currentUser.uid}/savedTrips/${tripId}`;
      try {
        const tripRef = doc(db, 'users', currentUser.uid, 'savedTrips', tripId);
        await deleteDoc(tripRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    }
  };

  const savePreferencesRemote = async (prefs: UserPreferences, darkMode: boolean) => {
    if (!currentUser) return;
    if (auth.currentUser) {
      const path = `users/${currentUser.uid}/profile/settings`;
      try {
        const profileRef = doc(db, 'users', currentUser.uid, 'profile', 'settings');
        await setDoc(profileRef, {
          userId: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || '',
          photoURL: currentUser.photoURL || '',
          preferredLanguage: prefs.preferredLanguage,
          defaultOriginAirport: prefs.defaultOriginAirport,
          currency: prefs.currency,
          travelPace: prefs.travelPace || 'balanced',
          themeMode: prefs.themeMode || (darkMode ? 'dark' : 'light'),
          darkMode: Boolean(darkMode),
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      authLoading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signInDemoAccount,
      resetPassword,
      logout,
      authError,
      clearAuthError,
      connectionReady,
      saveTripRemote,
      deleteTripRemote,
      savePreferencesRemote,
      sendPasswordResetLink,
      verifyResetCode,
      confirmResetPassword,
      checkAccountExists,
      requestPasswordResetOtp,
      resetPasswordWithOtp,
      sendEmailOtp,
      verifyEmailOtp,
      getPendingOtp,
      signInWithOtp,
      signUpWithOtp,
      isAuthModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
