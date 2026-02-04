const Discussion = require('../models/Discussion');
const Project = require('../models/Project');
const { createNotification } = require('./notificationController');

// @desc    Get all discussions for a project
// @route   GET /api/projects/:projectId/discussions
// @access  Private
exports.getDiscussions = async (req, res) => {
    try {
        const discussions = await Discussion.find({ project: req.params.projectId })
            .populate('author', 'name email')
            .populate('comments.author', 'name')
            .sort({ createdAt: -1 });

        res.json(discussions);
    } catch (error) {
        console.error('Error fetching discussions:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new discussion
// @route   POST /api/projects/:projectId/discussions
// @access  Private
exports.createDiscussion = async (req, res) => {
    try {
        const { title, content, attachments } = req.body;

        const discussion = await Discussion.create({
            project: req.params.projectId,
            author: req.user._id,
            title,
            content,
            attachments
        });

        const populatedDiscussion = await Discussion.findById(discussion._id)
            .populate('author', 'name email');

        // Notify Project Team
        const projectData = await Project.findById(req.params.projectId);
        if (projectData && projectData.team) {
            projectData.team.forEach(async (memberId) => {
                if (memberId.toString() !== req.user._id.toString()) {
                    await createNotification({
                        recipient: memberId,
                        sender: req.user._id,
                        type: 'ALERT', // Using ALERT for new discussion
                        message: `New discussion in ${projectData.name}: ${title}`,
                        link: `/projects/${req.params.projectId}/discussion`
                    });
                }
            });
        }

        res.status(201).json(populatedDiscussion);
    } catch (error) {
        console.error('Error creating discussion:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    delete a discussion
// @route   DELETE /api/discussions/:id
// @access  Private
exports.deleteDiscussion = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

        await discussion.deleteOne();
        res.json({ message: 'Discussion removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add comment to discussion
// @route   POST /api/discussions/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

        const comment = {
            author: req.user._id,
            content: req.body.content
        };

        discussion.comments.push(comment);
        await discussion.save();

        const updatedDiscussion = await Discussion.findById(req.params.id)
            .populate('author', 'name')
            .populate('comments.author', 'name');

        // Notify Discussion Author
        if (discussion.author.toString() !== req.user._id.toString()) {
            await createNotification({
                recipient: discussion.author,
                sender: req.user._id,
                type: 'COMMENT_ADDED',
                message: `New comment on your discussion: ${discussion.title}`,
                link: `/projects/${discussion.project}/discussion`
            });
        }

        res.json(updatedDiscussion);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
