import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute supports RBAC by requiredPermission (config-powered).
 * @param {React.ReactNode} children - The protected content
 * @param {string|string[]} requiredPermission - Permissions needed 
 */
export default function ProtectedRoute({ children, requiredPermission }) {
  const { user, role, can, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (requiredPermission && !can(requiredPermission))
    return <div>You do not have access to this feature.</div>;

  return children;
}
