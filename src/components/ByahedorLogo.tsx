import React from 'react';

interface ByahedorLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'white' | 'dark' | 'icon-only';
  showTagline?: boolean;
  animated?: boolean;
  className?: string;
  id?: string;
}

export const ByahedorLogo: React.FC<ByahedorLogoProps> = ({
  size = 'md',
  variant = 'full',
  showTagline = false,
  animated = false,
  className = '',
  id = 'byahedor-brand-logo'
}) => {
  // Dimensions map
  const sizeMap = {
    sm: { icon: 32, text: 'text-xl', tagline: 'text-[10px]', gap: 'gap-2' },
    md: { icon: 42, text: 'text-2xl', tagline: 'text-xs', gap: 'gap-2.5' },
    lg: { icon: 54, text: 'text-3xl', tagline: 'text-sm', gap: 'gap-3' },
    xl: { icon: 72, text: 'text-4xl', tagline: 'text-base', gap: 'gap-4' },
  };

  const { icon, text, tagline, gap } = sizeMap[size];

  // Color configurations based on variant
  const isWhite = variant === 'white';
  const isDark = variant === 'dark';

  return (
    <div id={id} className={`flex items-center ${gap} select-none cursor-pointer group ${className}`}>
      {/* Custom Original Byahedor SVG Symbol */}
      <div 
        className={`relative flex items-center justify-center transition-transform duration-300 ${
          animated ? 'group-hover:scale-105' : ''
        }`}
        style={{ width: icon, height: icon }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Primary Pin Gradient */}
            <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#087EA4" />
              <stop offset="60%" stopColor="#4DB8E8" />
              <stop offset="100%" stopColor="#39A96B" />
            </linearGradient>

            {/* Travel Journey Arc Gradient */}
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB84D" />
              <stop offset="100%" stopColor="#FF8C42" />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Smooth Location Pin Silhouette */}
          <path
            d="M50 6C31.2 6 16 21.2 16 40C16 63 46 91.5 48.5 93.8C49.4 94.6 50.6 94.6 51.5 93.8C54 91.5 84 63 84 40C84 21.2 68.8 6 50 6Z"
            fill={isWhite ? '#FFFFFF' : isDark ? '#087EA4' : 'url(#pinGrad)'}
            className="transition-all duration-300"
          />

          {/* Inner Depth ring */}
          <ellipse
            cx="50"
            cy="39"
            rx="27"
            ry="27"
            fill={isWhite ? '#087EA4' : 'rgba(10, 42, 67, 0.22)'}
          />

          {/* Curved Travel Trajectory Path forming subtle 'B' Loop */}
          <path
            d="M32 50 C32 30, 62 25, 66 38 C70 50, 40 56, 56 65"
            stroke="url(#arcGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={animated ? "4 2" : "none"}
            fill="none"
            className={animated ? "animate-pulse" : ""}
          />

          {/* Dynamic Taking-off Airplane Silhouette */}
          <g transform="translate(48, 38) rotate(-35) translate(-20, -20)">
            {/* Airplane Body */}
            <path
              d="M20 2L23 14L36 21L36 24L23 21L23 32L28 35L28 38L20 36L12 38L12 35L17 32L17 21L4 24L4 21L17 14Z"
              fill={isWhite ? '#FFFFFF' : '#FFFFFF'}
              filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.25))"
            />
          </g>

          {/* Discovery Star / Spark representing exploration */}
          <g transform="translate(68, 16)">
            <path
              d="M0 -6 Q0 0 6 0 Q0 0 0 6 Q0 0 -6 0 Q0 0 0 -6Z"
              fill="#FFB84D"
              className={animated ? "animate-spin" : ""}
              style={{ transformOrigin: '0 0', animationDuration: '6s' }}
            />
          </g>

          {/* Mini Ripple dot at base */}
          <circle cx="50" cy="94" r="2.5" fill="#39A96B" opacity="0.8" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center">
            <span
              className={`font-extrabold tracking-tight font-heading ${text} ${
                isWhite
                  ? 'text-white'
                  : isDark
                  ? 'text-white'
                  : 'text-[#102A43] dark:text-white'
              }`}
            >
              Byahe<span className="text-[#087EA4] dark:text-[#4DB8E8]">dor</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#39A96B] ml-1 mb-1 inline-block animate-pulse"></span>
          </div>

          {showTagline && (
            <span
              className={`font-medium tracking-wide mt-0.5 ${tagline} ${
                isWhite
                  ? 'text-white/80'
                  : isDark
                  ? 'text-slate-300'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Plan. Explore. Byahe.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
