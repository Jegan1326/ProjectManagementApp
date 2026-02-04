const Task = require('../models/Task');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new task
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
    try {
        if (req.body.assignee === '') delete req.body.assignee;
        if (req.body.milestone === '') delete req.body.milestone;
        const task = new Task({
            ...req.body,
            history: [{ action: 'Task Created', user: req.user._id }]
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
    try {
        const { project, milestone, isDeleted } = req.query;
        let query = { isDeleted: isDeleted === 'true' };
        if (project) query.project = project;
        if (milestone) query.milestone = milestone;

        const tasks = await Task.find(query)
            .populate('assignee', 'name email avatar')
            .populate('project', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Add history record for status changes
        if (req.body.status && req.body.status !== task.status) {
            task.history.push({
                action: `Status changed to ${req.body.status}`,
                user: req.user._id
            });
        }

        Object.assign(task, req.body);
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Soft Delete task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.isDeleted = true;
        task.history.push({ action: 'Task moved to trash', user: req.user._id });
        await task.save();

        res.status(200).json({ message: 'Task moved to trash' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Restore task from trash
exports.restoreTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.isDeleted = false;
        task.history.push({ action: 'Task restored from trash', user: req.user._id });
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Permanently delete task
exports.permanentDeleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task permanently deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment to task
exports.addComment = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.comments.push({
            text: req.body.text,
            user: req.user._id
        });
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
