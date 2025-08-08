import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * TaskInput modal/component for adding new tasks.
 * Allows user to input title, description, and select initial status.
 * Integrates with useTasks hook for Supabase insert.
 * 
 * Props:
 *  - onTaskCreated: function(task) called upon successful addition (optional)
 *  - onClose: function() to close modal/input (optional)
 */
const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" }
];

export default function TaskInput({ useTasks, user, onTaskCreated, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(STATUS_OPTIONS[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { createTask } = useTasks();

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const newTask = {
        title,
        description,
        progress: status,
        user_id: user?.id,
        date: new Date().toISOString()
      };
      const result = await createTask(newTask);
      if (result?.error) {
        setError(result.error.message || "Unable to create task.");
      } else {
        setTitle("");
        setDescription("");
        setStatus(STATUS_OPTIONS[0].value);
        if (onTaskCreated) onTaskCreated(result.data);
        if (onClose) onClose();
      }
    } catch (err) {
      setError(err.message || "Error adding task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-input-modal">
      <form className="task-input-form" onSubmit={handleSubmit} style={{
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
        background: "#fff",
        maxWidth: 400,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
      }}>
        <h3 style={{marginBottom:12}}>Add New Task</h3>
        <div style={{marginBottom:12}}>
          <label style={{fontWeight:500}}>Title</label>
          <input
            style={{width:"100%",padding:8,marginTop:4,border:"1px solid #ccc",borderRadius:4}}
            type="text"
            value={title}
            onChange={e=>setTitle(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div style={{marginBottom:12}}>
          <label style={{fontWeight:500}}>Description</label>
          <textarea
            style={{width:"100%",padding:8,marginTop:4,border:"1px solid #ccc",borderRadius:4,minHeight:60}}
            value={description}
            onChange={e=>setDescription(e.target.value)}
            disabled={loading}
          />
        </div>
        <div style={{marginBottom:18}}>
          <label style={{fontWeight:500}}>Status</label>
          <select
            style={{width:"100%",padding:8,marginTop:4,border:"1px solid #ccc",borderRadius:4}}
            value={status}
            onChange={e=>setStatus(e.target.value)}
            disabled={loading}
          >
            {STATUS_OPTIONS.map(opt => (
              <option value={opt.value} key={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {error && <div style={{ color: "#dc2626", marginBottom: 8 }}>{error}</div>}
        <div style={{display:"flex",gap:10}}>
          <button type="submit"
            style={{
              background:"#eb8e24", color:"white", border:"none", borderRadius:4, padding:"8px 18px", fontWeight:500, cursor:"pointer"
            }}
            disabled={loading}
          >{loading ? "Adding..." : "Add Task"}</button>
          {onClose && (
            <button type="button"
              style={{
                background:"#64748b", color:"white", border:"none", borderRadius:4, padding:"8px 18px", fontWeight:500, cursor:"pointer"
              }}
              onClick={onClose}
              disabled={loading}
            >Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}

TaskInput.propTypes = {
  useTasks: PropTypes.func.isRequired,
  user: PropTypes.object,
  onTaskCreated: PropTypes.func,
  onClose: PropTypes.func
};
