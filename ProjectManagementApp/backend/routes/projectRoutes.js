const express = require('express');
const { createProject, getProjects, getProjectById, updateProject, deleteProject, submitProjectRequest, handleProjectRequest, getTemplates, createFromTemplate } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .post(protect, authorize('Super Admin', 'Project Admin', 'Project Manager'), createProject)
    .get(protect, getProjects);

router.route('/:id')
    .get(protect, getProjectById)
    .put(protect, authorize('Super Admin', 'Project Admin', 'Project Manager'), updateProject)
    .delete(protect, authorize('Super Admin', 'Project Admin', 'Project Manager'), deleteProject);

router.route('/:id/request')
    .post(protect, submitProjectRequest);

router.route('/:id/handle-request')
    .put(protect, authorize('Super Admin', 'Project Admin'), handleProjectRequest);

router.get('/templates/all', protect, getTemplates);
router.post('/template/:templateId/use', protect, createFromTemplate);

module.exports = router;
