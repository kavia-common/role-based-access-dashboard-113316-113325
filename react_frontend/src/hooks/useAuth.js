import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

// PUBLIC_INTERFACE
/**
 * Custom hook to access authentication context and methods
 * This hook provides access to user authentication state, methods for login/logout,
 * registration, session management, and role-based authorization helpers.
 * 
 * @returns {Object} Authentication context containing:
 *   - user: Current authenticated user object
 *   - session: Current session object
 *   - userProfile: User profile with role information
 *   - loading: Boolean indicating if auth state is loading
 *   - signUp: Function to register a new user
 *   - signIn: Function to sign in user
 *   - signOut: Function to sign out user
 *   - updateUserRole: Function to update user role (admin only)
 *   - getUserRole: Function to get current user's role
 *   - hasRole: Function to check if user has specific role
 *   - isAdmin: Function to check if user is admin
 *   - isAuthenticated: Function to check if user is authenticated
 *   - resetPassword: Function to reset user password
 * 
 * @throws {Error} Throws error if used outside of AuthProvider
 * 
 * @example
 * const { user, signIn, signOut, isAdmin } = useAuth();
 * 
 * const handleLogin = async (email, password) => {
 *   const { data, error } = await signIn(email, password);
 *   if (error) console.error('Login failed:', error);
 * };
 * 
 * const handleLogout = () => signOut();
 * 
 * const isUserAdmin = isAdmin();
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider. Make sure to wrap your component tree with <AuthProvider>');
  }
  
  return context;
};

export default useAuth;
