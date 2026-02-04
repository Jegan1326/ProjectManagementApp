const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Organization = require('./models/Organization');
const Project = require('./models/Project');
const Task = require('./models/Task');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/project_management');
        console.log('Connected to MongoDB...');

        // Clear existing data
        await User.deleteMany({});
        await Organization.deleteMany({});
        await Project.deleteMany({});
        await Task.deleteMany({});
        console.log('Cleared existing data.');

        // 1. Create User (password will be hashed by the model's pre-save hook)
        // 1. Create Users
        const adminUser = new User({
            name: 'Guy Hawkins',
            email: 'admin@example.com',
            password: 'password123',
            role: 'Super Admin'
        });
        await adminUser.save();

        const managerUser = new User({
            name: 'Robert Stark',
            email: 'manager@example.com',
            password: 'password123',
            role: 'Project Manager'
        });
        await managerUser.save();

        const employeeUser = new User({
            name: 'John Doe',
            email: 'employee@example.com',
            password: 'password123',
            role: 'Team Member'
        });
        await employeeUser.save();

        const clientUser = new User({
            name: 'Alice Client',
            email: 'client@example.com',
            password: 'password123',
            role: 'Client'
        });
        await clientUser.save();

        console.log('Users created: Admin, Manager, Employee, Client');

        // 2. Create Organization
        const org = new Organization({
            name: 'DWISON Tech',
            admin: adminUser._id,
            address: 'Innovation Hub, NY'
        });
        await org.save();

        // Update user with org
        adminUser.organization = org._id;
        await adminUser.save();
        console.log('Organization created and linked.');

        // 3. Create Project
        const project = new Project({
            name: 'Project Management App',
            description: 'Building a Zoho Projects inspired application.',
            status: 'Active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
            admin: adminUser._id,
            team: [adminUser._id]
        });
        await project.save();
        console.log('Project created.');

        // 4. Create Sample Tasks
        await Task.insertMany([
            {
                title: 'Setup UI Layout',
                description: 'Implement sidebar and dashboard shell',
                project: project._id,
                assignee: adminUser._id,
                priority: 'High',
                status: 'Completed'
            },
            {
                title: 'Database Schema Design',
                description: 'Define MongoDB models for all modules',
                project: project._id,
                assignee: adminUser._id,
                priority: 'Urgent',
                status: 'In Progress'
            }
        ]);

        console.log('Database seeded successfully! 🌱');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
