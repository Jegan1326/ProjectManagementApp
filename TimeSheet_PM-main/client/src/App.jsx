import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserTimesheet from './pages/UserTimesheet';
import UserMyTimesheets from './pages/UserMyTimesheets';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/user/timesheet" />} />
                <Route path="/user/timesheet" element={<UserTimesheet />} />
                <Route path="/user/my-timesheets" element={<UserMyTimesheets />} />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                    path="/admin/timesheets"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
