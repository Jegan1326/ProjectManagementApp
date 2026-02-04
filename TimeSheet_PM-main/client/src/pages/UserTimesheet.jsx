import React, { useState } from 'react';
import axios from 'axios';
import '../styles/User.css';

const UserTimesheet = () => {
    const [formData, setFormData] = useState({
        userName: '',
        task: '',
        software: '',
        hours: '',
        description: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/timesheets', formData);
            // Save user name to local storage for "My Timesheets" view
            localStorage.setItem('userName', formData.userName);
            setMessage('Timesheet submitted successfully!');
            setFormData({ ...formData, task: '', software: '', hours: '', description: '' });
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            setMessage('Error submitting timesheet.');
        }
    };

    return (
        <div className="user-form-container">
            <h2 className="user-form-title">Submit Timesheet</h2>
            {message && <div style={{ textAlign: 'center', marginBottom: '15px', color: message.includes('Error') ? 'red' : 'green' }}>{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">User Name</label>
                    <input className="form-input" name="userName" value={formData.userName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Assigned Task</label>
                    <input className="form-input" name="task" value={formData.task} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Software Used</label>
                    <input className="form-input" name="software" value={formData.software} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Time Taken (hours)</label>
                    <input type="number" className="form-input" name="hours" value={formData.hours} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Work Description</label>
                    <textarea className="form-textarea" name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </div>
    );
};

export default UserTimesheet;
