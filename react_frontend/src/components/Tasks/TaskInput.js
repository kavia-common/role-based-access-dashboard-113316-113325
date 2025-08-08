import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Input component for adding a new daily task, styled for clarity and clean UX.
 */
function TaskInput({ onAddTask }) {
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      onAddTask(task.trim());
      setTask("");
    }
  };

  return (
    <form
      className="task-input-form"
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        marginBottom: "1.4rem",
        background: "#fff",
        padding: "1.1rem 1.4rem",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(235,142,36,0.06)",
        border: "1px solid #f3f4f6",
      }}
    >
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add daily task..."
        maxLength={100}
        style={{
          flex: 1,
          fontSize: "1rem",
          border: "none",
          outline: "none",
          background: "transparent",
        }}
        aria-label="Enter a new daily task"
      />
      <button
        type="submit"
        style={{
          background: "#fbbf24",
          border: "none",
          borderRadius: "7px",
          color: "#fff",
          fontWeight: 600,
          fontSize: "1rem",
          padding: "0.5rem 1.3rem",
          cursor: "pointer",
          transition: "background 0.17s",
          boxShadow: "0 1px 8px 0 rgba(251,191,36,0.03)",
        }}
      >
        Add
      </button>
    </form>
  );
}

export default TaskInput;
