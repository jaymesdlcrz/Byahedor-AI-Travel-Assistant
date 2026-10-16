import React from 'react';
import { 
  Home, 
  MapPin, 
  Map, 
  Wallet, 
  UtensilsCrossed, 
  CheckSquare, 
  MessageSquareQuote, 
  Heart, 
  Settings, 
  Sun,
  Moon,
  PlaneTakeoff,
  LogOut,
  LogIn,
  CloudCheck,
  User as UserIcon
} from 'lucide-react';
import { NavView } from '../types';
import { useAuth } from '../firebase/context';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  savedTripsCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onShowLoginScreen?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  savedTripsCount,
  darkMode,
  onToggleDarkMode,
  onShowLoginScreen
}) => {
  const { currentUser, authLoading, logout, openAuthModal } = useAuth();

  const navItems = [
    { id: 'home' as NavView, label: 'Home', emoji: '🏠', badge: null },
    { id: 'planner' as NavView, label: 'Plan a Trip', emoji: '✈️', badge: 'AI' },
    { id: 'destinations' as NavView, label: 'Destinations', emoji: '📍', badge: null },
    { id: 'explore' as NavView, label: 'Archipelago Map', emoji: '🗺️', badge: '7.1k' },
    { id: 'budget' as NavView, label: 'Budget Planner', emoji: '💰', badge: '₱' },
    { id: 'food' as NavView, label: 'Local Eats', emoji: '🍜', badge: null },
    { id: 'checklist' as NavView, label: 'Travel Checklist', emoji: '🎒', badge: null },
    { id: 'chat' as NavView, label: 'AI Chat', emoji: '💬', badge: 'Active' },
    { id: 'saved' as NavView, label: 'Saved Trips', emoji: '❤️', badge: savedTripsCount > 0 ? savedTripsCount : null },
    { id: 'settings' as NavView, label: 'Settings', emoji: '⚙️', badge: null },
  ];

  return (
    <aside 
      id="byahedor-sidebar"
      className="hidden lg:flex flex-col w-56 xl:w-60 bg-white dark:bg-[#0f233a] border-r border-[#E4E9F0] dark:border-slate-800/80 shrink-0 h-screen sticky top-0 z-30 transition-colors select-none font-sans"
    >
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#E4E9F0]/60 dark:border-slate-800/80">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-8 h-8 bg-gradient-to-br from-[#087EA4] to-[#39A96B] rounded-xl flex items-center justify-center shadow-md shadow-[#087EA4]/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="white"/>
              <path d="M11 8L13 10L16 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#087EA4] to-[#39A96B] font-heading">
            Byahedor
          </span>
        </div>
        
        {/* Dark mode switch */}
        <button
          id="theme-toggle-sidebar"
          onClick={onToggleDarkMode}
          className="p-1.5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 bg-slate-100/70 dark:bg-slate-800/80 text-slate-500 hover:text-[#087EA4] dark:text-slate-300 dark:hover:text-[#4DB8E8] transition-all cursor-pointer active:scale-90 flex items-center justify-center shadow-2xs"
          title={darkMode ? "Switch to Light Mode (Daylight)" : "Switch to Dark Mode (Twilight)"}
          aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2.5 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <div
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg font-medium text-xs cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#F0F7FA] dark:bg-[#087EA4]/20 text-[#087EA4] dark:text-[#4DB8E8] font-bold shadow-2xs'
                  : 'text-[#486581] dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-sm">{item.emoji}</span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-none ${
                  isActive
                    ? 'bg-[#087EA4] text-white'
                    : typeof item.badge === 'number'
                    ? 'bg-rose-500 text-white'
                    : item.badge === 'Active'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Firebase Cloud User & Sync Widget */}
      <div className="p-3 border-t border-[#E4E9F0]/60 dark:border-slate-800/80 space-y-2">
        {authLoading ? (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 animate-pulse text-[11px] text-slate-400">
            Checking Firebase cloud...
          </div>
        ) : currentUser ? (
          <div className="p-2.5 rounded-xl bg-[#F0F7FA] dark:bg-slate-800/60 border border-[#087EA4]/15 dark:border-slate-700">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'User'} 
                    className="w-6 h-6 rounded-full object-cover shrink-0 border border-[#087EA4]/20"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#087EA4] text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                    {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#102A43] dark:text-white truncate">
                    {currentUser.displayName || 'Traveler'}
                  </p>
                  <div className="flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Firebase Cloud Synced</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="p-1 rounded text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                title="Sign out of Firebase"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <button
              onClick={() => openAuthModal('signin')}
              className="w-full min-h-[36px] px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#087EA4] to-[#0A6C8C] hover:from-[#096d8e] hover:to-[#085a75] text-white text-[11px] font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
            {onShowLoginScreen && (
              <button
                type="button"
                onClick={onShowLoginScreen}
                className="w-full text-center text-[10px] text-slate-500 hover:text-[#087EA4] dark:text-slate-400 dark:hover:text-[#4DB8E8] transition-colors cursor-pointer"
              >
                Back to Login Portal
              </button>
            )}
          </div>
        )}

        {/* Next Stop Highlight Card */}
        <div className="bg-gradient-to-tr from-[#087EA4] to-[#4DB8E8] rounded-xl p-2.5 text-white shadow-xs relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[9px] font-semibold opacity-80 uppercase mb-0.5">Next Stop</p>
            <h4 className="font-bold text-[11px] mb-1">Boracay Island</h4>
            <button
              onClick={() => onNavigate('planner')}
              className="bg-white/20 hover:bg-white/30 text-[9px] font-bold py-0.5 px-2 rounded backdrop-blur-sm transition-all inline-flex items-center gap-1"
            >
              <span>View Journey</span>
              <PlaneTakeoff className="w-2.5 h-2.5" />
            </button>
          </div>
          <div className="absolute -right-3 -bottom-3 opacity-20 pointer-events-none">
            <svg width="45" height="45" viewBox="0 0 24 24" fill="white">
              <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z"/>
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
};
