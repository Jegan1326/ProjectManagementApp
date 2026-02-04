import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/User.css';

const UserMyTimesheets = () => {
    const [timesheets, setTimesheets] = useState([]);
    const [loading, setLoading] = useState(true);
    // Get user from local storage or default to John Doe
    const currentUser = localStorage.getItem('userName') || "John Doe";

    useEffect(() => {
        const fetchTimesheets = async () => {
            try {
                // Fetch only for current user
                const response = await axios.get(`http://localhost:5000/api/timesheets/my-timesheets?userName=${encodeURIComponent(currentUser)}`);
                setTimesheets(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching timesheets", error);
                setLoading(false);
            }
        };

        fetchTimesheets();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this timesheet?')) return;

        // Optimistic update: Remove from UI immediately
        setTimesheets(timesheets.filter(ts => ts._id !== id));

        try {
            await axios.delete(`http://localhost:5000/api/timesheets/${id}`);
            // No need to alert or re-fetch if successful, UI is already updated
        } catch (error) {
            console.error(error);
            alert('Error deleting timesheet');
            // Revert changes if error occurs
            fetchTimesheets();
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="timesheet-list-container">
            <h2 style={{ textAlign: 'center', width: '100%' }}>My Timesheets</h2>
            {timesheets.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No submissions found.</p>
            ) : (
                timesheets.map((ts) => (
                    <div key={ts._id} className="timesheet-card">
                        <div className="card-info">
                            <h3>{ts.task}</h3>
                            <div className="card-details">
                                <p><strong>Date:</strong> {new Date(ts.createdAt).toLocaleDateString()}</p>
                                <p><strong>Software:</strong> {ts.software} | <strong>Hours:</strong> {ts.hours}</p>
                                <p>{ts.description}</p>
                            </div>
                        </div>
                        <div className={`status-badge status-${ts.status.toLowerCase()}`}>
                            {ts.status}
                        </div>
                        <button
                            className="delete-btn"
                            onClick={() => handleDelete(ts._id)}
                        >
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default UserMyTimesheets;
