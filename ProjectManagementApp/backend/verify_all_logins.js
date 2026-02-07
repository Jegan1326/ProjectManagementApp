const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const usersToVerify = [
    { email: 'admin@example.com', password: 'password123', label: 'Admin' },
    { email: 'manager@example.com', password: 'password123', label: 'Manager' },
    { email: 'client@example.com', password: 'password123', label: 'Client' },
    { email: 'employee@example.com', password: 'password123', label: 'Employee' }
];

const verifyAllLogins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/project_management');
        console.log('Connected to MongoDB...');

        for (const u of usersToVerify) {
            const user = await User.findOne({ email: u.email });
            if (!user) {
                console.log(`❌ ${u.label}: User NOT FOUND (${u.email})`);
                continue;
            }

            const isMatch = await user.matchPassword(u.password);
            if (isMatch) {
                console.log(`✅ ${u.label}: Login SUCCESS (${u.email})`);
            } else {
                console.log(`❌ ${u.label}: Password MISMATCH (${u.email})`);
                // Optional: Force reset if mismatch?
                // user.password = u.password;
                // await user.save();
                // console.log(`   --> Password reset for ${u.label}`);
            }
        }
        process.exit(0);
    } catch (error) {
        console.error('Error verifying users:', error);
        process.exit(1);
    }
};

verifyAllLogins();
