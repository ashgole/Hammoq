const express = require('express');
const { getHello } = require('../controllers/hello.controller');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

// Hello test endpoint
router.get('/hello', getHello);

// Task CRUD endpoints
router.route('/tasks')
  .get(getTasks)
  .post(createTask);

router.route('/tasks/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
