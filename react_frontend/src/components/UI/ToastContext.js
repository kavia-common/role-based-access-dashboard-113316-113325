import React, { createContext, useContext, useCallback, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((msg, type="info", timeout=2500) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts, { id, msg, type }]);
    setTimeout(() => setToasts((ts) => ts.filter(t => t.id !== id)), timeout);
  }, []);
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 100, display: "flex", flexDirection: "column", gap: 8
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === "error" ? "#ef4444" : t.type === "success" ? "#22c55e" : "#64748b",
            color: "#fff", borderRadius: 6, padding: "10px 18px", minWidth: 160,
            boxShadow: "0 4px 20px rgba(0,0,0,0.13)"
          }}>{t.msg}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * PUBLIC_INTERFACE
 * useToast
 * @returns {addToast: function}
 * Usage: const { addToast } = useToast();
 */
export function useToast() {
  return useContext(ToastContext);
}
