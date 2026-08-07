'use client';

import React from 'react';
import { Search, Bell, ShieldCheck, Sun, Moon, Plus } from 'lucide-react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  return (
    <header className="h-16 glass-card border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search trigger */}
      <button
        onClick={() => {
          const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
          window.dispatchEvent(event);
        }}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-altix-green/40 text-altix-muted hover:text-white transition-all text-xs w-72"
      >
        <Search className="w-4 h-4 text-altix-green" />
        <span className="flex-1 text-left">Buscar recursos...</span>
        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">⌘K</kbd>
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {/* System Health Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-altix-green/10 border border-altix-green/30 text-xs text-altix-green font-medium">
          <span className="w-2 h-2 rounded-full bg-altix-green pulse-dot-online" />
          <span>99.98% Sistema Operacional</span>
        </div>

        {/* Action Button */}
        <Link
          href="/monitors?new=true"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-altix-green text-black font-semibold text-xs hover:bg-altix-green-light transition-all shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Monitor</span>
        </Link>

        {/* Notifications */}
        <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-altix-muted hover:text-white transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-altix-offline" />
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-altix-green to-emerald-400 p-[1px]">
          <div className="w-full h-full rounded-[11px] bg-slate-900 flex items-center justify-center font-bold text-xs text-altix-green">
            WS
          </div>
        </div>
      </div>
    </header>
  );
};
