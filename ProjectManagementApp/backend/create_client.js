const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createClient = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/project_management');
        console.log('Connected to MongoDB...');

        const clientEmail = 'client@example.com';

        // Check if exists
        const existing = await User.findOne({ email: clientEmail });
        if (existing) {
            console.log('Client already exists. Resetting password...');
            existing.password = 'password123';
            await existing.save();
            console.log('✅ Client password reset to: password123');
        } else {
            const client = new User({
                name: 'Alice Client',
                email: clientEmail,
                password: 'password123',
                role: 'Client'
            });
            await client.save();
            console.log('✅ Client user created successfully');
        }

        console.log(`
        Credentials:
        Email: ${clientEmail}
        Password: password123
        Role: Client
        `);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createClient();
