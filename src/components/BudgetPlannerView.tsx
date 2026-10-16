import React, { useState } from 'react';
import { 
  Wallet, 
  Sparkles, 
  TrendingDown, 
  ArrowDownRight, 
  CheckCircle2, 
  Plane, 
  Hotel, 
  Utensils, 
  Ticket, 
  ShieldAlert, 
  AlertTriangle,
  Lightbulb,
  Sliders,
  DollarSign
} from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';

interface BudgetPlannerViewProps {
  onStartPlanningWithBudget: (destination: string, budget: number) => void;
}

export const BudgetPlannerView: React.FC<BudgetPlannerViewProps> = ({
  onStartPlanningWithBudget
}) => {
  const [destination, setDestination] = useState('Siargao Island');
  const [days, setDays] = useState(4);
  const [travelers, setTravelers] = useState(2);
  const [totalBudget, setTotalBudget] = useState(18000);
  
  // Custom slider percentage overrides
  const [transpoRatio, setTranspoRatio] = useState(25);
  const [accomRatio, setAccomRatio] = useState(35);
  const [foodRatio, setFoodRatio] = useState(20);
  const [actRatio, setActRatio] = useState(15);
  const [emergRatio, setEmergRatio] = useState(5);

  const [optimizing, setOptimizing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[] | null>(null);

  // Calculate actual amounts
  const transpoCost = Math.round((totalBudget * transpoRatio) / 100);
  const accomCost = Math.round((totalBudget * accomRatio) / 100);
  const foodCost = Math.round((totalBudget * foodRatio) / 100);
  const actCost = Math.round((totalBudget * actRatio) / 100);
  const emergCost = Math.round((totalBudget * emergRatio) / 100);

  const dailyPerPerson = Math.round(totalBudget / (days * travelers));

  // Benchmark recommendation based on destination
  const matchedDest = DESTINATIONS.find(d => d.name.toLowerCase().includes(destination.toLowerCase()));
  const benchmarkDaily = matchedDest ? matchedDest.estimatedDailyBudgetPHP : 3000;
  const benchmarkTotal = benchmarkDaily * days * travelers;
  const isUnderBenchmark = totalBudget < benchmarkTotal;
  const budgetDifference = Math.abs(totalBudget - benchmarkTotal);

  const handleGetAiSwaps = async () => {
    setOptimizing(true);
    try {
      const res = await fetch('/api/budget-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          days,
          travelers,
          currentBudget: benchmarkTotal,
          targetBudget: totalBudget,
        }),
      });
      const data = await res.json();
      if (data.suggestions) {
        setAiSuggestions(data.suggestions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div id="byahedor-budget-planner-view" className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#39A96B]/10 dark:bg-[#39A96B]/20 text-[#39A96B] text-[11px] font-bold mb-1.5">
          <Wallet className="w-3 h-3" />
          <span>Interactive Peso (₱) Cost Optimizer</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] dark:text-white font-heading">
          Budget Planner & Smart Cost Swaps
        </h1>
        <p className="text-xs text-[#627D98] dark:text-slate-400">
          Simulate real travel expenses across transportation, lodging, boodle fights, and island tours with AI savings hacks.
        </p>
      </div>

      {/* Main Budget Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Input Parameters */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0f233a] rounded-2xl p-4 sm:p-5 border border-[#E4E9F0] dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#102A43] dark:text-white font-heading flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#087EA4]" />
            <span>Trip Parameters</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] dark:text-slate-300 mb-1">
                Destination Focus
              </label>
              <select
                id="budget-destination-select"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full py-2 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-[#E4E9F0] dark:border-slate-700 text-xs font-medium text-[#102A43] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#087EA4]"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.name}>{d.name} ({d.region})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] dark:text-slate-300 mb-1">
                  Duration ({days} Days)
                </label>
                <input
                  type="range"
                  min={1}
                  max={14}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full accent-[#087EA4]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] dark:text-slate-300 mb-1">
                  Travelers ({travelers} Pax)
                </label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="w-full accent-[#39A96B]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#102A43] dark:text-slate-300">
                  Target Budget (₱ PHP)
                </label>
                <span className="text-xs font-bold text-[#087EA4] dark:text-[#4DB8E8]">
                  ₱{totalBudget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={80000}
                step={1000}
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full accent-[#087EA4]"
              />
            </div>
          </div>

          {/* Benchmark Comparison Notice */}
          <div className={`p-3 rounded-xl border text-xs space-y-1 ${
            isUnderBenchmark
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-300'
              : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300'
          }`}>
            <div className="flex items-center gap-1.5 font-semibold">
              {isUnderBenchmark ? <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isUnderBenchmark ? 'Budget Saver Mode Active' : 'Comfortable Travel Range'}</span>
            </div>
            <p className="text-[10px] leading-relaxed opacity-90">
              {isUnderBenchmark
                ? `₱${totalBudget.toLocaleString()} is ₱${budgetDifference.toLocaleString()} below standard rates for ${days}d in ${destination}. Byahedor AI recommends homestays & joiner tours!`
                : `Your budget provides a comfortable ₱${dailyPerPerson.toLocaleString()} / person / day for beachfront stays and seafood.`}
            </p>
          </div>

          <button
            onClick={handleGetAiSwaps}
            disabled={optimizing}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#087EA4] to-[#39A96B] hover:opacity-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            {optimizing ? (
              <span>Analyzing local price swaps...</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#FFB84D]" />
                <span>Get AI Money-Saving Swaps</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Breakdown & Progress Visualizer */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0f233a] rounded-2xl p-4 sm:p-5 border border-[#E4E9F0] dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Total Cost</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#102A43] dark:text-white font-heading">
                ₱{totalBudget.toLocaleString()} <span className="text-xs font-semibold text-slate-400">PHP</span>
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Daily Cost per Pax</span>
              <span className="text-sm font-bold text-[#39A96B]">
                ₱{dailyPerPerson.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/ day</span>
              </span>
            </div>
          </div>

          {/* Visual Progress Stacked Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#627D98] dark:text-slate-400">
              <span>Category Allocation</span>
              <span>100% Allocated</span>
            </div>
            
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
              <div style={{ width: `${transpoRatio}%` }} className="bg-[#087EA4] h-full" title={`Transport: ${transpoRatio}%`} />
              <div style={{ width: `${accomRatio}%` }} className="bg-[#4DB8E8] h-full" title={`Stay: ${accomRatio}%`} />
              <div style={{ width: `${foodRatio}%` }} className="bg-amber-400 h-full" title={`Food: ${foodRatio}%`} />
              <div style={{ width: `${actRatio}%` }} className="bg-[#39A96B] h-full" title={`Activities: ${actRatio}%`} />
              <div style={{ width: `${emergRatio}%` }} className="bg-rose-400 h-full" title={`Emergency: ${emergRatio}%`} />
            </div>
          </div>

          {/* Categorized Breakdown Rows */}
          <div className="space-y-2">
            {/* Transportation */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#087EA4]/10 text-[#087EA4] flex items-center justify-center">
                  <Plane className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102A43] dark:text-white">Transportation ({transpoRatio}%)</h4>
                  <span className="text-[10px] text-slate-400">Flights, ferries, scooter & tricycles</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#102A43] dark:text-white">
                ₱{transpoCost.toLocaleString()}
              </span>
            </div>

            {/* Accommodation */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#4DB8E8]/15 text-[#087EA4] dark:text-[#4DB8E8] flex items-center justify-center">
                  <Hotel className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102A43] dark:text-white">Accommodation ({accomRatio}%)</h4>
                  <span className="text-[10px] text-slate-400">Homestays, hostels or beachfront rooms</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#102A43] dark:text-white">
                ₱{accomCost.toLocaleString()}
              </span>
            </div>

            {/* Food & Dining */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Utensils className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102A43] dark:text-white">Food & Dining ({foodRatio}%)</h4>
                  <span className="text-[10px] text-slate-400">Carinderias, boodle fights & fresh coconuts</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#102A43] dark:text-white">
                ₱{foodCost.toLocaleString()}
              </span>
            </div>

            {/* Activities & Tours */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#39A96B]/10 text-[#39A96B] flex items-center justify-center">
                  <Ticket className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102A43] dark:text-white">Activities & Tours ({actRatio}%)</h4>
                  <span className="text-[10px] text-slate-400">Island hopping, canyoneering & guides</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#102A43] dark:text-white">
                ₱{actCost.toLocaleString()}
              </span>
            </div>

            {/* Emergency Reserve */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102A43] dark:text-white">Emergency Buffer ({emergRatio}%)</h4>
                  <span className="text-[10px] text-slate-400">Ferry delays, medical & unexpected fees</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#102A43] dark:text-white">
                ₱{emergCost.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={() => onStartPlanningWithBudget(destination, totalBudget)}
              className="w-full py-2.5 rounded-xl bg-[#087EA4] hover:bg-[#076c8c] text-white font-bold text-xs transition-all shadow-2xs flex items-center justify-center gap-1.5"
            >
              <span>Build Full Itinerary with this Budget</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Money-Saving Alternatives Display */}
      {aiSuggestions && (
        <div className="bg-white dark:bg-[#0f233a] rounded-2xl p-4 sm:p-5 border border-[#E4E9F0] dark:border-slate-800 shadow-xs space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#102A43] dark:text-white font-heading flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Recommended Byahedor Cost-Cutting Swaps</span>
            </h3>
            <span className="text-[11px] font-bold text-[#39A96B] bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              Up to ₱12,000+ Savings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {aiSuggestions.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#087EA4] dark:text-[#4DB8E8] block">
                    {item.category}
                  </span>
                  <div className="mt-0.5 space-y-0.5">
                    <div className="text-[11px] text-slate-400 line-through">
                      Instead of: {item.original}
                    </div>
                    <div className="text-xs font-bold text-[#102A43] dark:text-white flex items-start gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#39A96B] shrink-0 mt-0.5" />
                      <span>{item.alternative}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Save approx:</span>
                  <span className="text-xs font-bold text-[#39A96B]">
                    ~₱{item.savingsPHP?.toLocaleString()} PHP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
