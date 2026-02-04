import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/navbar.css';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2></h2>
          </div>
          <div className="nav-right">
            <span className="user-info">{user?.role} - {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>
      <div className="sidebar">
        <ul className="sidebar-menu">
          {user?.role === 'ADMIN' && (
            <>
              <li><a href="/admin/dashboard">Admin Management</a></li>
              <li><a href="/create-project">Create Project</a></li>
              <li><a href="/admin/requests">Manage Requests</a></li>
            </>
          )}
          {user?.role === 'PROJECT_MANAGER' && (
            <>
              <li><a href="/pm/projects">My Projects</a></li>
            </>
          )}
          {user?.role === 'EMPLOYEE' && (
            <>
              <li><a href="/employee/projects">My Projects</a></li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};
