'use client';

import React, { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';
import { ShieldCheck, Activity, AlertTriangle, Clock, Maximize, RefreshCcw } from 'lucide-react';

export default function NOCModeTVPage() {
  const [time, setTime] = useState('');
  const [pulse, setPulse] = useState(22);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('pt-BR'));
      setPulse(Math.floor(Math.random() * 12) + 16);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#090D16] text-white p-8 flex flex-col justify-between select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-6">
          <Logo size={48} />
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-altix-green/10 border border-altix-green/30 text-altix-green font-bold text-sm">
            <span className="w-3 h-3 rounded-full bg-altix-green pulse-dot-online" />
            <span>NOC OPERATIONS CENTER • ACTIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-8 font-mono">
          <div className="text-right">
            <div className="text-xs text-altix-muted">HORÁRIO DE BRASÍLIA</div>
            <div className="text-3xl font-extrabold text-altix-green">{time || '15:52:00'}</div>
          </div>
        </div>
      </div>

      {/* Grid Status Cards for NOC Wall Display */}
      <div className="grid grid-cols-3 gap-6 my-8 flex-1">
        {/* Card 1: Main Status */}
        <div className="glass-card p-8 rounded-3xl flex flex-col justify-between border border-altix-green/40 bg-altix-green/5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-altix-muted uppercase tracking-wider">Status Geral</span>
            <ShieldCheck className="w-8 h-8 text-altix-green" />
          </div>
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-altix-green tracking-tight">OPERACIONAL</h2>
            <p className="text-sm text-altix-muted font-mono">4 de 5 serviços respondendo perfeitamente</p>
          </div>
          <div className="flex justify-between items-center text-xs font-mono text-altix-muted border-t border-white/10 pt-4">
            <span>SLA: 99.98%</span>
            <span>Sub-second sync</span>
          </div>
        </div>

        {/* Card 2: Live Latency */}
        <div className="glass-card p-8 rounded-3xl flex flex-col justify-between border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-altix-muted uppercase tracking-wider">Latência Média</span>
            <Activity className="w-8 h-8 text-altix-green" />
          </div>
          <div className="space-y-2">
            <h2 className="text-6xl font-black font-mono text-white tracking-tight">{pulse} <span className="text-2xl text-altix-green">ms</span></h2>
            <p className="text-sm text-altix-muted font-mono">Latência HTTP/TCP global</p>
          </div>
          <div className="flex justify-between items-center text-xs font-mono text-altix-muted border-t border-white/10 pt-4">
            <span>Região: us-east-1</span>
            <span>Workers: 500 Active</span>
          </div>
        </div>

        {/* Card 3: Active Incidents */}
        <div className="glass-card p-8 rounded-3xl flex flex-col justify-between border border-altix-offline/50 bg-altix-offline/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-altix-offline font-bold uppercase tracking-wider">Incidentes</span>
            <AlertTriangle className="w-8 h-8 text-altix-offline animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-6xl font-black font-mono text-altix-offline">1</h2>
            <p className="text-sm text-altix-offline font-mono font-bold">ns1.altix.io Down (DNS Error)</p>
          </div>
          <div className="flex justify-between items-center text-xs font-mono text-altix-offline border-t border-altix-offline/30 pt-4">
            <span>Alerta enviado via Telegram & WhatsApp</span>
          </div>
        </div>
      </div>

      {/* NOC Footer Bar */}
      <div className="flex items-center justify-between border-t border-white/10 pt-6 text-xs text-altix-muted font-mono">
        <div className="flex items-center gap-4">
          <span>ALTIX Enterprise NOC Platform</span>
          <span>•</span>
          <span className="text-altix-green">Redis Event Stream Connected</span>
        </div>
        <div>Pressione F11 para Tela Cheia</div>
      </div>
    </div>
  );
}
