import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../config/supabase";
import { ToastContext } from "../UI/ToastContext";
import EmptyState from "../UI/EmptyState";
import Skeleton from "../UI/Skeleton";
import Dialog from "../UI/Dialog";
import RoleBadge from "../Roles/RoleBadge";

// Helper to call invite_user Edge Function (duplicated for isolation; could be moved to shared/utils)
async function inviteUser({ email, role, orgId }, setToast) {
  try {
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

function OrgAdminDashboard() {
  const { addToast } = useContext(ToastContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // Org context should come from current user's org
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("user");
  const [submittingInvite, setSubmittingInvite] = useState(false);

  // demo: assume org_id is 1, in practice, fetch from user/profile context
  const orgId = 1;
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      let { data, error } = await supabase
        .from("profiles")
        .select("id, email, role, org_id")
        .eq("org_id", orgId);
      if (!error && data) setUsers(data);
      setLoading(false);
    }
    fetchUsers();
  }, [orgId]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setSubmittingInvite(true);
    await inviteUser(
      { email: inviteEmail.trim(), role: inviteRole, orgId: orgId },
      addToast
    );
    setSubmittingInvite(false);
    setInviteDialogOpen(false);
    setInviteEmail("");
    setInviteRole("user");
  };

  return (
    <div>
      <h2>Org Admin Dashboard</h2>
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
              onChange={e => setInviteEmail(e.target.value)}
              required
              autoFocus
            />
          </label>
          <label>
            Role:
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
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
        <EmptyState message="No users in your org." />
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

export default OrgAdminDashboard;
