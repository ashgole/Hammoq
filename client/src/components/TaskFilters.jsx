import React from 'react';

/**
 * TaskFilters Component
 * Single Responsibility: Present search input, status/priority/sort filters, and clear filter action.
 * Supports light & dark theme styling.
 *
 * @param {{
 *   filters: {
 *     search: string,
 *     status: string,
 *     priority: string,
 *     sortBy: string,
 *     sortOrder: string
 *   },
 *   onChange: (newFilters: Partial<typeof filters>) => void,
 *   onClear: () => void,
 *   hasActiveFilters: boolean
 * }} props
 */
export function TaskFilters({ filters, onChange, onClear, hasActiveFilters }) {
  const handleSearchChange = (e) => {
    onChange({ search: e.target.value });
  };

  const handleStatusChange = (e) => {
    onChange({ status: e.target.value });
  };

  const handlePriorityChange = (e) => {
    onChange({ priority: e.target.value });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === 'newest') {
      onChange({ sortBy: 'createdAt', sortOrder: 'desc' });
    } else if (value === 'oldest') {
      onChange({ sortBy: 'createdAt', sortOrder: 'asc' });
    } else if (value === 'dueDateAsc') {
      onChange({ sortBy: 'dueDate', sortOrder: 'asc' });
    } else if (value === 'dueDateDesc') {
      onChange({ sortBy: 'dueDate', sortOrder: 'desc' });
    }
  };

  const getSortSelectValue = () => {
    if (filters.sortBy === 'dueDate') {
      return filters.sortOrder === 'desc' ? 'dueDateDesc' : 'dueDateAsc';
    }
    return filters.sortOrder === 'asc' ? 'oldest' : 'newest';
  };

  return (
    <section className="task-filters-card" aria-label="Task Filters and Search">
      <div className="filters-row">
        {/* Search Input */}
        <div className="filter-group search-group">
          <label htmlFor="search-input" className="filter-label">Search</label>
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              id="search-input"
              type="text"
              className="form-control search-input"
              placeholder="Search tasks by title..."
              value={filters.search}
              onChange={handleSearchChange}
            />
            {filters.search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => onChange({ search: '' })}
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <label htmlFor="status-select" className="filter-label">Status</label>
          <select
            id="status-select"
            className="form-control select-control"
            value={filters.status}
            onChange={handleStatusChange}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="filter-group">
          <label htmlFor="priority-select" className="filter-label">Priority</label>
          <select
            id="priority-select"
            className="form-control select-control"
            value={filters.priority}
            onChange={handlePriorityChange}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="filter-group">
          <label htmlFor="sort-select" className="filter-label">Sort By</label>
          <select
            id="sort-select"
            className="form-control select-control"
            value={getSortSelectValue()}
            onChange={handleSortChange}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="dueDateAsc">Due Date (Earliest)</option>
            <option value="dueDateDesc">Due Date (Latest)</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="filter-group clear-group">
            <label className="filter-label">&nbsp;</label>
            <button
              type="button"
              className="btn btn-secondary clear-filters-btn"
              onClick={onClear}
              title="Reset all search and filter options"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
