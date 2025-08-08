import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../../hooks/useAuth';
import supabase from '../../config/supabase';

// PUBLIC_INTERFACE
/**
 * ProfileDisplay component for displaying authenticated user's profile information
 * Features clean, minimal layout with user data from Supabase authentication and profiles table
 * Shows email, role, account status, creation date, and other profile details
 * 
 * @returns {React.ReactNode} Profile display component with user information
 */
const ProfileDisplay = () => {
  const { user, getUserRole } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile data from Supabase
  const fetchUserProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile information');
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#dc3545';
      case 'user': return '#007bff';
      case 'guest': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getUserInitials = (email) => {
    if (!email) return '?';
    const name = email.split('@')[0];
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        color: 'var(--text-secondary)'
      }}>
        <div>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        border: '1px solid rgba(220, 53, 69, 0.3)',
        borderRadius: '8px',
        color: '#dc3545'
      }}>
        <p>{error}</p>
        <button
          onClick={fetchUserProfile}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        <p>Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0'
    }}>
      {/* Profile Header */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '32px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        {/* User Avatar */}
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: getRoleColor(getUserRole()),
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          fontSize: '32px',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {getUserInitials(user.email)}
        </div>

        {/* User Name/Email */}
        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: '28px',
          fontWeight: '700',
          color: 'var(--text-primary)'
        }}>
          {user.email}
        </h1>

        {/* Role Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '8px 16px',
          backgroundColor: getRoleColor(getUserRole()),
          borderRadius: '20px',
          fontSize: '14px',
          color: 'white',
          fontWeight: '600',
          textTransform: 'capitalize'
        }}>
          {getRoleIcon(getUserRole())} {getUserRole() || 'No Role'}
        </div>

        {/* Account Status */}
        <div style={{
          marginTop: '16px',
          padding: '8px 16px',
          backgroundColor: user.email_confirmed_at ? 'rgba(40, 167, 69, 0.1)' : 'rgba(255, 193, 7, 0.1)',
          border: `1px solid ${user.email_confirmed_at ? 'rgba(40, 167, 69, 0.3)' : 'rgba(255, 193, 7, 0.3)'}`,
          borderRadius: '6px',
          color: user.email_confirmed_at ? '#28a745' : '#856404',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {user.email_confirmed_at ? '✅ Email Verified' : '⚠️ Email Not Verified'}
        </div>
      </div>

      {/* Profile Information Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Account Details Card */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            Account Details
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '4px'
            }}>
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
              {user.id}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '4px'
            }}>
              Email
            </div>
            <div style={{
              fontSize: '16px',
              color: 'var(--text-primary)',
              fontWeight: '500'
            }}>
              {user.email}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '4px'
            }}>
              Account Created
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--text-primary)'
            }}>
              {formatDate(user.created_at)}
            </div>
          </div>

          {user.email_confirmed_at && (
            <div>
              <div style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginBottom: '4px'
              }}>
                Email Confirmed
              </div>
              <div style={{
                fontSize: '14px',
                color: 'var(--text-primary)'
              }}>
                {formatDate(user.email_confirmed_at)}
              </div>
            </div>
          )}
        </div>

        {/* Profile Information Card */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            Profile Information
          </h3>

          {profile ? (
            <>
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  marginBottom: '4px'
                }}>
                  Role
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 12px',
                  backgroundColor: getRoleColor(profile.role),
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: 'white',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {getRoleIcon(profile.role)} {profile.role}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  marginBottom: '4px'
                }}>
                  Profile Created
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--text-primary)'
                }}>
                  {formatDate(profile.created_at)}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  marginBottom: '4px'
                }}>
                  Last Updated
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--text-primary)'
                }}>
                  {formatDate(profile.updated_at)}
                </div>
              </div>
            </>
          ) : (
            <div style={{
              color: 'var(--text-secondary)',
              fontStyle: 'italic'
            }}>
              Profile information not available
            </div>
          )}
        </div>
      </div>

      {/* Session Information */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)'
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--text-primary)'
        }}>
          Session Information
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          {user.last_sign_in_at && (
            <div>
              <div style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginBottom: '4px'
              }}>
                Last Sign In
              </div>
              <div style={{
                fontSize: '14px',
                color: 'var(--text-primary)'
              }}>
                {formatDate(user.last_sign_in_at)}
              </div>
            </div>
          )}

          <div>
            <div style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '4px'
            }}>
              Current Status
            </div>
            <div style={{
              fontSize: '14px',
              color: '#28a745',
              fontWeight: '500'
            }}>
              🟢 Active Session
            </div>
          </div>
        </div>

        {/* Refresh Profile Button */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={fetchUserProfile}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--button-bg)',
              color: 'var(--button-text)',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;
