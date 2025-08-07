import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// PUBLIC_INTERFACE
/**
 * Sidebar component providing secondary navigation with role-based links
 * Features collapsible design, role-specific menu items, and active state indication
 * Responsive design with mobile toggle functionality
 * 
 * @param {Object} props - Component props
 * @param {boolean} [props.isCollapsed=false] - Whether sidebar is collapsed
 * @param {Function} [props.onToggleCollapse] - Handler for collapse toggle
 * @returns {React.ReactNode} Sidebar component with role-based navigation
 */
const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const { getUserRole, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't render sidebar if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  const userRole = getUserRole();

  // Navigation items based on role
  const getNavItems = () => {
    const commonItems = [
      {
        path: '/dashboard',
        label: 'Dashboard',
        icon: '📊',
        description: 'Main dashboard view'
      },
      {
        path: '/guest',
        label: 'Public Area',
        icon: '👋',
        description: 'Accessible to all users'
      }
    ];

    const userItems = [
      {
        path: '/user',
        label: 'User Area',
        icon: '👤',
        description: 'User-specific content'
      }
    ];

    const adminItems = [
      {
        path: '/admin',
        label: 'Admin Panel',
        icon: '🔐',
        description: 'Administrative controls'
      }
    ];

    let items = [...commonItems];

    if (userRole === 'user' || userRole === 'admin') {
      items = [...items, ...userItems];
    }

    if (userRole === 'admin') {
      items = [...items, ...adminItems];
    }

    return items;
  };

  const navItems = getNavItems();

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const sidebarWidth = isCollapsed ? '60px' : '240px';

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '70px',
          left: '10px',
          zIndex: 1001,
          backgroundColor: 'var(--button-bg)',
          color: 'var(--button-text)',
          border: 'none',
          borderRadius: '6px',
          padding: '8px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
        className="mobile-menu-toggle"
      >
        ☰
      </button>

      {/* Sidebar Container */}
      <aside
        style={{
          width: sidebarWidth,
          minHeight: 'calc(100vh - 60px)',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          position: 'fixed',
          left: 0,
          top: '60px',
          transition: 'width 0.3s ease',
          zIndex: 999,
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          overflowY: 'auto'
        }}
        className="sidebar"
      >
        {/* Collapse Toggle */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          alignItems: 'center'
        }}>
          {!isCollapsed && (
            <h3 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              Navigation
            </h3>
          )}
          
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                fontSize: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--bg-primary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? '→' : '←'}
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '16px 0' }}>
          {navItems.map((item) => {
            const isActive = isActivePath(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: isCollapsed ? '12px 16px' : '12px 20px',
                  margin: '4px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? 'var(--button-bg)' : 'var(--text-primary)',
                  backgroundColor: isActive ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--button-bg)' : '3px solid transparent',
                  transition: 'all 0.3s ease',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  justifyContent: isCollapsed ? 'center' : 'flex-start'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'var(--bg-primary)';
                    e.target.style.color = 'var(--text-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'var(--text-primary)';
                  }
                }}
                title={isCollapsed ? item.label : ''}
              >
                <span style={{
                  fontSize: '18px',
                  marginRight: isCollapsed ? '0' : '12px',
                  minWidth: '18px',
                  textAlign: 'center'
                }}>
                  {item.icon}
                </span>
                
                {!isCollapsed && (
                  <div style={{ flex: 1 }}>
                    <div>{item.label}</div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      marginTop: '2px',
                      opacity: 0.8
                    }}>
                      {item.description}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Role Badge */}
        {!isCollapsed && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            padding: '12px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '4px'
            }}>
              Current Role
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'capitalize',
              padding: '4px 8px',
              backgroundColor: getRoleColor(userRole),
              borderRadius: '4px',
              color: 'white'
            }}>
              {userRole || 'No Role'}
            </div>
          </div>
        )}
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            display: 'none'
          }}
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* CSS for responsive behavior */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: block !important;
          }
          
          .sidebar {
            width: 280px !important;
            transform: ${isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
          }
          
          .mobile-overlay {
            display: block !important;
          }
        }
        
        @media (min-width: 769px) {
          .sidebar {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
};

// Helper function to get role-based colors
const getRoleColor = (role) => {
  switch (role) {
    case 'admin':
      return '#dc3545'; // Red for admin
    case 'user':
      return '#007bff'; // Blue for user
    case 'guest':
      return '#6c757d'; // Gray for guest
    default:
      return '#6c757d'; // Default gray
  }
};

export default Sidebar;
