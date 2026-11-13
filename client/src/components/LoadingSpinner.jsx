import React from 'react';

/**
 * LoadingSpinner Component
 * Single Responsibility: Display an accessible loading indicator.
 * Supports light & dark theme styling.
 *
 * @param {{ message?: string, inline?: boolean }} props
 */
export function LoadingSpinner({ message = 'Loading tasks...', inline = false }) {
  if (inline) {
    return (
      <span className="spinner-inline" role="status" aria-live="polite">
        <span className="spinner-circle spinner-circle-sm" aria-hidden="true" />
        {message && <span className="spinner-message-sm">{message}</span>}
      </span>
    );
  }

  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner-circle" aria-hidden="true" />
      <p className="spinner-message">{message}</p>
    </div>
  );
}
