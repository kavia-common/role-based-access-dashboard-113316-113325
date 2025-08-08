import React from "react";
import { useAuth } from "../../contexts/AuthContext";

/**
 * PUBLIC_INTERFACE
 * AdminDashboard - RBAC demo dashboard using permission matrix for all actions.
 */
function AdminDashboard() {
  const { can } = useAuth();

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        {can("invite_user") && <li>Invite user</li>}
        {can("view_users") && <li>View all users</li>}
        {can("edit_profile") && <li>Edit profile</li>}
        {can("feature_x") && <li>Feature X</li>}
        {can("feature_y") && <li>Feature Y (SuperAdmins only)</li>}
      </ul>
    </div>
  );
}

export default AdminDashboard;
