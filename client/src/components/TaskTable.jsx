import React from 'react';

/**
 * TaskTable Component
 * Single Responsibility: Present task data in responsive tabular / card format
 * and emit edit/delete actions.
 * Supports light & dark theme styling.
 *
 * @param {{
 *   tasks: Array<any>,
 *   onEdit: (task: any) => void,
 *   onDelete: (task: any) => void,
 *   onToggleStatus: (task: any) => void
 * }} props
 */
export function TaskTable({ tasks, onEdit, onDelete, onToggleStatus }) {
  const formatDueDate = (dateString) => {
    if (!dateString) return { text: 'No due date', isOverdue: false };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { text: 'Invalid date', isOverdue: false };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    const isOverdue = taskDate < today;
    const formatted = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return { text: formatted, isOverdue };
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'badge-status-completed';
      case 'In Progress':
        return 'badge-status-inprogress';
      case 'Pending':
      default:
        return 'badge-status-pending';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'badge-priority-high';
      case 'Medium':
        return 'badge-priority-medium';
      case 'Low':
      default:
        return 'badge-priority-low';
    }
  };

  return (
    <div className="task-table-wrapper" role="region" aria-label="Task List">
      <table className="task-table">
        <thead>
          <tr>
            <th className="col-status">Status</th>
            <th className="col-title">Task Details</th>
            <th className="col-priority">Priority</th>
            <th className="col-due">Due Date</th>
            <th className="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const { text: dueDateText, isOverdue } = formatDueDate(task.dueDate);
            const showOverdueBadge = isOverdue && task.status !== 'Completed';

            return (
              <tr key={task._id || task.id} className="task-table-row">
                {/* Status Column */}
                <td className="col-status">
                  <button
                    type="button"
                    className={`status-pill ${getStatusBadgeClass(task.status)}`}
                    onClick={() => onToggleStatus && onToggleStatus(task)}
                    title="Click to advance status"
                  >
                    <span className="status-dot" aria-hidden="true">●</span>
                    <span>{task.status || 'Pending'}</span>
                  </button>
                </td>

                {/* Task Details */}
                <td className="col-title">
                  <div className="task-info">
                    <h4 className={`task-title ${task.status === 'Completed' ? 'completed-title' : ''}`}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                  </div>
                </td>

                {/* Priority Column */}
                <td className="col-priority">
                  <span className={`priority-tag ${getPriorityBadgeClass(task.priority)}`}>
                    {task.priority || 'Medium'}
                  </span>
                </td>

                {/* Due Date Column */}
                <td className="col-due">
                  <div className="due-date-wrapper">
                    <span className={`due-date-text ${showOverdueBadge ? 'text-overdue' : ''}`}>
                      {dueDateText}
                    </span>
                    {showOverdueBadge && (
                      <span className="overdue-tag">Overdue</span>
                    )}
                  </div>
                </td>

                {/* Actions Column */}
                <td className="col-actions">
                  <div className="actions-group">
                    <button
                      type="button"
                      className="btn-action btn-edit"
                      onClick={() => onEdit(task)}
                      aria-label={`Edit ${task.title}`}
                      title="Edit task"
                    >
                      ✏️ <span className="action-label">Edit</span>
                    </button>
                    <button
                      type="button"
                      className="btn-action btn-delete"
                      onClick={() => onDelete(task)}
                      aria-label={`Delete ${task.title}`}
                      title="Delete task"
                    >
                      🗑️ <span className="action-label">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile Card List View for Small Devices */}
      <div className="task-cards-mobile">
        {tasks.map((task) => {
          const { text: dueDateText, isOverdue } = formatDueDate(task.dueDate);
          const showOverdueBadge = isOverdue && task.status !== 'Completed';

          return (
            <div key={task._id || task.id} className="task-card-item">
              <div className="task-card-item-top">
                <span className={`status-pill ${getStatusBadgeClass(task.status)}`}>
                  ● {task.status || 'Pending'}
                </span>
                <span className={`priority-tag ${getPriorityBadgeClass(task.priority)}`}>
                  {task.priority || 'Medium'}
                </span>
              </div>

              <h4 className={`task-title ${task.status === 'Completed' ? 'completed-title' : ''}`}>
                {task.title}
              </h4>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}

              <div className="task-card-meta">
                <span className={`due-date-text ${showOverdueBadge ? 'text-overdue' : ''}`}>
                  📅 {dueDateText} {showOverdueBadge && ' (Overdue)'}
                </span>
              </div>

              <div className="task-card-actions">
                <button
                  type="button"
                  className="btn-action btn-edit"
                  onClick={() => onEdit(task)}
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  className="btn-action btn-delete"
                  onClick={() => onDelete(task)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
