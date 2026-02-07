const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/debug-check', (req, res) => res.send('Debug check OK')); // Verification endpoint

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const timesheetRoutes = require('./routes/timesheetRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const issueRoutes = require('./routes/issueRoutes');


const uploadRoutes = require('./routes/uploadRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const documentRoutes = require('./routes/documentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/timesheets', timesheetRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/upload', uploadRoutes);

// Register nested routes
app.use('/api/discussions', discussionRoutes);
app.use('/api/projects/:projectId/discussions', discussionRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/projects/:projectId/documents', documentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);


// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Project Management API is running...');
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project_management';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.log(err));
