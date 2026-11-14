/**
 * API Service for Hammoq Task Manager.
 * Adheres to Single Responsibility Principle (SRP) and Dependency Inversion Principle (DIP).
 * All network communication and error normalization is isolated here.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Generic helper for HTTP requests with error parsing.
 * @param {string} endpoint
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Accept': 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorMessage = data?.message || `Request failed with status ${response.status} (${response.statusText})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Fetch all tasks with optional search, filters, and sorting.
 * @param {Object} [params]
 * @param {string} [params.search]
 * @param {string} [params.status]
 * @param {string} [params.priority]
 * @param {string} [params.sortBy]
 * @param {string} [params.sortOrder]
 * @returns {Promise<{ success: boolean, count?: number, data: Array<any>, stats?: any }>}
 */
export async function getTasks(params = {}) {
  const query = new URLSearchParams();
  if (params.search && params.search.trim()) query.set('search', params.search.trim());
  if (params.status && params.status !== 'All') query.set('status', params.status);
  if (params.priority && params.priority !== 'All') query.set('priority', params.priority);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortOrder) query.set('sortOrder', params.sortOrder);

  const queryString = query.toString();
  const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
  return request(endpoint, { method: 'GET' });
}

/**
 * Fetch a single task by its ID.
 * @param {string} id
 * @returns {Promise<{ success: boolean, data: any }>}
 */
export async function getTaskById(id) {
  return request(`/tasks/${id}`, { method: 'GET' });
}

/**
 * Create a new task.
 * @param {{ title: string, description?: string, status?: string, priority?: string, dueDate?: string | null }} taskData
 * @returns {Promise<{ success: boolean, data: any }>}
 */
export async function createTask(taskData) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

/**
 * Update an existing task by ID.
 * @param {string} id
 * @param {{ title?: string, description?: string, status?: string, priority?: string, dueDate?: string | null }} taskData
 * @returns {Promise<{ success: boolean, data: any }>}
 */
export async function updateTask(id, taskData) {
  return request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });
}

/**
 * Delete a task by ID.
 * @param {string} id
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Ping backend hello endpoint for health check.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function fetchHelloMessage() {
  return request('/hello', { method: 'GET' });
}
