import React, { useEffect, useState, useCallback } from "react";
import supabase from "../../config/supabase";
import useAuth from "../../hooks/useAuth";

/**
 * PUBLIC_INTERFACE
 * Enhanced AdminDashboard: Shows all users, their roles, and all users' tasks in a clean, minimal layout.
 * Displays user/task stats and allows easy review of the team.
 */
function AdminDashboard() {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [reload, setReload] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users (profiles)
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, role, created_at");
      if (error) throw error;
      setAllUsers(data || []);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      setAllTasks(data || []);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, [fetchUsers, fetchTasks, reload]);

  // Count by role
  const countByRole = (role) =>
    allUsers.filter((u) => u.role === role).length;

  // Group tasks by user_id for simpler display
  const tasksByUser = allTasks.reduce((acc, t) => {
    if (!acc[t.user_id]) acc[t.user_id] = [];
    acc[t.user_id].push(t);
    return acc;
  }, {});

  // Minimalist user card with tasks
  const renderUserTasks = (profile) => (
    <div
      key={profile.id}
      style={{
        background: "#fff",
        border: "1px solid #f3f4f6",
        borderRadius: "10px",
        padding: "1.1rem 1.2rem",
        marginBottom: "1.1rem",
        boxShadow: "0 1px 6px 0 rgba(235,142,36,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <span style={{
          fontWeight: 700,
          color: profile.role === "admin"
            ? "#dc3545"
            : profile.role === "user"
            ? "#007bff"
            : "#6c757d",
          fontSize: 15,
          marginRight: 10,
          letterSpacing: "0.01rem"
        }}>
          {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
        </span>
        <span style={{
          color: "#64748b",
          fontSize: 13,
          marginRight: 10,
        }}>
          {profile.id.slice(0, 8)}...
        </span>
        <span style={{
          color: "#888",
          fontSize: 12,
        }}>
          Joined: {new Date(profile.created_at).toLocaleDateString()}
        </span>
      </div>
      {tasksByUser[profile.id]?.length > 0 ? (
        <ul style={{
          paddingLeft: 15,
          margin: 0
        }}>
          {tasksByUser[profile.id].map((task) => (
            <li key={task.id} style={{
              color: "#22223b",
              fontSize: 15,
              padding: "2px 0",
              listStyle: "square",
              opacity: task.progress >= 100 ? 0.6 : 1,
              textDecoration: task.progress >= 100 ? "line-through" : "none",
            }}>
              <span style={{ fontWeight: 500 }}>{task.title}</span>
              {task.progress !== undefined && (
                <span style={{
                  color: "#fbbf24",
                  fontWeight: 400,
                  marginLeft: 7,
                  fontSize: 13
                }}>
                  {task.progress}% done
                </span>
              )}
              <span style={{ marginLeft: 10, color: "#64748b", fontSize: 13 }}>
                {task.date}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{
          color: "#b0b0b0",
          fontSize: 14,
          fontStyle: "italic",
          marginTop: 6,
        }}>
          No tasks for this user.
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        maxWidth: 900,
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
          marginBottom: "1.15rem",
          letterSpacing: "0.01rem"
        }}
      >
        Admin – Team Overview
      </h2>
      <div style={{ color: "#22223b", fontWeight: 500, fontSize: "1rem", marginBottom: "1.3rem" }}>
        View and track all users and their daily tasks.<br />
        {loadingUsers || loadingTasks ? (
          <span style={{ color: "#888", fontSize: 13 }}>Loading data...</span>
        ) : (
          <span style={{
            color: "#888",
            fontSize: 13
          }}>
            Users: <b>{allUsers.length}</b>, Tasks: <b>{allTasks.length}</b> &nbsp; | Admins: {countByRole("admin")}, Users: {countByRole("user")}, Guests: {countByRole("guest")}
          </span>
        )}
      </div>
      <button
        onClick={() => setReload((r) => !r)}
        style={{
          background: "#fbbf24",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          fontWeight: 500,
          fontSize: "1rem",
          padding: "5px 18px",
          marginBottom: "1.2rem",
          boxShadow: "0 1px 4px 0 rgba(235,142,36,0.04)",
          cursor: loadingUsers || loadingTasks ? "not-allowed" : "pointer"
        }}
        disabled={loadingUsers || loadingTasks}
        aria-label="Refresh"
      >
        {loadingUsers || loadingTasks ? "Refreshing..." : "Refresh"}
      </button>
      {error && (
        <div style={{
          color: "#dc3545",
          background: "#fff5f5",
          border: "1px solid #ffe4e6",
          borderRadius: "7px",
          padding: "7px 13px",
          fontSize: 15,
          marginBottom: 14
        }}>{error}</div>
      )}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
        gap: "1.4rem",
        marginTop: "0.4rem"
      }}>
        {loadingUsers ? (
          <div>Loading users...</div>
        ) : (
          allUsers
            .sort((a, b) => a.role.localeCompare(b.role))
            .map((profile) => renderUserTasks(profile))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
