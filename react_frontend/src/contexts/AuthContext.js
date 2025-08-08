import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

// --- Permissions Matrix Setup --- //
export const PERMISSIONS_MATRIX = {
  super_admin: {
    can: ['manage_orgs', 'manage_users', 'view_all', 'invite_anyone'],
    description: 'Global super admin. Can manage all organizations and users.',
    orgScope: false,
  },
  org_admin: {
    can: ['manage_org_users', 'view_org_dashboard', 'invite_org_users'],
    description: 'Admin of a specific org. Can manage users within their org.',
    orgScope: true,
  },
  org_user: {
    can: ['view_org_dashboard'],
    description: 'User within the organization. Can view and interact with org dashboards.',
    orgScope: true,
  },
  guest: {
    can: [],
    description: 'Limited access, typically just authenticated.',
    orgScope: false,
  },
};

// ---- AuthContext Setup ---- //
const AuthContext = createContext({});

// PUBLIC_INTERFACE
/**
 * AuthProvider component for the application, supporting multi-org and advanced RBAC.
 *  - Provides authenticated user, session, org context, and role/permissions helpers.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orgMemberships, setOrgMemberships] = useState([]); // List of orgs user belongs to
  const [currentOrg, setCurrentOrg] = useState(null); // Currently active org (object: {id, name, ...})
  const [roleInOrg, setRoleInOrg] = useState(null); // Role of user in active org
  const [globalRole, setGlobalRole] = useState(null); // super_admin, etc.
  const [userProfile, setUserProfile] = useState(null);

  // Helper to fetch org memberships (for org_users with roles, org info)
  const getOrgMemberships = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('org_users')
        .select('org_id, orgs (name), role')
        .eq('user_id', userId);
      if (error) throw error;
      // Returns: [{ org_id, orgs: { name }, role }]
      return data;
    } catch (error) {
      console.error('Error fetching org memberships:', error);
      return [];
    }
  };

  // Helper to get top-level/global role from profiles table
  const getGlobalRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, global_role')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data?.global_role || null;
    } catch (error) {
      console.error('Error fetching global role:', error);
      return null;
    }
  };

  // Helper to fetch user profile details (audit convenience + future custom info)
  const getUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  };

  // Set currentOrg and roleInOrg when memberships or selection changes
  useEffect(() => {
    if (currentOrg && orgMemberships.length > 0) {
      const found = orgMemberships.find((m) => m.org_id === currentOrg.id);
      setRoleInOrg(found?.role || null);
    } else {
      setRoleInOrg(null);
    }
  }, [currentOrg, orgMemberships]);

  // Load session and profile/org/role data
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // --- Load user profile and org memberships --- //
          const userId = session.user.id;
          const [profile, orgs, gRole] = await Promise.all([
            getUserProfile(userId),
            getOrgMemberships(userId),
            getGlobalRole(userId),
          ]);
          setUserProfile(profile);
          setOrgMemberships(orgs || []);
          setGlobalRole(gRole);

          // If orgs found and no active selection, select the first by default
          if ((orgs || []).length > 0 && !currentOrg) {
            setCurrentOrg({ id: orgs[0].org_id, name: orgs[0].orgs?.name });
          }
        } else {
          setUserProfile(null);
          setOrgMemberships([]);
          setGlobalRole(null);
          setCurrentOrg(null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error in AuthProvider load:', error);
        if (mounted) setLoading(false);
      }
    };

    load();

    // Subscribe to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const userId = session.user.id;
          const [profile, orgs, gRole] = await Promise.all([
            getUserProfile(userId),
            getOrgMemberships(userId),
            getGlobalRole(userId),
          ]);
          setUserProfile(profile);
          setOrgMemberships(orgs || []);
          setGlobalRole(gRole);
          if ((orgs || []).length > 0 && !currentOrg) {
            setCurrentOrg({ id: orgs[0].org_id, name: orgs[0].orgs?.name });
          }
        } else {
          setUserProfile(null);
          setOrgMemberships([]);
          setGlobalRole(null);
          setCurrentOrg(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  // PUBLIC_INTERFACE: Set org context (used if user has >1 org)
  const selectOrg = (orgId) => {
    const org = orgMemberships.find((m) => m.org_id === orgId);
    if (org) {
      setCurrentOrg({ id: org.org_id, name: org.orgs?.name });
      setRoleInOrg(org.role);
    }
  };

  // PUBLIC_INTERFACE: Does user have a global/super_admin role
  const isSuperAdmin = () => globalRole === 'super_admin';

  // PUBLIC_INTERFACE: Does user have a role in the active org
  const hasOrgRole = (role) => roleInOrg === role;

  // PUBLIC_INTERFACE: Get current effective role (super_admin overrides org_role)
  const getEffectiveRole = () => {
    if (isSuperAdmin()) return 'super_admin';
    return roleInOrg || globalRole || null;
  };

  // PUBLIC_INTERFACE: Check permission by action (using permissions matrix)
  const hasPermission = (permission) => {
    const role = getEffectiveRole();
    if (!role) return false;
    const perms = PERMISSIONS_MATRIX[role]?.can || [];
    return perms.includes(permission);
  };

  // PUBLIC_INTERFACE: Shortcut for checking if authenticated
  const isAuthenticated = () => !!user && !!session;

  // PUBLIC_INTERFACE: Get list of orgs this user belongs to
  const getOrgs = () => orgMemberships.map((m) => ({
    id: m.org_id,
    name: m.orgs?.name,
    role: m.role,
  }));

  // PUBLIC_INTERFACE: Get current org and org role
  const getCurrentOrg = () => currentOrg;
  const getOrgRole = () => roleInOrg;

  // PUBLIC_INTERFACE: Core Supabase session info
  const getUser = () => user;
  const getSession = () => session;

  // --- Core Auth operations (signUp, signIn, signOut, etc.) --- //
  // PUBLIC_INTERFACE
  const signUp = async (email, password, options = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.REACT_APP_SITE_URL || window.location.origin}/auth/callback`,
          ...options,
        },
      });
      if (error) throw error;
      // No profile/org auto-creation, expect backend trigger/Edge function to handle invitations and membership.
      return { data, error: null };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { data: null, error };
    }
  };

  // PUBLIC_INTERFACE
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { data: null, error };
    }
  };

  // PUBLIC_INTERFACE
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      setOrgMemberships([]);
      setUserProfile(null);
      setCurrentOrg(null);
      setRoleInOrg(null);
      setGlobalRole(null);
      return { error: null };
    } catch (error) {
      console.error('Error in signOut:', error);
      return { error };
    }
  };

  // PUBLIC_INTERFACE: Reset password
  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.REACT_APP_SITE_URL || window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return { data: null, error };
    }
  };

  // --- Context value exposed to consumers --- //
  const value = {
    user,
    session,
    userProfile,
    loading,
    orgMemberships,
    currentOrg,
    roleInOrg,
    globalRole,

    // Core auth
    signUp,
    signIn,
    signOut,
    resetPassword,

    // Role/org helpers
    selectOrg,
    isSuperAdmin,
    hasOrgRole,
    getEffectiveRole,
    hasPermission,
    isAuthenticated,
    getOrgs,
    getCurrentOrg,
    getOrgRole,
    getUser,
    getSession,
    PERMISSIONS_MATRIX,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * PUBLIC_INTERFACE
 * useAuth() - React hook for accessing AuthContext in any component or custom hook.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
