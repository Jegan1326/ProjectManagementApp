import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { projectAPI } from '../services/api';
import '../styles/adminrequests.css';

export const AdminRequests = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    fetchProjectsWithRequests();
  }, [user]);

  const fetchProjectsWithRequests = async () => {
    try {
      const response = await projectAPI.getAllProjects();
      const projectsWithRequests = response.data.filter(p =>
        p.requests?.some(r => r.requestStatus === 'PENDING')
      );
      setProjects(projectsWithRequests);
    } catch (err) {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (projectId, requestId) => {
    try {
      const response = await projectAPI.approveRequest(projectId, requestId, 'APPROVED');
      setProjects(projects.map(p => p._id === projectId ? response.data : p));
    } catch (err) {
      setError('Failed to approve request');
    }
  };

  const handleRejectRequest = async (projectId, requestId) => {
    try {
      const response = await projectAPI.approveRequest(projectId, requestId, 'REJECTED');
      setProjects(projects.map(p => p._id === projectId ? response.data : p));
    } catch (err) {
      setError('Failed to reject request');
    }
  };

  if (user?.role !== 'ADMIN') {
    return <div className="admin-requests"><p>Only ADMIN can view requests.</p></div>;
  }

  if (loading) return <div className="admin-requests"><p>Loading...</p></div>;

  return (
    <div className="admin-requests">
      <h1>Project Requests</h1>
      {error && <p className="error">{error}</p>}

      {projects.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        projects.map(project => (
          <div key={project._id} className="project-requests-card">
            <h2>{project.name}</h2>
            <p className="pm-name">Project Manager: <strong>{project.projectManager?.name}</strong></p>

            {project.requests
              ?.filter(r => r.requestStatus === 'PENDING')
              .map(request => (
                <div key={request._id} className="request-card">
                  <div className="request-header">
                    <span className="request-type-badge">{request.requestType}</span>
                    <span className="request-date">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="request-content">
                    <p><strong>Requested By:</strong> {request.requestedBy?.name}</p>
                    <p><strong>Reason:</strong> {request.reason}</p>

                    {request.requestType === 'EXTEND_DATE' && request.newEndDate && (
                      <p><strong>New End Date:</strong> {new Date(request.newEndDate).toLocaleDateString()}</p>
                    )}
                  </div>

                  <div className="request-actions">
                    <button
                      onClick={() => handleApproveRequest(project._id, request._id)}
                      className="approve-btn"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectRequest(project._id, request._id)}
                      className="reject-btn"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))
      )}
    </div>
  );
};
