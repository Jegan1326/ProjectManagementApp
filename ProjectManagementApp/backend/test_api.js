const testLogin = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'password123'
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Login Success:', response.status);
            console.log('Token:', data.token ? 'Received' : 'Missing');
        } else {
            console.log('❌ API Login Failed:', response.status);
            const text = await response.text();
            console.log('Response:', text);
        }
    } catch (error) {
        console.log('❌ API Connection Failed:', error.message);
    }
};

testLogin();
