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

const INITIAL_SAVED_TRIPS: TripPlan[] = [
  {
    id: 'sample-siargao',
    title: '4-Day Tropical Surf & Secret Lagoon Adventure',
    destination: 'Siargao Island',
    origin: 'Manila (MNL)',
    departureDate: '2026-10-12',
    days: 4,
    travelers: 2,
    totalBudget: 22000,
    savedAt: new Date().toISOString(),
    coverImage: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
    overview: 'A vibrant island getaway embracing Cloud 9 surfing, coconut road photography, Sugba Lagoon bamboo rafting, and Doot Beach tidal sunsets.',
    budgetBreakdown: {
      transportation: 6500,
      accommodation: 7000,
      food: 4500,
      activities: 3000,
      emergency: 1000,
    },
    daysPlan: [
      {
        dayNumber: 1,
        theme: 'Arrival, Scooter Pick-up & Cloud 9 Sunset',
        activities: [
          { time: '11:30 AM', activity: 'Arrive at Sayak Airport (IAO) & pick up scooter rental', location: 'Sayak Airport', duration: '1 hr', estimatedCostPHP: 500 },
          { time: '01:30 PM', activity: 'Açai bowl and fresh coconut lunch at Shaka Cafe', location: 'General Luna', duration: '1 hr', estimatedCostPHP: 450 },
          { time: '05:00 PM', activity: 'Sunset boardwalk stroll at Cloud 9 surfing tower', location: 'Cloud 9 Boardwalk', duration: '2 hrs', estimatedCostPHP: 100 },
        ]
      },
      {
        dayNumber: 2,
        theme: 'Sugba Lagoon & Magpupungko Rock Pools',
        activities: [
          { time: '08:00 AM', activity: 'Boat transfer to turquoise Sugba Lagoon & paddleboarding', location: 'Del Carmen', duration: '4 hrs', estimatedCostPHP: 1200 },
          { time: '02:00 PM', activity: 'Tidal rock pool swimming at Magpupungko', location: 'Pilar', duration: '2 hrs', estimatedCostPHP: 150 },
        ]
      }
    ],
    localTips: [
      'Rent a scooter with surfboard rack for maximum mobility (₱350–₱500/day).',
      'Download offline maps as cell signal drops along the northern highway.',
    ]
  }
];

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

  // Saved trips state with local persistence
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>(() => {
    const saved = localStorage.getItem('byahedor_saved_trips');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_SAVED_TRIPS;
      }
    }
    return INITIAL_SAVED_TRIPS;
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
    const timer = setTimeout(() => setLoadingApp(false), 800);
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

  // Sync saved trips from Firebase Firestore in real-time when user is authenticated
  useEffect(() => {
    if (!currentUser) return;
    const tripsPath = `users/${currentUser.uid}/savedTrips`;
    const tripsCol = collection(db, 'users', currentUser.uid, 'savedTrips');
    
    const unsubscribe = onSnapshot(tripsCol, (snapshot) => {
      const trips: TripPlan[] = [];
      snapshot.forEach((docSnap) => {
        trips.push(docSnap.data() as TripPlan);
      });
      // If user has saved trips in Firestore, sync them
      if (trips.length > 0) {
        setSavedTrips(trips);
      } else if (savedTrips.length > 0) {
        // Upload initial sample/cached trips to user's new Firestore account
        savedTrips.forEach((t) => {
          saveTripRemote(t).catch(() => {});
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, tripsPath);
    });

    return () => unsubscribe();
  }, [currentUser]);

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
    localStorage.setItem('byahedor_saved_trips', JSON.stringify(savedTrips));
  }, [savedTrips]);

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
      if (exists) {
        return prev.map(t => t.id === newTrip.id ? newTrip : t);
      }
      return [newTrip, ...prev];
    });

    // Remote sync to Firebase
    if (currentUser) {
      saveTripRemote(newTrip).catch((err) => {
        console.warn("Could not sync trip to Firebase immediately:", err);
      });
    }
  };

  const handleDeleteTrip = (tripId: string) => {
    setSavedTrips(prev => prev.filter(t => t.id !== tripId));
    
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
    localStorage.removeItem('byahedor_saved_trips');
    localStorage.removeItem('byahedor_checklist');
    localStorage.removeItem('byahedor_chat_history');
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
