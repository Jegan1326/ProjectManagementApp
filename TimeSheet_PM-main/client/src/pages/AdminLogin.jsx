import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/User.css'; // Reusing user styles for consistency

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const { email, password } = credentials;

        if (email === 'demo@gmail.com' && password === 'demo123') {
            localStorage.setItem('adminAuthenticated', 'true');
            navigate('/admin/timesheets');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="user-form-container" style={{ marginTop: '100px' }}>
            <h2 className="user-form-title">Admin Login</h2>
            {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</div>}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-input"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-input"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn" style={{ backgroundColor: '#2d3748' }}>Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
