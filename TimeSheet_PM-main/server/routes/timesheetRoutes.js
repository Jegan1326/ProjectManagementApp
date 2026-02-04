const express = require('express');
const router = express.Router();
const timesheetController = require('../controllers/timesheetController');

// User routes
router.post('/', timesheetController.submitTimesheet);
router.get('/my-timesheets', timesheetController.getUserTimesheets);

// Admin routes
router.get('/', timesheetController.getAllTimesheets);
router.put('/:id/status', timesheetController.updateStatus);
router.delete('/:id', timesheetController.deleteTimesheet);

module.exports = router;
