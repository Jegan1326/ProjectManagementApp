const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createManager = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/project_management');
        console.log('Connected to MongoDB...');

        const manager = await User.findOne({ email: 'manager@example.com' });

        if (manager) {
            console.log('Manager user already exists.');
            process.exit();
        }

        const newManager = new User({
            name: 'Robert Stark',
            email: 'manager@example.com',
            password: 'password123',
            role: 'Project Manager'
        });

        await newManager.save();
        console.log('Manager user created: manager@example.com / password123');
        process.exit();
    } catch (error) {
        console.error('Error creating manager:', error);
        process.exit(1);
    }
};

createManager();
