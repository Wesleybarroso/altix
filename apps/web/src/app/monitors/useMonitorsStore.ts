import { useState, useEffect } from 'react';

type Protocol = 'HTTP' | 'SSL' | 'TCP' | 'DNS';
type Status = 'UP' | 'DOWN' | 'PENDING';

export interface Monitor {
  id: string;
  name: string;
  protocol: Protocol;
  target: string;
  status: Status;
  latency: number;
  interval: number; // seconds
  uptime: string; // e.g. "99.99%"
  lastChecked: string; // human readable
}

const STORAGE_KEY = 'altix-monitors';

export function useMonitorsStore() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: Monitor[] = JSON.parse(raw);
        setMonitors(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(monitors));
  }, [monitors]);

  const addMonitor = (monitor: Omit<Monitor, 'id'>) => {
    const id = crypto.randomUUID();
    setMonitors(prev => [{ id, ...monitor }, ...prev]);
  };

  const deleteMonitor = (id: string) => {
    setMonitors(prev => prev.filter(m => m.id !== id));
  };

  const updateMonitor = (id: string, updates: Partial<Monitor>) => {
    setMonitors(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  return { monitors, addMonitor, deleteMonitor, updateMonitor, setMonitors };
}
