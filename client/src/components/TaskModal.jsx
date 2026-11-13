import React, { useState, useEffect } from 'react';

/**
 * TaskModal Component
 * Single Responsibility: Form modal dialog for creating and editing tasks.
 * Supports light & dark theme styling.
 *
 * @param {{
 *   isOpen: boolean,
 *   mode: 'create' | 'edit',
 *   initialData?: any,
 *   onClose: () => void,
 *   onSubmit: (formData: any) => Promise<void>
 * }} props
 */
export function TaskModal({ isOpen, mode = 'create', initialData = null, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Synchronize initial data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData && mode === 'edit') {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setStatus(initialData.status || 'Pending');
        setPriority(initialData.priority || 'Medium');
        if (initialData.dueDate) {
          try {
            const d = new Date(initialData.dueDate);
            if (!isNaN(d.getTime())) {
              setDueDate(d.toISOString().split('T')[0]);
            } else {
              setDueDate('');
            }
          } catch {
            setDueDate('');
          }
        } else {
          setDueDate('');
        }
      } else {
        // Reset defaults for create mode
        setTitle('');
        setDescription('');
        setStatus('Pending');
        setPriority('Medium');
        setDueDate('');
      }
      setValidationError('');
      setSubmitting(false);
    }
  }, [isOpen, mode, initialData]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setValidationError('Task title is required.');
      return;
    }

    setValidationError('');
    setSubmitting(true);

    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });
      onClose();
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Failed to save task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isEditMode = mode === 'edit';

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {isEditMode ? '✏️ Edit Task' : '＋ Create New Task'}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            disabled={submitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {validationError && (
            <div className="modal-error-alert" role="alert">
              ⚠️ {validationError}
            </div>
          )}

          {/* Title Field */}
          <div className="form-field">
            <label htmlFor="task-title" className="form-label">
              Task Title <span className="required-indicator">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className={`form-control ${validationError && !title.trim() ? 'input-error' : ''}`}
              placeholder="e.g., Implement dark theme toggle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              autoFocus
              maxLength={150}
            />
          </div>

          {/* Description Field */}
          <div className="form-field">
            <label htmlFor="task-description" className="form-label">
              Description <span className="optional-label">(Optional)</span>
            </label>
            <textarea
              id="task-description"
              className="form-control textarea-control"
              placeholder="Add additional details, acceptance criteria, or notes..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              maxLength={500}
            />
          </div>

          {/* Status & Priority Row */}
          <div className="form-row-two">
            <div className="form-field">
              <label htmlFor="task-status" className="form-label">Status</label>
              <select
                id="task-status"
                className="form-control select-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={submitting}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="task-priority" className="form-label">Priority</label>
              <select
                id="task-priority"
                className="form-control select-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={submitting}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Due Date Field */}
          <div className="form-field">
            <label htmlFor="task-due-date" className="form-label">
              Due Date <span className="optional-label">(Optional)</span>
            </label>
            <input
              id="task-due-date"
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={submitting}
            />
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
