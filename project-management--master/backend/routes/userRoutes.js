const express = require("express");
const User = require("../models/User");

const router = express.Router();

/* Get all users */
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* Get users by role */
router.get("/role/:role", async (req, res) => {
  try {
    const users = await User.find({ role: req.params.role }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
