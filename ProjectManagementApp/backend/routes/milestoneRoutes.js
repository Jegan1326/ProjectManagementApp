const express = require('express');
const router = express.Router();
const { createMilestone, getProjectMilestones, updateMilestone, approveMilestone } = require('../controllers/milestoneController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Super Admin', 'Project Admin', 'Project Manager'), createMilestone);

router.route('/project/:projectId')
    .get(protect, getProjectMilestones);

router.route('/:id')
    .put(protect, updateMilestone);

router.route('/:id/approve')
    .put(protect, authorize('Super Admin', 'Project Admin'), approveMilestone);

module.exports = router;
