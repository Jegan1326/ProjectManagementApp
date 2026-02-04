const Timesheet = require('../models/Timesheet');

// @desc    Submit timesheet
exports.submitTimesheet = async (req, res) => {
    try {
        const timesheet = new Timesheet({
            ...req.body,
            user: req.user._id
        });
        await timesheet.save();
        res.status(201).json(timesheet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user timesheets
exports.getUserTimesheets = async (req, res) => {
    try {
        const timesheets = await Timesheet.find({ user: req.user._id })
            .populate('task', 'title')
            .populate('project', 'name')
            .sort({ date: -1 });
        res.json(timesheets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all timesheets (Admin/PM)
exports.getAllTimesheets = async (req, res) => {
    try {
        const timesheets = await Timesheet.find()
            .populate('user', 'name email')
            .populate('task', 'title')
            .populate('project', 'name')
            .sort({ date: -1 });
        res.json(timesheets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update timesheet status (Approve/Reject)
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const timesheet = await Timesheet.findById(req.params.id);
        if (!timesheet) return res.status(404).json({ message: 'Timesheet not found' });

        timesheet.status = status;
        timesheet.approvedBy = req.user._id;
        await timesheet.save();
        res.json(timesheet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
