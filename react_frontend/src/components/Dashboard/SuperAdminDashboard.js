import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../config/supabase";
import { ToastContext } from "../UI/ToastContext";
import EmptyState from "../UI/EmptyState";
import Skeleton from "../UI/Skeleton";
import Dialog from "../UI/Dialog";
import RoleBadge from "../Roles/RoleBadge";

/**
 * Helper for calling invite_user Edge Function.
 * @param {Object} params { email, role, orgId }
 * @param {Function} setToast function
 */
async function inviteUser({ email, role, orgId }, setToast) {
  try {
    // Edge Functions are invoked from the browser using public anon key only.
    const response = await fetch('/functions/v1/invite_user', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, role, org_id: orgId })
    });

    const data = await response.json();

    if (!response.ok) {
      setToast({
        type: "error",
        message: data?.error || "Invitation failed. Please try again."
      });
      return false;
    }

    setToast({
      type: "success",
      message: data?.message || "User invited successfully."
    });
    return true;
  } catch (err) {
    setToast({
      type: "error",
      message: "Network error. Please try again."
    });
    return false;
  }
}

function SuperAdminDashboard() {
  const { addToast } = useContext(ToastContext);

  // States for user data, loading, dialog visibility
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for invite dialog
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  // Invitation form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteOrg, setInviteOrg] = useState("");
  const [inviteRole, setInviteRole] = useState("org_admin");
  const [submittingInvite, setSubmittingInvite] = useState(false);

  useEffect(() => {
    // Load users for the org; for demo, load all users for super admin
    const fetchUsers = async () => {
      setLoading(true);
      let { data, error } = await supabase
        .from("profiles")
        .select("id, email, role, org_id");
      if (!error && data) setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    setSubmittingInvite(true);
    await inviteUser(
      { email: inviteEmail.trim(), role: inviteRole, orgId: inviteOrg },
      addToast
    );
    setSubmittingInvite(false);
    setInviteDialogOpen(false);
    setInviteEmail("");
    setInviteRole("org_admin");
    setInviteOrg("");
  };

  // UI rendering logic
  return (
    <div className="dashboard">
      <h2>Super Admin Dashboard</h2>
      <button onClick={() => setInviteDialogOpen(true)} className="btn-primary">
        Invite User
      </button>
      <Dialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        title="Invite User"
      >
        <form onSubmit={handleInvite} style={{ minWidth: 260 }}>
          <label>
            Email:
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              autoFocus
            />
          </label>
          <label>
            Org ID:
            <input
              type="text"
              value={inviteOrg}
              onChange={(e) => setInviteOrg(e.target.value)}
              required
            />
          </label>
          <label>
            Role:
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
              <option value="org_admin">Org Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="guest">Guest</option>
            </select>
          </label>
          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: 16 }}
            disabled={submittingInvite}
          >
            {submittingInvite ? "Sending..." : "Send Invite"}
          </button>
        </form>
      </Dialog>

      {loading ? (
        <Skeleton />
      ) : users.length === 0 ? (
        <EmptyState message="No users found." />
      ) : (
        <table className="user-list">
          <thead>
            <tr>
              <th>Email</th>
              <th>Org</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.org_id}</td>
                <td>
                  <RoleBadge role={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SuperAdminDashboard;
