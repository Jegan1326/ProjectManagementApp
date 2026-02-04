const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createEmployee = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/project_management');
        console.log('Connected to MongoDB...');

        const employee = await User.findOne({ email: 'employee@example.com' });

        if (employee) {
            console.log('Employee user already exists.');
            process.exit();
        }

        const newEmployee = new User({
            name: 'John Doe',
            email: 'employee@example.com',
            password: 'password123',
            role: 'Team Member'
        });

        await newEmployee.save();
        console.log('Employee user created: employee@example.com / password123');
        process.exit();
    } catch (error) {
        console.error('Error creating employee:', error);
        process.exit(1);
    }
};

createEmployee();
