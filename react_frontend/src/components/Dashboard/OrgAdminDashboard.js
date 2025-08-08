import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabase";
import RoleBadge from "../Roles/RoleBadge";
import Dialog from "../UI/Dialog";
import EmptyState from "../UI/EmptyState";
import Skeleton from "../UI/Skeleton";
import { useToast } from "../UI/ToastContext";

/**
 * PUBLIC_INTERFACE
 * Organization Admin dashboard displaying user management for their org.
 */
export default function OrgAdminDashboard({ orgId }) {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteDialog, setInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const { addToast } = useToast();

  // Fetch users for orgId
  useEffect(() => {
    setLoading(true);
    async function fetchOrgUsers() {
      if (!orgId) return;
      const { data, error } = await supabase
        .from("organization_users")
        .select("user_id, profiles(email, role)")
        .eq("org_id", orgId);
      if (error) addToast("Error loading org users", "error");
      setUsers(data || []);
      setLoading(false);
    }
    fetchOrgUsers();
  }, [orgId, addToast]);

  // Invite regular user to org
  async function handleInviteSubmit(e) {
    e.preventDefault();
    if (!inviteEmail) return;
    const { error } = await supabase.from("invites")
      .insert([{ email: inviteEmail, org_id: orgId, role: "user" }]);
    if (error) addToast("Error sending invite", "error");
    else {
      addToast("Invite sent!", "success");
      setInviteDialog(false);
      setInviteEmail("");
    }
  }

  if (loading) return (
    <div><Skeleton width={300} height={30} /><Skeleton width={500} height={62} /></div>
  );

  return (
    <div>
      <h2 style={{ color: "#64748b" }}>Organization Admin Dashboard</h2>
      <div>
        {users && users.length === 0 && <EmptyState message="No users in this organization." />}
        {users && users.map(({ user_id, profiles: user }) => (
          <div key={user_id} style={{
            borderBottom: "1px solid #eee", margin: "8px 0", padding: "4px 0",
            display: "flex", alignItems: "center", gap: 16
          }}>
            <span>{user.email}</span> <RoleBadge role={user.role} />
          </div>
        ))}
      </div>
      <button style={{
        background: "#fbbf24", color: "#fff", border: "none", borderRadius: 5,
        padding: "8px 14px", margin: "12px 0"
      }}
        onClick={() => setInviteDialog(true)}
      >
        Invite User
      </button>
      <Dialog open={inviteDialog} onClose={() => setInviteDialog(false)}>
        <h3>Invite New User</h3>
        <form onSubmit={handleInviteSubmit}>
          <input
            type="email"
            placeholder="Enter user email"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            required
            style={{ width: "90%", padding: 8, margin: "10px 0", border: "1px solid #ddd", borderRadius: 5 }}
          />
          <br />
          <button type="submit" style={{
            background: "#22c55e", color: "#fff", border: "none", borderRadius: 6, padding: "6px 16px", fontWeight: 600
          }}>
            Send Invite
          </button>
        </form>
      </Dialog>
    </div>
  );
}
