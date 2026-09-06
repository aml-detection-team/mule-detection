import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';

function Transactions() {
  const { runDetection, loading, error, isBackendOnline } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [detectionSuccess, setDetectionSuccess] = useState(false);

  // Sample transactions representing normal + injected mule patterns
  const [txList] = useState([
    { id: 'TX-901', from: 'ACC087', to: 'ACC092', amount: 31035, currency: 'INR', flag: 'Normal' },
    { id: 'TX-902', from: 'ACC073', to: 'ACC088', amount: 30009, currency: 'INR', flag: 'Structuring' },
    { id: 'TX-903', from: 'ACC034', to: 'ACC052', amount: 48500, currency: 'INR', flag: 'Cycle Layer 1' },
    { id: 'TX-904', from: 'ACC052', to: 'ACC034', amount: 47900, currency: 'INR', flag: 'Cycle Layer 2' },
    { id: 'TX-905', from: 'ACC012', to: 'ACC089', amount: 9800, currency: 'INR', flag: 'Pass-Through' },
    { id: 'TX-906', from: 'ACC060', to: 'ACC022', amount: 28337, currency: 'INR', flag: 'Normal' },
    { id: 'TX-907', from: 'ACC045', to: 'ACC011', amount: 49200, currency: 'INR', flag: 'Fan-In Hub' },
  ]);

  const handleRunDetection = async () => {
    try {
      await runDetection(txList);
      setDetectionSuccess(true);
    } catch {
      // Handled in hook error state
    }
  };

  const filtered = txList.filter(
    (tx) =>
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="transactions-page">
      <div className="page-header-row">
        <div>
          <h1>Transactions Ledger & Monitoring</h1>
          <p>Inspect raw transaction streams and trigger automated graph detection</p>
        </div>
        <button
          onClick={handleRunDetection}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Analyzing Graph...' : '⚡ Run Detection Engine'}
        </button>
      </div>

      {detectionSuccess && (
        <div className="success-banner">
          ✓ Detection engine successfully analyzed transaction graph!
        </div>
      )}

      {error && (
        <div className="warning-banner">
          ⚠ Backend engine unreachable on port 5000. Start backend with `npm start` in server directory.
        </div>
      )}

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by Account ID or Transaction ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="count-label">Showing {filtered.length} transactions</span>
      </div>

      <div className="alerts-section">
        <div className="table-responsive">
          <table className="aml-table">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Origin Account</th>
                <th>Beneficiary Account</th>
                <th>Amount</th>
                <th>Pattern Classification</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id}>
                  <td className="font-mono">{tx.id}</td>
                  <td className="font-bold">{tx.from}</td>
                  <td className="font-bold">{tx.to}</td>
                  <td>₹{tx.amount.toLocaleString()}</td>
                  <td>
                    <span className={`pattern-pill ${tx.flag !== 'Normal' ? 'pill-alert' : ''}`}>
                      {tx.flag}
                    </span>
                  </td>
                  <td>
                    <button className="btn-secondary">Trace Flow</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
