const router = require("express").Router();
const c = require("../controllers/admin.controller");
const { auth } = require("../middleware/auth");
const { role } = require("../middleware/role");

router.get("/milestones", auth, role(["admin"]), c.getAllMilestones);
router.post("/milestones", auth, role(["admin"]), c.createMilestoneAdmin);
router.post("/milestones/rename-phase", auth, role(["admin"]), c.renamePhase);

router.put("/milestones/:id", auth, role(["admin"]), c.editMilestoneAdmin);
router.delete("/milestones/:id", auth, role(["admin"]), c.deleteMilestone);

router.put("/milestones/:id/approve", auth, role(["admin"]), c.approveMilestone);
router.put("/milestones/:id/reject", auth, role(["admin"]), c.rejectMilestone);

module.exports = router;
