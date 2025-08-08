import React from "react";

/**
 * PUBLIC_INTERFACE
 * TaskList displays today's tasks with minimal, separated style.
 */
function TaskList({ tasks, onToggleComplete, onDeleteTask }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div
        className="empty-tasks"
        style={{
          color: "#64748b",
          opacity: 0.6,
          textAlign: "center",
          margin: "2.5rem 0",
          fontSize: "1.08rem",
        }}
      >
        No tasks for today. 🎉
      </div>
    );
  }

  return (
    <ul
      className="task-list"
      style={{
        padding: 0,
        margin: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
      }}
    >
      {tasks.map((task) => (
        <li
          key={task.id}
          className={task.completed ? "completed" : ""}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            background: "#fff",
            padding: "0.98rem 1.2rem",
            borderRadius: "10px",
            border: task.completed
              ? "1.5px solid #fbbf24"
              : "1px solid #f3f4f6",
            boxShadow: "0 2px 6px rgba(100,116,139,0.05)",
            textDecoration: task.completed ? "line-through" : "none",
            opacity: task.completed ? 0.72 : 1,
            fontWeight: 500,
            fontSize: "1.03rem",
            color: task.completed ? "#cacaca" : "#22223b",
            justifyContent: "space-between",
            transition: "border 0.2s, box-shadow 0.2s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flex: 1 }}>
            <input
              type="checkbox"
              checked={!!task.completed}
              onChange={() => onToggleComplete(task.id)}
              aria-label={`Mark task "${task.title}" as ${
                task.completed ? "incomplete" : "complete"
              }`}
              style={{
                accentColor: "#eb8e24",
                width: 18,
                height: 18,
              }}
            />
            <span>{task.title}</span>
          </div>
          <button
            onClick={() => onDeleteTask(task.id)}
            style={{
              background: "#fff",
              color: "#eb8e24",
              border: "1.3px solid #fbbf24",
              borderRadius: "6px",
              padding: "0.2rem 0.85rem",
              fontWeight: 500,
              fontSize: "0.99rem",
              marginLeft: "1rem",
              cursor: "pointer",
              transition: "background 0.13s, color 0.13s",
            }}
            aria-label={`Delete task "${task.title}"`}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
