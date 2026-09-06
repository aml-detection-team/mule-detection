import { useState } from 'react';

function Alerts() {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const alerts = [
    {
      id: 'ALT-1001',
      account: 'ACC034',
      pattern: 'Circular Flow (Cycle)',
      score: 94,
      status: 'Open',
      flow: 'ACC034 → ACC052 → ACC089 → ACC034',
      amount: '₹1,45,000',
      sarSummary: 'Account ACC034 is participating in a high-velocity circular loop transfer with 2 intermediate accounts within a 45-minute window, consistent with mule layering techniques.',
    },
    {
      id: 'ALT-1002',
      account: 'ACC089',
      pattern: 'Rapid Pass-Through',
      score: 88,
      status: 'Under Review',
      flow: 'In: ₹98,000 → Out: ₹96,500 (12 mins)',
      amount: '₹98,000',
      sarSummary: 'Rapid pass-through pattern detected: funds deposited into ACC089 were depleted via overseas remittance in under 15 minutes, leaving a near-zero closing balance.',
    },
    {
      id: 'ALT-1003',
      account: 'ACC073',
      pattern: 'Structuring (< $10k)',
      score: 82,
      status: 'Open',
      flow: '5 transfers of ₹49,500 to ACC088',
      amount: '₹2,47,500',
      sarSummary: 'Multiple consecutive cash transfers structured just below mandatory reporting thresholds within 48 hours to evade regulatory oversight.',
    },
    {
      id: 'ALT-1004',
      account: 'ACC057',
      pattern: 'Fan-Out (Smurfing)',
      score: 79,
      status: 'Escalated',
      flow: 'ACC057 dispersed to 14 mule accounts',
      amount: '₹5,10,000',
      sarSummary: 'Large single lump-sum credit followed by instantaneous micro-transfers distributed to multiple recently opened individual retail accounts.',
    },
  ];

  const filtered =
    filter === 'ALL'
      ? alerts
      : alerts.filter((a) => a.pattern.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="alerts-page">
      <div className="page-header-row">
        <div>
          <h1>AML Alert Investigation & SAR Workbench</h1>
          <p>Triage detected money mule rings, review AI audit trails, and manage case statuses</p>
        </div>
      </div>

      <div className="alerts-grid-layout">
        <div className="alerts-list-column">
          <div className="filter-chips">
            {['ALL', 'Circular Flow', 'Rapid Pass-Through', 'Structuring'].map((item) => (
              <button
                key={item}
                className={`chip-btn ${filter === item ? 'active' : ''}`}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="alert-cards-stack">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`alert-item-card ${selectedAlert?.id === item.id ? 'selected' : ''}`}
                onClick={() => setSelectedAlert(item)}
              >
                <div className="alert-item-header">
                  <span className="font-mono">{item.id}</span>
                  <span className={`risk-badge ${item.score >= 90 ? 'risk-critical' : 'risk-high'}`}>
                    Risk: {item.score}
                  </span>
                </div>
                <h4 className="alert-account-title">{item.account}</h4>
                <p className="alert-pattern-text">{item.pattern}</p>
                <div className="alert-meta-row">
                  <span>{item.amount}</span>
                  <span className="status-pill">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="alert-details-column">
          {selectedAlert ? (
            <div className="case-detail-card">
              <div className="case-header">
                <div>
                  <h3 style={{ margin: 0 }}>Case File: {selectedAlert.id}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Created by Graph Detection Engine</span>
                </div>
                <span className="badge">HSBC Compliance</span>
              </div>

              <div className="detail-field">
                <label>Target Account:</label>
                <span className="font-bold">{selectedAlert.account}</span>
              </div>

              <div className="detail-field">
                <label>Detected Ring / Flow:</label>
                <code className="code-flow">{selectedAlert.flow}</code>
              </div>

              <div className="detail-field">
                <label>Total Exposure:</label>
                <span className="exposure-amount">{selectedAlert.amount}</span>
              </div>

              <div className="sar-box">
                <div className="sar-box-header">
                  <span>🤖 AI Suspicious Activity Report (SAR) Narrative</span>
                </div>
                <p className="sar-text">{selectedAlert.sarSummary}</p>
              </div>

              <div className="case-actions">
                <button className="btn-primary">Escalate to FIU</button>
                <button className="btn-secondary">Mark Under Review</button>
                <button className="btn-secondary" style={{ color: '#4ade80' }}>Clear False Positive</button>
              </div>
            </div>
          ) : (
            <div className="case-placeholder">
              <p>👈 Select any alert from the left list to review case specifics and AI SAR narrative.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Alerts;
