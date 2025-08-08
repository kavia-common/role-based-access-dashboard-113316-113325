import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute component - restricts access based on RBAC config:
 *   - requiredRole: one or more roles, or
 *   - requiredPermission: permission key from PERMISSIONS_MATRIX
 *   - Supports org/global role context and dynamic, config-driven permission checks.
 *
 * Usage:
 *   <ProtectedRoute requiredRole="org_admin">
 *   <ProtectedRoute requiredRole={['super_admin', 'org_admin']}>
 *   <ProtectedRoute requiredPermission="manage_orgs">
 */
const ProtectedRoute = ({
  children,
  requiredRole = null,
  requiredPermission = null,
  redirectTo = '/login',
  fallback = null,
  accessDenied = null,
}) => {
  const {
    isAuthenticated,
    loading,
    getEffectiveRole,
    hasPermission,
    getCurrentOrg,
    globalRole,
    orgMemberships,
    getOrgRole,
  } = useAuth();
  const location = useLocation();

  // Show loading state while auth/org is loading
  if (loading) {
    return (
      fallback || (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          color: 'var(--text-primary)',
        }}>
          <div>Loading...</div>
        </div>
      )
    );
  }

  // Not authenticated: redirect
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If requiredRole is set, use role logic (supports array, e.g. ["org_user", "org_admin"])
  let hasValidRole = true;
  if (requiredRole) {
    const currentRole = getEffectiveRole();
    if (Array.isArray(requiredRole)) {
      hasValidRole = requiredRole.includes(currentRole);
    } else {
      hasValidRole = currentRole === requiredRole;
    }
  }

  // If requiredPermission is set, require that permission
  let hasValidPermission = true;
  if (requiredPermission) {
    hasValidPermission = hasPermission(requiredPermission);
  }

  // If either role/permission requirement fails:
  if (
    ((requiredRole && !hasValidRole) ||
      (requiredPermission && !hasValidPermission))
  ) {
    return (
      accessDenied || (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: '20px',
          textAlign: 'center',
          color: 'var(--text-primary)',
        }}>
          <h2 style={{ color: '#e74c3c', marginBottom: '16px' }}>Access Denied</h2>
          <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
            You don't have permission to access this page.
          </p>
          {(requiredRole || requiredPermission) && (
            <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
              Required:
              {requiredRole ? (
                <> role: {Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}</>
              ) : null}
              {requiredRole && requiredPermission ? ', ' : ''}
              {requiredPermission ? <> permission: {requiredPermission}</> : null}
            </p>
          )}
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Your current role: {getEffectiveRole() || 'No role assigned'}
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: 'var(--button-bg)',
              color: 'var(--button-text)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
        </div>
      )
    );
  }

  // All checks passed, user is permitted
  return children;
};

export default ProtectedRoute;
