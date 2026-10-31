import React, { useState, useMemo } from 'react';
import { 
  Wind, 
  Sun, 
  CloudRain, 
  Compass, 
  MapPin, 
  Waves, 
  ShieldAlert, 
  Info, 
  Check, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  PlaneTakeoff, 
  ShieldCheck, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  Anchor, 
  LifeBuoy, 
  ExternalLink,
  ChevronRight,
  Clock,
  Eye,
  Filter
} from 'lucide-react';
import { 
  MonsoonSeason, 
  MONSOON_SEASONS, 
  MONTHLY_CLIMATE_CALENDAR, 
  MonthClimateData, 
  CORONA_CLIMATE_TYPES, 
  CoronaClimateType, 
  COASTAL_SEAS_STATUS, 
  CoastalSeaZone, 
  PCG_ADVISORY_RULES 
} from '../data/climateData';
import { DESTINATIONS } from '../data/destinations';
import { Destination, NavView } from '../types';

interface AmihanClimateViewProps {
  onNavigate: (view: NavView) => void;
  onSelectDestination: (dest: Destination) => void;
  onStartPlanning: (destinationName?: string) => void;
  onStartChat: (initialPrompt?: string) => void;
}

export const AmihanClimateView: React.FC<AmihanClimateViewProps> = ({
  onNavigate,
  onSelectDestination,
  onStartPlanning,
  onStartChat
}) => {
  // Current real-world month (1-indexed: 1 = Jan, 10 = Oct, 11 = Nov)
  const currentMonthNum = useMemo(() => {
    return new Date().getMonth() + 1;
  }, []);

  // Selected state
  const [selectedSeason, setSelectedSeason] = useState<MonsoonSeason>('amihan');
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonthNum);
  const [selectedCoronaType, setSelectedCoronaType] = useState<string>('All');
  const [selectedSeaZone, setSelectedSeaZone] = useState<string>('All');

  // Active month data
  const activeMonthData = useMemo(() => {
    return MONTHLY_CLIMATE_CALENDAR.find(m => m.month === selectedMonth) || MONTHLY_CLIMATE_CALENDAR[0];
  }, [selectedMonth]);

  const activeSeasonData = MONSOON_SEASONS[selectedSeason];

  // Destinations matching current selected season or month
  const matchingDestinations = useMemo(() => {
    return DESTINATIONS.filter(dest => {
      // Corona type filter
      if (selectedCoronaType !== 'All') {
        const typeData = CORONA_CLIMATE_TYPES.find(c => c.type === selectedCoronaType);
        if (typeData) {
          const matchArea = typeData.coveredAreas.some(area => 
            dest.name.toLowerCase().includes(area.toLowerCase()) || 
            dest.location.toLowerCase().includes(area.toLowerCase())
          );
          if (!matchArea) return false;
        }
      }

      // Check if recommended in active month
      const isRecInMonth = activeMonthData.recommended.some(r => 
        dest.name.toLowerCase().includes(r.toLowerCase()) || 
        r.toLowerCase().includes(dest.name.toLowerCase())
      );

      return isRecInMonth || selectedCoronaType !== 'All';
    }).slice(0, 8);
  }, [selectedCoronaType, activeMonthData]);

  // Quick climate AI questions
  const climatePrompts = [
    { label: '🌊 Boracay sea right now?', prompt: 'How calm or wavy is Boracay White Beach right now during Amihan season, and is it good for swimming?' },
    { label: '🛡️ Typhoon-safe islands?', prompt: 'Which Philippine destinations are safest to visit between July and September to avoid tropical storm cancellations?' },
    { label: '🤿 Tubbataha diving window?', prompt: 'Why is Tubbataha Reefs only accessible from March to June, and what liveaboard tips should I know?' },
    { label: '🎒 Cordillera cold weather?', prompt: 'What are the essential packing tips for visiting Baguio and Sagada when temperatures drop during peak Amihan?' }
  ];

  return (
    <div id="byahedor-amihan-climate-view" className="space-y-6 pb-16 w-full animate-fade-in">
      {/* Hero Header with Dynamic Atmospheric Monsoon Canvas */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#087EA4] via-[#0284c7] to-[#39A96B] p-5 sm:p-7 md:p-8 text-white shadow-lg">
        {/* Decorative Wind Vector Trails */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
            <path d="M-50,80 Q200,20 400,120 T850,90" fill="none" stroke="white" strokeWidth="2.5" strokeDasharray="8 6" className="animate-dash" />
            <path d="M-50,180 Q250,120 500,220 T850,190" fill="none" stroke="white" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
            <path d="M-50,280 Q300,220 550,320 T850,290" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 4" className="animate-dash" />
          </svg>
        </div>

        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/25 shadow-2xs">
              <Wind className="w-3.5 h-3.5 text-[#FFB84D] animate-spin-slow" />
              <span>PAGASA Monsoon & Climate Intelligence</span>
            </div>

            {/* Real-time Season Status Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 backdrop-blur-md text-xs font-bold text-white border border-emerald-400/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Current Season: {currentMonthNum >= 10 || currentMonthNum <= 5 ? 'Amihan (Northeast Monsoon)' : 'Habagat (Southwest Monsoon)'}
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight text-white">
              Amihan, Habagat & Archipelago Climate
            </h1>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed mt-1.5 max-w-2xl font-normal">
              The secret to seamless Philippine island travel is timing your destination with the twin monsoons. Discover glass-calm waters on the western seaboard, Pacific surf swells, and Corona climate classifications across 7,641 islands.
            </p>
          </div>

          {/* Quick Action Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('explore')}
              className="px-4 py-2 rounded-xl bg-white text-[#087EA4] hover:bg-slate-50 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4 text-[#087EA4]" />
              <span>View Monsoon Winds on Archipelago Map</span>
            </button>

            <button
              onClick={() => onStartChat("Explain how Amihan and Habagat affect island hopping and boat safety in the Philippines.")}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md border border-white/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#FFB84D]" />
              <span>Ask Byahedor AI About Weather</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. THE 3 PHILIPPINE SEASONS SELECTOR & DEEP DIVE */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#102A43] dark:text-white font-heading flex items-center gap-2">
              <Wind className="w-5 h-5 text-[#087EA4]" />
              <span>The Twin Monsoons & Summer Cycle</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Switch between seasons to understand wind directions, wave characteristics, and prime regions.
            </p>
          </div>
        </div>

        {/* 3 Season Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['amihan', 'habagat', 'tag_init'] as MonsoonSeason[]).map((seasonKey) => {
            const season = MONSOON_SEASONS[seasonKey];
            const isSelected = selectedSeason === seasonKey;

            return (
              <button
                key={seasonKey}
                onClick={() => setSelectedSeason(seasonKey)}
                className={`p-4 rounded-2xl text-left transition-all border cursor-pointer active:scale-[0.99] flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-[#0f233a] border-[#087EA4] ring-2 ring-[#087EA4]/30 shadow-md'
                    : 'bg-white/80 dark:bg-[#0f233a]/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${season.badgeBg}`}>
                      {season.period}
                    </span>
                    {seasonKey === 'amihan' && <Wind className="w-4 h-4 text-[#087EA4]" />}
                    {seasonKey === 'habagat' && <CloudRain className="w-4 h-4 text-[#39A96B]" />}
                    {seasonKey === 'tag_init' && <Sun className="w-4 h-4 text-amber-500" />}
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-[#102A43] dark:text-white font-heading">
                    {season.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-[#087EA4] dark:text-[#4DB8E8] block mb-1">
                    {season.tagalogName}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {season.weatherPattern}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Avg Temp</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{season.averageTemp}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Season Comprehensive Detail Card */}
        <div className="bg-white dark:bg-[#0f233a] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#087EA4] dark:text-[#4DB8E8]">
                  Detailed Season Blueprint
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Wind Vector: <strong>{activeSeasonData.windDirection}</strong>
                </span>
              </div>
              <h3 className="text-xl font-black text-[#102A43] dark:text-white font-heading mt-0.5">
                {activeSeasonData.name} ({activeSeasonData.period})
              </h3>
            </div>

            <button
              onClick={() => onStartPlanning(activeSeasonData.bestRegions[0]?.split('(')[0]?.trim())}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#087EA4] to-[#0A6C8C] hover:from-[#096d8e] hover:to-[#085a75] text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 self-start md:self-auto shrink-0"
            >
              <PlaneTakeoff className="w-3.5 h-3.5" />
              <span>Plan {activeSeasonData.id === 'amihan' ? 'Amihan' : activeSeasonData.id === 'habagat' ? 'Habagat' : 'Summer'} Trip</span>
            </button>
          </div>

          {/* Sea Condition Contrast: Western Seaboard vs. Eastern Pacific */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs text-[#087EA4] dark:text-sky-300">
                <Waves className="w-4 h-4" />
                <span>Western Seaboard (Palawan, Boracay, Batangas)</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                {activeSeasonData.seaStateWest}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs text-[#39A96B] dark:text-emerald-300">
                <Waves className="w-4 h-4" />
                <span>Pacific Seaboard (Siargao, Baler, Bicol, Samar)</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                {activeSeasonData.seaStateEast}
              </p>
            </div>
          </div>

          {/* Recommended Destinations vs Caution Zones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Prime Destinations To Visit Now</span>
              </h4>
              <ul className="space-y-1.5">
                {activeSeasonData.bestRegions.map((region, rIdx) => (
                  <li 
                    key={rIdx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{region}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Areas with Swell or Caution</span>
              </h4>
              <ul className="space-y-1.5">
                {activeSeasonData.cautionRegions.map((caution, cIdx) => (
                  <li 
                    key={cIdx}
                    className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{caution}</span>
                  </li>
                ))}
              </ul>

              {/* Local Travel Advice Box */}
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1">
                <div className="font-bold text-[#102A43] dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFB84D]" />
                  <span>Byahedor Insider Verdict:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  {activeSeasonData.advice}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 12-MONTH INTERACTIVE TRAVEL CALENDAR & MATRIX */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#102A43] dark:text-white font-heading flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#087EA4]" />
              <span>12-Month Philippine Travel Matrix</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pick your target travel month to view rainfall risks, sea conditions, typhoon probability, and curated spots.
            </p>
          </div>
          <span className="text-[11px] font-bold text-[#087EA4] dark:text-[#4DB8E8] bg-sky-50 dark:bg-sky-950/50 px-2.5 py-1 rounded-xl self-start sm:self-auto border border-sky-100 dark:border-sky-900/40">
            Current: {MONTHLY_CLIMATE_CALENDAR.find(m => m.month === currentMonthNum)?.name}
          </span>
        </div>

        {/* 12 Months Horizontal Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
          {MONTHLY_CLIMATE_CALENDAR.map((m) => {
            const isSelected = selectedMonth === m.month;
            const isCurrent = currentMonthNum === m.month;

            return (
              <button
                key={m.month}
                onClick={() => setSelectedMonth(m.month)}
                className={`min-w-[70px] sm:min-w-[80px] p-2.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border active:scale-95 shrink-0 ${
                  isSelected
                    ? 'bg-[#087EA4] text-white border-[#087EA4] shadow-md shadow-[#087EA4]/20'
                    : isCurrent
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-[#087EA4]/40 text-slate-800 dark:text-slate-200'
                    : 'bg-white dark:bg-[#0f233a] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {m.shortName}
                </span>
                <span className={`text-base font-black ${isSelected ? 'text-white' : 'text-[#102A43] dark:text-white'}`}>
                  {m.month.toString().padStart(2, '0')}
                </span>
                <span className={`text-[9px] font-bold mt-0.5 truncate max-w-[65px] ${
                  isSelected ? 'text-white/90' : m.season === 'amihan' ? 'text-[#087EA4]' : m.season === 'tag_init' ? 'text-amber-500' : 'text-[#39A96B]'
                }`}>
                  {m.season === 'amihan' ? 'Amihan' : m.season === 'tag_init' ? 'Summer' : 'Habagat'}
                </span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Month Dashboard Inspector */}
        <div className="bg-white dark:bg-[#0f233a] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black text-[#102A43] dark:text-white font-heading">
                  {activeMonthData.name} Travel Forecast
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#087EA4]/10 text-[#087EA4] dark:text-[#4DB8E8]">
                  {activeMonthData.seasonLabel}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {activeMonthData.verdict}
              </p>
            </div>

            {/* Packing tip pill */}
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 max-w-sm text-xs text-amber-900 dark:text-amber-200 shrink-0">
              <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-800 dark:text-amber-300">
                🎒 What to Pack in {activeMonthData.name}:
              </span>
              <span className="text-[11px] leading-relaxed">{activeMonthData.packingTip}</span>
            </div>
          </div>

          {/* 4 Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Sea Condition
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: activeMonthData.seaRatingColor }} 
                />
                <span className="text-xs font-black text-[#102A43] dark:text-white">
                  {activeMonthData.seaRoughness}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Typhoon Risk
              </span>
              <span className={`text-xs font-black mt-0.5 block ${
                activeMonthData.typhoonRisk === 'High' ? 'text-rose-500' : activeMonthData.typhoonRisk === 'Moderate' ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {activeMonthData.typhoonRisk}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Rainfall Level
              </span>
              <span className="text-xs font-black text-[#102A43] dark:text-white mt-0.5 block">
                {activeMonthData.rainfall}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Temperature Range
              </span>
              <span className="text-xs font-black text-[#087EA4] dark:text-[#4DB8E8] mt-0.5 block">
                {activeMonthData.tempRange}
              </span>
            </div>
          </div>

          {/* Recommended destinations for this month */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Top Recommended Philippine Islands for {activeMonthData.name}:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeMonthData.recommended.map((recName, idx) => {
                const matchedDest = DESTINATIONS.find(d => 
                  d.name.toLowerCase().includes(recName.toLowerCase()) || 
                  recName.toLowerCase().includes(d.name.toLowerCase())
                );

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (matchedDest) {
                        onSelectDestination(matchedDest);
                      } else {
                        onStartPlanning(recName);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#087EA4] dark:text-[#4DB8E8] font-bold text-xs border border-sky-200/70 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{recName}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. COASTAL SEA ZONES & SWELL MONITOR */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#102A43] dark:text-white font-heading flex items-center gap-2">
              <Waves className="w-5 h-5 text-[#087EA4]" />
              <span>Coastal Sea Swell & Diving/Surfing Ratings</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Wave conditions across the four major Philippine marine bodies under seasonal monsoons.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {COASTAL_SEAS_STATUS.map((zone, zIdx) => (
            <div
              key={zIdx}
              className="bg-white dark:bg-[#0f233a] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-sm text-[#102A43] dark:text-white font-heading">
                    {zone.name}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {zone.currentStatus}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
                    <span className="font-bold text-[#087EA4] block text-[10px] uppercase tracking-wider mb-0.5">
                      During Amihan (Nov – May):
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 leading-snug text-[11px]">
                      {zone.amihanState}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
                    <span className="font-bold text-[#39A96B] block text-[10px] uppercase tracking-wider mb-0.5">
                      During Habagat (Jun – Oct):
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 leading-snug text-[11px]">
                      {zone.habagatState}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Diving Quality</span>
                  <span className="font-extrabold text-[#39A96B]">{zone.divingRating}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Surfing Waves</span>
                  <span className="font-extrabold text-[#FFB84D]">{zone.surfingRating}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Key Hubs</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-[130px] block">
                    {zone.topIslands[0]}, {zone.topIslands[1]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. PAGASA CORONA CLIMATE CLASSIFICATION MAP & EXPLAINER */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#102A43] dark:text-white font-heading flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#087EA4]" />
            <span>PAGASA Corona Climate Classifications (Types I – IV)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The Philippines does not have a single uniform weather pattern. Learn how mountain ranges divide the country into four distinct climate zones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CORONA_CLIMATE_TYPES.map((c) => {
            const isSelected = selectedCoronaType === c.type;

            return (
              <button
                key={c.type}
                onClick={() => setSelectedCoronaType(isSelected ? 'All' : c.type)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
                  isSelected
                    ? 'bg-white dark:bg-[#0f233a] border-[#087EA4] ring-2 ring-[#087EA4]/30 shadow-md'
                    : 'bg-white/80 dark:bg-[#0f233a]/80 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-xs font-black text-white" 
                      style={{ backgroundColor: c.color }}
                    >
                      {c.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {isSelected ? 'Filtering Active' : 'Click to filter'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-xs sm:text-sm text-[#102A43] dark:text-white font-heading mb-1">
                    {c.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#087EA4] dark:text-[#4DB8E8] mb-1.5">
                    {c.seasons}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mb-2">
                    {c.rainPattern}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] space-y-1">
                  <span className="font-bold text-slate-400 block uppercase">Key Coverage:</span>
                  <div className="flex flex-wrap gap-1">
                    {c.coveredAreas.slice(0, 3).map((area, aIdx) => (
                      <span key={aIdx} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. PHILIPPINE COAST GUARD (PCG) & SEA SAFETY ADVISORIES */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 relative overflow-hidden space-y-4">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Philippine Coast Guard (PCG) Sea Travel Protocols</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
            Golden Sea Rules: Avoiding Stranded Ferry Crossings
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Fastcraft ferries (OceanJet, SuperCat, Montenegro) and motorized bancas operate strictly under Philippine Coast Guard regulations. Always master these 3 crucial island survival strategies:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {PCG_ADVISORY_RULES.map((rule, rIdx) => (
              <div 
                key={rIdx}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5 text-xs"
              >
                <div className="flex items-center gap-1.5 text-[#FFB84D] font-bold">
                  <Anchor className="w-3.5 h-3.5" />
                  <span>{rule.signal}</span>
                </div>
                <h4 className="font-bold text-white text-xs leading-snug">
                  {rule.rule}
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                  {rule.description}
                </p>
                <div className="pt-1 text-[10px] text-emerald-400 font-semibold">
                  Action: {rule.action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subtle decorative background art */}
        <div className="absolute right-0 bottom-0 top-0 w-1/4 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
          <LifeBuoy className="w-48 h-48 text-white" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. AI WEATHER ASSISTANT QUICK LAUNCH */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-sky-50 to-emerald-50/60 dark:from-slate-800/80 dark:to-slate-850/80 rounded-3xl p-5 border border-sky-200/60 dark:border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#087EA4] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-[#FFB84D]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#102A43] dark:text-white font-heading">
                Need Specific Weather Advice for Your Trip?
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ask our AI assistant about boat schedules, wave swells, and monsoon timing.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {climatePrompts.map((cp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onStartChat(cp.prompt)}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-sky-50/60 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-left transition-all flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs group"
            >
              <span>{cp.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#087EA4] group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
