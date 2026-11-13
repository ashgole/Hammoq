import React from 'react';

/**
 * EmptyState Component
 * Single Responsibility: Present a friendly, actionable empty state view.
 * Supports light & dark theme styling.
 *
 * @param {{
 *   title?: string,
 *   description?: string,
 *   actionLabel?: string,
 *   onAction?: () => void,
 *   icon?: string
 * }} props
 */
export function EmptyState({
  title = 'No Tasks Found',
  description = 'Get started by creating your first task or adjust your search filters.',
  actionLabel = 'Create Task',
  onAction,
  icon = '📋',
}) {
  return (
    <div className="empty-state-card" role="region" aria-label="Empty State">
      <div className="empty-state-icon" aria-hidden="true">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {onAction && actionLabel && (
        <button
          type="button"
          className="btn btn-primary empty-state-btn"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
