'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Activity, AlertTriangle, ShieldCheck, Tv, Settings, LogOut, Users } from 'lucide-react';
import { Logo } from './Logo';
import { logoutUser } from '@/lib/authStore';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Monitores', href: '/monitors', icon: Activity, badge: '5' },
    { name: 'Incidentes', href: '/incidents', icon: AlertTriangle, badge: '1', alert: true },
    { name: 'Status Page', href: '/status-page', icon: ShieldCheck },
    { name: 'Modo TV (NOC)', href: '/tv', icon: Tv },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen glass-card border-r border-white/10 flex flex-col justify-between p-4 sticky top-0 z-30">
      <div className="space-y-8">
        {/* Brand */}
        <div className="px-2 pt-2">
          <Logo size={36} />
        </div>

        {/* Workspace Selector */}
        <div className="px-2 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-altix-green/20 border border-altix-green/40 flex items-center justify-center font-bold text-altix-green text-xs">
              AC
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-white truncate">Acme Cloud Corp</span>
              <span className="text-[10px] text-altix-muted font-mono">Enterprise Plan</span>
            </div>
          </div>
          <Users className="w-4 h-4 text-altix-muted" />
        </div>

        {/* Main Nav */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-altix-green/15 text-altix-green border border-altix-green/30 shadow-glow'
                    : 'text-altix-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-altix-green' : 'text-altix-muted group-hover:text-white'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      item.alert
                        ? 'bg-altix-offline/20 text-altix-offline border border-altix-offline/40 animate-pulse'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <div className="px-3 py-2 rounded-xl bg-altix-green/10 border border-altix-green/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-altix-green pulse-dot-online" />
            <span className="text-xs font-medium text-altix-green">Engine Online</span>
          </div>
          <span className="text-[10px] text-altix-muted font-mono">1.0s Pulse</span>
        </div>

        <button
          onClick={() => logoutUser()}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-altix-muted hover:text-altix-offline transition-colors rounded-xl hover:bg-altix-offline/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
};
