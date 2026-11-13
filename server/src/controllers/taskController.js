const mongoose = require('mongoose');
const Task = require('../models/Task');

/**
 * Task Controller
 * Single Responsibility: Handling Task CRUD operations and calculating task statistics
 */

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with optional search, filtering, and sorting + dashboard statistics
 */
const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build query filter
    const filter = {};

    // Search by title (case-insensitive regex)
    if (search && search.trim() !== '') {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    // Filter by status (ignoring 'All' or empty)
    if (status && status !== 'All' && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      filter.status = status;
    }

    // Filter by priority (ignoring 'All' or empty)
    if (priority && priority !== 'All' && ['Low', 'Medium', 'High'].includes(priority)) {
      filter.priority = priority;
    }

    // Build sort object
    const sort = {};
    const validSortFields = ['createdAt', 'updatedAt', 'dueDate', 'title', 'priority', 'status'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sort[sortField] = sortOrder.toLowerCase() === 'asc' ? 1 : -1;

    // Fetch filtered tasks and calculate global statistics in parallel
    const [tasks, totalCount, pendingCount, inProgressCount, completedCount] = await Promise.all([
      Task.find(filter).sort(sort),
      Task.countDocuments({}),
      Task.countDocuments({ status: 'Pending' }),
      Task.countDocuments({ status: 'In Progress' }),
      Task.countDocuments({ status: 'Completed' }),
    ]);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
      statistics: {
        total: totalCount,
        pending: pendingCount,
        inProgress: inProgressCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task by ID
 */
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update an existing task
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    // If title is explicitly passed, ensure it is non-empty
    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Title cannot be empty',
      });
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (status !== undefined) updateFields.status = status;
    if (priority !== undefined) updateFields.priority = priority;
    if (dueDate !== undefined) updateFields.dueDate = dueDate ? new Date(dueDate) : null;

    const updatedTask = await Task.findByIdAndUpdate(id, updateFields, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: deletedTask._id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
