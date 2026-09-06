function Navbar({ activeTab, onSelectTab }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Mule Detection System</h2>
        <span className="badge">AML Live</span>
      </div>
      <div className="nav-links">
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onSelectTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => onSelectTab('transactions')}
        >
          Transactions
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => onSelectTab('alerts')}
        >
          Alerts
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
