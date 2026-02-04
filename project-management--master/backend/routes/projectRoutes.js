const express = require("express");
const Project = require("../models/Project");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

/* ADMIN creates project */
router.post("/", auth, role("ADMIN"), async (req, res) => {
  try {
    const project = await Project.create(req.body);
    const populatedProject = await project.populate(["projectManager", "employees"]);
    res.json(populatedProject);
  } catch (err) {
    res.status(400).json({ msg: "Failed to create project" });
  }
});

/* Get all non-deleted projects */
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ status: { $ne: "DELETED" } })
      .populate("projectManager employees");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* PM projects */
router.get("/pm/:id", async (req, res) => {
  try {
    const projects = await Project.find({
      projectManager: req.params.id,
      status: { $ne: "DELETED" }
    }).populate("projectManager employees");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* Employee assigned projects */
router.get("/employee/:id", async (req, res) => {
  try {
    const projects = await Project.find({
      employees: req.params.id,
      status: { $ne: "DELETED" }
    }).populate("projectManager employees");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* PROJECT_MANAGER assigns employees to project */
router.post("/:id/assign-employees", auth, role("PROJECT_MANAGER"), async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { employees: req.body.employees },
      { new: true }
    ).populate("projectManager employees");
    res.json(project);
  } catch (err) {
    res.status(400).json({ msg: "Failed to assign employees" });
  }
});

/* PROJECT_MANAGER sends request (ON_HOLD or EXTEND_DATE) */
router.post("/:id/send-request", auth, role("PROJECT_MANAGER"), async (req, res) => {
  try {
    const { requestType, reason, newEndDate } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const newRequest = {
      requestedBy: req.user.id,
      requestType,
      reason,
      newEndDate: requestType === "EXTEND_DATE" ? newEndDate : null,
      requestStatus: "PENDING"
    };

    project.requests.push(newRequest);
    await project.save();

    const populatedProject = await project.populate(["projectManager", "employees", "requests.requestedBy"]);
    res.json(populatedProject);
  } catch (err) {
    res.status(400).json({ msg: "Failed to send request", error: err.message });
  }
});

/* ADMIN approves or rejects request */
router.post("/:id/approve-request/:requestId", auth, role("ADMIN"), async (req, res) => {
  try {
    const { action } = req.body; // "APPROVED" or "REJECTED"

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const request = project.requests.id(req.params.requestId);
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    request.requestStatus = action;

    if (action === "APPROVED") {
      if (request.requestType === "ON_HOLD") {
        project.status = "ON_HOLD";
      } else if (request.requestType === "EXTEND_DATE") {
        project.endDate = request.newEndDate;
      }
    }

    await project.save();

    const populatedProject = await project.populate(["projectManager", "employees", "requests.requestedBy"]);
    res.json(populatedProject);
  } catch (err) {
    res.status(400).json({ msg: "Failed to approve request", error: err.message });
  }
});

/* Complete */
router.post("/:id/complete", auth, role("ADMIN", "PROJECT_MANAGER"), async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { status: "COMPLETED" }, { new: true })
      .populate("projectManager employees");
    res.json(project);
  } catch (err) {
    res.status(400).json({ msg: "Failed to complete project" });
  }
});

/* Archive */
router.post("/:id/archive", auth, role("ADMIN"), async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { status: "ARCHIVED" }, { new: true })
      .populate("projectManager employees");
    res.json(project);
  } catch (err) {
    res.status(400).json({ msg: "Failed to archive project" });
  }
});

/* Soft delete */
router.post("/:id/delete", auth, role("ADMIN"), async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { status: "DELETED" }, { new: true })
      .populate("projectManager employees");
    res.json(project);
  } catch (err) {
    res.status(400).json({ msg: "Failed to delete project" });
  }
});

/* Update project status (ADMIN only) */
router.put("/:id/status", auth, role("ADMIN"), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED", "DELETED"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("projectManager employees");
    
    res.json(project);
  } catch (err) {
    res.status(400).json({ msg: "Failed to update project status" });
  }
});

/* Update project dates (ADMIN only) */
router.put("/:id/dates", auth, role("ADMIN"), async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ msg: "Start date and end date are required" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { startDate, endDate },
      { new: true }
    ).populate("projectManager employees");
    
    res.json(project);
  } catch (err) {
    res.status(400).json({ msg: "Failed to update project dates" });
  }
});

module.exports = router;

/* Employee assigned projects */
router.get("/employee/:id", async (req, res) => {
  const projects = await Project.find({
    employees: req.params.id,
    status: { $ne: "DELETED" }
  });
  res.json(projects);
});

/* PM requests ON HOLD */
router.post("/:id/request-onhold", auth, role("PROJECT_MANAGER"), async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project.status !== "ACTIVE") {
    return res.status(400).json({ msg: "Only active projects allowed" });
  }

  project.onHoldRequest = {
    requestedBy: req.user.id,
    reason: req.body.reason,
    status: "PENDING"
  };

  await project.save();
  res.json({ msg: "Request sent" });
});

/* ADMIN approves ON HOLD */
router.post("/:id/approve-onhold", auth, role("ADMIN"), async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, {
    status: "ON_HOLD",
    "onHoldRequest.status": "APPROVED"
  });
  res.json({ msg: "Project on hold" });
});

/* Complete */
router.post("/:id/complete", auth, role("ADMIN", "PROJECT_MANAGER"), async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, { status: "COMPLETED" });
  res.json({ msg: "Completed" });
});

/* Archive */
router.post("/:id/archive", auth, role("ADMIN"), async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, { status: "ARCHIVED" });
  res.json({ msg: "Archived" });
});

/* Soft delete */
router.post("/:id/delete", auth, role("ADMIN"), async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, { status: "DELETED" });
  res.json({ msg: "Deleted" });
});

module.exports = router;
