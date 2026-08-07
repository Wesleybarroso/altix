'use client';

import React, { useEffect, useState } from 'react';
import { Search, Monitor, AlertTriangle, ShieldCheck, Tv, Settings, Terminal, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const actions = [
    { id: '1', title: 'Novo Monitor HTTP/S', icon: Plus, category: 'Monitores', href: '/monitors?new=http' },
    { id: '2', title: 'Ver Incidentes Ativos', icon: AlertTriangle, category: 'Incidentes', href: '/incidents' },
    { id: '3', title: 'Abrir Modo TV (NOC)', icon: Tv, category: 'Visualização', href: '/tv' },
    { id: '4', title: 'Página Pública de Status', icon: ShieldCheck, category: 'Status Page', href: '/status-page' },
    { id: '5', title: 'Configurações de Canais & Alertas', icon: Settings, category: 'Configurações', href: '/settings' },
    { id: '6', title: 'API Keys & Developers', icon: Terminal, category: 'Desenvolvedor', href: '/settings?tab=api' },
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-2xl glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-altix-green" />
          <input
            type="text"
            placeholder="Digite um comando ou busque um recurso (ex: monitor, incidentes, TV)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-white placeholder-altix-muted focus:outline-none text-sm font-sans"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-altix-muted hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-altix-muted text-sm">Nenhum resultado encontrado para &quot;{query}&quot;</div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(item.href);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-altix-green/10 hover:border-altix-green/30 border border-transparent transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-altix-green/20 group-hover:text-altix-green text-altix-muted transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-white group-hover:text-altix-green transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-altix-muted font-mono">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-white/10 bg-black/20 flex items-center justify-between text-xs text-altix-muted">
          <span>Pressione <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">ESC</kbd> para fechar</span>
          <span className="flex items-center gap-1">ALTIX Quick Command Palette</span>
        </div>
      </div>
    </div>
  );
};
