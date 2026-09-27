import { useState, useEffect, useCallback, useRef } from 'react';
import { checkHealth } from '../api/scanApi';

export function useBackendHealth(intervalMs = 20000, timeoutMs = 4000) {
  const [status, setStatus] = useState('checking');
  const [latency, setLatency] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [error, setError] = useState(null);
  const [healthData, setHealthData] = useState(null);

  const isMountedRef = useRef(true);

  const runCheck = useCallback(async () => {
    const start = performance.now();
    try {
      const result = await checkHealth(timeoutMs);
      const elapsed = Math.round(performance.now() - start);

      if (!isMountedRef.current) return;

      if (result.status === 'healthy' || result.status === 'ok') {
        setStatus('connected');
        setLatency(elapsed);
        setError(null);
        setHealthData(result.data || null);
      } else {
        setStatus('disconnected');
        setLatency(null);
        setError(result.error || 'Backend service unreachable');
        setHealthData(null);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setStatus('disconnected');
      setLatency(null);
      setError(err.message);
      setHealthData(null);
    } finally {
      if (isMountedRef.current) {
        setLastChecked(new Date());
      }
    }
  }, [timeoutMs]);

  useEffect(() => {
    isMountedRef.current = true;
    runCheck();

    const intervalId = setInterval(() => {
      runCheck();
    }, intervalMs);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [runCheck, intervalMs]);

  return {
    status,
    latency,
    lastChecked,
    error,
    healthData,
    refetch: runCheck,
  };
}