import NetworkGraph from './NetworkGraph';

function Dashboard({ onInvestigate }) {
  const stats = [
    {
      label: 'Total Monitored Accounts',
      value: '128',
      change: '+12 this week',
    },
    {
      label: 'Flagged Mule Accounts',
      value: '14',
      change: 'High Risk',
      isAlert: true,
    },
    {
      label: 'Transactions Analyzed',
      value: '2,840',
      change: 'Live feed',
    },
    {
      label: 'Suspicious Ring Alerts',
      value: '5',
      change: 'Requires SAR Review',
      isAlert: true,
    },
  ];

  const recentAlerts = [
    {
      id: 'ALT-1001',
      account: 'ACC034',
      pattern: 'Circular Flow (Cycle)',
      score: 94,
      status: 'Open',
    },
    {
      id: 'ALT-1002',
      account: 'ACC089',
      pattern: 'Rapid Pass-Through',
      score: 88,
      status: 'Investigating',
    },
    {
      id: 'ALT-1003',
      account: 'ACC073',
      pattern: 'Structuring (< $10k)',
      score: 82,
      status: 'Open',
    },
    {
      id: 'ALT-1004',
      account: 'ACC057',
      pattern: 'Fan-Out (Smurfing)',
      score: 79,
      status: 'Escalated',
    },
  ];

  return (
    <div className="dashboard-container">

      {/* Metric Cards */}
      <div className="stats-grid">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className={`stat-card ${
              item.isAlert ? 'alert-card' : ''
            }`}
          >
            <span className="stat-label">
              {item.label}
            </span>

            <h3 className="stat-value">
              {item.value}
            </h3>

            <span className="stat-change">
              {item.change}
            </span>
          </div>
        ))}
      </div>

      {/* Interactive Visual Graph Component */}
      <NetworkGraph />

      {/* Priority Alerts Table */}
      <div
        className="alerts-section"
        style={{ marginTop: '2rem' }}
      >
        <div className="section-header">
          <div>
            <h3>Priority AML Alerts</h3>

            <span className="section-subtitle">
              Real-time alerts flagged by detection engine
            </span>
          </div>

          <button className="btn-secondary">
            Export SAR Feed
          </button>
        </div>

        <div className="table-responsive">
          <table className="aml-table">

            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Target Account</th>
                <th>Detected Pattern</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {recentAlerts.map((alert) => (
                <tr key={alert.id}>

                  <td className="font-mono">
                    {alert.id}
                  </td>

                  <td className="font-bold">
                    {alert.account}
                  </td>

                  <td>
                    <span className="pattern-pill">
                      {alert.pattern}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`risk-badge ${
                        alert.score >= 85
                          ? 'risk-critical'
                          : 'risk-high'
                      }`}
                    >
                      {alert.score} / 100
                    </span>
                  </td>

                  <td>
                    <span className="status-pill">
                      {alert.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn-action"
                      onClick={() => onInvestigate(alert)}
                    >
                      Investigate
                    </button>
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

export default Dashboard;