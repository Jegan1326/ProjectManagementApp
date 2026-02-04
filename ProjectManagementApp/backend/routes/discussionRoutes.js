const express = require('express');
const { getDiscussions, createDiscussion, deleteDiscussion, addComment } = require('../controllers/discussionController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(protect, getDiscussions)
    .post(protect, authorize('Super Admin', 'Project Admin', 'Project Manager', 'Team Member'), createDiscussion);

router.route('/:id')
    .delete(protect, authorize('Super Admin', 'Project Admin', 'Project Manager'), deleteDiscussion);

router.route('/:id/comments')
    .post(protect, authorize('Super Admin', 'Project Admin', 'Project Manager', 'Team Member'), addComment);

module.exports = router;
