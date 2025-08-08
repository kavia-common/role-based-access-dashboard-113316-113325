import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../config/supabase";

/**
 * AuthContext provides user, org, role, and permission checks for RBAC flows.
 * { user, orgs, currentOrg, roles, hasPermission, loading }
 */
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [orgs, setOrgs] = useState([]); // All orgs user is part of
  const [currentOrg, setCurrentOrg] = useState(null); // Org selected
  const [roles, setRoles] = useState([]); // Role(s) (org, global)
  const [profile, setProfile] = useState(null); // legacy single profile
  const [loading, setLoading] = useState(true);

  // Load user and RBAC context on auth state
  useEffect(() => {
    setLoading(true);
    async function loadSession() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      if (!authUser) {
        setProfile(null);
        setOrgs([]);
        setRoles([]);
        setCurrentOrg(null);
        setLoading(false);
        return;
      }
      // Grab all orgs/roles for user from org_users or similar
      let { data: orgUsers, error } = await supabase
        .from("organization_users")
        .select("org_id, organization(name), profiles(role)")
        .eq("user_id", authUser.id);

      // fallback to single legacy 'profiles'
      let { data: profileRow } = await supabase
        .from("profiles").select("*").eq("id", authUser.id).single();

      setProfile(profileRow || null);

      const orgList = orgUsers?.map(o => ({
        org_id: o.org_id,
        name: o.organization?.name,
        role: o.profiles?.role || null
      })) || [];
      setOrgs(orgList);

      // Pick currentOrg (could default to first)
      setCurrentOrg((c) => c || orgList[0] || null);
      setRoles(orgList.map(o => o.role));

      setLoading(false);
    }
    loadSession();
    // Listen to auth state changes:
    const unsub = supabase.auth.onAuthStateChange((_event, sess) => {
      if (sess?.user) setUser(sess.user);
      else setUser(null);
      setLoading(true);
      // trigger reload of orgs/roles
      setTimeout(() => {
        // lengthen for db propagation
        window.location.reload();
      }, 1250);
    });
    return () => {
      unsub?.data?.unsubscribe?.();
    };
  }, []);

  // PUBLIC_INTERFACE
  // RBAC/MATRIX permission check function
  function hasPermission(permission) {
    if (!roles || roles.length === 0) return false;
    // Example permission structure:
    const matrix = {
      "super_admin": ["view_super_dashboard", "invite_admin", "all"],
      "org_admin": ["view_org_dashboard", "invite_user", "all_org"],
      "invite_admin": ["view_invite_dashboard", "remove_invite"],
      "user": ["view_user_dashboard", "edit_own_profile"],
      "guest": [],
    };
    for (const r of roles) {
      if ((matrix[r] || []).includes(permission) || (matrix[r] || []).includes("all") || permission === "all") {
        return true;
      }
    }
    return false;
  }

  // Allow consumers to change org context...
  function setActiveOrg(org) {
    setCurrentOrg(org);
  }

  return (
    <AuthContext.Provider value={{
      user, orgs, currentOrg, roles, setActiveOrg,
      profile, hasPermission, loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
