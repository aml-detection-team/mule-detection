import Dashboard from '../components/Dashboard';
import { useTransactions } from '../hooks/useTransactions';

function Home() {
  const { isBackendOnline } = useTransactions();

  return (
    <div className="home-page">
      <div className="page-header-row">
        <div>
          <h1>AML Mule Account Detection Intelligence</h1>
          <p>Real-time graph analysis, mule ring identification & automated SAR reporting</p>
        </div>
        <div className="system-status">
          <span className={`status-indicator ${isBackendOnline ? 'status-online' : 'status-offline'}`} />
          <span className="status-text">
            {isBackendOnline ? 'Detection Engine: Connected' : 'Detection Engine: Standby'}
          </span>
        </div>
      </div>

      <Dashboard />
    </div>
  );
}

export default Home;
