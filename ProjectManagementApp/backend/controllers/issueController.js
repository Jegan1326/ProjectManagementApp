const Issue = require('../models/Issue');
const Project = require('../models/Project');

// @desc    Get all issues for a project or user
// @route   GET /api/issues
// @access  Private
exports.getIssues = async (req, res) => {
    try {
        let query = {};

        // Filter by project if provided
        if (req.query.project) {
            query.project = req.query.project;
        }

        // If employee, maybe only show assigned or reported by them? 
        // For now, let's allow seeing all issues in projects they are part of.

        const issues = await Issue.find(query)
            .populate('project', 'name')
            .populate('reporter', 'name email')
            .populate('assignee', 'name email')
            .sort({ createdAt: -1 });

        res.json(issues);
    } catch (error) {
        console.error('Error fetching issues:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new issue
// @route   POST /api/issues
// @access  Private
exports.createIssue = async (req, res) => {
    try {
        const { title, description, project, severity, priority, assignee } = req.body;

        const newIssue = await Issue.create({
            title,
            description,
            project,
            reporter: req.user._id,
            severity,
            priority,
            assignee: assignee || null
        });

        const populatedIssue = await Issue.findById(newIssue._id)
            .populate('project', 'name')
            .populate('reporter', 'name')
            .populate('assignee', 'name');

        res.status(201).json(populatedIssue);
    } catch (error) {
        console.error('Error creating issue:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update an issue
// @route   PUT /api/issues/:id
// @access  Private
exports.updateIssue = async (req, res) => {
    try {
        const { title, description, status, severity, priority, assignee } = req.body;

        const issue = await Issue.findById(req.params.id);
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Add update logic (e.g., check permissions)

        const updatedIssue = await Issue.findByIdAndUpdate(
            req.params.id,
            { title, description, status, severity, priority, assignee },
            { new: true }
        )
            .populate('project', 'name')
            .populate('reporter', 'name')
            .populate('assignee', 'name');

        res.json(updatedIssue);
    } catch (error) {
        console.error('Error updating issue:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete an issue
// @route   DELETE /api/issues/:id
// @access  Private
exports.deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        await issue.deleteOne();
        res.json({ message: 'Issue removed' });
    } catch (error) {
        console.error('Error deleting issue:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
