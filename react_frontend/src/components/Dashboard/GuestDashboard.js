import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// PUBLIC_INTERFACE
/**
 * GuestDashboard component providing basic guest user interface
 * Features welcome information, basic account details, and limited functionality
 * Accessible to all authenticated users (serves as default for users without specific roles)
 * 
 * @returns {React.ReactNode} Guest dashboard with basic features and welcome information
 */
const GuestDashboard = () => {
  const { user, getUserRole } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  // Update current time and greeting
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 17) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeOfDayIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 17) return '☀️';
    if (hour >= 17 && hour < 20) return '🌅';
    return '🌙';
  };

  const getUserInitials = (email) => {
    if (!email) return '?';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  const getWelcomeMessage = () => {
    const role = getUserRole();
    switch (role) {
      case 'admin':
        return "You have administrative privileges. Access the admin panel for advanced features.";
      case 'user':
        return "You have standard user access. Visit the user area for your personal dashboard.";
      case 'guest':
        return "You have guest access. Contact an administrator to upgrade your account permissions.";
      default:
        return "Your account role hasn't been assigned yet. Contact an administrator for assistance.";
    }
  };

  const getFeaturesList = () => {
    const role = getUserRole();
    const baseFeatures = [
      "View your basic profile information",
      "Access this welcome dashboard",
      "Update your account preferences"
    ];

    const userFeatures = [
      "Access user-specific content and tools",
      "View detailed profile statistics",
      "Manage your personal settings"
    ];

    const adminFeatures = [
      "Full administrative dashboard access",
      "User management and role assignment",
      "System configuration and monitoring"
    ];

    switch (role) {
      case 'admin':
        return [...baseFeatures, ...userFeatures, ...adminFeatures];
      case 'user':
        return [...baseFeatures, ...userFeatures];
      default:
        return baseFeatures;
    }
  };

  return (
    <div style={{ padding: '0', maxWidth: '100%' }}>
      {/* Welcome Header */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '32px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#6c757d',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          fontSize: '36px',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {getUserInitials(user?.email)}
        </div>

        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)' }}>
          {getTimeOfDayIcon()} {greeting}!
        </h1>
        
        <p style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-secondary)' }}>
          Welcome to your dashboard, <strong>{user?.email}</strong>
        </p>

        <div style={{
          display: 'inline-block',
          padding: '8px 16px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          fontSize: '14px',
          color: 'var(--text-primary)'
        }}>
          Role: <strong style={{ textTransform: 'capitalize', color: '#6c757d' }}>
            👋 {getUserRole() || 'Guest'}
          </strong>
        </div>
      </div>

      {/* Current Time Widget */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
          {getTimeOfDayIcon()} Current Time
        </h3>
        
        <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
          {formatTime(currentTime)}
        </div>
        
        <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
          {formatDate(currentTime)}
        </div>
      </div>

      {/* Account Information */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '1px solid var(--border-color)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
          Account Information
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Email Address
            </div>
            <div style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>
              {user?.email}
            </div>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Account Status
            </div>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#28a745' }}>
              🟢 Active
            </div>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Member Since
            </div>
            <div style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          padding: '16px',
          backgroundColor: 'rgba(108, 117, 125, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(108, 117, 125, 0.2)'
        }}>
          <p style={{ margin: '0', fontSize: '14px', color: 'var(--text-primary)' }}>
            {getWelcomeMessage()}
          </p>
        </div>
      </div>

      {/* Available Features */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '1px solid var(--border-color)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
          Available Features
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>
              What you can do:
            </h4>
            <ul style={{ margin: '0', paddingLeft: '20px', color: 'var(--text-primary)' }}>
              {getFeaturesList().map((feature, index) => (
                <li key={index} style={{ marginBottom: '6px', fontSize: '14px' }}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
          Quick Navigation
        </h3>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0056b3';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            📊 Main Dashboard
          </Link>

          {(getUserRole() === 'user' || getUserRole() === 'admin') && (
            <Link
              to="/user"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '10px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1e7e34';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#28a745';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              👤 User Area
            </Link>
          )}

          {getUserRole() === 'admin' && (
            <Link
              to="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '10px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
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
              🔐 Admin Panel
            </Link>
          )}
        </div>

        {getUserRole() === 'guest' && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            color: '#856404'
          }}>
            <strong>Need more access?</strong> Contact your administrator to upgrade your account permissions.
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestDashboard;
