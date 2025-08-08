import React from "react";
import { Link } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Minimal and visually clear guest dashboard with obvious prompt for account creation or login.
 */
function GuestDashboard() {
  return (
    <div
      style={{
        maxWidth: 440,
        margin: "2.5rem auto 1.7rem auto",
        background: "#fffbea",
        borderRadius: "17px",
        boxShadow: "0 8px 32px 0 rgba(100,116,139,0.07)",
        padding: "2.2rem 2.2rem 2.3rem 2.2rem",
        textAlign: "center",
        border: "1.5px solid #fde68a",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          background: "#fbbf24",
          borderRadius: "12px",
          margin: "0 auto 20px auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "38px",
          color: "#fff6e7",
          fontWeight: 700
        }}
      >
        👋
      </div>
      <h2
        style={{
          color: "#eb8e24",
          fontWeight: 700,
          fontSize: "1.22rem",
          marginBottom: "0.75rem",
          letterSpacing: "0.01rem"
        }}
      >
        Welcome to the Team Dashboard!
      </h2>
      <p style={{ color: "#64748b", fontSize: "1.13rem", fontWeight: 500, opacity: 0.86, marginBottom: 22 }}>
        Unlock personalized daily task tracking and join your team by creating an account or logging in.
      </p>
      <div style={{ display: "flex", gap: "13px", justifyContent: "center", marginTop: "16px" }}>
        <Link
          to="/login"
          style={{
            padding: "12px 26px",
            background: "#eb8e24",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            fontWeight: 600,
            fontSize: 16,
            textDecoration: "none",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(235,142,36,0.07)",
            transition: "background 0.2s"
          }}
        >
          Sign In
        </Link>
        <Link
          to="/login"
          style={{
            padding: "12px 26px",
            background: "transparent",
            color: "#eb8e24",
            fontWeight: 600,
            borderRadius: "8px",
            border: "2px solid #eb8e24",
            fontSize: 16,
            textDecoration: "none",
            cursor: "pointer",
            transition: "border 0.2s, color 0.2s"
          }}
        >
          Register
        </Link>
      </div>
      <p style={{
        color: "#9f7c14",
        fontSize: 13,
        opacity: 0.7,
        marginTop: "22px"
      }}>
        Accounts are free. Manage your daily tasks and team progress!
      </p>
    </div>
  );
}

export default GuestDashboard;
