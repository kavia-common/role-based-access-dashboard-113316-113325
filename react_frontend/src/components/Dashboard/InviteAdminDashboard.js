import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabase";
import Dialog from "../UI/Dialog";
import EmptyState from "../UI/EmptyState";
import Skeleton from "../UI/Skeleton";
import RoleBadge from "../Roles/RoleBadge";
import { useToast } from "../UI/ToastContext";

/**
 * PUBLIC_INTERFACE
 * Displays and manages user/org invitations for invite admins.
 */
export default function InviteAdminDashboard() {
  const [invites, setInvites] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const { addToast } = useToast();

  // Fetch all invites
  useEffect(() => {
    setLoading(true);
    async function fetchInvites() {
      let { data, error } = await supabase
        .from("invites")
        .select("*");
      if (error) addToast("Error loading invites", "error");
      setInvites(data || []);
      setLoading(false);
    }
    fetchInvites();
  }, [addToast]);

  // Remove invite
  async function handleRemoveInvite(id) {
    const { error } = await supabase.from("invites").delete().eq("id", id);
    if (error) addToast("Failed to remove invite", "error");
    else {
      addToast("Invite removed", "success");
      setConfirmDialog(false);
      setInvites((i) => i.filter(inv => inv.id !== id));
    }
  }

  if (loading) return <div><Skeleton width={600} height={30} /><Skeleton width={420} height={33} /></div>;
  return (
    <div>
      <h2 style={{ color: "#fbbf24" }}>Invite Admin Dashboard</h2>
      {invites && invites.length === 0 && <EmptyState message="No pending invites." />}
      <div>
        {invites && invites.map(invite => (
          <div key={invite.id} style={{
            border: "1px solid #f3f3f3", borderRadius: 8, margin: "18px 0", padding: 13,
            display: "flex", gap: 20, alignItems: "center"
          }}>
            <span>{invite.email}</span>
            <RoleBadge role={invite.role} />
            <span style={{ color: "#64748b" }}>Org: {invite.org_id}</span>
            <button style={{
              background: "#ef4444", color: "#fff", padding: "4px 12px",
              border: "none", borderRadius: 5, marginLeft: "auto"
            }}
              onClick={() => { setSelectedInvite(invite); setConfirmDialog(true); }}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <h3>Remove Invite</h3>
        <p>Are you sure you want to remove invite to {selectedInvite?.email}?</p>
        <button onClick={() => handleRemoveInvite(selectedInvite.id)}
          style={{ background: "#ef4444", color: "#fff", padding: "7px 18px", border: "none", borderRadius: 5, fontWeight: 600, marginRight: 10 }}>
          Yes, Remove
        </button>
        <button onClick={() => setConfirmDialog(false)}
          style={{ background: "#64748b", color: "#fff", padding: "7px 14px", border: "none", borderRadius: 5 }}>
          Cancel
        </button>
      </Dialog>
    </div>
  );
}
