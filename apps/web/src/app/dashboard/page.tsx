// Dashboard page (moved from root)
'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { UptimeBar } from '@/components/UptimeBar';
import { Activity, ShieldCheck, AlertTriangle, Clock, Server, Lock, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [liveLatency, setLiveLatency] = useState(24);
  const [pulseCount, setPulseCount] = useState(14820);

  // Simulated telemetry (1‑second updates)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLatency(Math.floor(Math.random() * 15) + 18);
      setPulseCount((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const chartData = [
    { time: '14:00', latency: 22 },
    { time: '14:15', latency: 24 },
    { time: '14:30', latency: 19 },
    { time: '14:45', latency: 31 },
    { time: '15:00', latency: 28 },
    { time: '15:15', latency: 22 },
    { time: '15:30', latency: liveLatency },
  ];

  const monitors = [
    { id: 'mon-101', name: 'Production API Gateway', type: 'HTTP', target: 'https://api.altix.io/health', status: 'UP', latency: liveLatency, uptime: 99.98 },
    { id: 'mon-102', name: 'Stripe Webhook Receiver', type: 'HTTP', target: 'https://payments.altix.io/webhooks', status: 'UP', latency: 42, uptime: 100 },
    { id: 'mon-103', name: 'Primary SSL Certificate', type: 'SSL', target: 'altix.io (74d)', status: 'UP', latency: 12, uptime: 100 },
    { id: 'mon-104', name: 'Redis Cache Cluster', type: 'TCP', target: 'redis.internal.altix.io:6379', status: 'UP', latency: 4, uptime: 99.99 },
    { id: 'mon-105', name: 'US‑East DNS Nameserver', type: 'DNS', target: 'ns1.altix.io', status: 'DOWN', latency: 0, uptime: 98.45 },
  ];

  return (
    <div className="flex min-h-screen bg-altix-bg text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Header banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-altix-green/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-1 z-10">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight">Painel de Disponibilidade</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-altix-green/20 text-altix-green text-xs font-mono font-bold border border-altix-green/30">
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-sm text-altix-muted">Monitoramento contínuo em tempo real. Sub‑segundo pulse ativado (~1 s latency broadcast).</p>
            </div>
            <div className="flex items-center gap-6 z-10">
              <div className="flex flex-col text-right">
                <span className="text-xs text-altix-muted font-mono">Verificações Hoje</span>
                <span className="text-xl font-bold font-mono text-altix-green">{pulseCount.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs text-altix-muted font-mono">SLA Global</span>
                <span className="text-xl font-bold font-mono text-white">99.98%</span>
              </div>
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 – Ativos monitorados */}
            <div className="glass-card glass-card-hover p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-altix-muted font-medium">Ativos Monitorados</span>
                <div className="p-2 rounded-xl bg-altix-green/10 text-altix-green"><Activity className="w-4 h-4" /></div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold font-mono">5</span>
                <span className="text-xs text-altix-green flex items-center">+2 este mês <ArrowUpRight className="w-3 h-3 ml-0.5" /></span>
              </div>
              <div className="text-[11px] text-altix-muted flex gap-2"><span>3 HTTP</span> • <span>1 SSL</span> • <span>1 TCP</span></div>
            </div>
            {/* Card 2 – Serviços online */}
            <div className="glass-card glass-card-hover p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-altix-muted font-medium">Serviços Online</span>
                <div className="p-2 rounded-xl bg-altix-green/10 text-altix-green"><ShieldCheck className="w-4 h-4" /></div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold font-mono text-altix-green">4 / 5</span>
                <span className="px-2 py-0.5 rounded-full bg-altix-green/20 text-altix-green font-bold">80% ONLINE</span>
              </div>
              <div className="text-[11px] text-altix-muted">Latência média: {liveLatency} ms</div>
            </div>
            {/* Card 3 – Incidentes */}
            <div className="glass-card glass-card-hover p-5 rounded-2xl border-altix-offline/30">
              <div className="flex items-center justify-between">
                <span className="text-xs text-altix-muted font-medium">Incidentes Ativos</span>
                <div className="p-2 rounded-xl bg-altix-offline/10 text-altix-offline"><AlertTriangle className="w-4 h-4" /></div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold font-mono text-altix-offline">1</span>
                <span className="px-2 py-0.5 rounded-full bg-altix-offline/20 text-altix-offline font-bold animate-pulse">CRÍTICO</span>
              </div>
              <div className="text-[11px] text-altix-offline">ns1.altix.io Down</div>
            </div>
            {/* Card 4 – SSL expirando */}
            <div className="glass-card glass-card-hover p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-altix-muted font-medium">SSL Expirando</span>
                <div className="p-2 rounded-xl bg-altix-warning/10 text-altix-warning"><Lock className="w-4 h-4" /></div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold font-mono text-altix-warning">74d</span>
                <span className="text-xs text-altix-muted">altix.io</span>
              </div>
              <div className="text-[11px] text-altix-muted">Cadeia 100% Válida</div>
            </div>
          </div>

          {/* Real‑time latency chart */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Clock className="w-4 h-4 text-altix-green" /> Latência da Infraestrutura em Tempo Real</h3>
                <p className="text-xs text-altix-muted">Tempo médio de resposta (TTFB + DNS + TCP)</p>
              </div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-altix-green pulse-dot-online" /> <span className="text-xs font-mono text-altix-green font-bold">{liveLatency} ms</span></div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C853" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00C853" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit="ms" />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#00C853' }} />
                  <Area type="monotone" dataKey="latency" stroke="#00C853" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monitors table */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><Server className="w-4 h-4 text-altix-green" /> Ativos Sob Monitoramento ({monitors.length})</h3>
              <button className="text-xs text-altix-green hover:underline font-semibold">Ver Todos</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-altix-muted font-mono">
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4">NOME DO MONITOR</th>
                    <th className="py-3 px-4">TIPO</th>
                    <th className="py-3 px-4">TARGET / ENDPOINT</th>
                    <th className="py-3 px-4">LATÊNCIA</th>
                    <th className="py-3 px-4">HISTÓRICO 60D</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {monitors.map((mon) => (
                    <tr key={mon.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        {mon.status === 'UP' ? (
                          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-altix-green pulse-dot-online" /> <span className="font-bold text-altix-green font-mono">ONLINE</span></div>
                        ) : (
                          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-altix-offline pulse-dot-offline" /> <span className="font-bold text-altix-offline font-mono">OFFLINE</span></div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">{mon.name}</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px]">{mon.type}</span></td>
                      <td className="py-3 px-4 font-mono text-altix-muted">{mon.target}</td>
                      <td className="py-3 px-4 font-mono font-bold">{mon.latency > 0 ? `${mon.latency} ms` : '—'}</td>
                      <td className="py-3 px-4 w-48"><UptimeBar days={30} uptimePercent={mon.uptime} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
