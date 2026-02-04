const mongoose = require('mongoose');

const TimesheetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    software: { type: String },
    hours: { type: Number, required: true },
    duration: { type: String }, // Keep for compatibility if needed
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Timesheet', TimesheetSchema);
