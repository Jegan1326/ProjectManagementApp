const express = require("express");
const Task = require("../models/Task");
const roleAuth = require("../middleware/roleAuth");

const router = express.Router();

/* CREATE TASK - Manager */
router.post("/", roleAuth(["manager"]), async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

/* VIEW TASKS */
router.get("/", async (req, res) => {
  const tasks = await Task.find({ deleted: false });
  res.json(tasks);
});

/* UPDATE TASK */
router.put("/:id", roleAuth(["manager", "hr", "employee"]), async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

/* DELETE TASK (Soft Delete) */
router.delete("/:id", roleAuth(["manager", "hr"]), async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { deleted: true });
  res.json(task);
});

/* TRASH */
router.get("/trash", async (req, res) => {
  const trash = await Task.find({ deleted: true });
  res.json(trash);
});

module.exports = router;
