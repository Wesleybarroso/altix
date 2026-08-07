'use client';

import React from 'react';

interface UptimeBarProps {
  days?: number;
  uptimePercent?: number;
}

export const UptimeBar: React.FC<UptimeBarProps> = ({ days = 60, uptimePercent = 99.98 }) => {
  // Generate mock history bars
  const bars = Array.from({ length: days }).map((_, i) => {
    const isDegraded = i === 12;
    const isDown = i === 42;
    return {
      day: i,
      status: isDown ? 'DOWN' : isDegraded ? 'DEGRADED' : 'UP',
      latencyMs: isDown ? 0 : isDegraded ? 480 : Math.floor(Math.random() * 25) + 12,
    };
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-altix-muted font-mono">Disponibilidade últimos {days} dias</span>
        <span className="text-altix-green font-bold font-mono">{uptimePercent}%</span>
      </div>
      <div className="flex items-center gap-1 h-8">
        {bars.map((bar) => {
          let bgClass = 'bg-altix-green hover:bg-altix-green-light';
          if (bar.status === 'DEGRADED') bgClass = 'bg-altix-warning';
          if (bar.status === 'DOWN') bgClass = 'bg-altix-offline';

          return (
            <div
              key={bar.day}
              className={`flex-1 h-full rounded-sm ${bgClass} transition-all cursor-pointer relative group`}
            >
              {/* Tooltip */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col px-2.5 py-1.5 rounded-lg glass-card border border-white/20 text-[10px] whitespace-nowrap z-30 shadow-xl pointer-events-none">
                <span className="font-bold text-white">Há {days - bar.day} dias</span>
                <span className="text-altix-muted">Status: {bar.status}</span>
                <span className="text-altix-green font-mono">Latência: {bar.latencyMs}ms</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
