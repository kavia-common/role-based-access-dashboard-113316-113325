import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import supabase from '../../config/supabase';

// PUBLIC_INTERFACE
/**
 * AdminDashboard component providing comprehensive administrative interface
 * Features user management, system statistics, role management, and admin tools
 * Only accessible to users with 'admin' role
 * 
 * @returns {React.ReactNode} Admin dashboard with management capabilities
 */
const AdminDashboard = () => {
  const { user, getUserRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminCount: 0,
    userCount: 0,
    guestCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch all users and their profiles
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, role, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(profiles || []);
      
      // Calculate statistics
      const totalUsers = profiles?.length || 0;
      const adminCount = profiles?.filter(p => p.role === 'admin').length || 0;
      const userCount = profiles?.filter(p => p.role === 'user').length || 0;
      const guestCount = profiles?.filter(p => p.role === 'guest').length || 0;

      setStats({
        totalUsers,
        adminCount,
        userCount,
        guestCount
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage(`Error loading users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      setMessage(`User role updated to ${newRole} successfully`);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error updating user role:', error);
      setMessage(`Error updating role: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#dc3545';
      case 'user': return '#007bff';
      case 'guest': return '#6c757d';
      default: return '#6c757d';
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
            backgroundColor: '#dc3545',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px',
            fontSize: '24px',
            color: 'white'
          }}>
            🔐
          </div>
          <div>
            <h1 style={{ margin: '0', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Admin Dashboard
            </h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '16px' }}>
              Welcome back, {user?.email} • Role: <strong style={{ textTransform: 'capitalize' }}>{getUserRole()}</strong>
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '20px'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#007bff' }}>
              {stats.totalUsers}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Total Users
            </div>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc3545' }}>
              {stats.adminCount}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Administrators
            </div>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#28a745' }}>
              {stats.userCount}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Standard Users
            </div>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#6c757d' }}>
              {stats.guestCount}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Guest Users
            </div>
          </div>
        </div>
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
            to="/user"
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
            👤 View User Area
          </Link>

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
            👋 View Guest Area
          </Link>

          <button
            onClick={fetchUsers}
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
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: message.includes('Error') 
            ? 'rgba(220, 53, 69, 0.1)' 
            : 'rgba(40, 167, 69, 0.1)',
          border: `1px solid ${message.includes('Error') 
            ? 'rgba(220, 53, 69, 0.3)' 
            : 'rgba(40, 167, 69, 0.3)'}`,
          color: message.includes('Error') ? '#dc3545' : '#28a745'
        }}>
          {message}
        </div>
      )}

      {/* User Management Section */}
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
            User Management
          </h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Manage user roles and permissions
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div>Loading users...</div>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div>No users found</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-primary)' }}>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    User ID
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    Role
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    Created
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((userProfile) => (
                  <tr key={userProfile.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>
                      <div style={{
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {userProfile.id}
                      </div>
                      {userProfile.id === user?.id && (
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#007bff',
                          fontWeight: '500'
                        }}>
                          (You)
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                        color: 'white',
                        backgroundColor: getRoleColor(userProfile.role)
                      }}>
                        {userProfile.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                      {formatDate(userProfile.created_at)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {userProfile.id !== user?.id && (
                        <select
                          value={userProfile.role}
                          onChange={(e) => updateUserRole(userProfile.id, e.target.value)}
                          style={{
                            padding: '6px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="guest">Guest</option>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                      {userProfile.id === user?.id && (
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Current User
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
