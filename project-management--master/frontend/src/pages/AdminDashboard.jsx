import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { projectAPI } from '../services/api';
import '../styles/admindashboard.css';

export const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [editingDates, setEditingDates] = useState(null);
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    fetchAllProjects();
  }, [user]);

  const fetchAllProjects = async () => {
    try {
      const response = await projectAPI.getAllProjects();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      let response;
      if (newStatus === 'ACTIVE') {
        // Assuming we create an endpoint to update status directly
        response = await projectAPI.updateProjectStatus(projectId, newStatus);
      } else if (newStatus === 'ON_HOLD') {
        response = await projectAPI.updateProjectStatus(projectId, newStatus);
      } else if (newStatus === 'COMPLETED') {
        response = await projectAPI.completeProject(projectId);
      } else if (newStatus === 'ARCHIVED') {
        response = await projectAPI.archiveProject(projectId);
      } else if (newStatus === 'DELETED') {
        response = await projectAPI.deleteProject(projectId);
      }
      
      setProjects(projects.map(p => p._id === projectId ? response.data : p));
      setError('');
    } catch (err) {
      setError('Failed to update project status');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await handleStatusChange(projectId, 'DELETED');
    }
  };

  const handleArchiveProject = async (projectId) => {
    if (window.confirm('Archive this project?')) {
      await handleStatusChange(projectId, 'ARCHIVED');
    }
  };

  const handleUpdateDates = async (projectId) => {
    try {
      const response = await projectAPI.updateProjectDates(projectId, newStartDate, newEndDate);
      setProjects(projects.map(p => p._id === projectId ? response.data : p));
      setEditingDates(null);
      setNewStartDate('');
      setNewEndDate('');
      setError('');
    } catch (err) {
      setError('Failed to update project dates');
    }
  };

  const handleStartEditDates = (project) => {
    setEditingDates(project._id);
    setNewStartDate(project.startDate?.split('T')[0] || '');
    setNewEndDate(project.endDate?.split('T')[0] || '');
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: '#4CAF50',
      ON_HOLD: '#FF9800',
      COMPLETED: '#2196F3',
      ARCHIVED: '#9E9E9E',
      DELETED: '#F44336'
    };
    return colors[status] || '#757575';
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="admin-dashboard">
        <div className="permission-denied">
          <p>⛔ Only ADMIN can access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="admin-dashboard"><p>Loading projects...</p></div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>📊 Admin Management - Project Control</h1>
        <p className="subtitle">Manage all projects and their statuses</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="projects-grid">
        {projects.length === 0 ? (
          <p className="no-projects">No projects found</p>
        ) : (
          projects.map(project => (
            <div
              key={project._id}
              className={`project-card status-${project.status.toLowerCase()}`}
            >
              <div className="card-header">
                <h2>{project.name}</h2>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(project.status) }}
                >
                  {project.status}
                </span>
              </div>

              <div className="card-content">
                <p><strong>Description:</strong> {project.description || 'N/A'}</p>
                <p>
                  <strong>Project Manager:</strong>{' '}
                  {project.projectManager?.name || 'Unassigned'}
                </p>
                <p>
                  <strong>Employees:</strong>{' '}
                  {project.employees?.length || 0} assigned
                </p>
                <p>
                  <strong>Start Date:</strong>{' '}
                  {new Date(project.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong>{' '}
                  {new Date(project.endDate).toLocaleDateString()}
                </p>

                {project.requests?.some(r => r.requestStatus === 'PENDING') && (
                  <div className="pending-requests">
                    <p className="pending-count">
                      ⚠️ {project.requests.filter(r => r.requestStatus === 'PENDING').length} pending request(s)
                    </p>
                  </div>
                )}
              </div>

              <div className="card-actions">
                <button
                  onClick={() => setExpandedId(expandedId === project._id ? null : project._id)}
                  className="expand-btn"
                >
                  {expandedId === project._id ? '▼ Less' : '▶ More'}
                </button>
              </div>

              {expandedId === project._id && (
                <div className="card-expanded">
                  <div className="status-actions">
                    <h3>Change Status</h3>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleStatusChange(project._id, 'ACTIVE')}
                        className={`action-btn active-btn ${project.status === 'ACTIVE' ? 'disabled' : ''}`}
                        disabled={project.status === 'ACTIVE'}
                      >
                        ✓ Set to Active
                      </button>
                      <button
                        onClick={() => handleStatusChange(project._id, 'ON_HOLD')}
                        className={`action-btn hold-btn ${project.status === 'ON_HOLD' ? 'disabled' : ''}`}
                        disabled={project.status === 'ON_HOLD'}
                      >
                        ⏸ Set to On Hold
                      </button>
                      <button
                        onClick={() => handleStatusChange(project._id, 'COMPLETED')}
                        className={`action-btn completed-btn ${project.status === 'COMPLETED' ? 'disabled' : ''}`}
                        disabled={project.status === 'COMPLETED'}
                      >
                        ✅ Mark Completed
                      </button>
                    </div>
                  </div>

                  <div className="destructive-actions">
                    <h3>Other Actions</h3>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleArchiveProject(project._id)}
                        className={`action-btn archive-btn ${project.status === 'ARCHIVED' ? 'disabled' : ''}`}
                        disabled={project.status === 'ARCHIVED'}
                      >
                        📦 Archive
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        className={`action-btn delete-btn ${project.status === 'DELETED' ? 'disabled' : ''}`}
                        disabled={project.status === 'DELETED'}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  <div className="date-actions">
                    <h3>Edit Dates</h3>
                    {editingDates === project._id ? (
                      <div className="date-editor">
                        <div className="date-inputs">
                          <div className="input-group">
                            <label>Start Date:</label>
                            <input
                              type="date"
                              value={newStartDate}
                              onChange={(e) => setNewStartDate(e.target.value)}
                            />
                          </div>
                          <div className="input-group">
                            <label>End Date:</label>
                            <input
                              type="date"
                              value={newEndDate}
                              onChange={(e) => setNewEndDate(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="date-buttons">
                          <button
                            onClick={() => handleUpdateDates(project._id)}
                            className="action-btn save-btn"
                          >
                            ✓ Save Dates
                          </button>
                          <button
                            onClick={() => {
                              setEditingDates(null);
                              setNewStartDate('');
                              setNewEndDate('');
                            }}
                            className="action-btn cancel-btn"
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEditDates(project)}
                        className="action-btn edit-dates-btn"
                      >
                        📅 Edit Dates
                      </button>
                    )}
                  </div>

                  {project.requests?.length > 0 && (
                    <div className="requests-info">
                      <h3>Project Requests</h3>
                      {project.requests.map(req => (
                        <div key={req._id} className="request-info">
                          <p>
                            <strong>{req.requestType}</strong> - {req.requestStatus}
                          </p>
                          <p className="request-reason">{req.reason}</p>
                          {req.requestType === 'EXTEND_DATE' && (
                            <p className="request-date">
                              New Date: {new Date(req.newEndDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
