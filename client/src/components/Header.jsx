import React from 'react';
import { ThemeToggle } from './ThemeToggle';

/**
 * Header Component
 * Single Responsibility: Present top branding, title, and theme controls.
 */
export function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="brand-group">
          <div className="badge">Hello World</div>
          <h1 className="app-title">Task Manager Application</h1>
          <p className="app-subtitle">
            Modern full-stack client built with React, Vite & SOLID architecture
          </p>
        </div>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
