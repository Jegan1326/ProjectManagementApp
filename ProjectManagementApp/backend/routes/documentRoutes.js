const express = require('express');
const { getDocuments, createDocument, deleteDocument, uploadVersion } = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Assuming this exists or using multer directly
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(protect, getDocuments)
    .post(protect, authorize('Super Admin', 'Project Admin', 'Project Manager', 'Team Member'), upload.single('file'), createDocument);

router.route('/:id')
    .delete(protect, authorize('Super Admin', 'Project Admin', 'Project Manager'), deleteDocument);

router.route('/:id/version')
    .post(protect, authorize('Super Admin', 'Project Admin', 'Project Manager', 'Team Member'), upload.single('file'), uploadVersion);

module.exports = router;
