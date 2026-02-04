const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// POST: Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, assignedTo } = req.body;
    let { dueDate } = req.body;

    // Fix: Handle empty string date coming from frontend
    if (dueDate === "") dueDate = undefined;

    const newTask = new Task({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      status: 'Todo',
      history: [{ action: 'Task Created', timestamp: new Date() }]
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET: Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: Update task status (The Sync Fix)
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Remove a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- FILE UPLOAD LOGIC ---
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// POST: Upload Attachment
router.post('/:id/attachments', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const attachment = {
      name: req.file.originalname,
      url: url,
      uploadedBy: req.body.uploadedBy || "Teammate",
      timestamp: new Date()
    };

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $push: { attachments: attachment },
        $push: { history: { action: `${attachment.uploadedBy} uploaded ${attachment.name}`, timestamp: new Date() } }
      },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;