const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users - Forced to include passwords for frontend matching
router.get('/', async (req, res) => {
  try {
    // The .select('+password') is the essential fix
    const users = await User.find({}).select('+password'); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;