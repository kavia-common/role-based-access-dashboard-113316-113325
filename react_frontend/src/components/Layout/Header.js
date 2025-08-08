import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// PUBLIC_INTERFACE
/**
 * Header component providing top navigation and user controls
 * Features app logo, navigation links, user info, and logout functionality
 * Adapts content based on authentication status and user role
 * 
 * @param {Object} props - Component props
 * @param {Function} [props.onToggleTheme] - Optional theme toggle handler
 * @param {string} [props.currentTheme] - Current theme for toggle button display
 * @returns {React.ReactNode} Header component with navigation and user controls
 */
const Header = ({ onToggleTheme, currentTheme = 'light' }) => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  // Helper for auth state, in upgraded AuthContext
  const isAuthenticated = () => !!user;

  // Helper for role (now provided by 'role' from context)
  const getUserRole = () => role;

  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
    }
    navigate('/login');
  };

  return (
    <header style={{
      backgroundColor: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px'
      }}>
        {/* Logo and App Title */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link 
            to={isAuthenticated() ? "/dashboard" : "/"}
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontSize: '24px',
              fontWeight: '700',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--text-secondary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--text-primary)';
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#eb8e24',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              fontSize: '18px',
              color: 'white',
              fontWeight: 'bold'
            }}>
              R
            </div>
            RBAC Dashboard
          </Link>
        </div>

        {/* Navigation Links - Only show when authenticated */}
        {isAuthenticated() && (
          <nav style={{ display: 'flex', gap: '30px' }}>
            <Link
              to="/dashboard"
              style={{
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--bg-secondary)';
                e.target.style.color = 'var(--text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-primary)';
              }}
            >
              Dashboard
            </Link>
            
            <Link
              to="/guest"
              style={{
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--bg-secondary)';
                e.target.style.color = 'var(--text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-primary)';
              }}
            >
              Public
            </Link>

            {/* User-specific links */}
            {(getUserRole() === 'user' || getUserRole() === 'admin') && (
              <Link
                to="/user"
                style={{
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-secondary)';
                  e.target.style.color = 'var(--text-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--text-primary)';
                }}
              >
                User Area
              </Link>
            )}

            {/* Admin-only links */}
            {getUserRole() === 'admin' && (
              <Link
                to="/admin"
                style={{
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-secondary)';
                  e.target.style.color = 'var(--text-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--text-primary)';
                }}
              >
                Admin Panel
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '4px',
                  fontSize: '10px',
                  color: '#eb8e24'
                }}>
                  🔒
                </span>
              </Link>
            )}
          </nav>
        )}

        {/* User Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '8px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--bg-secondary)';
                e.target.style.borderColor = 'var(--text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = 'var(--border-color)';
              }}
              aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
            >
              {currentTheme === 'light' ? '🌙' : '☀️'}
            </button>
          )}

          {/* User Info and Logout */}
          {isAuthenticated() ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* User Avatar and Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#64748b',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ 
                    fontWeight: '500', 
                    color: 'var(--text-primary)',
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {user?.email}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-secondary)',
                    textTransform: 'capitalize'
                  }}>
                    {getUserRole() || 'No role'}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleSignOut}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#c82333';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#dc3545';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                backgroundColor: 'var(--button-bg)',
                color: 'var(--button-text)',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
