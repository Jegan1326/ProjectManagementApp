const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: String,
  status: {
    type: String,
    enum: ["todo", "in-progress", "completed"],
    default: "todo"
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Task", taskSchema);
