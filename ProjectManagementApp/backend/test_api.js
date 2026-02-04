const axios = require('axios');

const testLogin = async () => {
    try {
        console.log('Attempting login to http://localhost:5000/api/auth/login...');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'manager@example.com',
            password: 'password123'
        });
        console.log('✅ API Login Success!');
        console.log('Status:', response.status);
        console.log('Role:', response.data.role);
    } catch (error) {
        console.error('❌ API Login Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

testLogin();
