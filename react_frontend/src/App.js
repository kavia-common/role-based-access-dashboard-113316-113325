import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import useAuth from './hooks/useAuth';
import { ProtectedRoute, Header, Sidebar } from './components';

// Simple Login Page Component
const LoginPage = () => {
  const { signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        setMessage(`Sign up failed: ${error.message}`);
      } else {
        setMessage('Sign up successful! Please check your email for verification.');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setMessage(`Sign in failed: ${error.message}`);
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '10px', 
            backgroundColor: 'var(--button-bg)', 
            color: 'var(--button-text)', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>
      </form>
      
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        style={{ 
          marginTop: '10px', 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-secondary)', 
          cursor: 'pointer', 
          textDecoration: 'underline' 
        }}
      >
        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </button>
      
      {message && (
        <p style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: message.includes('failed') ? '#fee' : '#efe',
          color: message.includes('failed') ? '#c33' : '#363',
          borderRadius: '4px'
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

// Dashboard Component for authenticated users
const Dashboard = () => {
  const { user, getUserRole } = useAuth();

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Dashboard</h2>
      <div style={{ margin: '20px 0', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
        <h3>Welcome, {user?.email}!</h3>
        <p>Your role: <strong>{getUserRole() || 'No role assigned'}</strong></p>
        <p>User ID: {user?.id}</p>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h4>Quick Actions:</h4>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/user" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
            User Page
          </Link>
          <Link to="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
            Admin Page
          </Link>
          <Link to="/guest" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
            Guest Page
          </Link>
        </div>
      </div>
    </div>
  );
};

// Admin-only component
const AdminPage = () => {
  const { user, getUserRole } = useAuth();
  
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>🔐 Admin Panel</h2>
      <p>This page is only accessible to admin users.</p>
      <div style={{ margin: '20px 0', padding: '20px', border: '2px solid #28a745', borderRadius: '8px' }}>
        <p>✅ Access granted for: {user?.email}</p>
        <p>Role: <strong>{getUserRole()}</strong></p>
      </div>
      <Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
        ← Back to Dashboard
      </Link>
    </div>
  );
};

// User-accessible component
const UserPage = () => {
  const { user, getUserRole } = useAuth();
  
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>👤 User Area</h2>
      <p>This page is accessible to users and admins.</p>
      <div style={{ margin: '20px 0', padding: '20px', border: '2px solid #007bff', borderRadius: '8px' }}>
        <p>✅ Access granted for: {user?.email}</p>
        <p>Role: <strong>{getUserRole()}</strong></p>
      </div>
      <Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
        ← Back to Dashboard
      </Link>
    </div>
  );
};

// Guest-accessible component
const GuestPage = () => {
  const { user, getUserRole } = useAuth();
  
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>👋 Guest Area</h2>
      <p>This page is accessible to all authenticated users.</p>
      <div style={{ margin: '20px 0', padding: '20px', border: '2px solid #6c757d', borderRadius: '8px' }}>
        <p>✅ Access granted for: {user?.email}</p>
        <p>Role: <strong>{getUserRole() || 'No role assigned'}</strong></p>
      </div>
      <Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
        ← Back to Dashboard
      </Link>
    </div>
  );
};

// Main App component with routing
const AppContent = () => {
  const [theme, setTheme] = useState('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  if (loading) {
    return (
      <div className="App">
        <div className="App-header">
          <div>Loading authentication...</div>
        </div>
      </div>
    );
  }

  const mainContentMargin = isAuthenticated() ? (sidebarCollapsed ? '60px' : '240px') : '0';

  return (
    <div className="App">
      {/* Header */}
      <Header 
        onToggleTheme={toggleTheme}
        currentTheme={theme}
      />
      
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      
      {/* Main Content */}
      <main style={{ 
        backgroundColor: 'var(--bg-primary)', 
        color: 'var(--text-primary)', 
        minHeight: 'calc(100vh - 60px)',
        marginLeft: mainContentMargin,
        transition: 'margin-left 0.3s ease',
        padding: isAuthenticated() ? '20px' : '0'
      }}>
        <Routes>
          {/* Public route for login */}
          <Route 
            path="/login" 
            element={
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginPage />
            } 
          />
          
          {/* Protected dashboard route - requires authentication */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin-only route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          
          {/* User and Admin accessible route */}
          <Route 
            path="/user" 
            element={
              <ProtectedRoute requiredRole={['user', 'admin']}>
                <UserPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Guest route - accessible to all authenticated users */}
          <Route 
            path="/guest" 
            element={
              <ProtectedRoute>
                <GuestPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect based on authentication status */}
          <Route 
            path="/" 
            element={
              <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />
            } 
          />
          
          {/* Fallback for unknown routes */}
          <Route 
            path="*" 
            element={
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>404 - Page Not Found</h2>
                <Link to={isAuthenticated() ? "/dashboard" : "/login"}>
                  Go {isAuthenticated() ? 'to Dashboard' : 'to Login'}
                </Link>
              </div>
            } 
          />
        </Routes>
      </main>
      
      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          main {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
