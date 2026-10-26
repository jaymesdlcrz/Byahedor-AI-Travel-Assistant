import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ByahedorLogo } from './ByahedorLogo';

interface LoadingScreenProps {
  message?: string;
  subtext?: string;
  onFinish?: () => void;
}

const PHILIPPINE_TRAVEL_TIPS = [
  "Plotting scenic island-hopping routes...",
  "Checking local pumpboat & ferry tides...",
  "Finding the crispiest lechon & freshest seafood...",
  "Calculating realistic Philippine Peso (₱) budgets...",
  "Packing reef-safe sunscreen & dry bags...",
  "Discovering hidden lagoons & secret beaches..."
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Preparing your journey...",
  subtext = "Plan. Explore. Byahe.",
  onFinish
}) => {
  const [tipIndex, setTipIndex] = useState(0);

  // Cycle through engaging travel tips
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % PHILIPPINE_TRAVEL_TIPS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      id="byahedor-loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5FAFC] dark:bg-[#09182A] px-6 text-center select-none overflow-hidden"
    >
      {/* Ambient Tropical Atmospheric Glows */}
      <div className="absolute w-96 h-96 bg-[#4DB8E8]/15 dark:bg-[#087EA4]/20 rounded-full blur-3xl pointer-events-none -top-12 -left-12 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute w-96 h-96 bg-[#39A96B]/15 dark:bg-[#39A96B]/15 rounded-full blur-3xl pointer-events-none -bottom-12 -right-12 animate-pulse" style={{ animationDuration: '5s' }} />

      <div className="relative z-10 flex flex-col items-center max-w-sm sm:max-w-md w-full">
        {/* Animated Brand Logo */}
        <motion.div
          initial={{ scale: 0.9, y: -8 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-4"
        >
          <ByahedorLogo size="xl" animated={true} />
        </motion.div>

        {/* Dynamic Flight Simulation Stage */}
        <div className="w-full max-w-[320px] sm:max-w-[360px] h-32 relative flex items-center justify-center my-2">
          <svg
            viewBox="0 0 300 90"
            className="w-full h-full overflow-visible drop-shadow-sm"
          >
            <defs>
              {/* Flight Path Gradient */}
              <linearGradient id="planeFlightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#087EA4" />
                <stop offset="50%" stopColor="#4DB8E8" />
                <stop offset="100%" stopColor="#39A96B" />
              </linearGradient>

              {/* Jet Exhaust Glow */}
              <linearGradient id="jetExhaustGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#FFB84D" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#4DB8E8" stopOpacity="0" />
              </linearGradient>

              {/* Plane Wing Drop Shadow */}
              <filter id="planeShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Drifting Background Tropical Clouds */}
            <g opacity="0.35" className="dark:opacity-20">
              <path
                d="M 72 20 C 72 16, 77 14, 81 15 C 83 12, 89 12, 92 15 C 95 14, 100 16, 100 20 C 102 20, 104 22, 104 24 C 104 26, 102 28, 99 28 L 73 28 C 70 28, 68 26, 68 24 C 68 22, 70 20, 72 20 Z"
                fill="#94A3B8"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="-10 0; 10 0; -10 0"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M 195 24 C 195 21, 199 19, 203 20 C 205 18, 209 18, 212 20 C 215 19, 219 21, 219 24 C 221 24, 222 25, 222 27 C 222 29, 220 30, 218 30 L 196 30 C 194 30, 192 29, 192 27 C 192 25, 194 24, 195 24 Z"
                fill="#94A3B8"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="10 0; -10 0; 10 0"
                  dur="10s"
                  repeatCount="indefinite"
                />
              </path>
            </g>

            {/* Origin Airport / Island Beacon (Manila NAIA) */}
            <g transform="translate(30, 52)">
              {/* Radar pulse ping */}
              <circle cx="0" cy="0" r="4" fill="none" stroke="#087EA4" strokeWidth="1.5">
                <animate attributeName="r" values="3; 16" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8; 0" dur="2.4s" repeatCount="indefinite" />
              </circle>
              {/* Base pin */}
              <circle cx="0" cy="0" r="7" fill="#087EA4" fillOpacity="0.18" />
              <circle cx="0" cy="0" r="4.5" fill="#087EA4" />
              <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />
              <text
                x="0"
                y="18"
                textAnchor="middle"
                fontSize="9"
                fill="#64748B"
                className="dark:fill-[#94A3B8] font-bold tracking-wider"
              >
                MNL
              </text>
            </g>

            {/* Destination Airport / Island Beacon (Palawan/Siargao) */}
            <g transform="translate(270, 52)">
              {/* Radar pulse ping */}
              <circle cx="0" cy="0" r="4" fill="none" stroke="#39A96B" strokeWidth="1.5">
                <animate attributeName="r" values="3; 16" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8; 0" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
              </circle>
              {/* Base pin */}
              <circle cx="0" cy="0" r="7" fill="#39A96B" fillOpacity="0.18" />
              <circle cx="0" cy="0" r="4.5" fill="#39A96B" />
              <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />
              <text
                x="0"
                y="18"
                textAnchor="middle"
                fontSize="9"
                fill="#39A96B"
                className="font-bold tracking-wider"
              >
                DEST
              </text>
            </g>

            {/* Atmospheric Ground Shadow Moving Along Baseline */}
            <g>
              <animateMotion
                path="M 30 54 L 270 54"
                dur="2.8s"
                repeatCount="indefinite"
                calcMode="spline"
                keyTimes="0; 0.5; 1"
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              />
              <ellipse cx="0" cy="0" rx="8" ry="2" fill="#087EA4">
                <animate attributeName="opacity" values="0.35; 0.08; 0.35" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="rx" values="6; 13; 6" dur="2.8s" repeatCount="indefinite" />
              </ellipse>
            </g>

            {/* Flight Route Base Guideline */}
            <path
              d="M 30 52 Q 150 -8 270 52"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="dark:stroke-[#334155] opacity-60"
            />

            {/* Active Flight Arc with Gradient & Moving Dashes */}
            <path
              d="M 30 52 Q 150 -8 270 52"
              fill="none"
              stroke="url(#planeFlightGrad)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
              className="opacity-90"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-60"
                dur="2.8s"
                repeatCount="indefinite"
              />
            </path>

            {/* ✈️ THE AIRPLANE: Animated Seamlessly with Precise Tangent Banking */}
            <g>
              {/* Native W3C SVG motion path animation */}
              <animateMotion
                path="M 30 52 Q 150 -8 270 52"
                dur="2.8s"
                repeatCount="indefinite"
                rotate="auto"
                calcMode="spline"
                keyTimes="0; 0.5; 1"
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              />

              {/* Smooth Take-off and Touchdown Opacity Fade */}
              <animate
                attributeName="opacity"
                values="0; 1; 1; 1; 0"
                keyTimes="0; 0.08; 0.5; 0.94; 1"
                dur="2.8s"
                repeatCount="indefinite"
              />

              {/* High-Fidelity Airliner Body, Centered at (0, 0) and Facing Forward (+X Direction) */}
              <g filter="url(#planeShadow)">
                {/* Dual Jet Engine Contrail Streams */}
                <line
                  x1="-4"
                  y1="-6"
                  x2="-24"
                  y2="-6"
                  stroke="url(#jetExhaustGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="-4"
                  y1="6"
                  x2="-24"
                  y2="6"
                  stroke="url(#jetExhaustGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Jet Engine Smoke Rings / Vapor Puffs */}
                <circle cx="-16" cy="-6" r="1.8" fill="#FFB84D" opacity="0.6">
                  <animate attributeName="r" values="1.8; 3.6; 1" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7; 0.2; 0.7" dur="0.6s" repeatCount="indefinite" />
                </circle>
                <circle cx="-16" cy="6" r="1.8" fill="#FFB84D" opacity="0.6">
                  <animate attributeName="r" values="1.8; 3.6; 1" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7; 0.2; 0.7" dur="0.6s" repeatCount="indefinite" />
                </circle>

                {/* Swept Main Wings (Span: ~32px) */}
                <path
                  d="M 5 -2.5 L -3 -15 L -6 -14.5 L -1.5 -2.5 Z"
                  fill="#FFB84D"
                />
                <path
                  d="M 5 2.5 L -3 15 L -6 14.5 L -1.5 2.5 Z"
                  fill="#FFB84D"
                />

                {/* Wingtips / Vertical Winglets */}
                <polygon points="-6,-14.5 -4.5,-17 -3,-15" fill="#F59E0B" />
                <polygon points="-6,14.5 -4.5,17 -3,15" fill="#F59E0B" />

                {/* Underwing Jet Turbines */}
                <rect x="-3" y="-7.2" width="6" height="2.4" rx="1.2" fill="#087EA4" />
                <circle cx="2.5" cy="-6" r="1.1" fill="#4DB8E8" />
                <rect x="-3" y="4.8" width="6" height="2.4" rx="1.2" fill="#087EA4" />
                <circle cx="2.5" cy="6" r="1.1" fill="#4DB8E8" />

                {/* Horizontal Tail Stabilizers */}
                <path
                  d="M -10 -1.5 L -16 -7.5 L -18 -7 L -14 -1 Z"
                  fill="#F59E0B"
                />
                <path
                  d="M -10 1.5 L -16 7.5 L -18 7 L -14 1 Z"
                  fill="#F59E0B"
                />

                {/* Main Fuselage (Nose Pointing Forward to the Right at x=18) */}
                <path
                  d="M 18 0 
                     C 16.5 -2.2, 10 -2.8, 1 -2.8 
                     L -12 -2.2 
                     L -16 -0.6 
                     L -17 0 
                     L -16 0.6 
                     L -12 2.2 
                     L 1 2.8 
                     C 10 2.8, 16.5 2.2, 18 0 Z"
                  fill="#FFFFFF"
                  stroke="#087EA4"
                  strokeWidth="0.8"
                />

                {/* Airline Livery Golden Accent Stripe */}
                <path
                  d="M 15 0 C 12 -0.8, 3 -0.9, -10 -0.7 L -10 0.7 C 3 0.9, 12 0.8, 15 0 Z"
                  fill="#FFB84D"
                />

                {/* Tinted Cockpit Windshield */}
                <path
                  d="M 14.5 -1.1 C 15.2 -0.5, 15.2 0.5, 14.5 1.1 L 11.5 1.4 L 11.5 -1.4 Z"
                  fill="#0B192C"
                />

                {/* Vertical Tail Fin Top Highlight */}
                <line x1="-12" y1="0" x2="-17" y2="0" stroke="#087EA4" strokeWidth="1.2" strokeLinecap="round" />
              </g>
            </g>
          </svg>
        </div>

        {/* Primary Status Title */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-1.5 mt-1"
        >
          <h3 className="text-lg sm:text-xl font-extrabold text-[#102A43] dark:text-white font-heading tracking-tight">
            {message}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-[#087EA4] dark:text-[#4DB8E8] tracking-widest uppercase">
            {subtext}
          </p>
        </motion.div>

        {/* Rotating Philippine Travel Inspiration Tip */}
        <div className="h-8 flex items-center justify-center mt-3 px-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-slate-500 dark:text-slate-400 italic font-medium"
            >
              🌴 {PHILIPPINE_TRAVEL_TIPS[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Triple Pulsing Rhythm Indicator */}
        <div className="flex gap-2 mt-4 items-center">
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
            className="w-2.5 h-2.5 rounded-full bg-[#087EA4]"
          />
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            className="w-2.5 h-2.5 rounded-full bg-[#4DB8E8]"
          />
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
            className="w-2.5 h-2.5 rounded-full bg-[#39A96B]"
          />
        </div>
      </div>
    </motion.div>
  );
};
