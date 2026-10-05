import { useCallback, useEffect, useState } from 'react';
import {
  checkServerHealth,
  detectMuleTransactions,
} from '../services/api';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [detectionResults, setDetectionResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Check backend connectivity when the application starts
  useEffect(() => {
    async function verifyBackend() {
      const status = await checkServerHealth();

      if (status) {
        setIsBackendOnline(true);
        setDetectionResults(status);
      } else {
        setIsBackendOnline(false);
      }
    }

    verifyBackend();
  }, []);

  // Run detection using the backend detection engine
  const runDetection = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await detectMuleTransactions();

      setDetectionResults(results);
      setIsBackendOnline(true);

      return results;
    } catch (err) {
      setError(err.message || 'Detection failed');
      setIsBackendOnline(false);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    transactions,
    setTransactions,
    detectionResults,
    loading,
    error,
    isBackendOnline,
    runDetection,
  };
}

export default useTransactions;