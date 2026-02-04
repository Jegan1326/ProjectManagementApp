const express = require('express');
const { getDiscussions, createDiscussion, deleteDiscussion, addComment } = require('../controllers/discussionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(protect, getDiscussions)
    .post(protect, createDiscussion);

router.route('/:id')
    .delete(protect, deleteDiscussion);

router.route('/:id/comments')
    .post(protect, addComment);

module.exports = router;
