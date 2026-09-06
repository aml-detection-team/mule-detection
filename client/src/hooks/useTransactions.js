import { useState, useEffect, useCallback } from 'react';
import { checkServerHealth, detectMuleTransactions } from '../services/api';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [detectionResults, setDetectionResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Check backend connectivity on mount
  useEffect(() => {
    async function verifyBackend() {
      const status = await checkServerHealth();
      setIsBackendOnline(Boolean(status));
    }
    verifyBackend();
  }, []);

  // Run detection against transactions
  const runDetection = useCallback(async (txData) => {
    setLoading(true);
    setError(null);
    try {
      const results = await detectMuleTransactions(txData);
      setDetectionResults(results);
      return results;
    } catch (err) {
      setError(err.message || 'Detection failed');
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
