import React from "react";
import TaskInput from "../Tasks/TaskInput";
import TaskList from "../Tasks/TaskList";

/**
 * PUBLIC_INTERFACE
 * Main dashboard for "user" role with daily task tracker focus.
 */
function UserDashboard({
  tasks = [],
  onAddTask,
  onToggleComplete,
  onDeleteTask,
  user,
}) {
  return (
    <div
      style={{
        maxWidth: 520,
        margin: "2.3rem auto 1.4rem auto",
        background: "#f9fafb",
        borderRadius: "17px",
        boxShadow: "0 8px 40px 0 rgba(100,116,139,0.08)",
        padding: "2.0rem 2.3rem 2.3rem 2.3rem",
      }}
    >
      <h2
        style={{
          color: "#eb8e24",
          fontWeight: 700,
          fontSize: "1.35rem",
          margin: 0,
          marginBottom: "1.5rem",
          letterSpacing: "0.01rem",
        }}
      >
        Daily Task Tracker
      </h2>
      <div
        style={{
          color: "#22223b",
          fontWeight: 500,
          marginBottom: "0.4rem",
          fontSize: "1.08rem",
        }}
      >
        Hi, {user?.user_metadata?.full_name || user?.email}! Here’s what’s on your daily agenda:
      </div>
      <TaskInput onAddTask={onAddTask} />
      <TaskList
        tasks={tasks}
        onToggleComplete={onToggleComplete}
        onDeleteTask={onDeleteTask}
      />
    </div>
  );
}

export default UserDashboard;
