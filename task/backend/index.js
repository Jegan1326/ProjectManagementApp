require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROBUST CONNECTION LOGIC ---
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => {
    console.log('------------------------------------');
    console.log('✅ MongoDB Connection: SUCCESS');
    console.log(`📂 Database: ${mongoose.connection.name}`);
    console.log(`🏠 Cluster: ${mongoose.connection.host}`);
    console.log('------------------------------------');
  })
  .catch(err => {
    console.log('------------------------------------');
    console.log('❌ MongoDB Connection: FAILED');
    console.log(`⚠️ Error Message: ${err.message}`);

    if (err.message.includes('authentication failed')) {
      console.log('👉 SOLUTION: Your DB password in .env is incorrect.');
      console.log('Go to Atlas > Database Access to reset your user password.');
    }
    console.log('------------------------------------');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server active on port ${PORT}`);

  // --- BACKGROUND JOB: Auto-Reassign Overdue Tasks ---
  const Task = require('./models/Task');
  const User = require('./models/User'); // Assuming User model exists

  setInterval(async () => {
    try {
      const now = new Date();

      // Find tasks that are overdue, not completed, and not already assigned to an admin
      // Note: This requires identifying who is an admin.
      // Strategy: Find an admin user first.
      const adminUser = await User.findOne({ role: 'admin' });

      if (!adminUser) return; // No admin to assign to

      const overdueTasks = await Task.find({
        dueDate: { $lt: now },
        status: { $ne: 'Completed' },
        isReassigned: { $ne: true }, // Only effect processed if not already marked (or maybe we re-reassign? user implies one-time swap but let's stick to not spamming)
        assignedTo: { $ne: adminUser.username }
      });

      if (overdueTasks.length > 0) {
        console.log(`Found ${overdueTasks.length} overdue tasks. Reassigning...`);

        for (const task of overdueTasks) {
          // task.assignedTo = adminUser.username; // REMOVED: Keep assigned to teammate so BOTH see it.
          task.isReassigned = true;

          // Extend Due Date by 24 hours
          const newDueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          task.dueDate = newDueDate;

          task.history.push({
            action: `Overdue: Flagged for Admin & Extended 24h`,
            timestamp: now
          });
          await task.save();
        }
        console.log("Reassignment complete.");
      }
    } catch (err) {
      console.error("Background Job Error:", err);
    }
  }, 60000); // Run every 60 seconds
});