import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import { hasPermission } from "../config/permissions";

/**
 * AuthContext provides user, role(s), and RBAC permission helpers.
 * Context value: { user, role, can(permission), loading }
 */
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user and role from Supabase (profiles table)
  useEffect(() => {
    setLoading(true);

    async function loadSession() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      if (!authUser) {
        setRole(null);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authUser.id)
        .single();
      setRole(data?.role || null);
      setLoading(false);
    }
    loadSession();

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setTimeout(() => { loadSession(); }, 100); // reload after minor delay
    });

    return () => {
      listener?.unsubscribe?.();
    };
  }, []);

  // PUBLIC_INTERFACE: can(permission)
  const can = (permission) => hasPermission(role, permission);

  return (
    <AuthContext.Provider value={{ user, role, can, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
