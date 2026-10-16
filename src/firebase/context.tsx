import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, googleProvider, testFirestoreConnection } from './config';
import { handleFirestoreError, OperationType } from './errors';
import { TripPlan, UserPreferences } from '../types';

export type AuthModalMode = 'signin' | 'signup' | 'forgot';

interface AuthContextType {
  currentUser: User | null;
  authLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
  connectionReady: boolean;
  saveTripRemote: (trip: TripPlan) => Promise<void>;
  deleteTripRemote: (tripId: string) => Promise<void>;
  savePreferencesRemote: (prefs: UserPreferences, darkMode: boolean) => Promise<void>;
  // Global modal state
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function formatAuthError(err: unknown): string {
  if (!err) return 'An error occurred during authentication';
  const code = (err as { code?: string }).code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password. Please double check and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in or use Google login.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters with letters and numbers.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completion. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Another authentication window was in progress.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please wait a minute or reset your password.';
    default:
      return (err as { message?: string }).message || 'Authentication error. Please try again.';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
      setCurrentUser(user);
      setAuthLoading(false);
      // Auto-create/sync user profile document in Firestore if user is logged in
      if (user) {
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
      }
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

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      setIsAuthModalOpen(false);
    } catch (err: unknown) {
      console.error("Email Sign-in failed:", err);
      const friendlyMsg = formatAuthError(err);
      setAuthError(friendlyMsg);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (displayName.trim() && cred.user) {
        await updateProfile(cred.user, {
          displayName: displayName.trim()
        });
      }
      setIsAuthModalOpen(false);
    } catch (err: unknown) {
      console.error("Email registration failed:", err);
      const friendlyMsg = formatAuthError(err);
      setAuthError(friendlyMsg);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: unknown) {
      console.error("Password reset failed:", err);
      const friendlyMsg = formatAuthError(err);
      setAuthError(friendlyMsg);
      throw err;
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      localStorage.removeItem('byahedor_guest_session');
      await signOut(auth);
    } catch (err: unknown) {
      console.error("Sign-out failed:", err);
      const friendlyMsg = formatAuthError(err);
      setAuthError(friendlyMsg);
      throw err;
    }
  };

  const saveTripRemote = async (trip: TripPlan) => {
    if (!currentUser) return;
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
  };

  const deleteTripRemote = async (tripId: string) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/savedTrips/${tripId}`;
    try {
      const tripRef = doc(db, 'users', currentUser.uid, 'savedTrips', tripId);
      await deleteDoc(tripRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const savePreferencesRemote = async (prefs: UserPreferences, darkMode: boolean) => {
    if (!currentUser) return;
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
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      authLoading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      logout,
      authError,
      clearAuthError,
      connectionReady,
      saveTripRemote,
      deleteTripRemote,
      savePreferencesRemote,
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
