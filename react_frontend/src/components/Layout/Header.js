import React from "react";
import useAuth from "../../hooks/useAuth";
import "../../App.css";

/**
 * PUBLIC_INTERFACE
 * Header component with app branding and logout button for daily task tracker.
 */
function Header({ onLogout }) {
  const { user } = useAuth();

  return (
    <header
      className="header"
      style={{
        padding: "0 2rem",
        height: "64px",
        background: "#fff",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 10,
        position: "sticky",
        top: 0,
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.02)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          aria-label="Dashboard Logo"
          role="img"
          style={{
            fontSize: "2rem",
            marginRight: "0.5rem",
            color: "#eb8e24",
          }}
        >
          🗂️
        </span>
        <span
          style={{
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "#22223b",
            letterSpacing: "0.02rem",
          }}
        >
          Daily Task Tracker
        </span>
      </div>
      <nav>
        {user && (
          <button
            onClick={onLogout}
            style={{
              background: "#eb8e24",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.4rem 1rem",
              fontWeight: 500,
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
