'use client';

import React from 'react';
import { Logo } from '@/components/Logo';
import { UptimeBar } from '@/components/UptimeBar';
import { ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink, Clock } from 'lucide-react';

export default function PublicStatusPage() {
  const services = [
    { name: 'Core API Gateway & Router', status: 'OPERATIONAL', uptime: 99.99 },
    { name: 'Payment & Stripe Webhook Engine', status: 'OPERATIONAL', uptime: 100.0 },
    { name: 'Global DNS Resolution & CDN', status: 'DEGRADED', uptime: 98.45 },
    { name: 'Database Cluster & Cache', status: 'OPERATIONAL', uptime: 99.98 },
    { name: 'Dashboard Web App', status: 'OPERATIONAL', uptime: 100.0 },
  ];

  return (
    <div className="min-h-screen bg-altix-bg text-white p-4 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Logo size={40} />
          <div className="flex items-center gap-2">
            <span className="text-xs text-altix-muted font-mono">Status em Tempo Real</span>
            <span className="w-2 h-2 rounded-full bg-altix-green pulse-dot-online" />
          </div>
        </div>

        {/* Global Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 to-altix-green/20 border border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Alguns Sistemas Apresentam Desempenho Degradado</h2>
              <p className="text-xs text-altix-muted">
                Investigando latência em registros DNS na região us-east-1. Demais serviços operando normalmente.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/30 text-amber-300">
            DEGRADED PERFORMANCE
          </span>
        </div>

        {/* Services Status List */}
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <h3 className="text-sm font-bold tracking-wider text-altix-muted uppercase">Serviços da Infraestrutura</h3>

          <div className="space-y-6 divide-y divide-white/10">
            {services.map((svc, i) => (
              <div key={svc.name} className={i === 0 ? '' : 'pt-6'}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm text-white">{svc.name}</span>
                  {svc.status === 'OPERATIONAL' ? (
                    <span className="text-xs font-bold text-altix-green flex items-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-4 h-4" /> OPERACIONAL
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                      <AlertTriangle className="w-4 h-4" /> PERFORMANCE DEGRADADA
                    </span>
                  )}
                </div>
                <UptimeBar days={60} uptimePercent={svc.uptime} />
              </div>
            ))}
          </div>
        </div>

        {/* Incident History */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold tracking-wider text-altix-muted uppercase">Histórico de Incidentes Recentes</h3>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400">DNS Resolution Degradation (us-east-1)</span>
                <span className="text-altix-muted font-mono">Hoje às 15:37 GMT</span>
              </div>
              <p className="text-xs text-altix-muted">
                Identificamos falhas intermitentes nos servidores DNS autoritativos. Engenheiros aplicando mitigação via rota BGP.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-altix-muted space-y-2 pt-6 border-t border-white/10">
          <p>Powered by <strong className="text-white">ALTIX Real-time Monitoring Engine</strong></p>
          <p className="font-mono text-[10px]">Atualização automática a cada 10 segundos • Uptime Global 99.98%</p>
        </footer>
      </div>
    </div>
  );
}
