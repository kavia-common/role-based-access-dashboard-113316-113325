import React from "react";

/**
 * PUBLIC_INTERFACE
 * Minimal reusable dialog/modal component for forms and confirmations.
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onClose - Function to close the dialog
 * @param {JSX.Element} children - Dialog content
 */
export default function Dialog({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      backgroundColor: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
    }}>
      <div style={{
        background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 6px 32px rgba(0,0,0,0.12)",
        minWidth: 320, maxWidth: "90vw", minHeight: 160,
        position: "relative"
      }}>
        <button aria-label="Close dialog" onClick={onClose} style={{
          position: "absolute", right: 16, top: 16, border: "none", background: "none",
          fontSize: 18, cursor: "pointer", color: "#64748b"
        }}>✕</button>
        {children}
      </div>
    </div>
  );
}
