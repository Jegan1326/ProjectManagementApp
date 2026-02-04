// In-memory storage for demonstration
let timesheets = [];

// Submit a new timesheet
exports.submitTimesheet = async (req, res) => {
    try {
        const newTimesheet = {
            _id: Date.now().toString(),
            ...req.body,
            status: 'Pending',
            createdAt: new Date()
        };
        timesheets.push(newTimesheet);
        res.status(201).json(newTimesheet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all timesheets (Admin)
exports.getAllTimesheets = async (req, res) => {
    try {
        // Sort by createdAt desc
        const sorted = [...timesheets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(sorted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get timesheets for a specific user
exports.getUserTimesheets = async (req, res) => {
    try {
        const { userName } = req.query;
        if (!userName) {
            return res.status(400).json({ message: 'User name is required' });
        }
        const userTimesheets = timesheets.filter(t => t.userName === userName);
        const sorted = [...userTimesheets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(sorted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update status (Approve/Reject)
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const index = timesheets.findIndex(t => t._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Timesheet not found' });

        timesheets[index].status = status;
        res.json(timesheets[index]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete timesheet
exports.deleteTimesheet = async (req, res) => {
    try {
        const index = timesheets.findIndex(t => t._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Timesheet not found' });

        timesheets.splice(index, 1);
        res.json({ message: 'Timesheet deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
