const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    dueDate: { type: String, required: true },
    progress: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"],
      default: "DRAFT"
    },
    adminComment: { type: String, default: "" },
    assignedTo: { type: String, required: true },
    description: { type: String, default: "" },
    links: { type: String, default: "" },
    createdBy: { type: String, required: true },
    createdByRole: { type: String, required: true },
    phase: { type: String, default: "Phase 1" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Milestone", milestoneSchema);
