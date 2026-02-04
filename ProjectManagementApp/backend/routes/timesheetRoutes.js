const express = require('express');
const router = express.Router();
const { submitTimesheet, getUserTimesheets, getAllTimesheets, updateStatus } = require('../controllers/timesheetController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, submitTimesheet)
    .get(protect, authorize('Super Admin', 'Project Admin', 'Project Manager'), getAllTimesheets);

router.route('/my')
    .get(protect, getUserTimesheets);

router.route('/:id/status')
    .put(protect, authorize('Super Admin', 'Project Admin', 'Project Manager'), updateStatus);

module.exports = router;
