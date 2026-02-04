import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const navStyle = {
        background: '#fff',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px'
    };

    const linkStyle = {
        textDecoration: 'none',
        color: '#2b6cb0',
        fontWeight: '600'
    };

    return (
        <nav style={navStyle}>
            <Link to="/user/timesheet" style={linkStyle}>Submit Timesheet</Link>
            <Link to="/user/my-timesheets" style={linkStyle}>My Timesheets</Link>
            <Link to="/admin/timesheets" style={linkStyle}>Admin Dashboard</Link>
        </nav>
    );
};

export default Navbar;
