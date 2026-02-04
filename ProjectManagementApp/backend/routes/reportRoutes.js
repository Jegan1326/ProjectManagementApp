const express = require('express');
const { getDashboardStats, getProjectProgress } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', protect, getDashboardStats);
router.get('/projects', protect, getProjectProgress);

module.exports = router;
