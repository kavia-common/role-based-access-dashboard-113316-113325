import React from "react";
import { NavLink } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation component for the daily task tracker.
 */
function Sidebar({ navLinks }) {
  return (
    <aside
      className="sidebar"
      style={{
        background: "#fafafb",
        borderRight: "1px solid #e5e7eb",
        minWidth: 180,
        maxWidth: 220,
        height: "calc(100vh - 64px)",
        paddingTop: 24,
        paddingBottom: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        boxSizing: "border-box",
      }}
    >
      <nav>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {navLinks.map((link) => (
            <li key={link.path} style={{ marginBottom: 10 }}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive ? "sidebar-link sidebar-link-active" : "sidebar-link"
                }
                style={({ isActive }) => ({
                  display: "block",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "6px",
                  color: "#22223b",
                  textDecoration: "none",
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? "#fbbf24" : "transparent",
                  boxShadow: isActive
                    ? "0 1px 8px 0 rgba(235,142,36,0.06)"
                    : "none",
                  transition: "background 0.18s",
                  letterSpacing: "0.01rem",
                })}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li style={{ marginTop: "2.2rem", color: "#64748b", fontSize: "0.9rem", fontWeight: 500, opacity: 0.7, paddingLeft: "1.2rem" }}>
            {/* subtle section label for daily tasks */}
            Daily Task Tracker
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
