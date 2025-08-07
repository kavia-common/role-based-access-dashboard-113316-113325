import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// PUBLIC_INTERFACE
/**
 * ProtectedRoute component that restricts access based on authentication and user role
 * 
 * This component wraps protected content and ensures that:
 * 1. User is authenticated (has valid session)
 * 2. User has the required role (if specified)
 * 3. Redirects to login page if not authenticated
 * 4. Shows access denied message if authenticated but lacks required role
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The protected content to render
 * @param {string|string[]} [props.requiredRole] - Required role(s) to access the route. Can be a string or array of strings
 * @param {string} [props.redirectTo='/login'] - Path to redirect to if not authenticated
 * @param {React.ReactNode} [props.fallback] - Custom component to show when loading
 * @param {React.ReactNode} [props.accessDenied] - Custom component to show when access is denied
 * 
 * @returns {React.ReactNode} Protected content, loading state, redirect, or access denied message
 * 
 * @example
 * // Protect route for any authenticated user
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * 
 * @example
 * // Protect route for admin users only
 * <ProtectedRoute requiredRole="admin">
 *   <AdminPanel />
 * </ProtectedRoute>
 * 
 * @example
 * // Protect route for multiple roles
 * <ProtectedRoute requiredRole={['admin', 'user']}>
 *   <UserContent />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = '/login',
  fallback = null,
  accessDenied = null
}) => {
  const { isAuthenticated, getUserRole, loading } = useAuth();
  const location = useLocation();

  // Show loading state while authentication is being determined
  if (loading) {
    return fallback || (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px',
        color: 'var(--text-primary)'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    // Save the attempted location to redirect back after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If no specific role is required, allow access for any authenticated user
  if (!requiredRole) {
    return children;
  }

  const userRole = getUserRole();

  // Check if user has required role
  const hasRequiredRole = () => {
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    return userRole === requiredRole;
  };

  // Show access denied if user doesn't have required role
  if (!hasRequiredRole()) {
    return accessDenied || (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '20px',
        textAlign: 'center',
        color: 'var(--text-primary)'
      }}>
        <h2 style={{ color: '#e74c3c', marginBottom: '16px' }}>Access Denied</h2>
        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
          You don't have permission to access this page.
        </p>
        <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
          Required role: {Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Your current role: {userRole || 'No role assigned'}
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
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  // User is authenticated and has required role, render protected content
  return children;
};

export default ProtectedRoute;
