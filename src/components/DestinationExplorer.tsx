import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar, 
  Wallet, 
  PlaneTakeoff, 
  X, 
  Compass, 
  Utensils, 
  Lightbulb
} from 'lucide-react';
import { Destination } from '../types';
import { DESTINATIONS } from '../data/destinations';

interface DestinationExplorerProps {
  onSelectDestination: (dest: Destination) => void;
  onStartPlanning: (destName: string) => void;
}

export const DestinationExplorer: React.FC<DestinationExplorerProps> = ({
  onSelectDestination,
  onStartPlanning
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeModalDest, setActiveModalDest] = useState<Destination | null>(null);

  const regionTabs = ['All', 'Luzon', 'Visayas', 'Mindanao'];
  const tagTabs = ['All', 'Beach & Surf', 'Island Hopping', 'Heritage', 'Waterfalls', 'Scenic Hills', 'Wreck Diving'];

  const filteredDestinations = DESTINATIONS.filter((d) => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRegion = selectedRegion === 'All' || d.region === selectedRegion;
    const matchesTag = selectedTag === 'All' || d.tags.some(t => t.toLowerCase().includes(selectedTag.toLowerCase()));

    return matchesSearch && matchesRegion && matchesTag;
  });

  return (
    <div id="byahedor-destination-explorer" className="space-y-5 pb-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#087EA4]/10 dark:bg-[#087EA4]/20 text-[#087EA4] dark:text-[#4DB8E8] text-[11px] font-bold mb-1">
            <Compass className="w-3 h-3" />
            <span>Discover the Philippines</span>
          </div>
          <h1 className="text-fluid-title font-bold text-[#102A43] dark:text-white font-heading">
            Destination Explorer
          </h1>
          <p className="text-xs text-[#627D98] dark:text-slate-400">
            Browse idyllic islands, dramatic mountain escapes, and colonial heritage hubs across the archipelago.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            id="destination-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search islands, beaches..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#0f233a] border border-[#E4E9F0] dark:border-slate-800 text-xs font-semibold text-[#102A43] dark:text-white placeholder-[#9FB3C8] focus:outline-none focus:ring-2 focus:ring-[#087EA4] min-h-[40px]"
          />
        </div>
      </div>

      {/* Filter Tabs with horizontal momentum scrolling */}
      <div className="space-y-2.5">
        {/* Region Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Region:
          </span>
          {regionTabs.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 min-h-[34px] active:scale-95 ${
                selectedRegion === region
                  ? 'bg-[#087EA4] text-white shadow-2xs'
                  : 'bg-white dark:bg-[#0f233a] text-slate-600 dark:text-slate-300 border border-[#E4E9F0] dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {tagTabs.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all shrink-0 min-h-[32px] active:scale-95 ${
                selectedTag === tag
                  ? 'bg-[#39A96B] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Destination Grid: 1 col on mobile, 2 col on tablet, 3 on desktop */}
      {filteredDestinations.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#0f233a] rounded-2xl border border-[#E4E9F0] dark:border-slate-800 p-6 space-y-3">
          <Compass className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-[#102A43] dark:text-white font-heading">
            No matching destinations found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or switching filters back to "All".
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedRegion('All'); setSelectedTag('All'); }}
            className="px-4 py-2 rounded-xl bg-[#087EA4] text-white text-xs font-bold min-h-[38px] active:scale-95"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              id={`destination-grid-card-${dest.id}`}
              className="bg-white dark:bg-[#0f233a] rounded-2xl overflow-hidden border border-[#E4E9F0] dark:border-slate-800 shadow-2xs hover:shadow-sm transition-all group flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-44 sm:h-48 overflow-hidden">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Region Badge */}
                <div className="absolute top-2.5 left-2.5 flex gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                    {dest.region}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#39A96B]/90 backdrop-blur-md text-white text-[10px] font-bold">
                    {dest.idealDurationDays}d Ideal
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 dark:bg-black/80 backdrop-blur-md text-amber-500 text-[11px] font-bold shadow-2xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-slate-800 dark:text-white">{dest.rating}</span>
                </div>

                {/* Bottom Overlay Title */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-bold text-base font-heading drop-shadow-xs leading-tight">
                    {dest.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-white/90 font-medium mt-0.5">
                    <MapPin className="w-3 h-3 text-[#FFB84D] shrink-0" />
                    <span className="truncate">{dest.location}</span>
                  </div>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-[11px] text-[#486581] dark:text-slate-300 leading-relaxed line-clamp-2">
                  {dest.description}
                </p>

                {/* Best time & Budget Row */}
                <div className="space-y-1.5 py-1.5 border-y border-[#E4E9F0] dark:border-slate-800/80 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                      <Calendar className="w-3 h-3 text-[#087EA4]" />
                      Best Season:
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-right text-[10px] truncate max-w-[150px]">
                      {dest.bestTimeToVisit.split('(')[0]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                      <Wallet className="w-3 h-3 text-[#39A96B]" />
                      Est. Daily:
                    </span>
                    <span className="font-bold text-[#087EA4] dark:text-[#4DB8E8]">
                      ₱{dest.estimatedDailyBudgetPHP.toLocaleString()} / pax
                    </span>
                  </div>
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1">
                  {dest.tags.slice(0, 3).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action Buttons with 40px+ touch target */}
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <button
                    onClick={() => setActiveModalDest(dest)}
                    className="w-full min-h-[38px] py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all text-center active:scale-95"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => onStartPlanning(dest.name)}
                    className="w-full min-h-[38px] py-1.5 px-2 rounded-lg bg-[#087EA4] hover:bg-[#076c8c] text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1 shadow-2xs active:scale-95"
                  >
                    <span>Plan Trip</span>
                    <PlaneTakeoff className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Destination Detail Modal - Optimized for mobile viewports */}
      {activeModalDest && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setActiveModalDest(null)}
        >
          <div 
            className="bg-white dark:bg-[#0f233a] rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto shadow-2xl border border-[#E4E9F0] dark:border-slate-800 relative animate-scale-in pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={activeModalDest.heroImage}
                alt={activeModalDest.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/4/45/Cloud_9_Boardwalk%2C_Siargao.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <button
                onClick={() => setActiveModalDest(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors active:scale-95"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="px-2 py-0.5 rounded bg-[#087EA4] text-white text-[10px] font-bold uppercase tracking-wider inline-block mb-1">
                  {activeModalDest.region} • {activeModalDest.idealDurationDays} Days Recommended
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-heading leading-tight">
                  {activeModalDest.name}
                </h2>
                <p className="text-[11px] text-slate-200 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#FFB84D]" />
                  <span>{activeModalDest.location}</span>
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Overview</h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {activeModalDest.description}
                </p>
              </div>

              {/* Authentic Photo Gallery */}
              {activeModalDest.galleryImages && activeModalDest.galleryImages.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Authentic Views & Landmarks</span>
                    <span className="text-[9px] text-[#087EA4] font-semibold">{activeModalDest.galleryImages.length} photos</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {activeModalDest.galleryImages.map((imgUrl, gIdx) => (
                      <div key={gIdx} className="h-20 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group relative">
                        <img 
                          src={imgUrl} 
                          alt={`${activeModalDest.name} view ${gIdx + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = activeModalDest.heroImage;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights & Top Activities */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Signature Activities & Costs
                </h4>
                <div className="space-y-2">
                  {activeModalDest.popularActivities.map((act, aIdx) => (
                    <div
                      key={aIdx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-[#102A43] dark:text-white truncate">{act.title}</h5>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{act.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[#39A96B] block">~₱{act.costPHP}</span>
                        <span className="text-[9px] text-slate-400">{act.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Foodie Specialties */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Utensils className="w-3 h-3 text-amber-500" />
                  <span>Must-Try Local Eats</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalDest.localSpecialties.map((dish, dIdx) => (
                    <span
                      key={dIdx}
                      className="px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40 text-[11px] font-semibold"
                    >
                      {dish}
                    </span>
                  ))}
                </div>
              </div>

              {/* Local Insider Advice */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 space-y-1.5">
                <h4 className="text-[10px] font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 text-blue-600" />
                  <span>Local Island Wisdom</span>
                </h4>
                <ul className="space-y-0.5 text-[11px] text-blue-950 dark:text-blue-200">
                  {activeModalDest.travelTips.map((tip, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-1">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Modal CTA Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setActiveModalDest(null)}
                  className="flex-1 min-h-[42px] py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs active:scale-95"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const destName = activeModalDest.name;
                    setActiveModalDest(null);
                    onStartPlanning(destName);
                  }}
                  className="flex-1 min-h-[42px] py-2 px-3 rounded-xl bg-[#087EA4] hover:bg-[#076c8c] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
                >
                  <span>Plan Trip</span>
                  <PlaneTakeoff className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
