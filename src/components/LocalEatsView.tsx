import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  MapPin, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Flame, 
  Heart,
  Store,
  DollarSign
} from 'lucide-react';
import { LOCAL_EATS } from '../data/localEats';
import { LocalDish } from '../types';

export const LocalEatsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Main Dish', 'Soup/Stew', 'Seafood', 'Dessert', 'Street Food'];

  const filteredDishes = LOCAL_EATS.filter((dish) => {
    const matchesSearch = 
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.flavorProfile.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div id="byahedor-local-eats-view" className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-2">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Regional Filipino Gastronomy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#102A43] dark:text-white font-heading">
            Local Eats & Island Food Crawl
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A culinary expedition through 7,100 islands — from crunchy Cebu lechon and fiery Bicol Express to fresh Visayan kinilaw.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
          <input
            type="text"
            id="food-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes, flavors, cities..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#0f233a] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#102A43] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[36px] active:scale-95 ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xs'
                : 'bg-white dark:bg-[#0f233a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredDishes.map((dish) => (
          <div
            key={dish.id}
            id={`food-card-${dish.id}`}
            className="bg-white dark:bg-[#0f233a] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all flex flex-col group"
          >
            {/* Dish Image */}
            <div className="relative h-52 overflow-hidden">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                {dish.category}
              </span>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="font-extrabold text-lg font-heading">{dish.name}</h3>
                <span className="text-xs text-[#FFB84D] font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>{dish.region}</span>
                </span>
              </div>
            </div>

            {/* Dish Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {dish.description}
              </p>

              {/* Flavor Profile Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Flavor Profile</span>
                <div className="flex flex-wrap gap-1">
                  {dish.flavorProfile.map((flv, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-200/50 dark:border-amber-900/30"
                    >
                      {flv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Must-Try Spot & Average Cost */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Store className="w-3.5 h-3.5 text-[#087EA4] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Best Authentic Spot:</span>
                    <span className="font-bold text-[#102A43] dark:text-white leading-tight block">
                      {dish.mustTrySpot}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-[11px] text-slate-400">Typical Price:</span>
                  <span className="font-extrabold text-[#39A96B]">{dish.averagePricePHP}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Street Food & Drinking Water Safety Tips */}
      <div className="rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/30 p-6 sm:p-7 space-y-3">
        <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 font-heading flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Byahedor Foodie Safety & Dining Etiquette</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-emerald-950/90 dark:text-emerald-200/90">
          <div className="space-y-1">
            <h5 className="font-bold text-emerald-800 dark:text-emerald-300">1. Freshly Cooked Rules</h5>
            <p className="text-[11px] leading-relaxed">
              Choose carinderias and street stalls with high turnover where food is steaming hot and replenished constantly.
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-emerald-800 dark:text-emerald-300">2. Drinking Water Tips</h5>
            <p className="text-[11px] leading-relaxed">
              Stick to purified or bottled water in remote islands (Siargao, El Nido). Most cafes offer free filtered water refills.
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-emerald-800 dark:text-emerald-300">3. Kamayan & Boodle Fights</h5>
            <p className="text-[11px] leading-relaxed">
              Embrace eating with clean hands (*kamayan*) over banana leaves for the most authentic and communal Filipino feast!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
