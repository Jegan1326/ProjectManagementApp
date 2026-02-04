const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetManager = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/project_management');
        console.log('Connected to MongoDB...');

        await User.findOneAndDelete({ email: 'manager@example.com' });
        console.log('Deleted existing manager (if any).');

        const newManager = new User({
            name: 'Robert Stark',
            email: 'manager@example.com',
            password: 'password123',
            role: 'Project Manager'
        });

        await newManager.save();
        console.log('Manager user created/reset: manager@example.com / password123');

        // Verify it exists
        const check = await User.findOne({ email: 'manager@example.com' });
        console.log('Verification found user:', check.email, 'Role:', check.role);

        process.exit();
    } catch (error) {
        console.error('Error resetting manager:', error);
        process.exit(1);
    }
};

resetManager();
