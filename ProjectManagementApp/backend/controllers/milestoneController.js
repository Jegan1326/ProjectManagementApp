const Milestone = require('../models/Milestone');

// @desc    Create Milestone
exports.createMilestone = async (req, res) => {
    try {
        const milestone = new Milestone({
            ...req.body,
            createdBy: req.user._id
        });
        await milestone.save();
        res.status(201).json(milestone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get Project Milestones
exports.getProjectMilestones = async (req, res) => {
    try {
        const milestones = await Milestone.find({ project: req.params.projectId })
            .populate('assignedTo', 'name')
            .sort({ dueDate: 1 });
        res.json(milestones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Milestone (Submit for approval)
exports.updateMilestone = async (req, res) => {
    try {
        const milestone = await Milestone.findById(req.params.id);
        if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

        // Logic from legacy: cannot edit after submit/approve unless admin
        if (req.user.role !== 'Super Admin' && (milestone.status === 'SUBMITTED' || milestone.status === 'APPROVED')) {
            return res.status(400).json({ message: "Cannot edit after submit/approve" });
        }

        Object.assign(milestone, req.body);
        await milestone.save();
        res.json(milestone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Approve/Reject Milestone (Admin only)
exports.approveMilestone = async (req, res) => {
    try {
        const { status, adminComment } = req.body;
        const milestone = await Milestone.findById(req.params.id);
        if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

        milestone.status = status;
        milestone.adminComment = adminComment;
        await milestone.save();
        res.json(milestone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
