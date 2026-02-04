const router = require("express").Router();
const Milestone = require("../models/Milestone");

router.post("/milestones", async (req, res) => {
  await Milestone.deleteMany({});

  const data = await Milestone.insertMany([
    {
      title: "Create milestone UI",
      dueDate: "2026-01-28",
      progress: 60,
      status: "DRAFT",
      adminComment: "",
      assignedTo: "karthik"
    },
    {
      title: "Submit milestone module",
      dueDate: "2026-01-30",
      progress: 100,
      status: "SUBMITTED",
      adminComment: "",
      assignedTo: "karthik"
    },
    {
      title: "Update docs",
      dueDate: "2026-02-02",
      progress: 40,
      status: "SUBMITTED",
      adminComment: "",
      assignedTo: "employee2"
    }
  ]);

  res.json({ inserted: data.length, data });
});

module.exports = router;
