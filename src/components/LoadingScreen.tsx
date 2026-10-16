import React from 'react';
import { motion } from 'motion/react';
import { ByahedorLogo } from './ByahedorLogo';

interface LoadingScreenProps {
  message?: string;
  subtext?: string;
  onFinish?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Preparing your journey...",
  subtext = "Plan. Explore. Byahe."
}) => {
  return (
    <motion.div
      id="byahedor-loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5FAFC] dark:bg-[#0B192C] px-6 text-center select-none"
    >
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 bg-[#4DB8E8]/10 dark:bg-[#087EA4]/15 rounded-full blur-3xl pointer-events-none -top-10 -left-10" />
      <div className="absolute w-96 h-96 bg-[#39A96B]/10 dark:bg-[#39A96B]/10 rounded-full blur-3xl pointer-events-none -bottom-10 -right-10" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Animated Brand Logo */}
        <motion.div
          initial={{ scale: 0.85, y: -10 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <ByahedorLogo size="xl" animated={true} />
        </motion.div>

        {/* Travel Path Animation SVG with Pin -> Curved Flight -> Pin */}
        <div className="w-full max-w-xs h-24 relative flex items-center justify-center my-4">
          <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
            {/* Origin Pin */}
            <g transform="translate(30, 45)">
              <circle cx="0" cy="0" r="10" fill="#087EA4" fillOpacity="0.15" />
              <circle cx="0" cy="0" r="5" fill="#087EA4" />
              <text x="0" y="20" textAnchor="middle" fontSize="10" fill="#64748B" fontWeight="600">Origin</text>
            </g>

            {/* Destination Pin */}
            <g transform="translate(270, 45)">
              <circle cx="0" cy="0" r="10" fill="#39A96B" fillOpacity="0.15" />
              <circle cx="0" cy="0" r="5" fill="#39A96B" />
              <text x="0" y="20" textAnchor="middle" fontSize="10" fill="#64748B" fontWeight="600">Destinasyon</text>
            </g>

            {/* Dotted Flight Path */}
            <path
              d="M 30 45 Q 150 -10 270 45"
              fill="none"
              stroke="#4DB8E8"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className="animate-dash opacity-70"
            />

            {/* Animated Airplane travelling along path */}
            <motion.g
              animate={{
                offsetDistance: ["0%", "100%"],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                offsetPath: 'path("M 30 45 Q 150 -10 270 45")',
                offsetRotate: 'auto',
              }}
            >
              <g transform="translate(-10, -10)">
                <path
                  d="M10 2L12 9L20 13L20 15L12 13L12 19L15 21L15 23L10 22L5 23L5 21L8 19L8 13L0 15L0 13L8 9Z"
                  fill="#FFB84D"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                />
              </g>
            </motion.g>
          </svg>
        </div>

        {/* Status Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2 mt-2"
        >
          <h3 className="text-lg font-bold text-[#102A43] dark:text-white font-heading">
            {message}
          </h3>
          <p className="text-sm font-semibold text-[#087EA4] dark:text-[#4DB8E8] tracking-widest uppercase">
            {subtext}
          </p>
        </motion.div>

        {/* Subtle pulsing dots */}
        <div className="flex gap-1.5 mt-6">
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 rounded-full bg-[#087EA4]"
          />
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-[#4DB8E8]"
          />
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-[#39A96B]"
          />
        </div>
      </div>
    </motion.div>
  );
};
