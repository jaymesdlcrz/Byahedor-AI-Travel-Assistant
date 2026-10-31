import React, { useState, useEffect } from 'react';
import { 
  Home, 
  PlaneTakeoff, 
  MapPin, 
  MessageSquareQuote, 
  Menu, 
  X, 
  Wallet, 
  UtensilsCrossed, 
  CheckSquare, 
  Heart, 
  Settings,
  Sun,
  Moon,
  Compass,
  Sparkles,
  ChevronRight,
  Wind
} from 'lucide-react';
import { NavView } from '../types';
import { ByahedorLogo } from './ByahedorLogo';
import { useAuth } from '../firebase/context';
import { LogIn, LogOut } from 'lucide-react';

interface MobileNavProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  savedTripsCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onShowLoginScreen?: () => void;
  isKeyboardOpen?: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onNavigate,
  savedTripsCount,
  darkMode,
  onToggleDarkMode,
  onShowLoginScreen,
  isKeyboardOpen = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout, openAuthModal } = useAuth();

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    if (menuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Primary 4 tabs + More button for bottom bar
  const mainBottomTabs = [
    { id: 'home' as NavView, label: 'Home', icon: Home },
    { id: 'planner' as NavView, label: 'Trips', icon: PlaneTakeoff },
    { id: 'destinations' as NavView, label: 'Explore', icon: MapPin },
    { id: 'chat' as NavView, label: 'AI Chat', icon: MessageSquareQuote },
  ];

  // Secondary tools in More drawer
  const moreCategories = [
    {
      title: 'Planning & Discover',
      items: [
        { id: 'explore' as NavView, label: 'Archipelago Map', desc: 'Island routes & sea lanes', icon: Compass },
        { id: 'climate' as NavView, label: 'Amihan & Climate', desc: 'Monsoons, sea swells & best months', icon: Wind },
        { id: 'budget' as NavView, label: 'Budget Planner', desc: '₱ cost swaps & optimizer', icon: Wallet },
        { id: 'food' as NavView, label: 'Local Culinary Eats', desc: 'Regional dishes & street food', icon: UtensilsCrossed },
        { id: 'checklist' as NavView, label: 'Travel Checklist', desc: 'Packing & island gear', icon: CheckSquare },
      ]
    },
    {
      title: 'Saved & Account',
      items: [
        { id: 'saved' as NavView, label: 'Saved Itineraries', desc: 'Your offline trip plans', icon: Heart, count: savedTripsCount },
        { id: 'settings' as NavView, label: 'Settings & Dialects', desc: 'Preferences & language tone', icon: Settings },
      ]
    }
  ];

  const handleSelectNav = (view: NavView) => {
    onNavigate(view);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top App Bar (Safe area aware) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-[#0f233a]/95 backdrop-blur-md border-b border-[#E4E9F0] dark:border-slate-800 px-3 sm:px-4 py-2 pt-safe transition-colors shadow-2xs">
        <div className="flex items-center justify-between min-h-[44px]">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center text-left focus:outline-hidden"
            aria-label="Go to Home"
          >
            <ByahedorLogo size="sm" showTagline={false} />
          </button>

          <div className="flex items-center gap-2">
            {/* Quick Dark Mode toggle with accessible 44px min tap target */}
            <button
              id="mobile-dark-mode-toggle"
              type="button"
              onClick={onToggleDarkMode}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-2xs group relative border ${
                darkMode
                  ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border-amber-400/30 hover:border-amber-400/50 shadow-amber-500/5'
                  : 'bg-slate-100/90 hover:bg-slate-200/90 text-slate-700 hover:text-[#087EA4] border-slate-200/90 hover:border-[#087EA4]/40 shadow-slate-900/5'
              }`}
              title={darkMode ? "Switch to Light Mode (Daylight)" : "Switch to Dark Mode (Twilight)"}
              aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400 fill-amber-400/20 transition-transform duration-300 group-hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </button>

            {/* Hamburger / More Drawer Trigger */}
            <button
              id="mobile-hamburger-btn"
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-2xs group relative border ${
                menuOpen
                  ? 'bg-[#087EA4] text-white border-[#087EA4] shadow-md shadow-[#087EA4]/25 hover:bg-[#076c8c]'
                  : 'bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 hover:text-[#087EA4] dark:hover:text-[#4DB8E8] border-slate-200/90 dark:border-slate-700/80 shadow-slate-900/5'
              }`}
              aria-label={menuOpen ? "Close Menu" : "Open Menu"}
              title={menuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            >
              {menuOpen ? (
                <X className="w-5 h-5 transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-Up Mobile Navigation Drawer (More Menu) */}
      {menuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in"
          onClick={() => setMenuOpen(false)}
        >
          <div 
            className="bg-white dark:bg-[#0f233a] rounded-t-3xl max-h-[88dvh] overflow-y-auto shadow-2xl border-t border-[#E4E9F0] dark:border-slate-800 flex flex-col pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle for touch gestures */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Drawer Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
              <div>
                <h3 className="text-sm font-bold text-[#102A43] dark:text-white font-heading">
                  Byahedor Travel Hub
                </h3>
                <p className="text-[11px] text-[#627D98] dark:text-slate-400">
                  All island tools & smart travel utilities
                </p>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center active:scale-95 transition-transform"
                aria-label="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Firebase Cloud Sync Banner */}
            <div className="px-5 pt-3">
              {currentUser ? (
                <div className="p-3 rounded-2xl bg-[#F0F7FA] dark:bg-slate-800/70 border border-[#087EA4]/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-[#087EA4]/30 shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#087EA4] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#102A43] dark:text-white truncate">
                        {currentUser.displayName || 'Traveler'}
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Firebase Synced
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      openAuthModal('signin');
                    }}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#087EA4] to-[#0A6C8C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In (Google & Email Options)</span>
                  </button>
                  {onShowLoginScreen && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onShowLoginScreen();
                      }}
                      className="w-full text-center text-xs text-slate-500 dark:text-slate-400 hover:text-[#087EA4] dark:hover:text-[#4DB8E8] py-1 cursor-pointer"
                    >
                      ← Back to Login Portal
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quick Dark Mode Switch inside Drawer */}
            <div className="px-5 pt-2">
              <button
                onClick={onToggleDarkMode}
                className="w-full p-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-[#102A43] dark:text-white transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                    darkMode ? 'bg-amber-400/20 text-amber-400' : 'bg-[#087EA4]/15 text-[#087EA4]'
                  }`}>
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </div>
                  <span>{darkMode ? 'Dark Mode: Twilight Navy' : 'Light Mode: Tropical Daylight'}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold shadow-2xs">
                  Switch
                </span>
              </button>
            </div>

            {/* Drawer Navigation List */}
            <div className="p-4 space-y-4 overflow-y-auto">
              {moreCategories.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 block">
                    {group.title}
                  </span>

                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentView === item.id;
                      return (
                        <button
                          key={item.id}
                          id={`mobile-drawer-${item.id}`}
                          onClick={() => handleSelectNav(item.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all active:scale-[0.98] ${
                            isActive
                              ? 'bg-[#087EA4] text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#102A43] dark:text-slate-200 border border-slate-100 dark:border-slate-700/40'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-white dark:bg-slate-700 text-[#087EA4] dark:text-[#4DB8E8] shadow-2xs'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">
                              <span className="text-xs font-bold block truncate">{item.label}</span>
                              <span className={`text-[10px] block truncate ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-400'}`}>
                                {item.desc}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {item.count !== undefined && item.count > 0 && (
                              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {item.count}
                              </span>
                            )}
                            <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white/70' : 'text-slate-300 dark:text-slate-600'}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Footer in Drawer */}
            <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleSelectNav('chat')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#087EA4] to-[#39A96B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFB84D]" />
                <span>Ask Byahedor AI Concierge</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Fixed Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-nav"
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0f233a]/95 backdrop-blur-md border-t border-[#E4E9F0] dark:border-slate-800 px-2 sm:px-4 py-1 pb-safe flex items-center justify-around shadow-lg transition-all duration-200 ${
          isKeyboardOpen && currentView === 'chat'
            ? 'translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        }`}
      >
        {mainBottomTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 min-w-[56px] min-h-[48px] py-1 px-1 rounded-xl flex flex-col items-center justify-center transition-all active:scale-90 ${
                isActive
                  ? 'text-[#087EA4] dark:text-[#4DB8E8]'
                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              aria-label={tab.label}
            >
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-105 bg-[#087EA4]/10 dark:bg-[#087EA4]/20 text-[#087EA4] dark:text-[#4DB8E8]' : ''}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={`text-[10px] leading-tight mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More Tab Trigger */}
        <button
          id="mobile-tab-more"
          onClick={() => setMenuOpen(true)}
          className={`flex-1 min-w-[56px] min-h-[48px] py-1 px-1 rounded-xl flex flex-col items-center justify-center transition-all active:scale-90 ${
            menuOpen ? 'text-[#087EA4] dark:text-[#4DB8E8]' : 'text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          aria-label="More navigation options"
        >
          <div className={`p-1 rounded-lg ${menuOpen ? 'bg-[#087EA4]/10 dark:bg-[#087EA4]/20 text-[#087EA4] dark:text-[#4DB8E8]' : ''}`}>
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className={`text-[10px] leading-tight mt-0.5 tracking-tight ${menuOpen ? 'font-bold' : 'font-medium'}`}>
            More
          </span>
        </button>
      </nav>
    </>
  );
};
