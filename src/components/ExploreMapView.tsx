import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Compass, 
  Navigation, 
  Sparkles, 
  PlaneTakeoff, 
  ArrowRight, 
  Star,
  Info,
  Waves,
  Sun,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Ship,
  Plane,
  Bus,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Wind
} from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';
import { Destination } from '../types';

interface ExploreMapViewProps {
  onStartPlanning: (destName: string) => void;
  onSelectDestination: (dest: Destination) => void;
}

// Bounding box for Philippine Archipelago geographic coordinates
const GEO_BOUNDS = {
  minLng: 116.5,
  maxLng: 127.2,
  minLat: 4.5,
  maxLat: 21.5,
};

/**
 * Projects real geographic latitude & longitude into SVG viewBox coordinates (600x820)
 */
function projectGeo(lat: number, lng: number, viewBoxWidth = 600, viewBoxHeight = 820) {
  const padX = 42;
  const padY = 40;
  const width = viewBoxWidth - padX * 2;
  const height = viewBoxHeight - padY * 2;
  
  const x = padX + ((lng - GEO_BOUNDS.minLng) / (GEO_BOUNDS.maxLng - GEO_BOUNDS.minLng)) * width;
  const y = padY + ((GEO_BOUNDS.maxLat - lat) / (GEO_BOUNDS.maxLat - GEO_BOUNDS.minLat)) * height;
  return { 
    x: Math.round(x * 10) / 10, 
    y: Math.round(y * 10) / 10 
  };
}

export type RouteId = 'all' | 'palawan-loop' | 'visayas-trio' | 'cordillera-trail' | 'siargao-surf' | 'volcano-corridor';
export type MapLayer = 'all' | 'lanes' | 'climate';
export type RegionFilter = 'All' | 'Luzon' | 'Visayas' | 'Mindanao' | 'Palawan';

interface RouteDefinition {
  id: RouteId;
  name: string;
  badge: string;
  desc: string;
  destinationIds: string[];
  stops: { from: string; to: string; mode: 'ferry' | 'flight' | 'van' | 'bus'; duration: string; fare: string; operator: string }[];
}

export const ExploreMapView: React.FC<ExploreMapViewProps> = ({
  onStartPlanning,
  onSelectDestination,
}) => {
  const [selectedPin, setSelectedPin] = useState<Destination>(DESTINATIONS[0]);
  const [activeRoute, setActiveRoute] = useState<RouteId>('all');
  const [activeRegion, setActiveRegion] = useState<RegionFilter>('All');
  const [activeLayer, setActiveLayer] = useState<MapLayer>('lanes');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredDest, setHoveredDest] = useState<Destination | null>(null);

  const routes: RouteDefinition[] = [
    {
      id: 'all',
      name: 'All Archipelago Highlights',
      badge: 'Archipelago Overview',
      desc: 'All 7,100+ islands premier destinations across Luzon, Visayas, and Mindanao.',
      destinationIds: DESTINATIONS.map(d => d.id),
      stops: []
    },
    {
      id: 'palawan-loop',
      name: 'Palawan Lagoon & Wreck Loop',
      badge: 'Scenic Sea Lane',
      desc: 'Coron ➔ El Nido ➔ Puerto Princesa (Calamianes fast ferry & coastal highway).',
      destinationIds: ['coron', 'el-nido'],
      stops: [
        {
          from: 'Coron Port',
          to: 'El Nido Port',
          mode: 'ferry',
          duration: '3.5 - 4 hrs',
          fare: '₱1,800 - ₱2,200',
          operator: 'Montenegro / Phimal Fast Ferry'
        },
        {
          from: 'El Nido Terminal',
          to: 'Puerto Princesa',
          mode: 'van',
          duration: '5 - 5.5 hrs',
          fare: '₱650 - ₱800',
          operator: 'Lexus / Daytripper AC Van'
        }
      ]
    },
    {
      id: 'visayas-trio',
      name: 'Central Visayas Island Hopping',
      badge: 'Ferry Circuit',
      desc: 'Cebu City ➔ Bohol ➔ Siquijor ➔ Boracay (OceanJet Fastcraft & RoRo route).',
      destinationIds: ['cebu', 'bohol', 'siquijor', 'boracay'],
      stops: [
        {
          from: 'Cebu Pier 1',
          to: 'Tagbilaran Port (Bohol)',
          mode: 'ferry',
          duration: '2 hrs',
          fare: '₱800 Tourist Class',
          operator: 'OceanJet Fast Ferry (Hourly)'
        },
        {
          from: 'Tagbilaran Port',
          to: 'Larena Port (Siquijor)',
          mode: 'ferry',
          duration: '1.5 hrs',
          fare: '₱650 Tourist Class',
          operator: 'OceanJet / Lite Shipping'
        },
        {
          from: 'Cebu Mactan (CEB)',
          to: 'Caticlan (MPH) / Boracay',
          mode: 'flight',
          duration: '55 mins',
          fare: '₱1,800 - ₱3,500',
          operator: 'Cebu Pacific / AirAsia'
        }
      ]
    },
    {
      id: 'cordillera-trail',
      name: 'Northern Highlands Heritage',
      badge: 'Mountain Pass',
      desc: 'Manila ➔ Vigan ➔ Sagada ➔ Baguio (Cobblestones, pine peaks & ancient rice terraces).',
      destinationIds: ['vigan', 'sagada', 'baguio'],
      stops: [
        {
          from: 'Metro Manila (Cubao)',
          to: 'Vigan Heritage City',
          mode: 'bus',
          duration: '8 - 9 hrs',
          fare: '₱950 Deluxe with CR',
          operator: 'Partas / Viron Transit'
        },
        {
          from: 'Vigan City',
          to: 'Sagada (via Bessang Pass)',
          mode: 'bus',
          duration: '5 - 6 hrs',
          fare: '₱450 Mountain Van',
          operator: 'Local Highland Express'
        },
        {
          from: 'Sagada Town',
          to: 'Baguio City (Halsema Highway)',
          mode: 'bus',
          duration: '5 - 6 hrs',
          fare: '₱350 Mountain Coach',
          operator: 'GL Lizardo / Rising Sun Bus'
        }
      ]
    },
    {
      id: 'volcano-corridor',
      name: 'Southern Volcano & Ridge Circuit',
      badge: 'Volcanic Highway',
      desc: 'Manila ➔ Tagaytay Ridge ➔ Mayon Volcano Albay (Crater lake vistas, bulalo feasts & black lava ATV trails).',
      destinationIds: ['tagaytay', 'bicol-mayon'],
      stops: [
        {
          from: 'Metro Manila (PITX)',
          to: 'Tagaytay Ridge',
          mode: 'bus',
          duration: '1.5 - 2 hrs',
          fare: '₱120 - ₱160',
          operator: 'San Agustin / DLTB Bus'
        },
        {
          from: 'Tagaytay / Manila',
          to: 'Legazpi City (Bicol)',
          mode: 'flight',
          duration: '1 hr (or 9 hrs sleeper bus)',
          fare: '₱2,200 - ₱3,500',
          operator: 'Cebu Pacific / PAL to Bicol Airport (DRP)'
        }
      ]
    },
    {
      id: 'siargao-surf',
      name: 'Pacific Waves & Southern Swell',
      badge: 'Island Flight & Sea Lane',
      desc: 'Cebu ➔ Siargao ➔ Camiguin (Cloud 9 surf breaks, lagoons & volcanic White Island sandbar).',
      destinationIds: ['cebu', 'siargao', 'camiguin'],
      stops: [
        {
          from: 'Cebu (CEB)',
          to: 'Sayak Siargao (IAO)',
          mode: 'flight',
          duration: '45 mins',
          fare: '₱2,200 - ₱4,000',
          operator: 'Cebgo / Philippine Airlines'
        },
        {
          from: 'Surigao City Port',
          to: 'Dapa Port (Siargao)',
          mode: 'ferry',
          duration: '1.5 - 2 hrs',
          fare: '₱350 - ₱500',
          operator: 'Evaristo / Dapa Express Fastcraft'
        },
        {
          from: 'Balingoan Port',
          to: 'Benoni Port (Camiguin)',
          mode: 'ferry',
          duration: '1 hr',
          fare: '₱350 RoRo Ferry',
          operator: 'Super Shuttle / Camiguin Express'
        }
      ]
    }
  ];

  const currentRouteData = useMemo(() => {
    return routes.find(r => r.id === activeRoute) || routes[0];
  }, [activeRoute]);

  // Filter destinations based on active route and region
  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter(dest => {
      // Region filter
      if (activeRegion === 'Palawan') {
        if (!dest.location.toLowerCase().includes('palawan')) return false;
      } else if (activeRegion !== 'All' && dest.region !== activeRegion) {
        return false;
      }

      // Route filter
      if (activeRoute !== 'all') {
        const routeDef = routes.find(r => r.id === activeRoute);
        if (routeDef && !routeDef.destinationIds.includes(dest.id)) {
          return false;
        }
      }

      return true;
    });
  }, [activeRegion, activeRoute]);

  // Map destination coordinates for rendering
  const mappedDestinations = useMemo(() => {
    return DESTINATIONS.map(dest => {
      const { x, y } = projectGeo(dest.coordinates.lat, dest.coordinates.lng);
      const isRouteActive = activeRoute === 'all' || currentRouteData.destinationIds.includes(dest.id);
      const isRegionActive = activeRegion === 'All' || 
        (activeRegion === 'Palawan' ? dest.location.toLowerCase().includes('palawan') : dest.region === activeRegion);
      const isHighlighted = isRouteActive && isRegionActive;
      const isSelected = selectedPin.id === dest.id;

      return {
        ...dest,
        svgX: x,
        svgY: y,
        isHighlighted,
        isSelected
      };
    });
  }, [activeRoute, activeRegion, selectedPin, currentRouteData]);

  // Pre-calculated major transit lane paths
  // Palawan Sea Lane (Coron to El Nido to Puerto Princesa)
  const coronPt = projectGeo(11.9986, 120.2043);
  const elNidoPt = projectGeo(11.2001, 119.4167);
  const ptoPrincesaPt = projectGeo(9.7392, 118.7353);

  // Visayas Hopping Sea Lane (Cebu to Bohol to Siquijor to Boracay)
  const cebuPt = projectGeo(10.3157, 123.8854);
  const boholPt = projectGeo(9.8500, 124.1435);
  const siquijorPt = projectGeo(9.1999, 123.5952);
  const boracayPt = projectGeo(11.9674, 121.9248);

  // Cordillera Mountain Pass (Manila to Vigan to Sagada)
  const manilaPt = projectGeo(14.5995, 120.9842);
  const viganPt = projectGeo(17.5747, 120.3869);
  const sagadaPt = projectGeo(17.0833, 120.9000);

  // Siargao Pacific Flight & Sea Lane (Cebu to Siargao)
  const siargaoPt = projectGeo(9.8584, 126.0469);
  const batanesPt = projectGeo(20.4485, 121.9708);

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(Math.max(0.85, prev + delta), 2.2));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setActiveRegion('All');
  };

  return (
    <div id="byahedor-explore-map-view" className="space-y-6 pb-16 w-full">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087EA4]/10 dark:bg-[#087EA4]/20 text-[#087EA4] dark:text-[#4DB8E8] text-xs font-bold mb-2">
            <Navigation className="w-3.5 h-3.5" />
            <span>Philippine Archipelago Navigator</span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-[11px] text-[#39A96B] dark:text-emerald-400 font-semibold">7,641 Islands</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#102A43] dark:text-white font-heading tracking-tight">
            Interactive Archipelago Map & Sea Lanes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-0.5">
            Real geographic coordinates, island hopping fast ferry corridors, mountain highways, and domestic flight connections across Luzon, Visayas, and Mindanao.
          </p>
        </div>

        {/* Layer Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-[#0f233a] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveLayer('lanes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeLayer === 'lanes'
                ? 'bg-[#087EA4] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>Transit & Ferries</span>
          </button>

          <button
            onClick={() => setActiveLayer('climate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeLayer === 'climate'
                ? 'bg-[#39A96B] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-[#FFB84D]" />
            <span>Amihan & Climate</span>
          </button>
        </div>
      </div>

      {/* Region & Route Navigation Filters */}
      <div className="space-y-3">
        {/* Route Selector Chips */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#087EA4]" />
              <span>Signature Travel Routes:</span>
            </span>
            <span className="text-[11px] font-semibold text-[#087EA4] dark:text-[#4DB8E8]">
              {currentRouteData.name}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {routes.map((r) => {
              const isSelected = activeRoute === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setActiveRoute(r.id);
                    // Automatically focus first destination in route if available
                    if (r.destinationIds.length > 0) {
                      const first = DESTINATIONS.find(d => d.id === r.destinationIds[0]);
                      if (first) setSelectedPin(first);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 active:scale-95 ${
                    isSelected
                      ? 'bg-[#087EA4] text-white shadow-md ring-2 ring-[#087EA4]/30'
                      : 'bg-white dark:bg-[#0f233a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {r.id === 'palawan-loop' && <Ship className="w-3.5 h-3.5 text-cyan-300" />}
                  {r.id === 'visayas-trio' && <Waves className="w-3.5 h-3.5 text-emerald-300" />}
                  {r.id === 'cordillera-trail' && <Bus className="w-3.5 h-3.5 text-amber-300" />}
                  {r.id === 'siargao-surf' && <Plane className="w-3.5 h-3.5 text-sky-300" />}
                  {r.id === 'all' && <Compass className="w-3.5 h-3.5 text-[#FFB84D]" />}
                  <span>{r.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Region Sub-Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            Focus Region:
          </span>
          {(['All', 'Luzon', 'Visayas', 'Mindanao', 'Palawan'] as RegionFilter[]).map((reg) => (
            <button
              key={reg}
              onClick={() => setActiveRegion(reg)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
                activeRegion === reg
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-2xs'
                  : 'bg-white dark:bg-[#0f233a] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Stylized Philippine Vector Map */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0f233a] rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col">
          {/* Top Bar of Map Controls */}
          <div className="flex items-center justify-between mb-3 z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#087EA4]/10 text-[#087EA4] dark:text-[#4DB8E8] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>PH Archipelago Projection</span>
              </span>
              <span className="hidden sm:inline text-[11px] text-slate-400 dark:text-slate-500">
                Lat 4.5°N - 21.5°N
              </span>
            </div>

            {/* Map Action Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                onClick={() => handleZoom(0.25)}
                title="Zoom In"
                aria-label="Zoom In"
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleZoom(-0.25)}
                title="Zoom Out"
                aria-label="Zoom Out"
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                title="Reset View"
                aria-label="Reset View"
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Map Canvas Viewport with Ocean Gradient */}
          <div className="relative w-full h-[480px] sm:h-[620px] bg-gradient-to-b from-[#EBF5FB] via-[#E0F2FE] to-[#D9EEF9] dark:from-[#08192E] dark:via-[#0A1F38] dark:to-[#071526] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-2 sm:p-4 flex items-center justify-center overflow-hidden select-none">
            {/* Nautical Coordinate Grid Lines */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="geo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#087EA4" strokeWidth="0.5" strokeDasharray="1 3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#geo-grid)" />
              </svg>
            </div>

            {/* Ocean & Sea Labels */}
            <div className="absolute top-10 right-4 pointer-events-none text-right">
              <span className="text-[10px] font-black tracking-widest text-[#087EA4]/40 dark:text-sky-400/25 uppercase block">
                Philippine Sea
              </span>
              <span className="text-[8px] font-semibold text-slate-400/40 dark:text-slate-500/30">
                (Pacific Ocean)
              </span>
            </div>

            <div className="absolute top-28 left-4 pointer-events-none text-left">
              <span className="text-[10px] font-black tracking-widest text-[#087EA4]/40 dark:text-sky-400/25 uppercase block">
                West Philippine Sea
              </span>
              <span className="text-[8px] font-semibold text-slate-400/40 dark:text-slate-500/30">
                (South China Sea)
              </span>
            </div>

            <div className="absolute top-[58%] left-8 pointer-events-none text-left">
              <span className="text-[9px] font-black tracking-widest text-[#087EA4]/40 dark:text-sky-400/20 uppercase block">
                Sulu Sea
              </span>
            </div>

            <div className="absolute bottom-6 right-8 pointer-events-none text-right">
              <span className="text-[9px] font-black tracking-widest text-[#087EA4]/40 dark:text-sky-400/20 uppercase block">
                Celebes Sea
              </span>
            </div>

            {/* Nautical Compass Rose Widget */}
            <div className="absolute bottom-4 left-4 pointer-events-none opacity-60 dark:opacity-40 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border border-[#087EA4]/40 flex items-center justify-center relative">
                <span className="absolute -top-3 text-[9px] font-black text-[#087EA4] dark:text-[#4DB8E8]">N</span>
                <div className="w-3 h-3 bg-[#FFB84D] rotate-45 transform origin-center" />
              </div>
              <span className="text-[8px] font-bold text-slate-400 mt-1 tracking-wider">BYAHEDOR</span>
            </div>

            {/* Dynamic Scalable Vector Graphic of the Philippines Archipelago */}
            <div 
              className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <svg 
                viewBox="0 0 600 820" 
                className="w-full h-full max-h-[460px] sm:max-h-[600px] overflow-visible drop-shadow-sm"
              >
                <defs>
                  {/* Pin Glow Filter */}
                  <filter id="ph-pin-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  {/* Island Land Gradients */}
                  <linearGradient id="luzonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#39A96B" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#2e8554" stopOpacity="0.85" />
                  </linearGradient>

                  <linearGradient id="visayasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#087EA4" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
                  </linearGradient>

                  <linearGradient id="mindanaoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.85" />
                  </linearGradient>

                  <linearGradient id="palawanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#087EA4" stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                {/* ═════════════════════════════════════════════════════════════════════ */}
                {/* 1. BATANES & NORTHERN ISLETS */}
                {/* ═════════════════════════════════════════════════════════════════════ */}
                {/* Itbayat Island */}
                <path
                  d="M 298 56 Q 304 50 307 58 Q 304 66 298 64 Z"
                  fill="url(#luzonGrad)"
                  stroke="#1b5e20"
                  strokeWidth="1.2"
                  className="transition-colors hover:brightness-125 cursor-pointer"
                />
                {/* Batan Island (Basco) & Sabtang Island */}
                <path
                  d="M 306 78 Q 315 76 317 86 Q 312 94 305 90 Q 301 83 306 78 Z"
                  fill="url(#luzonGrad)"
                  stroke="#1b5e20"
                  strokeWidth="1.2"
                  className="transition-colors hover:brightness-125 cursor-pointer"
                />
                <path
                  d="M 299 88 Q 304 86 305 94 Q 300 97 297 93 Z"
                  fill="url(#luzonGrad)"
                  stroke="#1b5e20"
                  strokeWidth="1.2"
                  className="transition-colors hover:brightness-125 cursor-pointer"
                />

                {/* Babuyan Islands (Calayan & Camiguin Norte) */}
                <path
                  d="M 282 125 Q 292 122 291 130 Q 284 134 282 125 Z"
                  fill="url(#luzonGrad)"
                  stroke="#1b5e20"
                  strokeWidth="1"
                />
                <path
                  d="M 314 116 Q 323 115 321 123 Q 313 125 312 118 Z"
                  fill="url(#luzonGrad)"
                  stroke="#1b5e20"
                  strokeWidth="1"
                />

                {/* ═════════════════════════════════════════════════════════════════════ */}
                {/* 2. LUZON MAINLAND & SURROUNDING ISLANDS */}
                {/* Realistic geographical contour: Ilocos, Cordillera, Cagayan, Zambales, Bataan, Manila Bay, Bicol */}
                {/* ═════════════════════════════════════════════════════════════════════ */}
                <path
                  d="M 235 158 
                     C 255 150, 280 152, 298 162 
                     C 310 178, 305 210, 302 245 
                     C 300 270, 308 290, 295 320 
                     C 285 330, 280 345, 275 355 
                     C 290 360, 320 375, 345 385 
                     C 365 395, 375 410, 360 425 
                     C 345 435, 335 425, 325 415 
                     C 310 405, 290 395, 275 385 
                     C 265 380, 255 375, 250 365 
                     C 252 355, 258 350, 258 340 
                     C 250 342, 240 338, 235 330 
                     C 225 315, 222 285, 225 255 
                     C 222 235, 218 205, 224 180 
                     Z"
                  fill="url(#luzonGrad)"
                  stroke="#1b5e20"
                  strokeWidth="1.5"
                  className="transition-colors hover:brightness-110 cursor-pointer"
                />

                {/* Polillo Island (Pacific Coast off Quezon) */}
                <path
                  d="M 300 320 Q 308 316 307 330 Q 301 336 298 328 Z"
                  fill="url(#luzonGrad)"
                  stroke="#1b5e20"
                  strokeWidth="1"
                />

                {/* Catanduanes Island (Pacific Coast off Bicol) */}
                <path
                  d="M 370 380 Q 380 375 378 395 Q 368 402 366 390 Z"
                  fill="url(#luzonGrad)"
                  stroke="#1b5e20"
                  strokeWidth="1"
                />

                {/* Mindoro Island (Southwest of Batangas) */}
                <path
                  d="M 238 398 
                     C 255 392, 268 405, 265 425 
                     C 260 445, 248 450, 238 438 
                     C 230 425, 228 408, 238 398 Z"
                  fill="url(#luzonGrad)"
                  stroke="#1b5e20"
                  strokeWidth="1.4"
                  className="transition-colors hover:brightness-110 cursor-pointer"
                />

                {/* Marinduque Island (Heart of the Philippines) */}
                <path
                  d="M 285 392 Q 294 388 293 399 Q 286 405 283 398 Z"
                  fill="url(#luzonGrad)"
                  stroke="#1b5e20"
                  strokeWidth="1"
                />

                {/* Romblon Island Group (Sibuyan Sea) */}
                <path
                  d="M 292 432 Q 298 428 296 440 Q 290 442 291 432 Z"
                  fill="url(#visayasGrad)"
                  stroke="#075985"
                  strokeWidth="1"
                />
                <path
                  d="M 310 435 Q 318 433 316 445 Q 308 448 307 438 Z"
                  fill="url(#visayasGrad)"
                  stroke="#075985"
                  strokeWidth="1"
                />

                {/* Masbate Island (Wishbone shape in Sibuyan Sea) */}
                <path
                  d="M 335 435 
                     C 345 428, 355 435, 352 450 
                     C 348 465, 340 472, 332 460 
                     C 335 450, 325 442, 335 435 Z"
                  fill="url(#visayasGrad)"
                  stroke="#075985"
                  strokeWidth="1.2"
                />

                {/* ═════════════════════════════════════════════════════════════════════ */}
                {/* 3. PALAWAN ARCHIPELAGO (CALAMIANES TO BALABAC) */}
                {/* ═════════════════════════════════════════════════════════════════════ */}
                {/* Calamian Group: Busuanga / Coron & Culion Islands */}
                <path
                  d="M 210 440 
                     C 225 435, 230 448, 224 458 
                     C 215 464, 205 455, 210 440 Z"
                  fill="url(#palawanGrad)"
                  stroke="#0e7490"
                  strokeWidth="1.3"
                  className="transition-colors hover:brightness-125 cursor-pointer"
                />
                {/* Culion & Linapacan */}
                <path
                  d="M 198 462 Q 206 458 204 470 Q 196 472 195 464 Z"
                  fill="url(#palawanGrad)"
                  stroke="#0e7490"
                  strokeWidth="1"
                />

                {/* Mainland Palawan (El Nido, Puerto Princesa, Brooke's Point) */}
                <path
                  d="M 178 480 
                     C 185 490, 175 515, 165 540 
                     C 152 570, 138 600, 118 630 
                     C 110 635, 102 628, 110 615 
                     C 125 585, 142 550, 155 520 
                     C 165 495, 170 480, 178 480 Z"
                  fill="url(#palawanGrad)"
                  stroke="#0e7490"
                  strokeWidth="1.5"
                  className="transition-colors hover:brightness-110 cursor-pointer"
                />

                {/* ═════════════════════════════════════════════════════════════════════ */}
                {/* 4. VISAYAS ISLANDS (CENTRAL, WESTERN & EASTERN) */}
                {/* ═════════════════════════════════════════════════════════════════════ */}
                {/* Panay Island (Triangular with Boracay at tip) */}
                <path
                  d="M 302 452 
                     C 318 458, 325 475, 320 495 
                     C 310 505, 290 500, 285 485 
                     C 285 470, 295 455, 302 452 Z"
                  fill="url(#visayasGrad)"
                  stroke="#075985"
                  strokeWidth="1.4"
                  className="transition-colors hover:brightness-110 cursor-pointer"
                />
                {/* Boracay Island (Just off the NW tip of Panay) */}
                <circle
                  cx={boracayPt.x}
                  cy={boracayPt.y}
                  r="3.5"
                  fill="#FFB84D"
                  stroke="#b45309"
                  strokeWidth="1"
                />

                {/* Negros Island (Boot shape: Bacolod to Dumaguete) */}
                <path
                  d="M 326 498 
                     C 342 492, 350 515, 345 540 
                     C 340 562, 332 568, 328 555 
                     C 325 535, 320 515, 326 498 Z"
                  fill="url(#visayasGrad)"
                  stroke="#075985"
                  strokeWidth="1.4"
                  className="transition-colors hover:brightness-110 cursor-pointer"
                />

                {/* Cebu Island (Long slender spine running north-to-south) */}
                <path
                  d="M 388 475 
                     C 394 485, 388 515, 380 545 
                     C 374 548, 372 535, 376 510 
                     C 380 488, 384 472, 388 475 Z"
                  fill="url(#visayasGrad)"
                  stroke="#075985"
                  strokeWidth="1.5"
                  className="transition-colors hover:brightness-110 cursor-pointer"
                />

                {/* Bohol Island (Round emerald dome & Panglao) */}
                <path
                  d="M 405 532 
                     C 420 530, 422 548, 415 558 
                     C 405 565, 395 558, 398 545 
                     C 400 538, 402 532, 405 532 Z"
                  fill="url(#visayasGrad)"
                  stroke="#075985"
                  strokeWidth="1.4"
                  className="transition-colors hover:brightness-110 cursor-pointer"
                />

                {/* Siquijor Island (Mystical island south of Bohol/Negros) */}
                <circle
                  cx={siquijorPt.x}
                  cy={siquijorPt.y}
                  r="6.5"
                  fill="url(#visayasGrad)"
                  stroke="#075985"
                  strokeWidth="1.3"
                  className="transition-colors hover:brightness-125 cursor-pointer"
                />

                {/* Samar Island (Eastern Visayas facing Pacific Ocean) */}
                <path
                  d="M 415 440 
                     C 435 442, 442 468, 438 495 
                     C 430 515, 418 505, 412 485 
                     C 408 465, 410 445, 415 440 Z"
                  fill="url(#visayasGrad)"
                  stroke="#075985"
                  strokeWidth="1.4"
                />

                {/* Leyte Island (West of Samar, Tacloban & Ormoc) */}
                <path
                  d="M 405 490 
                     C 415 488, 420 512, 415 538 
                     C 408 550, 400 545, 400 528 
                     C 398 508, 400 495, 405 490 Z"
                  fill="url(#visayasGrad)"
                  stroke="#075985"
                  strokeWidth="1.3"
                />

                {/* ═════════════════════════════════════════════════════════════════════ */}
                {/* 5. MINDANAO MAINLAND & SULU ARCHIPELAGO */}
                {/* Surigao horn, Davao Gulf, Zamboanga peninsula, Mount Apo, Cotabato */}
                {/* ═════════════════════════════════════════════════════════════════════ */}
                {/* Dinagat & Siargao Islands (Northeast Pacific Horn) */}
                <path
                  d="M 478 522 Q 484 518 483 535 Q 477 538 476 525 Z"
                  fill="url(#mindanaoGrad)"
                  stroke="#92400e"
                  strokeWidth="1.2"
                />
                {/* Siargao Island (Teardrop shape) */}
                <path
                  d="M 500 538 
                     C 508 532, 510 548, 506 558 
                     C 500 562, 496 552, 498 542 Z"
                  fill="url(#mindanaoGrad)"
                  stroke="#92400e"
                  strokeWidth="1.4"
                  className="transition-colors hover:brightness-125 cursor-pointer"
                />

                {/* Camiguin Island (Volcanic Pearl of Northern Mindanao) */}
                <circle
                  cx="430"
                  cy="578"
                  r="4.5"
                  fill="url(#mindanaoGrad)"
                  stroke="#92400e"
                  strokeWidth="1"
                />

                {/* Mindanao Mainland */}
                <path
                  d="M 465 545 
                     C 475 560, 465 590, 468 620 
                     C 475 645, 480 675, 465 698 
                     C 450 710, 430 705, 418 695 
                     C 405 680, 395 655, 385 640 
                     C 365 645, 335 655, 310 658 
                     C 295 660, 290 648, 305 638 
                     C 330 625, 355 620, 375 605 
                     C 388 595, 410 580, 435 580 
                     C 450 575, 458 555, 465 545 Z"
                  fill="url(#mindanaoGrad)"
                  stroke="#92400e"
                  strokeWidth="1.6"
                  className="transition-colors hover:brightness-110 cursor-pointer"
                />

                {/* Sulu Archipelago & Tawi-Tawi Chain (Basilan, Jolo, Bongao) */}
                <path
                  d="M 315 672 Q 324 668 322 680 Q 314 682 312 674 Z"
                  fill="url(#mindanaoGrad)"
                  stroke="#92400e"
                  strokeWidth="1"
                />
                <path
                  d="M 285 692 Q 295 688 292 700 Q 284 702 282 694 Z"
                  fill="url(#mindanaoGrad)"
                  stroke="#92400e"
                  strokeWidth="1"
                />
                <path
                  d="M 255 712 Q 265 708 262 720 Q 254 722 252 714 Z"
                  fill="url(#mindanaoGrad)"
                  stroke="#92400e"
                  strokeWidth="1"
                />

                {/* ═════════════════════════════════════════════════════════════════════ */}
                {/* 6. TRANSIT LANES & SEA ROUTE TRAJECTORIES */}
                {/* ═════════════════════════════════════════════════════════════════════ */}
                {activeLayer === 'lanes' && (
                  <g className="transition-opacity duration-300">
                    {/* PALAWAN CORRIDOR: Coron to El Nido Fast Ferry Lane */}
                    <path
                      d={`M ${coronPt.x} ${coronPt.y} Q ${coronPt.x - 25} ${coronPt.y + 40} ${elNidoPt.x} ${elNidoPt.y}`}
                      fill="none"
                      stroke={activeRoute === 'palawan-loop' ? '#087EA4' : '#087EA4'}
                      strokeWidth={activeRoute === 'palawan-loop' ? '3.5' : '2'}
                      strokeDasharray={activeRoute === 'palawan-loop' ? '6 4' : '4 4'}
                      className="animate-dash"
                      opacity={activeRoute === 'palawan-loop' ? 1 : 0.6}
                    />

                    {/* El Nido to Puerto Princesa Highway */}
                    <path
                      d={`M ${elNidoPt.x} ${elNidoPt.y} Q ${elNidoPt.x - 15} ${elNidoPt.y + 50} ${ptoPrincesaPt.x} ${ptoPrincesaPt.y}`}
                      fill="none"
                      stroke={activeRoute === 'palawan-loop' ? '#39A96B' : '#64748b'}
                      strokeWidth={activeRoute === 'palawan-loop' ? '3' : '1.5'}
                      strokeDasharray="4 4"
                      opacity={activeRoute === 'palawan-loop' ? 0.9 : 0.4}
                    />

                    {/* VISAYAS TRIO: Cebu to Bohol Fast Ferry */}
                    <path
                      d={`M ${cebuPt.x} ${cebuPt.y} L ${boholPt.x} ${boholPt.y}`}
                      fill="none"
                      stroke={activeRoute === 'visayas-trio' ? '#087EA4' : '#087EA4'}
                      strokeWidth={activeRoute === 'visayas-trio' ? '3.5' : '2'}
                      strokeDasharray="5 3"
                      className="animate-dash"
                      opacity={activeRoute === 'visayas-trio' ? 1 : 0.6}
                    />

                    {/* Bohol to Siquijor Fast Ferry */}
                    <path
                      d={`M ${boholPt.x} ${boholPt.y} L ${siquijorPt.x} ${siquijorPt.y}`}
                      fill="none"
                      stroke={activeRoute === 'visayas-trio' ? '#087EA4' : '#087EA4'}
                      strokeWidth={activeRoute === 'visayas-trio' ? '3.5' : '2'}
                      strokeDasharray="5 3"
                      className="animate-dash"
                      opacity={activeRoute === 'visayas-trio' ? 1 : 0.6}
                    />

                    {/* Cebu to Boracay Flight Corridor */}
                    <path
                      d={`M ${cebuPt.x} ${cebuPt.y} Q ${cebuPt.x - 50} ${cebuPt.y - 70} ${boracayPt.x} ${boracayPt.y}`}
                      fill="none"
                      stroke={activeRoute === 'visayas-trio' ? '#FFB84D' : '#FFB84D'}
                      strokeWidth={activeRoute === 'visayas-trio' ? '2.5' : '1.5'}
                      strokeDasharray="4 4"
                      className="animate-dash"
                      opacity={activeRoute === 'visayas-trio' ? 0.95 : 0.5}
                    />

                    {/* CORDILLERA TRAIL: Manila to Vigan Highway */}
                    <path
                      d={`M ${manilaPt.x} ${manilaPt.y} Q ${manilaPt.x - 20} ${manilaPt.y - 60} ${viganPt.x} ${viganPt.y}`}
                      fill="none"
                      stroke={activeRoute === 'cordillera-trail' ? '#39A96B' : '#39A96B'}
                      strokeWidth={activeRoute === 'cordillera-trail' ? '3.5' : '1.8'}
                      strokeDasharray="5 3"
                      opacity={activeRoute === 'cordillera-trail' ? 1 : 0.5}
                    />

                    {/* Vigan to Sagada Mountain Pass Highway */}
                    <path
                      d={`M ${viganPt.x} ${viganPt.y} Q ${viganPt.x + 15} ${viganPt.y + 12} ${sagadaPt.x} ${sagadaPt.y}`}
                      fill="none"
                      stroke={activeRoute === 'cordillera-trail' ? '#FFB84D' : '#FFB84D'}
                      strokeWidth={activeRoute === 'cordillera-trail' ? '3' : '1.8'}
                      strokeDasharray="4 4"
                      opacity={activeRoute === 'cordillera-trail' ? 1 : 0.5}
                    />

                    {/* SIARGAO PACIFIC SWELL: Cebu to Siargao Direct Flight */}
                    <path
                      d={`M ${cebuPt.x} ${cebuPt.y} Q ${cebuPt.x + 40} ${cebuPt.y + 15} ${siargaoPt.x} ${siargaoPt.y}`}
                      fill="none"
                      stroke={activeRoute === 'siargao-surf' ? '#FFB84D' : '#FFB84D'}
                      strokeWidth={activeRoute === 'siargao-surf' ? '3' : '1.5'}
                      strokeDasharray="4 4"
                      className="animate-dash"
                      opacity={activeRoute === 'siargao-surf' ? 1 : 0.45}
                    />

                    {/* Manila to Batanes Northern Frontier Flight */}
                    <path
                      d={`M ${manilaPt.x} ${manilaPt.y} Q ${manilaPt.x + 30} ${manilaPt.y - 120} ${batanesPt.x} ${batanesPt.y}`}
                      fill="none"
                      stroke="#FFB84D"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      className="animate-dash"
                      opacity={activeRoute === 'all' ? 0.6 : 0.25}
                    />
                  </g>
                )}

                {/* ═════════════════════════════════════════════════════════════════════ */}
                {/* 7. CLIMATE & MONSOON WINDS LAYER (When Active) */}
                {/* ═════════════════════════════════════════════════════════════════════ */}
                {activeLayer === 'climate' && (
                  <g className="transition-opacity duration-300 pointer-events-none">
                    {/* Amihan Northeast Trade Winds (Cool dry breezes Oct - May) */}
                    <path
                      d="M 520 120 Q 420 180 320 220"
                      fill="none"
                      stroke="#087EA4"
                      strokeWidth="2.5"
                      strokeDasharray="6 6"
                      className="animate-dash opacity-70"
                    />
                    <path
                      d="M 540 220 Q 450 280 350 320"
                      fill="none"
                      stroke="#087EA4"
                      strokeWidth="2.5"
                      strokeDasharray="6 6"
                      className="animate-dash opacity-70"
                    />
                    <text x="390" y="160" fill="#087EA4" fontSize="11" fontWeight="bold">
                      Amihan Winds (Nov - May)
                    </text>
                  </g>
                )}

                {/* ═════════════════════════════════════════════════════════════════════ */}
                {/* 8. INTERACTIVE DESTINATION PINS WITH ACCURATE COORDINATES */}
                {/* ═════════════════════════════════════════════════════════════════════ */}
                {mappedDestinations.map((dest) => {
                  const { svgX, svgY, isHighlighted, isSelected } = dest;

                  return (
                    <g
                      key={dest.id}
                      transform={`translate(${svgX}, ${svgY})`}
                      onClick={() => setSelectedPin(dest)}
                      onMouseEnter={() => setHoveredDest(dest)}
                      onMouseLeave={() => setHoveredDest(null)}
                      className="cursor-pointer group"
                      opacity={isHighlighted ? 1 : 0.35}
                    >
                      {/* Pulse sonar wave for selected destination */}
                      {isSelected && (
                        <circle
                          cx="0"
                          cy="0"
                          r="22"
                          fill="#087EA4"
                          fillOpacity="0.25"
                          className="animate-ping"
                        />
                      )}

                      {/* Outer Pin Halo */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 13 : 9}
                        fill={isSelected ? '#087EA4' : '#FFFFFF'}
                        stroke={isSelected ? '#FFB84D' : '#087EA4'}
                        strokeWidth={isSelected ? 3 : 2}
                        filter="url(#ph-pin-glow)"
                        className="transition-all duration-300 group-hover:scale-125"
                      />

                      {/* Inner Core */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 6 : 4}
                        fill={isSelected ? '#FFB84D' : '#39A96B'}
                      />

                      {/* Smart Pin Label with Collision Prevention */}
                      {/* We offset labels intelligently based on island position */}
                      {(() => {
                        // Determine optimal label offset: Palawan/West labels to left, East labels to right
                        const isWestSide = svgX < 260;
                        const labelX = isWestSide ? -(dest.name.length * 6 + 14) : 14;
                        const labelY = -12;
                        const labelWidth = dest.name.length * 6.2 + 10;

                        return (
                          <g className="transition-all duration-200">
                            <rect
                              x={labelX}
                              y={labelY}
                              width={labelWidth}
                              height="21"
                              rx="6"
                              fill={
                                isSelected
                                  ? '#087EA4'
                                  : 'rgba(16, 42, 67, 0.9)'
                              }
                              stroke={isSelected ? '#FFB84D' : 'rgba(255, 255, 255, 0.2)'}
                              strokeWidth={isSelected ? '1.5' : '0.5'}
                              className="group-hover:fill-[#087EA4]"
                            />
                            <text
                              x={labelX + 5}
                              y={labelY + 14}
                              fill="#FFFFFF"
                              fontSize="10"
                              fontWeight="bold"
                              fontFamily="system-ui, -apple-system, sans-serif"
                              className="pointer-events-none select-none"
                            >
                              {dest.name}
                            </text>
                          </g>
                        );
                      })()}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Quick Interactive Hover Tooltip */}
            {hoveredDest && (
              <div 
                className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#102A43]/95 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl border border-white/20 shadow-lg pointer-events-none flex items-center gap-2 z-20"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FFB84D]" />
                <span className="text-xs font-bold">{hoveredDest.name}</span>
                <span className="text-[10px] text-slate-300">({hoveredDest.region})</span>
                <span className="text-emerald-400 text-xs font-extrabold">₱{hoveredDest.estimatedDailyBudgetPHP.toLocaleString()}/d</span>
              </div>
            )}
          </div>

          {/* Map Legend & Sea Lane Guide */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-3 h-0.5 bg-[#087EA4] border-t border-dashed border-[#087EA4]" />
              <Ship className="w-3 h-3 text-[#087EA4] shrink-0" />
              <span>Fast Ferry Lane</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-3 h-0.5 bg-[#FFB84D] border-t border-dashed border-[#FFB84D]" />
              <Plane className="w-3 h-3 text-[#FFB84D] shrink-0" />
              <span>Flight Corridor</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-3 h-0.5 bg-[#39A96B] border-t border-dashed border-[#39A96B]" />
              <Bus className="w-3 h-3 text-[#39A96B] shrink-0" />
              <span>Scenic Highway</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#087EA4] ring-2 ring-[#FFB84D]" />
              <span>Selected Stop</span>
            </div>
          </div>
        </div>

        {/* Selected Destination Detailed Inspector Card & Route Connections */}
        <div className="lg:col-span-5 space-y-4">
          {/* Destination Hero Card */}
          <div className="bg-white dark:bg-[#0f233a] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            {/* Card Hero Image */}
            <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden group">
              <img
                src={selectedPin.heroImage}
                alt={selectedPin.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/4/45/Cloud_9_Boardwalk%2C_Siargao.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-bold border border-white/20">
                <Star className="w-3 h-3 text-[#FFB84D] fill-[#FFB84D]" />
                <span>{selectedPin.rating}</span>
                <span className="text-white/60 text-[10px]">({selectedPin.reviewCount})</span>
              </div>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#087EA4] text-white text-[10px] font-bold uppercase tracking-wider">
                    {selectedPin.region} Region
                  </span>
                  <span className="text-[11px] text-white/80 font-medium">
                    {selectedPin.idealDurationDays} Days Ideal
                  </span>
                </div>
                <h3 className="text-xl font-extrabold font-heading text-white tracking-tight">
                  {selectedPin.name}
                </h3>
                <p className="text-xs text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FFB84D] shrink-0" />
                  <span className="truncate">{selectedPin.location}</span>
                </p>
              </div>
            </div>

            {/* Tagline & Description */}
            <div>
              <p className="text-xs font-bold text-[#087EA4] dark:text-[#4DB8E8] mb-1">
                "{selectedPin.tagline}"
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {selectedPin.description}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-sky-50/70 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Est. Daily Budget
                </span>
                <span className="text-sm font-black text-[#087EA4] dark:text-[#4DB8E8]">
                  ₱{selectedPin.estimatedDailyBudgetPHP.toLocaleString()} / day
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Best Season
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-1">
                  {selectedPin.bestTimeToVisit.split('(')[0]}
                </span>
              </div>
            </div>

            {/* Signature Activities with Costs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Signature Island Experiences
                </h4>
                <span className="text-[10px] font-semibold text-[#087EA4] dark:text-[#4DB8E8]">
                  {selectedPin.popularActivities.length} Activities
                </span>
              </div>

              <div className="space-y-2">
                {selectedPin.popularActivities.slice(0, 3).map((act, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{act.duration}</span>
                      </span>
                    </div>
                    <span className="font-bold text-[#39A96B] shrink-0 text-xs">
                      ~₱{act.costPHP.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Island Specialties & Delicacies */}
            {selectedPin.localSpecialties && selectedPin.localSpecialties.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Must-Try Local Eats
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPin.localSpecialties.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-[11px] font-medium border border-amber-200/60 dark:border-amber-900/50"
                    >
                      🍽️ {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action CTA Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectDestination(selectedPin)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1"
              >
                <span>Full Island Guide</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onStartPlanning(selectedPin.name)}
                className="py-2.5 rounded-xl bg-[#087EA4] hover:bg-[#076c8c] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>Plan This Trip</span>
                <PlaneTakeoff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Route Itinerary & Ferry Connections Box */}
          {currentRouteData.stops.length > 0 && (
            <div className="bg-white dark:bg-[#0f233a] rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ship className="w-4 h-4 text-[#087EA4]" />
                  <h4 className="text-xs font-bold text-[#102A43] dark:text-white uppercase tracking-wider">
                    Route Sea & Land Connections
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-[#087EA4] bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-full border border-sky-200/50 dark:border-sky-800">
                  {currentRouteData.badge}
                </span>
              </div>

              <div className="space-y-2">
                {currentRouteData.stops.map((stop, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100">
                      <div className="flex items-center gap-1.5 truncate">
                        <span>{stop.from}</span>
                        <ArrowRight className="w-3 h-3 text-[#087EA4] shrink-0" />
                        <span>{stop.to}</span>
                      </div>
                      <span className="text-[#39A96B] shrink-0 text-[11px] font-extrabold">{stop.fare}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        {stop.mode === 'ferry' && <Ship className="w-3 h-3 text-[#087EA4]" />}
                        {stop.mode === 'flight' && <Plane className="w-3 h-3 text-[#FFB84D]" />}
                        {stop.mode === 'van' && <Bus className="w-3 h-3 text-[#39A96B]" />}
                        {stop.mode === 'bus' && <Bus className="w-3 h-3 text-[#39A96B]" />}
                        <span>{stop.duration}</span>
                      </span>
                      <span className="italic text-[10px] truncate max-w-[170px]">{stop.operator}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
