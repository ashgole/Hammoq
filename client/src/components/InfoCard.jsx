import React from 'react';

/**
 * InfoCard Component
 * Single Responsibility: Present architectural highlights and system information.
 */
export function InfoCard() {
  return (
    <div className="card info-card">
      <h2 className="info-title">System Architecture & Features</h2>
      <ul className="feature-list">
        <li className="feature-item">
          <span className="feature-bullet">✨</span>
          <div>
            <strong>Dark & Light Theme:</strong> Dynamic CSS variable switching with system preference detection and localStorage persistence.
          </div>
        </li>
        <li className="feature-item">
          <span className="feature-bullet">🧱</span>
          <div>
            <strong>SOLID Principles:</strong> Separated API service, theme context, focused components, and decoupled state management.
          </div>
        </li>
        <li className="feature-item">
          <span className="feature-bullet">⚡</span>
          <div>
            <strong>Vite + React:</strong> Fast modular HMR development environment using standard React hooks (<code>useState</code>, <code>useEffect</code>).
          </div>
        </li>
      </ul>
    </div>
  );
}
