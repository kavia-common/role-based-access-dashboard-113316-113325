import React from "react";

/**
 * PUBLIC_INTERFACE
 * A simple loading skeleton UI component for placeholders.
 * @param {number} width - width in px or percent
 * @param {number} height - height in px
 */
export default function Skeleton({ width = 120, height = 20, style }) {
  return (
    <div
      style={{
        ...style,
        width,
        height,
        borderRadius: 8,
        background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 38%, #f3f4f6 67%)",
        backgroundSize: "400% 100%",
        animation: "skeleton-shimmer 1.1s infinite linear",
        marginBottom: 4,
      }}
    />
  );
}
