import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import Alerts from './pages/Alerts';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleInvestigate = (alert) => {
    setSelectedAlert(alert);
    setActiveTab('alerts');
  };

  return (
    <div className="app">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      <main className="main-content">

        {activeTab === 'dashboard' && (
          <Home onInvestigate={handleInvestigate} />
        )}

        {activeTab === 'transactions' && (
          <Transactions />
        )}

        {activeTab === 'alerts' && (
          <Alerts
            selectedAlert={selectedAlert}
            setSelectedAlert={setSelectedAlert}
          />
        )}

      </main>
    </div>
  );
}

export default App;