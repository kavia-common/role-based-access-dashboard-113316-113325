import React from "react";
import PermissionsMatrix from "../UI/PermissionsMatrix";

/**
 * PUBLIC_INTERFACE
 * SuperAdminDashboard - RBAC demo dashboard for super admin, displays full permissions matrix.
 */
function SuperAdminDashboard() {
  return (
    <div>
      <h2>Super Admin Dashboard</h2>
      <ul>
        <li>Manage admins</li>
        <li>Manage organizations</li>
        <li>Edit profile</li>
        <li>Feature Y (SuperAdmins only)</li>
      </ul>
      <div style={{ marginTop: 24 }}>
        <h4>Permissions Matrix</h4>
        <PermissionsMatrix />
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
