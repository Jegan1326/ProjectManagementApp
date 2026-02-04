const Milestone = require("../models/Milestone");

exports.getAllMilestones = async (req, res) => {
  const milestones = await Milestone.find().sort({ createdAt: -1 });
  res.json(milestones);
};

exports.approveMilestone = async (req, res) => {
  const updated = await Milestone.findByIdAndUpdate(
    req.params.id,
    { status: "APPROVED", adminComment: "" },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Milestone not found" });
  res.json(updated);
};

exports.rejectMilestone = async (req, res) => {
  const updated = await Milestone.findByIdAndUpdate(
    req.params.id,
    { status: "REJECTED", adminComment: req.body.reason || "" },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Milestone not found" });
  res.json(updated);
};

exports.createMilestoneAdmin = async (req, res) => {
  const { title, dueDate, assignedTo, phase } = req.body;

  if (!title || !dueDate || !assignedTo) {
    return res.status(400).json({ message: "title, dueDate, assignedTo required" });
  }

  const created = await Milestone.create({
    title,
    dueDate,
    progress: 0,
    status: "DRAFT",
    adminComment: "",
    assignedTo,
    createdBy: req.user.id,
    createdByRole: req.user.role,
    phase: phase || "Phase 1"
  });

  res.status(201).json(created);
};

exports.deleteMilestone = async (req, res) => {
  const deleted = await Milestone.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Milestone not found" });
  res.json({ message: "Deleted", id: req.params.id });
};

exports.editMilestoneAdmin = async (req, res) => {
  const { title, dueDate, assignedTo, status, adminComment, phase } = req.body;

  const update = {};

  if (title !== undefined) update.title = title;
  if (dueDate !== undefined) update.dueDate = dueDate;
  if (assignedTo !== undefined) update.assignedTo = assignedTo;
  if (adminComment !== undefined) update.adminComment = adminComment;
  if (phase !== undefined) update.phase = phase;

  if (status !== undefined) {
    const allowed = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "invalid status" });
    }
    update.status = status;
  }

  const updated = await Milestone.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!updated) return res.status(404).json({ message: "Milestone not found" });
  res.json(updated);
};
exports.renamePhase = async (req, res) => {
  const { oldName, newName } = req.body;

  if (!oldName || !newName) {
    return res.status(400).json({ message: "oldName and newName required" });
  }

  const result = await Milestone.updateMany(
    { phase: oldName },
    { $set: { phase: newName } }
  );

  res.json({ message: "Updated", modifiedCount: result.modifiedCount });
};
