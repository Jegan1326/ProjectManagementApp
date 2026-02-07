const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/project_management';

console.log(`Attempting to connect to ${MONGO_URI}...`);

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Successfully connected to MongoDB');
        try {
            const users = await mongoose.connection.db.collection('users').find().toArray();
            console.log(`Found ${users.length} users.`);
            users.forEach(u => console.log(`- ${u.email} (${u.role})`));
        } catch (e) {
            console.error('Error querying users:', e);
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection failed:', err);
        process.exit(1);
    });
