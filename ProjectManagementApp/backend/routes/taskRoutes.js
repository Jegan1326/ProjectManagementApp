const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask, addComment, restoreTask, permanentDeleteTask } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Super Admin', 'Project Admin', 'Project Manager'), createTask)
    .get(protect, getTasks);

router.route('/:id')
    .put(protect, updateTask)
    .delete(protect, authorize('Super Admin', 'Project Admin'), deleteTask);

router.route('/:id/restore')
    .put(protect, authorize('Super Admin', 'Project Admin'), restoreTask);

router.route('/:id/permanent')
    .delete(protect, authorize('Super Admin', 'Project Admin'), permanentDeleteTask);

router.route('/:id/comment')
    .post(protect, addComment);

module.exports = router;
