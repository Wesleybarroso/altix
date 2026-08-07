'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { AlertTriangle, Sparkles, CheckCircle2, Clock, MapPin, Terminal, RefreshCw } from 'lucide-react';

export default function IncidentsPage() {
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const incidents = [
    {
      id: 'inc-901',
      monitorName: 'US-East DNS Nameserver',
      target: 'ns1.altix.io',
      status: 'OPEN',
      severity: 'CRITICAL',
      startedAt: 'Há 15 minutos (15:37:12)',
      duration: '15 min 22 seg',
      workerRegion: 'us-east-1',
      errorCode: 'EAI_AGAIN',
      errorMessage: 'DNS lookup failed: getaddrinfo EAI_AGAIN ns1.altix.io',
    },
    {
      id: 'inc-884',
      monitorName: 'Stripe Webhook Receiver',
      target: 'https://payments.altix.io/webhooks',
      status: 'RESOLVED',
      severity: 'MEDIUM',
      startedAt: 'Ontem às 22:14:00',
      duration: '4 min 10 seg',
      workerRegion: 'sa-east-1 (São Paulo)',
      errorCode: 'HTTP 504',
      errorMessage: 'Gateway Timeout 504 from Nginx Reverse Proxy',
    },
  ];

  const handleRunAIAnalysis = (inc: any) => {
    setSelectedIncident(inc);
    setIsAnalyzing(true);
    setAiAnalysis(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAiAnalysis({
        rootCause: `Diagnóstico IA ALTIX: Detectada falha na resolução de nomes DNS no servidor de autoridade ${inc.target}. O erro EAI_AGAIN indica falha de conectividade ou indisponibilidade temporária dos servidores TLD.`,
        impactSeverity: 'CRITICAL',
        suggestedAction: 'Verifique os registros NS no seu registrador de domínio ou altere temporariamente os nameservers para Cloudflare (1.1.1.1).',
        confidence: '98.4%',
      });
    }, 1200);
  };

  return (
    <div className="flex min-h-screen bg-altix-bg text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Registro de Incidentes & Diagnósticos IA</h1>
            <p className="text-sm text-altix-muted">
              Histórico detalhado de quedas com milissegundos, código de erro e análise preditiva por Inteligência Artificial.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Incident List */}
            <div className="lg:col-span-2 space-y-4">
              {incidents.map((inc) => (
                <div key={inc.id} className="glass-card p-5 rounded-2xl space-y-4 border border-white/10 relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${inc.status === 'OPEN' ? 'bg-altix-offline/10 text-altix-offline' : 'bg-altix-green/10 text-altix-green'}`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base">{inc.monitorName}</h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${inc.status === 'OPEN' ? 'bg-altix-offline/20 text-altix-offline border border-altix-offline/30' : 'bg-altix-green/20 text-altix-green'}`}>
                            {inc.status}
                          </span>
                        </div>
                        <p className="text-xs text-altix-muted font-mono">{inc.target}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRunAIAnalysis(inc)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/40 text-xs font-semibold transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Análise com IA</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-red-400 space-y-1">
                    <div className="flex justify-between text-altix-muted text-[10px]">
                      <span>Erro: {inc.errorCode}</span>
                      <span>Worker: {inc.workerRegion}</span>
                    </div>
                    <div>{inc.errorMessage}</div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-altix-muted pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Início: {inc.startedAt}</span>
                    <span>Duração: {inc.duration}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Diagnostics Panel */}
            <div className="glass-card p-6 rounded-2xl space-y-4 border border-purple-500/30 h-fit">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                <h3>ALTIX AI Diagnostics Engine</h3>
              </div>

              {!selectedIncident && (
                <div className="p-8 text-center text-altix-muted text-xs">
                  Selecione um incidente na lista e clique em &quot;Análise com IA&quot; para diagnosticar a causa raiz automaticamente.
                </div>
              )}

              {isAnalyzing && (
                <div className="p-8 text-center text-purple-300 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
                  <p className="text-xs">Processando stack trace, headers HTTP e rotas DNS...</p>
                </div>
              )}

              {aiAnalysis && !isAnalyzing && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-2">
                    <span className="text-[10px] font-mono text-purple-300 font-bold">Causa Raiz Identificada ({aiAnalysis.confidence})</span>
                    <p className="text-white leading-relaxed">{aiAnalysis.rootCause}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-altix-green/10 border border-altix-green/20 text-xs space-y-1">
                    <span className="text-[10px] font-mono text-altix-green font-bold">Ação Sugerida de Resolução</span>
                    <p className="text-white">{aiAnalysis.suggestedAction}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
