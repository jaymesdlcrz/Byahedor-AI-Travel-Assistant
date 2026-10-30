import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Compass, 
  Star, 
  TrendingUp, 
  PlaneTakeoff, 
  ShieldCheck,
  Palmtree,
  Wallet,
  LogIn,
  CloudCheck,
  Sun,
  Moon,
  Menu
} from 'lucide-react';
import { Destination, NavView } from '../types';
import { DESTINATIONS } from '../data/destinations';
import { useAuth } from '../firebase/context';

interface HomeDashboardProps {
  onNavigate: (view: NavView) => void;
  onSelectDestination: (dest: Destination) => void;
  onStartPlanning: (destinationName?: string) => void;
  onStartChat: (initialPrompt?: string) => void;
  savedTripIds: string[];
  onToggleSaveDestination?: (destId: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onSelectDestination,
  onStartPlanning,
  onStartChat,
  darkMode,
  onToggleDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser, openAuthModal } = useAuth();

  const quickPrompts = [
    { label: '✈️ Plan my trip', query: 'Plan a 4-day tropical itinerary for Siargao with surf lessons and island hopping' },
    { label: '📍 Find destination', query: 'What are the top hidden gem destinations in the Philippines for nature and waterfalls?' },
    { label: '💰 Under ₱8k budget', query: 'How can I do a 3-day Cebu trip for under ₱8,000 PHP per person?' },
    { label: '🏝️ Peaceful beach', query: 'Recommend a peaceful beach destination with white sand and great local food' },
    { label: '🍜 Local food', query: 'What are the must-try regional Filipino dishes and where is the best place to eat them?' },
    { label: '🎒 Island packing', query: 'What is the ultimate packing checklist for a 5-day Palawan island hopping trip?' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onStartChat(searchQuery);
  };

  const featuredDestinations = DESTINATIONS.slice(0, 4);

  return (
    <div id="byahedor-home-dashboard" className="space-y-5 pb-8 w-full">
      {/* Hero Banner with Philippines Gradient Canvas */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#087EA4] via-[#0284c7] to-[#39A96B] p-4 sm:p-6 md:p-7 text-white shadow-md">
        {/* Subtle decorative travel trajectory overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,20 50,50 T100,50" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="25" cy="35" r="2" fill="#FFB84D" />
            <circle cx="75" cy="65" r="2" fill="#FFB84D" />
          </svg>
        </div>

        <div className="relative z-10 space-y-2.5 sm:space-y-3">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="max-w-3xl space-y-2.5 sm:space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] sm:text-[11px] font-bold text-white/95 border border-white/20">
                  <Sparkles className="w-3 h-3 text-[#FFB84D]" />
                  <span>Mabuhay! Your Intelligent Philippine Travel Companion</span>
                </div>

                {currentUser ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/25 backdrop-blur-md text-[10px] sm:text-[11px] font-bold text-white border border-emerald-400/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Hi, {currentUser.displayName || currentUser.email?.split('@')[0]}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-[10px] sm:text-[11px] font-bold text-white border border-white/25 transition-all cursor-pointer active:scale-95"
                  >
                    <LogIn className="w-3 h-3 text-[#FFB84D]" />
                    <span>Sign In (Google Sync)</span>
                  </button>
                )}
              </div>

              <h1 className="text-fluid-hero font-extrabold font-heading tracking-tight text-white">
                Where will your next <span className="text-[#FFB84D]">journey</span> take you?
              </h1>

              <p className="text-fluid-subtitle text-white/90 font-normal leading-relaxed">
                Let Byahedor help you plan the perfect escape with personalized itineraries, real budgets in ₱, and local secrets.
              </p>
            </div>

            {/* Quick Dashboard Controls on Desktop Screens */}
            {onToggleDarkMode && (
              <div className="hidden lg:flex items-center gap-2 shrink-0 pt-0.5">
                <button
                  type="button"
                  onClick={onToggleDarkMode}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-xs group border backdrop-blur-md ${
                    darkMode
                      ? 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border-amber-300/40 shadow-amber-400/10'
                      : 'bg-white/20 hover:bg-white/30 text-white border-white/25 shadow-black/10'
                  }`}
                  title={darkMode ? "Switch to Light Mode (Daylight)" : "Switch to Dark Mode (Twilight)"}
                  aria-label="Toggle Dark Mode"
                >
                  {darkMode ? (
                    <Sun className="w-4.5 h-4.5 text-amber-300 fill-amber-300/25 transition-transform duration-300 group-hover:rotate-45" />
                  ) : (
                    <Moon className="w-4.5 h-4.5 text-white transition-transform duration-300 group-hover:-rotate-12" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('destinations')}
                  className="h-10 px-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/25 backdrop-blur-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-xs"
                  title="Explore Destinations Menu"
                  aria-label="Destinations Menu"
                >
                  <Compass className="w-4 h-4 text-[#FFB84D]" />
                  <span>Explore</span>
                </button>
              </div>
            )}
          </div>

          {/* AI Search & Input Box */}
          <form 
            onSubmit={handleSearchSubmit}
            className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-stretch gap-2 bg-white dark:bg-[#0f233a] p-1.5 sm:p-2 rounded-xl shadow-md border border-white/40 dark:border-slate-700"
          >
            <div className="flex-1 flex items-center gap-2 px-2 min-h-[40px]">
              <Search className="w-4 h-4 text-[#087EA4] shrink-0" />
              <input
                type="text"
                id="home-ai-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask Byahedor anything... (e.g. 3-day Boracay, ₱10k budget)"
                className="w-full bg-transparent border-none outline-none text-[#102A43] dark:text-white placeholder-[#9FB3C8] text-xs sm:text-sm font-medium py-1"
              />
            </div>

            <button
              type="submit"
              id="home-ai-ask-btn"
              className="min-h-[40px] flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#087EA4] hover:brightness-110 text-white font-bold text-xs shadow-xs transition-all shrink-0 active:scale-95"
            >
              <span>Search</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FFB84D]" />
            </button>
          </form>

          {/* Quick Prompts Chips with clean wrapping so no chip is cut off */}
          <div className="pt-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold text-white/90 block mb-1.5 tracking-wide">
              Quick Inspiration:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onStartChat(p.query)}
                  className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/25 hover:border-white/50 transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer shadow-2xs"
                >
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Value Pillars Cards (1 col on mobile, 2 on small tablet, 4 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div 
          onClick={() => onNavigate('planner')}
          className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0f233a] border border-[#E4E9F0] dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer group active:scale-[0.98]"
        >
          <div className="w-8 h-8 rounded-lg bg-[#087EA4]/10 dark:bg-[#087EA4]/20 text-[#087EA4] dark:text-[#4DB8E8] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <PlaneTakeoff className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-[#102A43] dark:text-white text-xs sm:text-sm font-heading">Smart Trip Planner</h3>
          <p className="text-[10px] sm:text-[11px] text-[#627D98] dark:text-slate-400 mt-0.5 leading-snug">
            Build day-by-day itineraries with morning, afternoon, and evening timelines in seconds.
          </p>
        </div>

        <div 
          onClick={() => onNavigate('budget')}
          className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0f233a] border border-[#E4E9F0] dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer group active:scale-[0.98]"
        >
          <div className="w-8 h-8 rounded-lg bg-[#39A96B]/10 dark:bg-[#39A96B]/20 text-[#39A96B] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-[#102A43] dark:text-white text-xs sm:text-sm font-heading">Peso Budget Tracker</h3>
          <p className="text-[10px] sm:text-[11px] text-[#627D98] dark:text-slate-400 mt-0.5 leading-snug">
            Dynamic cost calculations for transpo, stay, food, activities, and emergency buffers.
          </p>
        </div>

        <div 
          onClick={() => onNavigate('food')}
          className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0f233a] border border-[#E4E9F0] dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer group active:scale-[0.98]"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Palmtree className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-[#102A43] dark:text-white text-xs sm:text-sm font-heading">Local Culinary Guide</h3>
          <p className="text-[10px] sm:text-[11px] text-[#627D98] dark:text-slate-400 mt-0.5 leading-snug">
            Authentic regional specialties from Cebu Lechon to Palawan Chao Long and street food tips.
          </p>
        </div>

        <div 
          onClick={() => onNavigate('checklist')}
          className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0f233a] border border-[#E4E9F0] dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer group active:scale-[0.98]"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-[#102A43] dark:text-white text-xs sm:text-sm font-heading">Smart Packing Checklist</h3>
          <p className="text-[10px] sm:text-[11px] text-[#627D98] dark:text-slate-400 mt-0.5 leading-snug">
            AI-tailored essentials for island weather, boat transfers, and outdoor gear requirements.
          </p>
        </div>
      </div>

      {/* Featured Destinations Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-fluid-title font-bold text-[#102A43] dark:text-white font-heading">
              Trending Philippine Escapes
            </h2>
            <p className="text-[11px] sm:text-xs text-[#627D98] dark:text-slate-400">
              Handcrafted destinations curated by local travelers & AI recommendations
            </p>
          </div>

          <button
            onClick={() => onNavigate('destinations')}
            className="flex items-center gap-1 text-xs font-bold text-[#087EA4] dark:text-[#4DB8E8] hover:underline p-1 min-h-[36px]"
          >
            <span>See all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1 col on small phones, 2 col on tablet/large mobile, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {featuredDestinations.map((dest) => (
            <div
              key={dest.id}
              id={`destination-card-${dest.id}`}
              className="bg-white dark:bg-[#0f233a] rounded-2xl overflow-hidden border border-[#E4E9F0] dark:border-slate-800 shadow-2xs hover:shadow-sm transition-all group flex flex-col"
            >
              {/* Image Header with Responsive Aspect Ratio */}
              <div className="relative h-40 sm:h-36 overflow-hidden">
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/4/45/Cloud_9_Boardwalk%2C_Siargao.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                
                {/* Region Tag */}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#39A96B] text-white text-[9px] font-bold uppercase tracking-wider">
                  {dest.region}
                </span>

                {/* Rating */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/90 dark:bg-black/80 backdrop-blur-md text-amber-500 text-[10px] sm:text-[11px] font-bold shadow-2xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[#102A43] dark:text-white">{dest.rating}</span>
                </div>

                {/* Bottom title on image */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <h3 className="font-bold text-sm sm:text-base font-heading drop-shadow-xs leading-tight">{dest.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-white/90 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#FFB84D] shrink-0" />
                    <span className="truncate">{dest.location}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
                <p className="text-[11px] text-[#486581] dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>

                <div className="pt-2 border-t border-[#E4E9F0] dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-[#9FB3C8] block text-[9px] uppercase tracking-wider">Est. Daily</span>
                    <span className="font-bold text-[#087EA4] dark:text-[#4DB8E8]">
                      ₱{dest.estimatedDailyBudgetPHP.toLocaleString()} / day
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[#9FB3C8] block text-[9px] uppercase tracking-wider">Duration</span>
                    <span className="font-semibold text-[#102A43] dark:text-slate-300">
                      {dest.idealDurationDays} Days
                    </span>
                  </div>
                </div>

                {/* Action Buttons with 40px+ touch targets */}
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <button
                    onClick={() => onSelectDestination(dest)}
                    className="w-full min-h-[38px] py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors text-center active:scale-95"
                  >
                    Explore
                  </button>

                  <button
                    onClick={() => onStartPlanning(dest.name)}
                    className="w-full min-h-[38px] py-1.5 px-2 rounded-lg bg-[#087EA4] hover:bg-[#076c8c] text-white text-xs font-bold transition-colors text-center flex items-center justify-center gap-1 shadow-2xs active:scale-95"
                  >
                    <span>Plan Trip</span>
                    <PlaneTakeoff className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Archipelago Highlights Banner */}
      <div className="rounded-2xl bg-slate-900 text-white p-4 sm:p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#4DB8E8] uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>7,641 Islands To Explore</span>
          </div>

          <h3 className="text-fluid-title font-extrabold font-heading">
            From the Cordillera Mountains to the Sulu Sea
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Whether you are dreaming of surfing Cloud 9 in Siargao, exploring the underground river of Puerto Princesa, hiking the UNESCO rice terraces of Banaue, or tasting authentic Bacolod Inasal, Byahedor connects every island route.
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('explore')}
              className="min-h-[40px] px-3.5 py-2 rounded-lg bg-[#4DB8E8] hover:bg-[#38a9d8] text-[#102A43] font-bold text-xs transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Archipelago Map</span>
            </button>

            <button
              onClick={() => onStartChat("Give me 5 incredible off-the-beaten-path Philippine travel destinations")}
              className="min-h-[40px] px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all border border-white/20 active:scale-95"
            >
              <span>Discover Secret Spots</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative archipelago background art */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none hidden md:flex items-center justify-center">
          <Palmtree className="w-36 h-36 text-[#39A96B]" />
        </div>
      </div>
    </div>
  );
};
