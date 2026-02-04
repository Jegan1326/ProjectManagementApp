import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { projectAPI } from '../services/api';
import '../styles/dashboard.css';

export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let response;
      
      if (user?.role === 'ADMIN') {
        response = await projectAPI.getAllProjects();
      } else if (user?.role === 'PROJECT_MANAGER') {
        response = await projectAPI.getProjectsByPM(user?.id);
      } else {
        response = await projectAPI.getProjectsByEmployee(user?.id);
      }
      
      setProjects(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Projects</h1>
        <div className="header-actions">
          <div className="user-badge">{user?.role} - {user?.name}</div>
        </div>
      </div>
      
      {error && <p className="error">{error}</p>}
      
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div className="projects-list">
          <h2>Projects</h2>
          {projects.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Project Manager</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id}>
                    <td>{project.name}</td>
                    <td><span className={`status ${project.status.toLowerCase()}`}>{project.status}</span></td>
                    <td>{project.projectManager?.name || 'N/A'}</td>
                    <td>{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</td>
                    <td>{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="action-cell">
                      <Link to={`/project/${project._id}`} className="view-btn">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      )}
    </div>
  );
};
