import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    hero: 'w-20 h-20 sm:w-24 sm:h-24',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl sm:text-4xl',
    hero: 'text-4xl sm:text-5xl md:text-6xl',
  };

  const pillSizes = {
    sm: 'text-[9px] px-2 py-0.5 tracking-wider',
    md: 'text-[10px] px-2.5 py-0.5 tracking-widest',
    lg: 'text-xs px-3 py-1 tracking-widest',
    hero: 'text-xs sm:text-sm px-4 py-1.5 tracking-widest',
  };

  return (
    <div
      id="brand-logo-container"
      onClick={onClick}
      className={`inline-flex flex-col items-start select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Vector 3D Emblem replicating the OgojiPulse emblem from uploaded image */}
        <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center`}>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_0_12px_rgba(0,210,255,0.45)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="emblemGrad" x1="10" y1="90" x2="90" y2="10" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#002b66" />
                <stop offset="45%" stopColor="#0066ff" />
                <stop offset="100%" stopColor="#00d2ff" />
              </linearGradient>
              <linearGradient id="boltGrad" x1="30" y1="25" x2="45" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#00d2ff" />
              </linearGradient>
              <linearGradient id="arrowGrad" x1="45" y1="75" x2="85" y2="15" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0047ba" />
                <stop offset="60%" stopColor="#0080ff" />
                <stop offset="100%" stopColor="#00f0ff" />
              </linearGradient>
              <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Base Ring / Pulse Circle */}
            <circle
              cx="44"
              cy="52"
              r="30"
              stroke="url(#emblemGrad)"
              strokeWidth="9"
              fill="#080e1a"
              className="drop-shadow-md"
            />

            {/* Inner Lightning Bolt */}
            <path
              d="M44 32L34 50H44L40 68L56 46H45L50 32H44Z"
              fill="url(#boltGrad)"
              filter="url(#subtleGlow)"
            />

            {/* Ascending Pulse Arrow (Growth & Reach) */}
            <path
              d="M52 68L68 36L78 44L86 16L58 22L66 30L52 60Z"
              fill="url(#arrowGrad)"
              stroke="#ffffff"
              strokeWidth="1.5"
            />

            {/* Embedded Play Button Triangle inside Arrow path */}
            <polygon
              points="66,35 66,45 74,40"
              fill="#ffffff"
              className="opacity-95"
            />
          </svg>
        </div>

        {/* Brand Name Typography */}
        <div className="flex flex-col">
          <div className="flex items-baseline leading-none">
            <span
              className={`font-extrabold tracking-tight ${titleSizes[size]} bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent font-['Outfit'] drop-shadow-sm`}
            >
              Ogoji
            </span>
            <span
              className={`font-black tracking-tight ${titleSizes[size]} bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-300 bg-clip-text text-transparent font-['Outfit'] drop-shadow-[0_0_15px_rgba(0,210,255,0.4)]`}
            >
              Pulse
            </span>
          </div>
        </div>
      </div>

      {/* Subtitle Pill from Logo */}
      {showSubtitle && (
        <div className="mt-1.5 pl-0.5">
          <div
            className={`inline-flex items-center rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 font-bold uppercase shadow-[0_2px_8px_rgba(0,0,0,0.4)] ${pillSizes[size]}`}
          >
            <span className="text-cyan-400">TECH</span>
            <span className="mx-1 text-slate-500">|</span>
            <span className="text-sky-300">AI</span>
            <span className="mx-1 text-slate-500">|</span>
            <span className="text-blue-300">CREATION</span>
            <span className="mx-1 text-slate-500">|</span>
            <span className="text-teal-300">OPTIMIZATION</span>
          </div>
        </div>
      )}
    </div>
  );
};
