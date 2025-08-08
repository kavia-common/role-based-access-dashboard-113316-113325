import React from "react";

/**
 * PUBLIC_INTERFACE
 * Minimal empty/zero data UI for dashboard sections.
 * @param {string} message - Text to display
 */
export default function EmptyState({ message = "Nothing here yet." }) {
  return (
    <div style={{
      color: "#64748b",
      fontWeight: 500,
      fontSize: "1.1em",
      padding: "50px 0",
      textAlign: "center"
    }}>
      <div style={{
        fontSize: 38, marginBottom: 10
      }}>🗂️</div>
      <div>{message}</div>
    </div>
  );
}
