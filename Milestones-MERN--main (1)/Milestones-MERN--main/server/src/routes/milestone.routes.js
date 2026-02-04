const router = require("express").Router();
const c = require("../controllers/milestone.controller");
const { auth } = require("../middleware/auth");
const { role } = require("../middleware/role");

router.get("/my", auth, role(["member"]), c.getMyMilestones);
router.put("/:id", auth, role(["member"]), c.updateMilestone);
router.post("/:id/submit", auth, role(["member"]), c.submitMilestone);

module.exports = router;
