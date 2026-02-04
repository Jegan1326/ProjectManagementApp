const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,

  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  startDate: Date,
  endDate: Date,

  status: {
    type: String,
    enum: ["ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED", "DELETED"],
    default: "ACTIVE"
  },

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
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Project", projectSchema);
