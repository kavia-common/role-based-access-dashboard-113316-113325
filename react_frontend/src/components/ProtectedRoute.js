import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute supports RBAC by requiredRoles and/or permissions.
 * @param {Array|string} requiredRoles
 * @param {string} requiredPermission
 */
export default function ProtectedRoute({ children, requiredRoles, requiredPermission }) {
  const { user, roles, loading, hasPermission } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;

  if (requiredRoles) {
    const roleSet = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const found = roleSet.some(r => roles.includes(r));
    if (!found) return <div>You do not have access to this page.</div>;
  }
  if (requiredPermission && !hasPermission(requiredPermission))
    return <div>You do not have this permission.</div>;

  return children;
}
