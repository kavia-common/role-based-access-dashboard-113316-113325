import React from "react";

/**
 * PUBLIC_INTERFACE
 * Minimal and clear admin dashboard with daily task management emphasis.
 */
function AdminDashboard({ adminContent }) {
  return (
    <div
      style={{
        maxWidth: 580,
        margin: "2.3rem auto 1.4rem auto",
        background: "#f9fafb",
        borderRadius: "17px",
        boxShadow: "0 8px 40px 0 rgba(100,116,139,0.08)",
        padding: "2.0rem 2.3rem 2.3rem 2.3rem",
      }}
    >
      <h2
        style={{
          color: "#eb8e24",
          fontWeight: 700,
          fontSize: "1.35rem",
          margin: 0,
          marginBottom: "1.15rem",
        }}
      >
        Admin Dashboard
      </h2>
      <div style={{ color: "#22223b", fontWeight: 500, fontSize: "1rem", marginBottom: "1rem" }}>
        Manage roles, users, and oversee daily tasks.
      </div>
      {adminContent}
    </div>
  );
}

export default AdminDashboard;
