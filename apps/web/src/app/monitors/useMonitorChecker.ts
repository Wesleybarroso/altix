import { useEffect, useRef } from 'react';
import type { Monitor, Status } from './useMonitorsStore';

/**
 * Periodically checks HTTP monitors.
 * - Performs a fetch with no‑cors and abort timeout (5 s).
 * - Updates status, latency and lastChecked via the provided updater.
 * - Non‑HTTP monitors are ignored (remain PENDING).
 */
export function useMonitorChecker(
  monitors: Monitor[],
  updateMonitor: (id: string, updates: Partial<Monitor>) => void
) {
  const monitorsRef = useRef<Monitor[]>(monitors);
  useEffect(() => {
    monitorsRef.current = monitors;
  }, [monitors]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    monitorsRef.current.forEach(mon => {
      if (mon.protocol !== 'HTTP') return;
      const runCheck = async () => {
        const start = performance.now();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        let status: Status = 'DOWN';
        let latency = 0;
        try {
          await fetch(mon.target, { mode: 'no-cors', signal: controller.signal });
          latency = Math.round(performance.now() - start);
          status = 'UP';
        } catch {
          status = 'DOWN';
        } finally {
          clearTimeout(timeout);
        }
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        updateMonitor(mon.id, { status, latency, lastChecked: timeStr });
      };
      // Immediate check then interval
      runCheck();
      const intervalId = setInterval(runCheck, mon.interval * 1000);
      timers.push(intervalId);
    });
    return () => {
      timers.forEach(clearInterval);
    };
  }, [updateMonitor]);
}
