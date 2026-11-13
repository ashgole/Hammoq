import React, { useEffect } from 'react';

/**
 * AlertBanner Component
 * Single Responsibility: Present dismissible feedback alerts (success, error, info).
 * Supports light & dark theme styling.
 *
 * @param {{
 *   type: 'success' | 'error' | 'info',
 *   message: string,
 *   onDismiss: () => void,
 *   autoDismissMs?: number
 * }} props
 */
export function AlertBanner({ type = 'info', message, onDismiss, autoDismissMs = 5000 }) {
  useEffect(() => {
    if (!message || !autoDismissMs) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, autoDismissMs);
    return () => clearTimeout(timer);
  }, [message, autoDismissMs, onDismiss]);

  if (!message) return null;

  const iconMap = {
    success: '✅',
    error: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`alert-banner alert-${type}`} role="alert">
      <span className="alert-icon" aria-hidden="true">{iconMap[type] || 'ℹ️'}</span>
      <div className="alert-content">
        <span className="alert-message">{message}</span>
      </div>
      <button
        type="button"
        className="alert-close-btn"
        onClick={onDismiss}
        aria-label="Dismiss alert"
      >
        ✕
      </button>
    </div>
  );
}
