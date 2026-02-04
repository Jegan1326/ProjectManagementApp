const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const verifyLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/project_management');
        console.log('Connected to MongoDB...');

        const email = 'admin@example.com';
        const password = 'password123';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ User not found!');
            process.exit(1);
        }

        console.log('User found:', user.email);
        console.log('Stored Hash:', user.password);

        const isMatch = await user.matchPassword(password);
        if (isMatch) {
            console.log('✅ Password matches!');
        } else {
            console.log('❌ Password does NOT match!');
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyLogin();
