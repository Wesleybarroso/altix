'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import {
  Plus,
  Globe,
  Lock,
  Network,
  Cpu,
  MoreVertical,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Edit,
  Trash2,
} from 'lucide-react';

import { useMonitorsStore, Monitor } from './useMonitorsStore';
import { useMonitorChecker } from './useMonitorChecker';

export default function MonitorsPage() {
  // Store hook
  const { monitors, addMonitor, deleteMonitor, updateMonitor } = useMonitorsStore();

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', protocol: 'HTTP' as Monitor['protocol'], target: '', interval: 30 });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Populate form when editing
  useEffect(() => {
    if (editingId) {
      const mon = monitors.find(m => m.id === editingId);
      if (mon) {
        setForm({
          name: mon.name,
          protocol: mon.protocol as Monitor['protocol'],
          target: mon.target,
          interval: mon.interval,
        });
      }
    } else {
      setForm({ name: '', protocol: 'HTTP', target: '', interval: 30 });
    }
  }, [editingId, monitors]);

  // Run periodic HTTP checks
  useMonitorChecker(monitors, updateMonitor);

  const handleFormChange = (field: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!form.name.trim() || !form.target.trim()) {
      setErrorMsg('Nome e destino são obrigatórios.');
      return;
    }
    // Normalise target for HTTP
    let normalized = form.target.trim();
    if (form.protocol === 'HTTP') {
      if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
        normalized = `https://${normalized}`;
      }
      try {
        new URL(normalized);
      } catch {
        setErrorMsg('URL inválida.');
        return;
      }
    }
    setIsSubmitting(true);
    const base: Omit<Monitor, 'id'> = {
      name: form.name.trim(),
      protocol: form.protocol,
      target: normalized,
      status: 'PENDING',
      latency: 0,
      interval: Number(form.interval),
      uptime: '0%',
      lastChecked: 'Nunca',
    } as any;

    // Immediate HTTP check to set initial status
    if (form.protocol === 'HTTP') {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const start = performance.now();
        await fetch(normalized, { mode: 'no-cors', signal: controller.signal });
        clearTimeout(timeout);
        const latency = Math.round(performance.now() - start);
        base.status = 'UP';
        base.latency = latency;
        base.uptime = '100.0%';
        base.lastChecked = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      } catch {
        base.status = 'DOWN';
        base.latency = 0;
        base.uptime = '0%';
        base.lastChecked = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
    }

    if (editingId) {
      updateMonitor(editingId, base);
      setSuccessMsg('Monitor atualizado com sucesso!');
    } else {
      addMonitor(base);
      setSuccessMsg('Monitor criado com sucesso!');
    }
    setIsSubmitting(false);
    setIsModalOpen(false);
    setEditingId(null);
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Excluir este monitor permanentemente?')) {
      deleteMonitor(id);
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <svg className="w-16 h-16 text-altix-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6M9 16h6M9 8h6" />
      </svg>
      <p className="text-altix-muted mb-4">Nenhum monitor cadastrado</p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 rounded-xl bg-altix-green text-black font-bold hover:bg-altix-green-light transition"
      >
        Criar primeiro monitor
      </button>
    </div>
  );

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
                Gerencie todos os seus ativos monitorados em tempo real (HTTP, SSL, TCP, DNS).
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

          {/* Filter tabs (static) */}
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

          {/* Grid or empty state */}
          {monitors.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monitors.map(mon => (
                <div key={mon.id} className="glass-card glass-card-hover p-5 rounded-2xl space-y-4 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          mon.status === 'UP'
                            ? 'bg-altix-green/10 text-altix-green'
                            : mon.status === 'DOWN'
                            ? 'bg-altix-offline/10 text-altix-offline'
                            : 'bg-altix-pending/10 text-altix-pending'
                        }`}
                      >
                        {mon.protocol === 'HTTP' && <Globe className="w-5 h-5" />}
                        {mon.protocol === 'SSL' && <Lock className="w-5 h-5" />}
                        {mon.protocol === 'TCP' && <Network className="w-5 h-5" />}
                        {mon.protocol === 'DNS' && <Cpu className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{mon.name}</h4>
                        <span className="text-[11px] text-altix-muted font-mono block truncate max-w-[180px]">
                          {mon.target}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        className="text-altix-muted hover:text-white p-1"
                        onClick={() => setOpenMenuId(prev => (prev === mon.id ? null : mon.id))}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openMenuId === mon.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-md shadow-lg z-10">
                          <button
                            className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-gray-700"
                            onClick={() => {
                              setEditingId(mon.id);
                              setIsModalOpen(true);
                              setOpenMenuId(null);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" /> Editar
                          </button>
                          <button
                            className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-700"
                            onClick={() => {
                              handleDelete(mon.id);
                              setOpenMenuId(null);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          mon.status === 'UP'
                            ? 'bg-altix-green pulse-dot-online'
                            : mon.status === 'DOWN'
                            ? 'bg-altix-offline pulse-dot-offline'
                            : 'bg-altix-pending'
                        }`}
                      />
                      <span className={`font-mono font-bold ${
                        mon.status === 'UP'
                          ? 'text-altix-green'
                          : mon.status === 'DOWN'
                          ? 'text-altix-offline'
                          : 'text-altix-pending'
                      }`}
                      >
                        {mon.status}
                      </span>
                    </div>
                    <span className="font-mono text-altix-muted">
                      Latência: {mon.latency > 0 ? `${mon.latency}ms` : '—'}
                    </span>
                    <span className="font-mono text-altix-green font-bold">{mon.uptime}</span>
                  </div>
                  {mon.protocol !== 'HTTP' && (
                    <div className="absolute inset-0" title="Requer backend Go para checagem real" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Modal Create / Edit */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
              <div className="w-full max-w-lg glass-card p-6 rounded-2xl space-y-5 border border-white/20">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-extrabold text-lg">
                    {editingId ? 'Editar Monitor' : 'Criar Novo Monitor'}
                  </h3>
                  <button
                    onClick={() => { setIsModalOpen(false); setEditingId(null); }}
                    className="text-altix-muted hover:text-white"
                  >
                    ✕
                  </button>
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-altix-muted block mb-1">
                      Protocolo de Verificação
                    </label>
                    <select
                      value={form.protocol}
                      onChange={e => handleFormChange('protocol', e.target.value as Monitor['protocol'])}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                    >
                      <option value="HTTP">HTTP / HTTPS (REST API)</option>
                      <option value="SSL">Certificado SSL / TLS</option>
                      <option value="TCP">TCP Port / Socket</option>
                      <option value="DNS">Resolução de Nome DNS</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-altix-muted block mb-1">
                      Nome do Monitor
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: API de Pagamentos Production"
                      value={form.name}
                      onChange={e => handleFormChange('name', e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-altix-muted block mb-1">
                      URL / Host / IP Target
                    </label>
                    <input
                      type="text"
                      placeholder="https://api.empresa.com/health ou 192.168.1.1:5432"
                      value={form.target}
                      onChange={e => handleFormChange('target', e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-altix-muted block mb-1">
                      Intervalo de Checagem (segundos)
                    </label>
                    <select
                      value={form.interval}
                      onChange={e => handleFormChange('interval', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                    >
                      <option value={10}>10 segundos (Pro Plan)</option>
                      <option value={30}>30 segundos</option>
                      <option value={60}>60 segundos</option>
                      <option value={300}>5 minutos</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => { setIsModalOpen(false); setEditingId(null); }}
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
                          <span>Salvando …</span>
                        </>
                      ) : (
                        <span>{editingId ? 'Salvar Alterações' : 'Criar Monitor'}</span>
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
