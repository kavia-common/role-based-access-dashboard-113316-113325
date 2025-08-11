import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import useAuth from './hooks/useAuth';
import { 
  ProtectedRoute, 
  Header, 
  Sidebar, 
  LoginModal, 
  RegisterModal, 
  ProfileDisplay 
} from './components';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import GuestDashboard from './components/Dashboard/GuestDashboard';

// Login Page Component with modal support
const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const handleRegisterSuccess = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-secondary)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '12px',
        padding: '40px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: 'var(--primary-color)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto',
          fontSize: '28px',
          color: 'white',
          fontWeight: 'bold'
        }}>
          R
        </div>
        
        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: '28px',
          fontWeight: '700',
          color: 'var(--text-primary)'
        }}>
          RBAC Dashboard
        </h1>
        
        <p style={{
          margin: '0 0 32px 0',
          color: 'var(--text-secondary)',
          fontSize: '16px'
        }}>
          Role-Based Access Control Team Dashboard
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => setShowLoginModal(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Sign In
          </button>
          
          <button
            onClick={() => setShowRegisterModal(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: 'var(--primary-color)',
              border: '2px solid var(--primary-color)',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Authentication Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
        onSuccess={handleLoginSuccess}
      />
      
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
};

// Dashboard routing component that renders appropriate dashboard based on role
const Dashboard = () => {
  const { getUserRole } = useAuth();
  const userRole = getUserRole();

  // Route to appropriate dashboard based on role
  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'user':
      return <UserDashboard />;
    case 'guest':
      return <GuestDashboard />;
    default:
      return <GuestDashboard />;
  }
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
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* User and Admin accessible route */}
          <Route 
            path="/user" 
            element={
              <ProtectedRoute requiredRole={['user', 'admin']}>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Guest route - accessible to all authenticated users */}
          <Route 
            path="/guest" 
            element={
              <ProtectedRoute>
                <GuestDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Profile route - accessible to all authenticated users */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfileDisplay />
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
