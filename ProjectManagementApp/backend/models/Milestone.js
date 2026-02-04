const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    dueDate: { type: Date, required: true },
    progress: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"],
        default: "DRAFT"
    },
    adminComment: { type: String, default: "" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    links: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Milestone', MilestoneSchema);
