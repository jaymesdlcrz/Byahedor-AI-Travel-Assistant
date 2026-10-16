import React, { useState, useEffect } from 'react';
import { 
  PlaneTakeoff, 
  MapPin, 
  Calendar, 
  Users, 
  Wallet, 
  Sparkles, 
  Check, 
  Clock, 
  Coffee, 
  Compass, 
  Utensils, 
  Camera, 
  Moon, 
  Bookmark, 
  Share2, 
  Download, 
  RotateCcw,
  AlertCircle,
  Lightbulb,
  DollarSign
} from 'lucide-react';
import { TripPlan, Destination, DayPlan } from '../types';
import { DESTINATIONS } from '../data/destinations';
import confetti from 'canvas-confetti';

interface TripPlannerViewProps {
  initialDestination?: string;
  onSaveTrip: (trip: TripPlan) => void;
  savedTripIds: string[];
  onOpenInChat: (prompt: string) => void;
}

export const TripPlannerView: React.FC<TripPlannerViewProps> = ({
  initialDestination = '',
  onSaveTrip,
  savedTripIds,
  onOpenInChat,
}) => {
  const [destination, setDestination] = useState(initialDestination);
  const [origin, setOrigin] = useState('Manila (MNL)');
  const [departureDate, setDepartureDate] = useState('2026-09-15');
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(15000);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Relaxation', 'Food']);
  const [customNotes, setCustomNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialDestination]);

  const travelStyleOptions = [
    { id: 'Relaxation', label: '🏖️ Relaxation' },
    { id: 'Adventure', label: '🏔️ Adventure' },
    { id: 'Culture', label: '🏛️ Culture' },
    { id: 'Food', label: '🍜 Food & Dining' },
    { id: 'Photography', label: '📸 Photography' },
    { id: 'Shopping', label: '🛍️ Shopping' },
    { id: 'Nature', label: '🌿 Nature & Wildlife' },
  ];

  const toggleStyle = (styleId: string) => {
    if (selectedStyles.includes(styleId)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== styleId));
    } else {
      setSelectedStyles([...selectedStyles, styleId]);
    }
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setErrorMsg('Please specify a destination.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          origin,
          departureDate,
          days,
          travelers,
          budget,
          travelStyles: selectedStyles,
          customNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate trip plan from Byahedor AI.');
      }

      const data = await response.json();
      if (data.plan) {
        const fullPlan: TripPlan = {
          ...data.plan,
          id: `trip-${Date.now()}`,
          destination,
          origin,
          departureDate,
          days: Number(days),
          travelers: Number(travelers),
          totalBudget: Number(budget),
          savedAt: new Date().toISOString(),
          coverImage: DESTINATIONS.find(d => d.name.toLowerCase().includes(destination.toLowerCase()))?.heroImage || 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
        };
        setCurrentPlan(fullPlan);
        setActiveDayIndex(0);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not connect to AI service. Using instant smart itinerary model.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCurrentTrip = () => {
    if (!currentPlan) return;
    onSaveTrip(currentPlan);
    setSavedSuccess(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleExportText = () => {
    if (!currentPlan) return;
    let exportText = `✈️ BYAHEDOR ITINERARY: ${currentPlan.title}\n`;
    exportText += `📍 Destination: ${currentPlan.destination} | 👥 Travelers: ${currentPlan.travelers} | 📅 Days: ${currentPlan.days}\n`;
    exportText += `💰 Total Budget: ₱${currentPlan.totalBudget.toLocaleString()} PHP\n\n`;
    exportText += `--- OVERVIEW ---\n${currentPlan.overview}\n\n`;
    
    currentPlan.daysPlan.forEach((d) => {
      exportText += `\n📅 DAY ${d.dayNumber}: ${d.theme}\n`;
      d.activities.forEach((act) => {
        exportText += `• ${act.time} - ${act.activity} (${act.location}) | ~₱${act.estimatedCostPHP} (${act.duration})\n`;
      });
    });

    exportText += `\n--- LOCAL INSIDER TIPS ---\n`;
    currentPlan.localTips.forEach((tip) => {
      exportText += `• ${tip}\n`;
    });

    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Byahedor_${currentPlan.destination.replace(/\s+/g, '_')}_Plan.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isSaved = currentPlan ? savedTripIds.includes(currentPlan.id) : false;

  return (
    <div id="byahedor-trip-planner-view" className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#087EA4]/10 dark:bg-[#087EA4]/20 text-[#087EA4] dark:text-[#4DB8E8] text-[11px] font-bold mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>AI Journey Architect</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] dark:text-white font-heading">
            Personalized Trip Planner
          </h1>
          <p className="text-xs text-[#627D98] dark:text-slate-400">
            Tell Byahedor your preferences and let our AI craft a detailed day-by-day itinerary with budget breakdowns.
          </p>
        </div>
      </div>

      {/* Planner Form Container */}
      <div className="bg-white dark:bg-[#0f233a] rounded-2xl p-4 sm:p-6 border border-[#E4E9F0] dark:border-slate-800 shadow-xs">
        <form onSubmit={handleGeneratePlan} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* Where are you going? */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#102A43] dark:text-slate-200">
                Where are you going? <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-3.5 h-3.5 text-[#087EA4] absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  id="planner-destination-input"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Siargao, El Nido, Batanes, Cebu"
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-[#E4E9F0] dark:border-slate-700 text-xs sm:text-sm font-medium text-[#102A43] dark:text-white placeholder-[#9FB3C8] focus:ring-2 focus:ring-[#087EA4] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Where are you coming from? */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#102A43] dark:text-slate-200">
                Where are you coming from?
              </label>
              <div className="relative flex items-center">
                <Compass className="w-3.5 h-3.5 text-[#39A96B] absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  id="planner-origin-input"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Manila, Clark, Cebu, Davao"
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-[#E4E9F0] dark:border-slate-700 text-xs sm:text-sm font-medium text-[#102A43] dark:text-white placeholder-[#9FB3C8] focus:ring-2 focus:ring-[#087EA4] focus:outline-none"
                />
              </div>
            </div>

            {/* When are you traveling? */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#102A43] dark:text-slate-200">
                When are you traveling?
              </label>
              <div className="relative flex items-center">
                <Calendar className="w-3.5 h-3.5 text-amber-500 absolute left-3 pointer-events-none" />
                <input
                  type="date"
                  id="planner-date-input"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-[#E4E9F0] dark:border-slate-700 text-xs sm:text-sm font-medium text-[#102A43] dark:text-white focus:ring-2 focus:ring-[#087EA4] focus:outline-none"
                />
              </div>
            </div>

            {/* How many days? */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#102A43] dark:text-slate-200">
                How many days? ({days} Days)
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="range"
                  id="planner-days-range"
                  min={1}
                  max={14}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="flex-1 accent-[#087EA4]"
                />
                <span className="w-10 text-center text-xs font-bold bg-slate-100 dark:bg-slate-800 py-1 px-1.5 rounded text-[#087EA4] dark:text-[#4DB8E8]">
                  {days}d
                </span>
              </div>
            </div>

            {/* How many travelers? */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#102A43] dark:text-slate-200">
                How many travelers? ({travelers} {travelers === 1 ? 'Person' : 'People'})
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="range"
                  id="planner-travelers-range"
                  min={1}
                  max={10}
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="flex-1 accent-[#39A96B]"
                />
                <span className="w-10 text-center text-xs font-bold bg-slate-100 dark:bg-slate-800 py-1 px-1.5 rounded text-[#39A96B]">
                  {travelers}p
                </span>
              </div>
            </div>

            {/* What's your budget? */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#102A43] dark:text-slate-200">
                Total budget? (₱{budget.toLocaleString()} PHP)
              </label>
              <div className="relative flex items-center">
                <span className="text-amber-500 font-bold text-xs absolute left-3">₱</span>
                <input
                  type="number"
                  id="planner-budget-input"
                  min={3000}
                  step={1000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-[#E4E9F0] dark:border-slate-700 text-xs sm:text-sm font-medium text-[#102A43] dark:text-white placeholder-[#9FB3C8] focus:ring-2 focus:ring-[#087EA4] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Travel Style Chips */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold text-[#102A43] dark:text-slate-200">
              Travel Style & Vibe:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {travelStyleOptions.map((opt) => {
                const isSelected = selectedStyles.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleStyle(opt.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#087EA4] text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-[#486581] dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              id="planner-submit-btn"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#087EA4] via-[#0284c7] to-[#39A96B] hover:opacity-95 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Byahedor is crafting your journey...</span>
                </>
              ) : (
                <>
                  <span>Create My Journey ✈️</span>
                  <Sparkles className="w-4 h-4 text-[#FFB84D]" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Itinerary Display */}
      {currentPlan && (
        <div id="generated-trip-itinerary" className="space-y-4 animate-fade-in">
          {/* Trip Header Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-md">
            <img
              src={currentPlan.coverImage}
              alt={currentPlan.destination}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10 p-5 sm:p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#4DB8E8] bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-[#FFB84D]" />
                  <span>{currentPlan.destination}</span>
                  <span>•</span>
                  <span>{currentPlan.days} Days / {currentPlan.travelers} Travelers</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  <button
                    onClick={handleSaveCurrentTrip}
                    id="save-trip-btn"
                    className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 ${
                      savedSuccess || isSaved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{savedSuccess ? 'Saved!' : isSaved ? 'Saved' : 'Save Trip'}</span>
                  </button>

                  <button
                    onClick={handleExportText}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all flex items-center justify-center gap-1 active:scale-95"
                    title="Export Itinerary as Text File"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>

                  <button
                    onClick={() => onOpenInChat(`Modify this ${currentPlan.days}-day itinerary for ${currentPlan.destination}: `)}
                    className="flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FFB84D] hover:bg-[#ffa929] text-[#102A43] transition-all flex items-center justify-center gap-1 active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Modify</span>
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold font-heading">
                  {currentPlan.title}
                </h2>
                <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
                  {currentPlan.overview}
                </p>
              </div>

              {/* Quick Trip Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                  <span className="text-[9px] text-slate-400 block uppercase">Est. Total Budget</span>
                  <span className="text-xs font-bold text-[#FFB84D]">
                    ₱{currentPlan.totalBudget.toLocaleString()} PHP
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                  <span className="text-[9px] text-slate-400 block uppercase">Daily per Pax</span>
                  <span className="text-xs font-bold text-[#4DB8E8]">
                    ₱{Math.round(currentPlan.totalBudget / (currentPlan.days * currentPlan.travelers)).toLocaleString()} / day
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                  <span className="text-[9px] text-slate-400 block uppercase">Departure</span>
                  <span className="text-xs font-bold text-white">
                    {currentPlan.origin || 'Manila'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                  <span className="text-[9px] text-slate-400 block uppercase">Vibe</span>
                  <span className="text-xs font-bold text-[#39A96B]">
                    {selectedStyles.slice(0, 2).join(' & ') || 'Relaxation'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Breakdown Card */}
          <div className="bg-white dark:bg-[#0f233a] rounded-2xl p-4 sm:p-5 border border-[#E4E9F0] dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#102A43] dark:text-white font-heading flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-[#087EA4]" />
              <span>Smart Budget Allocation Breakdown</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">Transportation</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                  ₱{currentPlan.budgetBreakdown.transportation.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Flights / Ferries / Tricycles</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">Accommodation</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                  ₱{currentPlan.budgetBreakdown.accommodation.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Homestay / Resort</span>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">Food & Dining</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                  ₱{currentPlan.budgetBreakdown.food.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Boodle Fights / Carinderias</span>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30">
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block">Activities & Tours</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                  ₱{currentPlan.budgetBreakdown.activities.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Island Hopping & Guides</span>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block">Emergency Buffer</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                  ₱{currentPlan.budgetBreakdown.emergency.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Medical / Delays Reserve</span>
              </div>
            </div>
          </div>

          {/* Day-by-Day Itinerary Tabs */}
          <div className="bg-white dark:bg-[#0f233a] rounded-2xl p-4 sm:p-5 border border-[#E4E9F0] dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#102A43] dark:text-white font-heading">
                  Day-by-Day Schedule
                </h3>
                <p className="text-[11px] text-[#627D98] dark:text-slate-400">
                  Interactive timeline with morning, afternoon, and evening activities
                </p>
              </div>

              {/* Day Tab Selectors */}
              <div className="flex gap-1.5 overflow-x-auto py-1 no-scrollbar">
                {currentPlan.daysPlan.map((d, index) => (
                  <button
                    key={d.dayNumber}
                    onClick={() => setActiveDayIndex(index)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 min-h-[34px] active:scale-95 ${
                      activeDayIndex === index
                        ? 'bg-[#087EA4] text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-[#486581] dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Day {d.dayNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Day Content */}
            {currentPlan.daysPlan[activeDayIndex] && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#087EA4]/5 dark:bg-[#087EA4]/15 border border-[#087EA4]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#087EA4] dark:text-[#4DB8E8] uppercase tracking-wider block">
                      Day {currentPlan.daysPlan[activeDayIndex].dayNumber} Theme
                    </span>
                    <h4 className="font-bold text-sm text-[#102A43] dark:text-white font-heading">
                      {currentPlan.daysPlan[activeDayIndex].theme}
                    </h4>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-2.5 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {currentPlan.daysPlan[activeDayIndex].activities.map((activity, aIdx) => (
                    <div
                      key={aIdx}
                      className="relative pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 transition-all group"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-2.5 top-3.5 w-3.5 h-3.5 rounded-full bg-[#087EA4] border-2 border-white dark:border-[#0f233a] shadow-2xs" />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-[#087EA4] dark:text-[#4DB8E8] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700">
                            {activity.time}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.duration}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#39A96B]" />
                            {activity.location}
                          </span>
                          <span className="font-bold text-[#39A96B] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            ~₱{activity.estimatedCostPHP}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-[#102A43] dark:text-slate-200 leading-snug">
                        {activity.activity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Local Insider Tips Section */}
          {currentPlan.localTips && currentPlan.localTips.length > 0 && (
            <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/30 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 font-heading flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Byahedor Insider Tips & Safety Notes</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-amber-900/90 dark:text-amber-200/90">
                {currentPlan.localTips.map((tip, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
