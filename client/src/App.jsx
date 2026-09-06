import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import Alerts from './pages/Alerts';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app">
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />
      <main className="main-content">
        {activeTab === 'dashboard' && <Home />}
        {activeTab === 'transactions' && <Transactions />}
        {activeTab === 'alerts' && <Alerts />}
      </main>
    </div>
  );
}

export default App;
