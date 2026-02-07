const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const usersToEnsure = [
    { name: 'Guy Hawkins', email: 'admin@example.com', password: 'password123', role: 'Super Admin' },
    { name: 'Robert Stark', email: 'manager@example.com', password: 'password123', role: 'Project Manager' },
    { name: 'Alice Client', email: 'client@example.com', password: 'password123', role: 'Client' },
    { name: 'John Doe', email: 'employee@example.com', password: 'password123', role: 'Team Member' }
];

const ensureUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/project_management');
        console.log('Connected to MongoDB...');

        for (const u of usersToEnsure) {
            const existing = await User.findOne({ email: u.email });
            if (existing) {
                console.log(`✅ User exists: ${u.email} (${u.role})`);
                // Optional: Reset password if needed, but for now just verification
                // existing.password = u.password;
                // await existing.save();
            } else {
                console.log(`⚠️ User missing: ${u.email}. Creating...`);
                const newUser = new User(u);
                await newUser.save();
                console.log(`✅ Created user: ${u.email}`);
            }
        }
        process.exit(0);
    } catch (error) {
        console.error('Error ensuring users:', error);
        process.exit(1);
    }
};

ensureUsers();
