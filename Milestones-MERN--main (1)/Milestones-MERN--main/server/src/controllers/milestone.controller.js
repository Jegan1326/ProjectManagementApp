const Milestone = require("../models/Milestone");

exports.getMyMilestones = async (req, res) => {
  const data = await Milestone.find({ assignedTo: req.user.id }).sort({ createdAt: -1 });
  res.json(data);
};

exports.updateMilestone = async (req, res) => {
  const m = await Milestone.findById(req.params.id);
  if (!m) return res.status(404).json({ message: "Not found" });
  if (m.assignedTo !== req.user.id) return res.status(403).json({ message: "Forbidden" });

  if (m.status === "SUBMITTED" || m.status === "APPROVED")
    return res.status(400).json({ message: "Cannot edit after submit/approve" });

  const updated = await Milestone.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.submitMilestone = async (req, res) => {
  const m = await Milestone.findById(req.params.id);
  if (!m) return res.status(404).json({ message: "Not found" });
  if (m.assignedTo !== req.user.id) return res.status(403).json({ message: "Forbidden" });

  m.status = "SUBMITTED";
  m.adminComment = "";
  await m.save();

  res.json(m);
};
