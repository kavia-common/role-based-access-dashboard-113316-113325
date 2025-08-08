import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import useTasks from '../../hooks/useTasks';

/**
 * TaskList component displays a list of user tasks for the day, with per-task progress status dropdown.
 * @param {Object[]} tasks - Array of task objects.
 * @param {string|number} userId - User ID (for useTasks hook, if needed).
 */
// PUBLIC_INTERFACE
function TaskList({ tasks, userId }) {
  /** This is a public component for displaying and updating a user's daily task list. */
  // Security: Always ensure the hook is tied to the current userId
  const { updateTask } = useTasks(userId);

  // Mapping between status string and numeric progress value
  const statusOptions = [
    { value: 0, label: "Not started" },
    { value: 50, label: "In progress" },
    { value: 100, label: "Done" }
  ];

  // Handler for dropdown change
  const handleStatusChange = useCallback(
    (taskId, progress) => {
      // Update progress for the task, Supabase reflects in real-time via useTasks hook
      updateTask(taskId, { progress });
    },
    [updateTask]
  );

  if (!tasks) {
    return <div>Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return <div className="task-list-empty">No tasks for today 🎉</div>;
  }

  return (
    <div className="task-list-container">
      <h2 style={{marginBottom: "0.75rem"}}>Today's Tasks</h2>
      <ul className="task-list" style={{
        background: "#fff",
        padding: 0,
        borderRadius: "8px",
        boxShadow: "0 2px 8px #fbbf2440",
        listStyle: 'none',
        margin: 0,
      }}>
        {tasks.map((task) => (
          <li key={task.id} className="task-list-item" style={{
            padding: "0.75rem 1rem",
            borderBottom: "1px solid #f3f4f6",
            display: "flex",
            alignItems: "center",
            fontSize: "1rem"
          }}>
            <span style={{
              flex: 1,
              textDecoration: Number(task.progress) === 100 ? "line-through" : "none",
              color: Number(task.progress) === 100 ? "#64748b" : "#111",
              opacity: Number(task.progress) === 100 ? 0.6 : 1
            }}>
              {task.title}
            </span>
            {task.due_date && (
              <span style={{
                fontSize: "0.825rem",
                color: "#eb8e24",
                marginLeft: "1.25rem"
              }}>
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
            <select
              aria-label="Update task status"
              style={{
                marginLeft: "1.25rem",
                padding: "0.25rem 0.5rem",
                fontSize: "0.95rem",
                border: "1px solid #eb8e24",
                borderRadius: "6px",
                background: "#fff7ea",
                color: "#eb8e24"
              }}
              value={Number(task.progress) || 0}
              onChange={e => handleStatusChange(task.id, Number(e.target.value))}
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id:    PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool,
      due_date: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
      progress: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }),
  ),
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default TaskList;
