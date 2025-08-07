import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import useAuth from './hooks/useAuth';

// Component to display auth status - will be expanded in future iterations
const AuthStatus = () => {
  const { user, loading, isAuthenticated, getUserRole } = useAuth();
  
  if (loading) return <p>Loading authentication...</p>;
  
  return (
    <div style={{ margin: '20px 0', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
      <h3>Authentication Status</h3>
      {isAuthenticated() ? (
        <div>
          <p>✅ Authenticated as: {user?.email}</p>
          <p>Role: {getUserRole() || 'No role assigned'}</p>
          <p>User ID: {user?.id}</p>
        </div>
      ) : (
        <p>❌ Not authenticated</p>
      )}
    </div>
  );
};

// Main App component wrapped with authentication
const AppContent = () => {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          RBAC Team Dashboard
        </p>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
        <AuthStatus />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
