'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Plus, Globe, Lock, Network, Cpu, MoreVertical, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';

export default function MonitorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [protocol, setProtocol] = useState('HTTP');
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [interval, setInterval] = useState('30');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [monitors, setMonitors] = useState([
    { id: 'mon-101', name: 'Production API Gateway', protocol: 'HTTP', target: 'https://api.altix.io/health', status: 'UP', latency: 34, interval: '15s', uptime: '99.98%', lastChecked: 'Agora mesmo' },
    { id: 'mon-102', name: 'Stripe Webhook Receiver', protocol: 'HTTP', target: 'https://payments.altix.io/webhooks', status: 'UP', latency: 82, interval: '30s', uptime: '100.0%', lastChecked: 'Há 5s' },
    { id: 'mon-103', name: 'Primary SSL Certificate', protocol: 'SSL', target: 'altix.io', status: 'UP', latency: 12, interval: '1h', uptime: '100.0%', lastChecked: 'Há 2m' },
    { id: 'mon-104', name: 'Redis Cache Cluster', protocol: 'TCP', target: 'redis.internal.altix.io:6379', status: 'UP', latency: 4, interval: '10s', uptime: '99.99%', lastChecked: 'Há 1s' },
    { id: 'mon-105', name: 'US-East DNS Nameserver', protocol: 'DNS', target: 'ns1.altix.io', status: 'DOWN', latency: 0, interval: '60s', uptime: '98.45%', lastChecked: 'Há 12s' },
  ]);

  const handleAddMonitor = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !target.trim()) {
      setErrorMsg('Por favor, informe o nome do monitor e o destino.');
      return;
    }

    // 1. URL / Host Validation
    let formattedTarget = target.trim();
    if (protocol === 'HTTP' || protocol === 'HTTPS') {
      if (!formattedTarget.startsWith('http://') && !formattedTarget.startsWith('https://')) {
        formattedTarget = `https://${formattedTarget}`;
      }
      try {
        new URL(formattedTarget);
      } catch (err) {
        setErrorMsg('URL inválida. Exemplo válido: https://api.empresa.com');
        return;
      }
    }

    setIsSubmitting(true);

    // 2. Immediate Initial Check Execution simulation
    setTimeout(() => {
      setIsSubmitting(false);
      const isDown = formattedTarget.includes('error') || formattedTarget.includes('down');
      const initialLatency = isDown ? 0 : Math.floor(Math.random() * 35) + 15;

      const newMon = {
        id: `mon-${Date.now()}`,
        name: name.trim(),
        protocol,
        target: formattedTarget,
        status: isDown ? 'DOWN' : 'UP',
        latency: initialLatency,
        interval: `${interval}s`,
        uptime: '100.0%',
        lastChecked: 'Verificação inicial concluída agora',
      };

      setMonitors((prev) => [newMon, ...prev]);
      setSuccessMsg(`Monitor "${name}" cadastrado e 1ª verificação executada (${newMon.status})!`);
      setName('');
      setTarget('');
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg('');
      }, 1200);
    }, 700);
  };

  return (
    <div className="flex min-h-screen bg-altix-bg text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Gestão de Monitores</h1>
              <p className="text-sm text-altix-muted">
                Gerencie todos os seus ativos monitorados em tempo real (HTTP, SSL, TCP, DNS, DBs).
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-altix-green text-black font-bold text-sm hover:bg-altix-green-light transition-all shadow-glow"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Monitor</span>
            </button>
          </div>

          {/* Protocols Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
            {['TODOS', 'HTTP/S', 'SSL', 'TCP/UDP', 'DNS', 'BANCOS DE DADOS', 'DOCKER/K8S'].map((tab, idx) => (
              <button
                key={tab}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  idx === 0
                    ? 'bg-altix-green/20 text-altix-green border border-altix-green/30'
                    : 'text-altix-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Monitors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monitors.map((mon) => (
              <div key={mon.id} className="glass-card glass-card-hover p-5 rounded-2xl space-y-4 relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${mon.status === 'UP' ? 'bg-altix-green/10 text-altix-green' : 'bg-altix-offline/10 text-altix-offline'}`}>
                      {mon.protocol === 'HTTP' && <Globe className="w-5 h-5" />}
                      {mon.protocol === 'SSL' && <Lock className="w-5 h-5" />}
                      {mon.protocol === 'TCP' && <Network className="w-5 h-5" />}
                      {mon.protocol === 'DNS' && <Cpu className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{mon.name}</h4>
                      <span className="text-[11px] text-altix-muted font-mono block truncate max-w-[180px]">{mon.target}</span>
                    </div>
                  </div>
                  <button className="text-altix-muted hover:text-white p-1">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${mon.status === 'UP' ? 'bg-altix-green pulse-dot-online' : 'bg-altix-offline pulse-dot-offline'}`} />
                    <span className={`font-mono font-bold ${mon.status === 'UP' ? 'text-altix-green' : 'text-altix-offline'}`}>
                      {mon.status}
                    </span>
                  </div>
                  <span className="font-mono text-altix-muted">Latência: {mon.latency > 0 ? `${mon.latency}ms` : '—'}</span>
                  <span className="font-mono text-altix-green font-bold">{mon.uptime}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Create Monitor */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
              <div className="w-full max-w-lg glass-card p-6 rounded-2xl space-y-5 border border-white/20">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-extrabold text-lg">Criar Novo Monitor</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-altix-muted hover:text-white">✕</button>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-altix-offline/10 border border-altix-offline/30 text-altix-offline text-xs font-semibold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-xl bg-altix-green/10 border border-altix-green/30 text-altix-green text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAddMonitor} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-altix-muted block mb-1">Protocolo de Verificação</label>
                    <select
                      value={protocol}
                      onChange={(e) => setProtocol(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                    >
                      <option value="HTTP">HTTP / HTTPS (REST API)</option>
                      <option value="SSL">Certificado SSL / TLS</option>
                      <option value="TCP">TCP Port / Socket</option>
                      <option value="DNS">Resolução de Nome DNS</option>
                      <option value="PING">ICMP Ping</option>
                      <option value="POSTGRES">PostgreSQL Database</option>
                      <option value="REDIS">Redis Cache Cluster</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-altix-muted block mb-1">Nome do Monitor</label>
                    <input
                      type="text"
                      placeholder="Ex: API de Pagamentos Production"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-altix-muted block mb-1">URL / Host / IP Target</label>
                    <input
                      type="text"
                      placeholder="https://api.empresa.com/health ou 192.168.1.1:5432"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-altix-muted block mb-1">Intervalo de Checagem</label>
                    <select
                      value={interval}
                      onChange={(e) => setInterval(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                    >
                      <option value="10">10 segundos (Pro Plan)</option>
                      <option value="30">30 segundos</option>
                      <option value="60">60 segundos</option>
                      <option value="300">5 minutos</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-altix-muted hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-altix-green text-black font-bold text-xs hover:bg-altix-green-light transition-all shadow-glow disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Executando 1ª Verificação...</span>
                        </>
                      ) : (
                        <span>Salvar & Verificar Agora</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
