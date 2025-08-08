import React from 'react';
import PropTypes from 'prop-types';

/**
 * TaskList component displays a list of user tasks for the day.
 * @param {Object[]} tasks - Array of task objects.
 */
 // PUBLIC_INTERFACE
function TaskList({ tasks }) {
  /** This is a public component for displaying a user's daily task list. */

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
              textDecoration: task.completed ? "line-through" : "none",
              color: task.completed ? "#64748b" : "#111",
              opacity: task.completed ? 0.6 : 1
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
    }),
  ),
};

export default TaskList;
