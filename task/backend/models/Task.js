const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Todo', 'In Progress', 'Review', 'Completed'],
    default: 'Todo'
  },
  assignedTo: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date
  },
  isReassigned: {
    type: Boolean,
    default: false
  },
  subTasks: [{
    text: String,
    completed: { type: Boolean, default: false }
  }],
  // NEW: Support for user discussions
  comments: [{
    text: String,
    user: String,
    timestamp: { type: Date, default: Date.now }
  }],
  // NEW: Support for file links
  attachments: [{
    name: String,
    url: String,
    uploadedBy: String,
    timestamp: { type: Date, default: Date.now }
  }],
  history: [{
    action: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);