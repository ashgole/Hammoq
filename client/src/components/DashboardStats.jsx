import React from 'react';

/**
 * DashboardStats Component
 * Single Responsibility: Display summary counts (Total, Pending, In Progress, Completed)
 * and provide quick status filtering.
 * Supports light & dark theme styling.
 *
 * @param {{
 *   stats: { total: number, pending: number, inProgress: number, completed: number },
 *   activeStatus: string,
 *   onSelectStatus: (status: string) => void
 * }} props
 */
export function DashboardStats({ stats, activeStatus, onSelectStatus }) {
  const statItems = [
    {
      key: 'All',
      label: 'Total Tasks',
      count: stats.total ?? 0,
      icon: '📊',
      themeClass: 'stat-total',
    },
    {
      key: 'Pending',
      label: 'Pending',
      count: stats.pending ?? 0,
      icon: '⏳',
      themeClass: 'stat-pending',
    },
    {
      key: 'In Progress',
      label: 'In Progress',
      count: stats.inProgress ?? 0,
      icon: '🚀',
      themeClass: 'stat-in-progress',
    },
    {
      key: 'Completed',
      label: 'Completed',
      count: stats.completed ?? 0,
      icon: '✅',
      themeClass: 'stat-completed',
    },
  ];

  return (
    <section className="dashboard-stats-grid" aria-label="Task Summary Statistics">
      {statItems.map((item) => {
        const isActive = (item.key === 'All' && (!activeStatus || activeStatus === 'All')) ||
                         activeStatus === item.key;

        return (
          <button
            key={item.key}
            type="button"
            className={`stat-card ${item.themeClass} ${isActive ? 'active' : ''}`}
            onClick={() => onSelectStatus(item.key)}
            aria-pressed={isActive}
            title={`Filter by ${item.label}`}
          >
            <div className="stat-card-header">
              <span className="stat-label">{item.label}</span>
              <span className="stat-icon" aria-hidden="true">{item.icon}</span>
            </div>
            <div className="stat-count">{item.count}</div>
            <div className="stat-footer">
              <span className="stat-hint">
                {isActive ? '● Currently active' : 'Click to filter'}
              </span>
            </div>
          </button>
        );
      })}
    </section>
  );
}
