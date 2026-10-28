/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { NavView, TripPlan, Destination, UserPreferences } from './types';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { HomeDashboard } from './components/HomeDashboard';
import { TripPlannerView } from './components/TripPlannerView';
import { DestinationExplorer } from './components/DestinationExplorer';
import { ExploreMapView } from './components/ExploreMapView';
import { BudgetPlannerView } from './components/BudgetPlannerView';
import { LocalEatsView } from './components/LocalEatsView';
import { TravelChecklistView } from './components/TravelChecklistView';
import { AiChatView } from './components/AiChatView';
import { SavedTripsView } from './components/SavedTripsView';
import { SettingsView } from './components/SettingsView';
import { LoadingScreen } from './components/LoadingScreen';
import { AuthModal } from './components/AuthModal';
import { LoginScreen } from './components/LoginScreen';
import { DESTINATIONS } from './data/destinations';
import { useAuth } from './firebase/context';
import { db } from './firebase/config';
import { handleFirestoreError, OperationType } from './firebase/errors';

const DEFAULT_PREFS: UserPreferences = {
  preferredLanguage: 'English',
  defaultOriginAirport: 'Manila (MNL / NAIA)',
  currency: 'PHP',
  travelPace: 'balanced',
};

const INITIAL_SAVED_TRIPS: TripPlan[] = [];

function getSavedTripsStorageKey(uid?: string | null): string {
  return uid ? `byahedor_saved_trips_${uid}` : 'byahedor_saved_trips_guest';
}

function loadSavedTripsForUser(uid?: string | null): TripPlan[] {
  const key = getSavedTripsStorageKey(uid);
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Exclude pre-saved sample-siargao trip if previously cached
        const filtered = parsed.filter(t => t.id !== 'sample-siargao');
        if (filtered.length !== parsed.length) {
          localStorage.setItem(key, JSON.stringify(filtered));
        }
        return filtered;
      }
    } catch {
      // ignore parsing errors
    }
  }
  // For guest, check legacy 'byahedor_saved_trips' for backward-compatibility
  if (!uid) {
    const legacy = localStorage.getItem('byahedor_saved_trips');
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(t => t.id !== 'sample-siargao');
          if (filtered.length !== parsed.length) {
            localStorage.setItem('byahedor_saved_trips', JSON.stringify(filtered));
          }
          return filtered;
        }
      } catch {}
    }
    return INITIAL_SAVED_TRIPS;
  }
  // For signed-in user without local cache, start empty (Firestore will supply)
  return [];
}

export default function App() {
  const [loadingApp, setLoadingApp] = useState(true);
  const [currentView, setCurrentView] = useState<NavView>('home');
  const [plannerPrefillDest, setPlannerPrefillDest] = useState<string>('');
  const [chatPrefillPrompt, setChatPrefillPrompt] = useState<string>('');
  
  const { 
    currentUser, 
    authLoading, 
    signInWithGoogle, 
    logout, 
    saveTripRemote, 
    deleteTripRemote,
    savePreferencesRemote 
  } = useAuth();

  // Guest session flag to determine whether to show LoginScreen before main interface
  const [guestSession, setGuestSession] = useState<boolean>(() => {
    return localStorage.getItem('byahedor_guest_session') === 'true';
  });

  // Sync guestSession when user logs out
  useEffect(() => {
    if (!currentUser && localStorage.getItem('byahedor_guest_session') !== 'true') {
      setGuestSession(false);
    }
  }, [currentUser]);

  // Virtual keyboard detection for mobile viewports
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const handleViewport = () => {
      if (window.visualViewport) {
        const diff = window.innerHeight - window.visualViewport.height;
        setIsKeyboardOpen(diff > 120);
      }
    };
    window.visualViewport.addEventListener('resize', handleViewport);
    return () => window.visualViewport?.removeEventListener('resize', handleViewport);
  }, []);

  // Google Maps Platform quota listener (SKILL.md Section 8 Case A)
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);
  useEffect(() => {
    const handleQuota = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Saved trips state scoped per user
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>(() => {
    return loadSavedTripsForUser(currentUser?.uid);
  });

  // User Preferences
  const [userPrefs, setUserPrefs] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('byahedor_user_prefs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PREFS;
      }
    }
    return DEFAULT_PREFS;
  });

  // Theme mode: 'light' | 'dark' | 'system'
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('byahedor_theme_mode');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
    const legacy = localStorage.getItem('byahedor_dark_mode');
    if (legacy !== null) {
      return legacy === 'true' ? 'dark' : 'light';
    }
    return 'system';
  });

  // Effective dark mode boolean
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('byahedor_theme_mode');
    if (savedMode === 'dark') return true;
    if (savedMode === 'light') return false;
    const legacy = localStorage.getItem('byahedor_dark_mode');
    if (legacy !== null) return legacy === 'true';
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoadingApp(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Sync theme changes with DOM, color-scheme, and localStorage
  useEffect(() => {
    const applyTheme = () => {
      let isDark = false;
      if (themeMode === 'dark') {
        isDark = true;
      } else if (themeMode === 'light') {
        isDark = false;
      } else {
        isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setDarkMode(isDark);
      localStorage.setItem('byahedor_theme_mode', themeMode);
      localStorage.setItem('byahedor_dark_mode', String(isDark));

      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    };

    applyTheme();

    if (themeMode === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleMediaChange = (e: MediaQueryListEvent) => {
        const isDark = e.matches;
        setDarkMode(isDark);
        localStorage.setItem('byahedor_dark_mode', String(isDark));
        if (isDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
      };

      mediaQuery.addEventListener('change', handleMediaChange);
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }
  }, [themeMode]);

  // Sync saved trips when user logs in, switches accounts, or logs out
  useEffect(() => {
    if (!currentUser) {
      // Switched to guest mode or logged out: load guest trips
      setSavedTrips(loadSavedTripsForUser(null));
      return;
    }

    // Authenticated user: immediately populate with this user's local cache
    const initialUserTrips = loadSavedTripsForUser(currentUser.uid);
    setSavedTrips(initialUserTrips);

    const tripsPath = `users/${currentUser.uid}/savedTrips`;
    const tripsCol = collection(db, 'users', currentUser.uid, 'savedTrips');
    
    const unsubscribe = onSnapshot(tripsCol, (snapshot) => {
      const trips: TripPlan[] = [];
      snapshot.forEach((docSnap) => {
        const trip = docSnap.data() as TripPlan;
        if (trip.id === 'sample-siargao') {
          deleteTripRemote('sample-siargao').catch(() => {});
        } else {
          trips.push(trip);
        }
      });

      // Sort by savedAt descending (newest trips first)
      trips.sort((a, b) => {
        const timeA = a.savedAt ? new Date(a.savedAt).getTime() : 0;
        const timeB = b.savedAt ? new Date(b.savedAt).getTime() : 0;
        return timeB - timeA;
      });

      // Update state and write to user-scoped localStorage
      setSavedTrips(trips);
      localStorage.setItem(getSavedTripsStorageKey(currentUser.uid), JSON.stringify(trips));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, tripsPath);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // Sync user profile preferences from Firebase Firestore
  useEffect(() => {
    if (!currentUser) return;
    const profilePath = `users/${currentUser.uid}/profile/settings`;
    const profileRef = doc(db, 'users', currentUser.uid, 'profile', 'settings');
    
    const unsubscribe = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.preferredLanguage || data.currency || data.defaultOriginAirport) {
          setUserPrefs((prev) => ({
            ...prev,
            preferredLanguage: data.preferredLanguage || prev.preferredLanguage,
            defaultOriginAirport: data.defaultOriginAirport || prev.defaultOriginAirport,
            currency: data.currency || prev.currency,
            travelPace: data.travelPace || prev.travelPace,
          }));
        }
        if (typeof data.themeMode === 'string' && (data.themeMode === 'light' || data.themeMode === 'dark' || data.themeMode === 'system')) {
          setThemeMode(data.themeMode);
        } else if (typeof data.darkMode === 'boolean') {
          setThemeMode(data.darkMode ? 'dark' : 'light');
        }
      } else {
        // Initialize remote profile document
        savePreferencesRemote(userPrefs, darkMode).catch(() => {});
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, profilePath);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const key = getSavedTripsStorageKey(currentUser?.uid);
    localStorage.setItem(key, JSON.stringify(savedTrips));
    if (!currentUser) {
      localStorage.setItem('byahedor_saved_trips', JSON.stringify(savedTrips));
    }
  }, [savedTrips, currentUser?.uid]);

  useEffect(() => {
    localStorage.setItem('byahedor_user_prefs', JSON.stringify(userPrefs));
  }, [userPrefs]);


  const handleNavigate = (view: NavView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartPlanning = (destinationName?: string) => {
    if (destinationName) {
      setPlannerPrefillDest(destinationName);
    }
    handleNavigate('planner');
  };

  const handleStartChat = (initialPrompt?: string) => {
    if (initialPrompt) {
      setChatPrefillPrompt(initialPrompt);
    }
    handleNavigate('chat');
  };

  const handleSelectDestination = (dest: Destination) => {
    setPlannerPrefillDest(dest.name);
    handleNavigate('planner');
  };

  const handleSaveTrip = (newTrip: TripPlan) => {
    setSavedTrips(prev => {
      const exists = prev.some(t => t.id === newTrip.id);
      const updated = exists ? prev.map(t => t.id === newTrip.id ? newTrip : t) : [newTrip, ...prev];
      localStorage.setItem(getSavedTripsStorageKey(currentUser?.uid), JSON.stringify(updated));
      return updated;
    });

    // Remote sync to Firebase
    if (currentUser) {
      saveTripRemote(newTrip).catch((err) => {
        console.warn("Could not sync trip to Firebase immediately:", err);
      });
    }
  };

  const handleDeleteTrip = (tripId: string) => {
    setSavedTrips(prev => {
      const updated = prev.filter(t => t.id !== tripId);
      localStorage.setItem(getSavedTripsStorageKey(currentUser?.uid), JSON.stringify(updated));
      return updated;
    });
    
    // Remote deletion from Firebase
    if (currentUser) {
      deleteTripRemote(tripId).catch((err) => {
        console.warn("Could not delete trip from Firebase immediately:", err);
      });
    }
  };

  const handleUpdatePreferences = (prefs: UserPreferences) => {
    setUserPrefs(prefs);
    if (currentUser) {
      savePreferencesRemote(prefs, darkMode).catch(() => {});
    }
  };

  const handleToggleDarkMode = () => {
    const nextDark = !darkMode;
    const nextMode: 'light' | 'dark' = nextDark ? 'dark' : 'light';
    setThemeMode(nextMode);
    setDarkMode(nextDark);
    if (currentUser) {
      savePreferencesRemote({ ...userPrefs, themeMode: nextMode }, nextDark).catch(() => {});
    }
  };

  const handleSetThemeMode = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    let isDark = false;
    if (mode === 'dark') isDark = true;
    else if (mode === 'light') isDark = false;
    else isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setDarkMode(isDark);
    if (currentUser) {
      savePreferencesRemote({ ...userPrefs, themeMode: mode }, isDark).catch(() => {});
    }
  };

  const handleOpenTrip = (trip: TripPlan) => {
    setPlannerPrefillDest(trip.destination);
    handleNavigate('planner');
  };

  const handleClearAllData = () => {
    const userKey = currentUser ? currentUser.uid : 'guest';
    const tripsKey = getSavedTripsStorageKey(currentUser?.uid);
    localStorage.removeItem(tripsKey);
    localStorage.removeItem(`byahedor_chat_history_${userKey}`);
    localStorage.removeItem('byahedor_checklist');
    if (!currentUser) {
      localStorage.removeItem('byahedor_saved_trips');
      localStorage.removeItem('byahedor_chat_history');
    }
    setSavedTrips([]);
    handleNavigate('home');
  };

  if (loadingApp || authLoading) {
    return <LoadingScreen />;
  }

  // Show login form before the main interface when not signed in
  if (!currentUser && !guestSession) {
    return (
      <LoginScreen
        onContinueAsGuest={() => {
          localStorage.setItem('byahedor_guest_session', 'true');
          setGuestSession(true);
        }}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
    );
  }

  return (
    <div className={`bg-[#F5FAFC] dark:bg-[#09182a] text-[#102A43] dark:text-slate-100 flex flex-col lg:flex-row transition-colors font-sans antialiased selection:bg-[#087EA4] selection:text-white w-full ${
      currentView === 'chat'
        ? 'h-[100dvh] max-h-[100dvh] overflow-hidden'
        : 'min-h-screen min-h-dvh overflow-x-hidden'
    }`}>
      {/* Desktop Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        savedTripsCount={savedTrips.length}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onShowLoginScreen={() => setGuestSession(false)}
      />

      {/* Main Dynamic Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 w-full ${
        currentView === 'chat' ? 'h-full overflow-hidden' : 'overflow-x-hidden'
      }`}>
        {/* Google Maps Quota Defense Banner (SKILL.md Section 8 Case A) */}
        {mapsQuotaExceeded && (
          <div className="bg-amber-50 dark:bg-amber-950/80 border-b border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm flex items-center justify-center gap-2">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 dark:text-amber-100 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        {/* Mobile Header & Bottom Navigation */}
        <MobileNav
          currentView={currentView}
          onNavigate={handleNavigate}
          savedTripsCount={savedTrips.length}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onShowLoginScreen={() => setGuestSession(false)}
          isKeyboardOpen={isKeyboardOpen}
        />

        {/* View Viewport with bottom safe area for mobile navigation */}
        <main className={
          currentView === 'chat'
            ? `flex-1 min-h-0 flex flex-col w-full h-full p-0 sm:p-2 md:p-4 max-w-4xl mx-auto overflow-hidden ${
                isKeyboardOpen ? 'pb-1' : 'pb-[56px] sm:pb-[60px] lg:pb-0'
              }`
            : "flex-1 p-3 sm:p-4.5 md:p-6 pb-24 sm:pb-28 lg:pb-8 max-w-6xl w-full mx-auto"
        }>
          {currentView === 'home' && (
            <HomeDashboard
              onNavigate={handleNavigate}
              onSelectDestination={handleSelectDestination}
              onStartPlanning={handleStartPlanning}
              onStartChat={handleStartChat}
              savedTripIds={savedTrips.map(t => t.id)}
            />
          )}

          {currentView === 'planner' && (
            <TripPlannerView
              initialDestination={plannerPrefillDest}
              onSaveTrip={handleSaveTrip}
              savedTripIds={savedTrips.map(t => t.id)}
              onOpenInChat={handleStartChat}
            />
          )}

          {currentView === 'destinations' && (
            <DestinationExplorer
              onSelectDestination={handleSelectDestination}
              onStartPlanning={handleStartPlanning}
            />
          )}

          {currentView === 'explore' && (
            <ExploreMapView
              onStartPlanning={handleStartPlanning}
              onSelectDestination={handleSelectDestination}
            />
          )}

          {currentView === 'budget' && (
            <BudgetPlannerView
              onStartPlanningWithBudget={(dest, budget) => {
                setPlannerPrefillDest(dest);
                handleNavigate('planner');
              }}
            />
          )}

          {currentView === 'food' && <LocalEatsView />}

          {currentView === 'checklist' && <TravelChecklistView />}

          {currentView === 'chat' && (
            <AiChatView
              key={currentUser ? currentUser.uid : 'guest'}
              initialPrompt={chatPrefillPrompt}
              onStartPlanning={handleStartPlanning}
            />
          )}

          {currentView === 'saved' && (
            <SavedTripsView
              savedTrips={savedTrips}
              onDeleteTrip={handleDeleteTrip}
              onOpenTrip={handleOpenTrip}
              onStartPlanning={() => handleNavigate('planner')}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              userPrefs={userPrefs}
              onUpdatePrefs={handleUpdatePreferences}
              darkMode={darkMode}
              themeMode={themeMode}
              onSetThemeMode={handleSetThemeMode}
              onToggleDarkMode={handleToggleDarkMode}
              onClearAllData={handleClearAllData}
              onShowLoginScreen={() => setGuestSession(false)}
            />
          )}
        </main>
      </div>

      {/* Global Byahedor Authentication Modal */}
      <AuthModal />
    </div>
  );
}
