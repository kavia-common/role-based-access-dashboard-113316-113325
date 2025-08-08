import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Custom hook to access advanced authentication, org, and RBAC context.
 * Provides:
 *  - user, session, userProfile, org info, role helpers, permissions helpers, etc.
 *  - RBAC-aware: use `hasPermission('action')`, `isSuperAdmin()`, `selectOrg`, `getEffectiveRole`, etc.
 *
 * @example
 *   const { user, currentOrg, hasPermission, selectOrg } = useAuth();
 *   if (hasPermission('manage_orgs')) { ... }
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider. Make sure to wrap your component tree with <AuthProvider>'
    );
  }
  return context;
};

export default useAuth;
