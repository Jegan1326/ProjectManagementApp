const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['Active', 'On Hold', 'Completed', 'Archived'],
        default: 'Active'
    },
    startDate: { type: Date },
    endDate: { type: Date },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Project Admin/PM
    projectManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    milestones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' }],
    requests: [{
        requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        requestType: {
            type: String,
            enum: ["ON_HOLD", "EXTEND_DATE"]
        },
        reason: String,
        newEndDate: Date,
        requestStatus: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "PENDING"
        },
        createdAt: { type: Date, default: Date.now }
    }],
    isTemplate: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
