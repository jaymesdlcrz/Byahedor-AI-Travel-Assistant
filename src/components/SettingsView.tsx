import React, { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Plane, 
  Coins, 
  ShieldCheck, 
  Sparkles, 
  Moon, 
  Sun, 
  Monitor,
  Trash2, 
  CheckCircle2, 
  HeartHandshake,
  Info,
  CloudCheck,
  LogIn,
  LogOut,
  Database,
  Check
} from 'lucide-react';
import { UserPreferences } from '../types';
import { useAuth } from '../firebase/context';

interface SettingsViewProps {
  userPrefs: UserPreferences;
  onUpdatePrefs: (prefs: UserPreferences) => void;
  darkMode: boolean;
  themeMode: 'light' | 'dark' | 'system';
  onSetThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  onToggleDarkMode: () => void;
  onClearAllData: () => void;
  onShowLoginScreen?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userPrefs,
  onUpdatePrefs,
  darkMode,
  themeMode,
  onSetThemeMode,
  onToggleDarkMode,
  onClearAllData,
  onShowLoginScreen,
}) => {
  const [pledged, setPledged] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { currentUser, logout, openAuthModal } = useAuth();

  const handleLangChange = (lang: 'English' | 'Filipino' | 'Bisaya' | 'Taglish') => {
    onUpdatePrefs({ ...userPrefs, preferredLanguage: lang });
    triggerToast();
  };

  const handleAirportChange = (airport: string) => {
    onUpdatePrefs({ ...userPrefs, defaultOriginAirport: airport });
    triggerToast();
  };

  const handleCurrencyChange = (curr: 'PHP' | 'USD' | 'EUR' | 'JPY') => {
    onUpdatePrefs({ ...userPrefs, currency: curr });
    triggerToast();
  };

  const triggerToast = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div id="byahedor-settings-view" className="space-y-5 pb-8 max-w-4xl w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#087EA4]/10 dark:bg-[#087EA4]/20 text-[#087EA4] dark:text-[#4DB8E8] text-[11px] font-bold mb-1">
            <Settings className="w-3 h-3" />
            <span>App Preferences</span>
          </div>
          <h1 className="text-fluid-title font-bold text-[#102A43] dark:text-white font-heading">
            Settings & Personalization
          </h1>
          <p className="text-xs text-[#627D98] dark:text-slate-400">
            Customize AI dialect tones, departure gateways, and responsible ecotourism protocols.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 animate-bounce self-start sm:self-auto shadow-2xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Updated!</span>
          </div>
        )}
      </div>

      {/* Settings Grid */}
      <div className="space-y-4">
        {/* Firebase Cloud Sync & Authentication */}
        <div className="bg-white dark:bg-[#0f233a] rounded-2xl p-4 sm:p-5 border border-[#087EA4]/20 dark:border-slate-800 shadow-2xs space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#087EA4]/10 dark:bg-[#087EA4]/20 text-[#087EA4] dark:text-[#4DB8E8]">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#102A43] dark:text-white font-heading flex items-center gap-2">
                  <span>Firebase Cloud Storage & Auth</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    Connected
                  </span>
                </h3>
                <p className="text-[11px] text-[#627D98] dark:text-slate-400">
                  Cloud Firestore Project: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">dark-physics-m98sv</span> (asia-southeast1)
                </p>
              </div>
            </div>

            {currentUser ? (
              <button
                onClick={() => logout()}
                className="self-start sm:self-auto min-h-[36px] px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="min-h-[36px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#087EA4] to-[#0A6C8C] hover:opacity-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In / Register</span>
                </button>
                {onShowLoginScreen && (
                  <button
                    type="button"
                    onClick={onShowLoginScreen}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#087EA4] dark:hover:text-[#4DB8E8] text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    Login Portal
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            {currentUser ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="User" className="w-9 h-9 rounded-full border border-[#087EA4]/30 shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#087EA4] text-white font-bold flex items-center justify-center shrink-0">
                      {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-[#102A43] dark:text-white">
                      {currentUser.displayName || 'Byahedor Explorer'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] self-start sm:self-auto">
                  <CloudCheck className="w-4 h-4" />
                  <span>Real-Time Cloud Synced</span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Your trips and preferences are currently kept in your local browser storage. Sign in with Google to automatically back them up to Firebase Firestore and sync across your mobile devices and desktop.
              </p>
            )}
          </div>
        </div>

        {/* Display & Appearance / Dark & Light Mode */}
        <div id="settings-appearance-card" className="bg-white dark:bg-[#0f233a] rounded-2xl p-4 sm:p-5 border border-[#E4E9F0] dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 dark:bg-amber-400/10 dark:text-amber-400">
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#102A43] dark:text-white font-heading flex items-center gap-2">
                  <span>Display & Theme Appearance</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    darkMode 
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' 
                      : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                  }`}>
                    {darkMode ? '🌙 Dark Mode Active' : '☀️ Light Mode Active'}
                  </span>
                </h3>
                <p className="text-[11px] text-[#627D98] dark:text-slate-400">
                  Switch between tropical island daylight, twilight midnight navy, or system match
                </p>
              </div>
            </div>

            {/* Quick Toggle Switch Button */}
            <button
              onClick={() => {
                onToggleDarkMode();
                triggerToast();
              }}
              className="self-start sm:self-auto min-h-[40px] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[#102A43] dark:text-white text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-2xs"
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                darkMode ? 'bg-amber-400/20 text-amber-400' : 'bg-[#087EA4]/15 text-[#087EA4]'
              }`}>
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </div>
              <span>Toggle to {darkMode ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          {/* Three Mode Cards: Light, Dark, System */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Light Mode Card */}
            <button
              type="button"
              onClick={() => {
                onSetThemeMode('light');
                triggerToast();
              }}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                themeMode === 'light'
                  ? 'border-[#087EA4] ring-2 ring-[#087EA4]/20 bg-sky-50/50 dark:bg-slate-800'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {themeMode === 'light' && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#087EA4] text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              {/* Mini Preview Box */}
              <div className="w-full h-12 rounded-lg bg-[#F5FAFC] border border-slate-200 p-1.5 flex flex-col justify-between mb-2.5">
                <div className="flex items-center justify-between">
                  <div className="h-2 w-12 rounded-full bg-[#087EA4]/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-16 rounded-full bg-slate-300" />
                  <div className="h-1.5 w-10 rounded-full bg-slate-200" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-[#102A43] dark:text-white">Light Mode</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Crisp tropical daylight palette. Best for bright rooms and sunny days.
              </p>
            </button>

            {/* Dark Mode Card */}
            <button
              type="button"
              onClick={() => {
                onSetThemeMode('dark');
                triggerToast();
              }}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                themeMode === 'dark'
                  ? 'border-[#4DB8E8] ring-2 ring-[#4DB8E8]/20 bg-slate-900'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {themeMode === 'dark' && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#4DB8E8] text-[#09182a] flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              {/* Mini Preview Box */}
              <div className="w-full h-12 rounded-lg bg-[#09182a] border border-slate-700 p-1.5 flex flex-col justify-between mb-2.5">
                <div className="flex items-center justify-between">
                  <div className="h-2 w-12 rounded-full bg-[#4DB8E8]/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-16 rounded-full bg-slate-700" />
                  <div className="h-1.5 w-10 rounded-full bg-slate-800" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-[#102A43] dark:text-white">Dark Mode</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Archipelago Twilight Navy (#09182a). Gentle on the eyes, OLED battery saver.
              </p>
            </button>

            {/* System Auto Card */}
            <button
              type="button"
              onClick={() => {
                onSetThemeMode('system');
                triggerToast();
              }}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                themeMode === 'system'
                  ? 'border-[#39A96B] ring-2 ring-[#39A96B]/20 bg-emerald-50/40 dark:bg-slate-800'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {themeMode === 'system' && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#39A96B] text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              {/* Mini Split Preview Box */}
              <div className="w-full h-12 rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden flex mb-2.5">
                <div className="w-1/2 h-full bg-[#F5FAFC] p-1.5 flex flex-col justify-between border-r border-slate-300">
                  <div className="h-2 w-7 rounded-full bg-[#087EA4]" />
                  <div className="h-1.5 w-8 rounded-full bg-slate-300" />
                </div>
                <div className="w-1/2 h-full bg-[#09182a] p-1.5 flex flex-col justify-between">
                  <div className="h-2 w-7 rounded-full bg-[#4DB8E8]" />
                  <div className="h-1.5 w-8 rounded-full bg-slate-700" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-[#102A43] dark:text-white">Auto (Device Sync)</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Follows your phone, tablet, or laptop's native dark/light schedule automatically.
              </p>
            </button>
          </div>
        </div>

        {/* Language & Dialect Preferences */}
        <div className="bg-white dark:bg-[#0f233a] rounded-2xl p-4 sm:p-5 border border-[#E4E9F0] dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#087EA4] dark:text-[#4DB8E8]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#102A43] dark:text-white font-heading">
                AI Companion Language Tone
              </h3>
              <p className="text-[11px] text-[#627D98] dark:text-slate-400">
                Choose the primary dialect for Byahedor's conversational style
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {[
              { id: 'English' as const, title: 'English', desc: 'Standard international' },
              { id: 'Filipino' as const, title: 'Filipino / Tagalog', desc: 'Natural Tagalog phrasing' },
              { id: 'Bisaya' as const, title: 'Cebuano / Bisaya', desc: 'Visayas & Mindanao tone' },
              { id: 'Taglish' as const, title: 'Taglish', desc: 'Conversational Metro blend' },
            ].map(l => (
              <button
                key={l.id}
                onClick={() => handleLangChange(l.id)}
                className={`p-3 rounded-xl border text-left transition-all min-h-[44px] active:scale-95 ${
                  userPrefs.preferredLanguage === l.id
                    ? 'border-[#087EA4] bg-[#087EA4]/10 text-[#087EA4] dark:text-[#4DB8E8]'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xs font-bold block">{l.title}</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{l.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Departure Gateway */}
        <div className="bg-white dark:bg-[#0f233a] rounded-2xl p-4 sm:p-5 border border-[#E4E9F0] dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#39A96B]">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#102A43] dark:text-white font-heading">
                Default Departure Airport
              </h3>
              <p className="text-[11px] text-[#627D98] dark:text-slate-400">
                Auto-fill flight calculations from your home airport hub
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {[
              { id: 'Manila (MNL / NAIA)', label: 'Manila (MNL / Ninoy Aquino International Airport)' },
              { id: 'Clark (CRK)', label: 'Clark Pampanga (CRK International)' },
              { id: 'Cebu (MCIA)', label: 'Cebu (MCIA / Mactan-Cebu International Airport)' },
              { id: 'Davao (DVO)', label: 'Davao (DVO / Francisco Bangoy International Airport)' },
            ].map(a => (
              <button
                key={a.id}
                onClick={() => handleAirportChange(a.id)}
                className={`p-3 rounded-xl border text-left transition-all min-h-[44px] active:scale-95 ${
                  userPrefs.defaultOriginAirport === a.id
                    ? 'border-[#39A96B] bg-[#39A96B]/10 text-[#39A96B]'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xs font-bold block">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Responsible Travel Pledge */}
        <div className="bg-gradient-to-br from-[#087EA4]/10 via-[#39A96B]/10 to-[#FFB84D]/10 rounded-2xl p-4 sm:p-5 border border-[#39A96B]/20 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#39A96B] text-white">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#102A43] dark:text-white font-heading">
                Byahedor Responsible Ecotourism Pledge
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Our community promise to protect Philippine marine reefs, forests, and local cultures
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#0f233a]/80 backdrop-blur-xs border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
            <p className="font-semibold text-[11px] sm:text-xs">
              "As a proud byahedor, I pledge to leave no trace in our islands, never touch marine turtles or fragile coral reefs, use only reef-safe mineral sunscreen, support indigenous and local homestay hosts, and preserve the pristine beauty of the Philippine archipelago for future generations."
            </p>
            <div className="pt-1.5 flex items-center gap-2">
              <input
                type="checkbox"
                id="pledge-chk"
                checked={pledged}
                onChange={(e) => setPledged(e.target.checked)}
                className="w-4 h-4 accent-[#39A96B] rounded-sm"
              />
              <label htmlFor="pledge-chk" className="font-bold text-[#39A96B] cursor-pointer text-xs">
                I honor the Responsible Byahedor Ecotourism Pledge
              </label>
            </div>
          </div>
        </div>

        {/* System & Data Management */}
        <div className="bg-white dark:bg-[#0f233a] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-[#102A43] dark:text-white font-heading">
            Storage & Local Data Cache
          </h3>
          <p className="text-[11px] text-slate-500">
            Clear locally stored trip drafts, checklist selections, and chat records if needed.
          </p>

          <button
            onClick={() => {
              if (window.confirm('Reset all saved trips, checklists, and chat sessions?')) {
                onClearAllData();
              }
            }}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Stored Browser Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
