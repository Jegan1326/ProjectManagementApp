const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const verifyLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/project_management');
        console.log('Connected to MongoDB...');

        const email = 'employee@example.com';
        const password = 'password123';

        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User NOT FOUND:', email);
        } else {
            console.log('✅ User FOUND:', user.email, 'Role:', user.role);
            console.log('   Stored Hash:', user.password);

            const isMatch = await user.matchPassword(password);
            console.log('   Password Match Result:', isMatch);

            if (isMatch) {
                console.log('✅ LOGIN SHOULD SUCCEED');
            } else {
                console.log('❌ PASSWORD MISMATCH');
            }
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyLogin();
