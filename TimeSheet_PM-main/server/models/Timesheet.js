const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  software: {
    type: String,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Timesheet', timesheetSchema);
