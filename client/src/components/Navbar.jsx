import React from 'react';
import { ThemeToggle } from './ThemeToggle';

/**
 * Navbar Component
 * Single Responsibility: Top navigation bar with branding, theme switcher, and primary actions.
 * Supports light & dark theme styling.
 *
 * @param {{ onNewTask: () => void }} props
 */
export function Navbar({ onNewTask }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo" aria-hidden="true">
            <span>⚡</span>
          </div>
          <div className="brand-text">
            <span className="brand-badge">Assessment Demo</span>
            <h1 className="brand-title">Hammoq Task Manager</h1>
          </div>
        </div>

        <div className="navbar-actions">
          <ThemeToggle />
          <button
            type="button"
            className="btn btn-primary new-task-btn"
            onClick={onNewTask}
          >
            <span className="btn-icon" aria-hidden="true">＋</span>
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
