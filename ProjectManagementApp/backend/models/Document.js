const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    tags: [{
        type: String
    }],
    version: {
        type: Number,
        default: 1
    },
    versions: [{
        fileUrl: String,
        originalName: String,
        size: Number,
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
        versionNumber: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
