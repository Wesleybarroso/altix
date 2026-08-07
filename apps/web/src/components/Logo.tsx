import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, showText = true }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="relative flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_0_12px_rgba(0,200,83,0.6)]"
        >
          <rect width="40" height="40" rx="10" fill="#111827" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {/* Digital Pulse Heartbeat Radar Icon */}
          <path
            d="M8 20H14L17 12L21 28L25 16L28 20H32"
            stroke="#00C853"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="20" r="2" fill="#00E676" className="animate-ping" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-extrabold tracking-wider text-white font-sans">
            ALT<span className="text-altix-green">IX</span>
          </span>
          <span className="text-[10px] text-altix-muted tracking-widest font-mono uppercase mt-0.5">
            Realtime Pulse
          </span>
        </div>
      )}
    </div>
  );
};
