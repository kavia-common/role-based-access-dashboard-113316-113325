import { useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Custom hook to access advanced authentication, org, and RBAC context.
 * Provides:
 *  - user, session, userProfile, org info, role helpers, permissions helpers, etc.
 *  - RBAC-aware: use `can('permission')`, `user`, `role`, etc.
 *
 * @example
 *   const { user, role, can } = useAuth();
 *   if (can('manage_orgs')) { ... }
 */
export default useAuth;
