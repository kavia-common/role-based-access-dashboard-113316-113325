import React from "react";
import { PERMISSIONS_MATRIX } from "../../config/permissions";

/**
 * PUBLIC_INTERFACE
 * PermissionsMatrix - Displays the RBAC role-permission mapping as a table.
 */
export default function PermissionsMatrix() {
  // Flatten all permissions to make grid columns
  const allPermissions = Array.from(
    new Set(Object.values(PERMISSIONS_MATRIX).flat())
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ minWidth: 600, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>Role</th>
            {allPermissions.map((perm) => (
              <th key={perm} style={{ padding: 8, borderBottom: "1px solid #ccc" }}>{perm}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(PERMISSIONS_MATRIX).map(([role, perms]) => (
            <tr key={role}>
              <td style={{ fontWeight: "bold", padding: 6 }}>{role}</td>
              {allPermissions.map((perm) => (
                <td key={perm} style={{ textAlign: "center" }}>
                  {perms.includes(perm) ? "✅" : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 12, color: "#666", fontSize: "0.95em" }}>
        <em>Each checkmark shows which actions each role can perform.</em>
      </div>
    </div>
  );
}
