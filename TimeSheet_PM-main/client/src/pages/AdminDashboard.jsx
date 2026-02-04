import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Admin.css';

const AdminDashboard = () => {
    const [timesheets, setTimesheets] = useState([]);

    const fetchTimesheets = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/timesheets');
            // Only show Pending requests in Admin Panel
            const pendingRequests = response.data.filter(ts => ts.status === 'Pending');
            setTimesheets(pendingRequests);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTimesheets();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/timesheets/${id}/status`, { status });
            fetchTimesheets();
            alert(`Timesheet ${status}`);
        } catch (error) {
            console.error(error);
            alert('Error updating status');
        }
    };



    const handleLogout = () => {
        localStorage.removeItem('adminAuthenticated');
        window.location.href = '/admin/login';
    };

    return (
        <div className="admin-dashboard-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 className="admin-title" style={{ marginBottom: 0 }}>Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#e53e3e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    Logout
                </button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Task</th>
                        <th>Software</th>
                        <th>Hours</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {timesheets.map((ts) => (
                        <tr key={ts._id}>
                            <td>{ts.userName}</td>
                            <td>{ts.task}</td>
                            <td>{ts.software}</td>
                            <td>{ts.hours}</td>
                            <td>{ts.description}</td>
                            <td>{new Date(ts.createdAt).toLocaleDateString()}</td>
                            <td>
                                <span className={`status-badge status-${ts.status.toLowerCase()}`}>
                                    {ts.status}
                                </span>
                            </td>
                            <td>
                                <button
                                    className="action-btn btn-approve"
                                    onClick={() => handleStatusUpdate(ts._id, 'Approved')}
                                    disabled={ts.status === 'Approved' || ts.status === 'Rejected'}
                                >
                                    Approve
                                </button>
                                <button
                                    className="action-btn btn-reject"
                                    onClick={() => handleStatusUpdate(ts._id, 'Rejected')}
                                    disabled={ts.status === 'Approved' || ts.status === 'Rejected'}
                                >
                                    Reject
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
