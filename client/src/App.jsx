import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskTable } from './components/TaskTable';
import { TaskModal } from './components/TaskModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AlertBanner } from './components/AlertBanner';
import { LoadingSpinner } from './components/LoadingSpinner';
import { EmptyState } from './components/EmptyState';

const DEFAULT_FILTERS = {
  search: '',
  status: 'All',
  priority: 'All',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function App() {
  const [tasks, setTasks] = useState([]);
  const [backendStats, setBackendStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState('create'); // 'create' | 'edit'
  const [editingTask, setEditingTask] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);

  // Feedback notifications
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error' | 'info', message: string }

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
  }, []);

  const dismissAlert = useCallback(() => {
    setAlert(null);
  }, []);

  // Fetch tasks from API
  const fetchTasksList = useCallback(async (currentFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTasks(currentFilters);
      // Support responses of format { success: true, data: [...], stats: {...} } or direct array
      const taskList = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      setTasks(taskList);
      if (response?.stats) {
        setBackendStats(response.stats);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to connect to the backend server.';
      setError(msg);
      showAlert('error', msg);
    } finally {
      setLoading(false);
    }
  }, [filters, showAlert]);

  // Initial load and filter change trigger
  useEffect(() => {
    fetchTasksList(filters);
  }, [filters, fetchTasksList]);

  // Derived or fallback statistics
  const stats = useMemo(() => {
    if (backendStats) {
      return backendStats;
    }
    const total = tasks.length;
    let pending = 0;
    let inProgress = 0;
    let completed = 0;

    tasks.forEach((t) => {
      if (t.status === 'Completed') completed++;
      else if (t.status === 'In Progress') inProgress++;
      else pending++;
    });

    return { total, pending, inProgress, completed };
  }, [backendStats, tasks]);

  // Filter change handlers
  const handleFilterChange = (updates) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.sortBy !== 'createdAt' ||
    filters.sortOrder !== 'desc'
  );

  // Quick status filter toggle from dashboard stat cards
  const handleSelectStatStatus = (statusKey) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status === statusKey && statusKey !== 'All' ? 'All' : statusKey,
    }));
  };

  // Create Task Flow
  const handleOpenCreateModal = () => {
    setTaskModalMode('create');
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  // Edit Task Flow
  const handleOpenEditModal = (task) => {
    setTaskModalMode('edit');
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (formData) => {
    if (taskModalMode === 'create') {
      const res = await createTask(formData);
      showAlert('success', `Task "${formData.title}" created successfully!`);
      await fetchTasksList(filters);
      return res;
    } else if (editingTask) {
      const id = editingTask._id || editingTask.id;
      const res = await updateTask(id, formData);
      showAlert('success', `Task "${formData.title}" updated successfully!`);
      await fetchTasksList(filters);
      return res;
    }
  };

  // Delete Task Flow
  const handleOpenDeleteModal = (task) => {
    setDeletingTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (taskId) => {
    await deleteTask(taskId);
    showAlert('success', 'Task deleted successfully.');
    await fetchTasksList(filters);
  };

  // Quick cycle status: Pending -> In Progress -> Completed -> Pending
  const handleToggleStatus = async (task) => {
    const nextStatus =
      task.status === 'Pending'
        ? 'In Progress'
        : task.status === 'In Progress'
        ? 'Completed'
        : 'Pending';

    try {
      const id = task._id || task.id;
      await updateTask(id, { status: nextStatus });
      showAlert('success', `Status updated to "${nextStatus}".`);
      await fetchTasksList(filters);
    } catch (err) {
      showAlert('error', err instanceof Error ? err.message : 'Failed to update task status.');
    }
  };

  return (
    <div className="app-shell">
      {/* Top Navigation */}
      <Navbar onNewTask={handleOpenCreateModal} />

      {/* Main Container */}
      <main className="dashboard-container">
        {/* Alerts / Feedback Toast */}
        {alert && (
          <AlertBanner
            type={alert.type}
            message={alert.message}
            onDismiss={dismissAlert}
          />
        )}

        {/* Dashboard Statistics Row */}
        <DashboardStats
          stats={stats}
          activeStatus={filters.status}
          onSelectStatus={handleSelectStatStatus}
        />

        {/* Filter & Search Toolbar */}
        <TaskFilters
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Main Content Area */}
        <section className="task-content-section" aria-label="Task Management Table">
          {loading && !tasks.length ? (
            <div className="loading-state-wrapper">
              <LoadingSpinner message="Loading your tasks..." />
            </div>
          ) : error && !tasks.length ? (
            <div className="card error-state-card" role="alert">
              <span className="error-icon" aria-hidden="true">⚠️</span>
              <h3 className="error-title">Failed to Load Tasks</h3>
              <p className="error-message">{error}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => fetchTasksList(filters)}
              >
                🔄 Retry Connection
              </button>
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState
              title={hasActiveFilters ? 'No Matching Tasks Found' : 'No Tasks Yet'}
              description={
                hasActiveFilters
                  ? 'Try clearing your filters or search query to see other tasks.'
                  : 'Get organized today! Click the button below to add your very first task.'
              }
              actionLabel={hasActiveFilters ? 'Reset Filters' : '＋ Add Your First Task'}
              onAction={hasActiveFilters ? handleClearFilters : handleOpenCreateModal}
              icon={hasActiveFilters ? '🔍' : '📝'}
            />
          ) : (
            <>
              {loading && (
                <div className="subtle-refresh-indicator">
                  <LoadingSpinner inline message="Updating tasks..." />
                </div>
              )}
              <TaskTable
                tasks={tasks}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onToggleStatus={handleToggleStatus}
              />
            </>
          )}
        </section>
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        mode={taskModalMode}
        initialData={editingTask}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSaveTask}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={deletingTask}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Hammoq Task Manager Assessment &bull; Powered by React, Vite, Express &amp; MongoDB</p>
      </footer>
    </div>
  );
}

export default App;
