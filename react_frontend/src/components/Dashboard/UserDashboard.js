import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { supabase } from '../../config/supabase';

// PUBLIC_INTERFACE
/**
 * UserDashboard component providing standard user interface
 * Features profile information, activity overview, and user-specific tools
 * Accessible to users with 'user' or 'admin' roles
 * 
 * @returns {React.ReactNode} User dashboard with profile and activity features
 */
const UserDashboard = () => {
  const { user, getUserRole } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastLogin, setLastLogin] = useState(null);
  const [accountAge, setAccountAge] = useState('');

  // Fetch user profile and calculate statistics
  useEffect(() => {
    fetchUserProfile();
    calculateAccountStats();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAccountStats = () => {
    if (!user?.created_at) return;

    // Calculate account age
    const createdDate = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      setAccountAge('Today');
    } else if (diffDays === 1) {
      setAccountAge('1 day');
    } else if (diffDays < 30) {
      setAccountAge(`${diffDays} days`);
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      setAccountAge(`${months} month${months > 1 ? 's' : ''}`);
    } else {
      const years = Math.floor(diffDays / 365);
      setAccountAge(`${years} year${years > 1 ? 's' : ''}`);
    }

    // Set last login time
    if (user.last_sign_in_at) {
      setLastLogin(new Date(user.last_sign_in_at).toLocaleString());
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return '🔐';
      case 'user': return '👤';
      case 'guest': return '👋';
      default: return '❓';
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'admin': return 'Full administrative access to all system features';
      case 'user': return 'Standard user access with personal dashboard features';
      case 'guest': return 'Limited access to basic features';
      default: return 'No role assigned - contact administrator';
    }
  };

  return (
    <div style={{ padding: '0', maxWidth: '100%' }}>
      {/* Header Section */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#007bff',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px',
            fontSize: '24px',
            color: 'white'
          }}>
            {getRoleIcon(getUserRole())}
          </div>
          <div>
            <h1 style={{ margin: '0', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
              User Dashboard
            </h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '16px' }}>
              Welcome back, {user?.email} • Role: <strong style={{ textTransform: 'capitalize' }}>{getUserRole()}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '1px solid var(--border-color)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
          Profile Information
        </h3>

        {loading ? (
          <div style={{ color: 'var(--text-secondary)' }}>Loading profile...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            {/* Email Card */}
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
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {user?.email_confirmed_at ? '✅ Verified' : '⚠️ Not verified'}
              </div>
            </div>

            {/* Role Card */}
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Account Role
              </div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '500', 
                color: 'var(--text-primary)',
                textTransform: 'capitalize',
                marginBottom: '8px'
              }}>
                {getRoleIcon(getUserRole())} {getUserRole()}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {getRoleDescription(getUserRole())}
              </div>
            </div>

            {/* Account Age Card */}
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Account Age
              </div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>
                {accountAge}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Member since {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
              </div>
            </div>

            {/* Last Login Card */}
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Last Login
              </div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>
                {lastLogin ? formatDate(user.last_sign_in_at) : 'Current session'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                🟢 Currently active
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '1px solid var(--border-color)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            to="/guest"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#545b62';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#6c757d';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            👋 Visit Guest Area
          </Link>

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

          <button
            onClick={fetchUserProfile}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
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
            🔄 Refresh Profile
          </button>
        </div>
      </div>

      {/* Account Details */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Account Details
          </h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Your account information and settings
          </p>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                User ID
              </div>
              <div style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-primary)',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                wordBreak: 'break-all'
              }}>
                {user?.id}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Email Confirmed
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                {user?.email_confirmed_at ? (
                  <span style={{ color: '#28a745' }}>
                    ✅ Yes - {formatDate(user.email_confirmed_at)}
                  </span>
                ) : (
                  <span style={{ color: '#dc3545' }}>
                    ❌ Not confirmed
                  </span>
                )}
              </div>
            </div>

            {profile?.created_at && (
              <div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Profile Created
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                  {formatDate(profile.created_at)}
                </div>
              </div>
            )}

            {profile?.updated_at && (
              <div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Last Updated
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                  {formatDate(profile.updated_at)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
