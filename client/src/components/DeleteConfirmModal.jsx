import React, { useState, useEffect } from 'react';

/**
 * DeleteConfirmModal Component
 * Single Responsibility: Modal confirmation dialog before deleting a task.
 * Supports light & dark theme styling.
 *
 * @param {{
 *   isOpen: boolean,
 *   task: any,
 *   onClose: () => void,
 *   onConfirm: (taskId: string) => Promise<void>
 * }} props
 */
export function DeleteConfirmModal({ isOpen, task, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDeleting(false);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !deleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, deleting, onClose]);

  if (!isOpen || !task) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    setError('');
    try {
      await onConfirm(task._id || task.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-container modal-container-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="delete-dialog-title" className="modal-title modal-title-danger">
            ⚠️ Delete Task
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={deleting}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="modal-error-alert" role="alert">
              ⚠️ {error}
            </div>
          )}

          <p className="delete-dialog-text">
            Are you sure you want to permanently delete:
          </p>
          <div className="delete-task-preview">
            &ldquo;<strong>{task.title}</strong>&rdquo;
          </div>
          <p className="delete-warning-subtext">
            This action cannot be undone.
          </p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
