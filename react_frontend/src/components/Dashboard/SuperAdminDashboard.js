import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabase";
import RoleBadge from "../Roles/RoleBadge";
import Dialog from "../UI/Dialog";
import EmptyState from "../UI/EmptyState";
import Skeleton from "../UI/Skeleton";
import { useToast } from "../UI/ToastContext";

/**
 * PUBLIC_INTERFACE
 * SuperAdminDashboard - manage organizations, admin users, and invites.
 */
export default function SuperAdminDashboard() {
  const [orgs, setOrgs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteDialog, setInviteDialog] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const { addToast } = useToast();

  // Fetch orgs and their admins
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      let { data, error } = await supabase
        .from("organizations")
        .select("id, name, users:organization_users(user_id, profiles(role, email))");
      if (error) addToast("Error loading organizations", "error");
      setOrgs(data || []);
      setLoading(false);
    }
    fetchData();
    // Could wire up to subscription for live changes in future
  }, [addToast]);

  // Invite admin to selected org via email (simplified flow)
  async function handleInviteSubmit(e) {
    e.preventDefault();
    if (!inviteEmail) return;
    // Invite logic: call backend RPC/supabase function or insert to invites:
    const { data, error } = await supabase.from("invites")
      .insert([{ email: inviteEmail, org_id: selectedOrg.id, role: "org_admin" }]);
    if (error) {
      addToast("Error sending invite.", "error");
    } else {
      addToast("Invite sent!", "success");
      setInviteDialog(false);
      setInviteEmail("");
    }
  }

  if (loading) return (
    <div>
      <Skeleton width={220} height={32} />
      <Skeleton width={480} height={60} />
      <Skeleton width={420} height={42} />
    </div>
  );

  return (
    <div>
      <h2 style={{ color: "#eb8e24" }}>Super Admin Dashboard</h2>
      <div>
        {orgs && orgs.length === 0 && <EmptyState message="No organizations exist yet." />}
        {orgs && orgs.map(org => (
          <div key={org.id} style={{
            border: "1px solid #f3f3f3", borderRadius: 10, margin: "24px 0", padding: 16
          }}>
            <div style={{ fontWeight: 600 }}>{org.name}</div>
            <div style={{ margin: "10px 0 6px 0" }}>
              {(org.users && org.users.length > 0) ? org.users.map(({ profiles: user }) =>
                <div key={user.email} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span>{user.email}</span>
                  <RoleBadge role={user.role} />
                </div>
              ) : <span style={{ color: "#888" }}>No admins assigned.</span>}
            </div>
            <button style={{
              background: "#eb8e24", color: "#fff", border: "none", borderRadius: 6, padding: "7px 18px", marginTop: 10
            }} onClick={() => { setSelectedOrg(org); setInviteDialog(true); }}>
              Invite Org Admin
            </button>
          </div>
        ))}
      </div>
      <Dialog open={inviteDialog} onClose={() => setInviteDialog(false)}>
        <h3>Invite Org Admin</h3>
        <form onSubmit={handleInviteSubmit}>
          <input
            type="email"
            placeholder="Enter email address"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            required
            style={{ width: "90%", padding: 8, margin: "12px 0", border: "1px solid #ddd", borderRadius: 5 }}
            autoFocus
          />
          <br />
          <button type="submit" style={{
            background: "#22c55e", color: "#fff", border: "none", borderRadius: 6, padding: "7px 18px", fontWeight: 600
          }}>
            Send Invite
          </button>
        </form>
      </Dialog>
    </div>
  );
}
