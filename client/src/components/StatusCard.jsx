import React from 'react';

/**
 * StatusCard Component
 * Single Responsibility: Present API communication states (loading, error, success)
 * and provide user action (retry).
 *
 * @param {{
 *   loading: boolean,
 *   error: string | null,
 *   data: { success?: boolean, message?: string } | null,
 *   onRetry: () => void
 * }} props
 */
export function StatusCard({ loading, error, data, onRetry }) {
  if (loading) {
    return (
      <div className="card status-card loading-card" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true"></div>
        <div className="status-body">
          <h3 className="status-title">Connecting to Backend API...</h3>
          <p className="status-text">Fetching message from <code>/api/hello</code></p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card status-card error-card" role="alert">
        <div className="status-header">
          <span className="status-icon" aria-hidden="true">⚠️</span>
          <h3 className="status-title">Connection Error</h3>
        </div>
        <p className="status-text">{error}</p>
        <p className="status-hint">
          Make sure the backend server is running at <code>http://localhost:5000</code>.
        </p>
        <div className="status-actions">
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            🔄 Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (data) {
    return (
      <div className="card status-card success-card" role="region" aria-label="API Result">
        <div className="status-header">
          <span className="status-icon" aria-hidden="true">✅</span>
          <h3 className="status-title">API Response Received</h3>
        </div>
        <div className="response-box">
          <div className="response-row">
            <span className="response-label">Status:</span>
            <span className="response-badge success-badge">
              {data.success ? 'Success (200 OK)' : 'Failed'}
            </span>
          </div>
          <div className="response-row">
            <span className="response-label">Message:</span>
            <span className="response-value highlight-message">{data.message}</span>
          </div>
        </div>
        <div className="status-actions">
          <button type="button" className="btn btn-secondary" onClick={onRetry}>
            🔄 Refresh
          </button>
        </div>
      </div>
    );
  }

  return null;
}
