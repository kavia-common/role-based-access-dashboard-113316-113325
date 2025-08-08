import React from "react";

/**
 * PUBLIC_INTERFACE
 * A badge component to visually display a user's role.
 * @param {string} role - The user's role (super_admin, org_admin, invite_admin, user, guest)
 * @returns {JSX.Element}
 */
const roleColors = {
  super_admin: "#eb8e24",
  org_admin: "#64748b",
  invite_admin: "#fbbf24",
  user: "#22c55e",
  guest: "#94a3b8",
};

const prettyNames = {
  super_admin: "Super Admin",
  org_admin: "Org Admin",
  invite_admin: "Invite Admin",
  user: "User",
  guest: "Guest",
};

export default function RoleBadge({ role }) {
  const color = roleColors[role] || "#64748b";
  const name = prettyNames[role] || role || "Unknown";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "10px",
        fontSize: "0.8em",
        fontWeight: "bold",
        color: "#fff",
        background: color,
      }}
      aria-label={`Role: ${name}`}
    >
      {name}
    </span>
  );
}
