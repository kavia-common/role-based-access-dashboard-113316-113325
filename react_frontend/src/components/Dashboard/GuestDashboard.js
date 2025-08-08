import React from "react";

/**
 * PUBLIC_INTERFACE
 * Minimal, clean guest dashboard for demo clarity.
 */
function GuestDashboard() {
  return (
    <div
      style={{
        maxWidth: 420,
        margin: "2.3rem auto 1.4rem auto",
        background: "#f9fafb",
        borderRadius: "15px",
        boxShadow: "0 4px 30px 0 rgba(100,116,139,0.07)",
        padding: "2.1rem 1.9rem",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          color: "#eb8e24",
          fontWeight: 700,
          fontSize: "1.26rem",
          marginBottom: "1.15rem",
        }}
      >
        Welcome, Guest!
      </h2>
      <p style={{ color: "#64748b", fontSize: "1.08rem", fontWeight: 500, opacity: 0.85 }}>
        Please log in or register to access personalized daily task tracking features.
      </p>
    </div>
  );
}

export default GuestDashboard;
