import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { projectAPI, userAPI } from '../services/api';
import '../styles/projectdetail.css';

export const ProjectDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestType, setRequestType] = useState('ON_HOLD');
  const [reason, setReason] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProject();
    fetchEmployees();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectAPI.getAllProjects();
      const proj = response.data.find(p => p._id === id);
      setProject(proj);
    } catch (err) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await userAPI.getUsersByRole('EMPLOYEE');
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to load employees');
    }
  };

  const handleAssignEmployees = async (selectedEmployees) => {
    try {
      const response = await projectAPI.assignEmployees(id, selectedEmployees);
      setProject(response.data);
    } catch (err) {
      setError('Failed to assign employees');
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await projectAPI.sendRequest(id, requestType, reason, newEndDate || null);
      setProject(response.data);
      setShowRequestForm(false);
      setReason('');
      setNewEndDate('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="project-detail"><p>Loading...</p></div>;
  if (!project) return <div className="project-detail"><p>Project not found</p></div>;

  const isProjectManager = user?.id === project.projectManager?._id;
  const pendingRequests = project.requests?.filter(r => r.requestStatus === 'PENDING') || [];

  return (
    <div className="project-detail">
      <div className="detail-header">
        <h1>{project.name}</h1>
        <div className={`status-badge ${project.status.toLowerCase()}`}>{project.status}</div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Project Information</h3>
          <p><strong>Description:</strong> {project.description || 'N/A'}</p>
          <p><strong>Project Manager:</strong> {project.projectManager?.name}</p>
          <p><strong>Start Date:</strong> {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</p>
          <p><strong>End Date:</strong> {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</p>
        </div>

        <div className="detail-card">
          <h3>Assigned Employees</h3>
          {project.employees && project.employees.length > 0 ? (
            <ul>
              {project.employees.map(emp => (
                <li key={emp._id}>{emp.name} ({emp.email})</li>
              ))}
            </ul>
          ) : (
            <p>No employees assigned</p>
          )}
        </div>
      </div>

      {isProjectManager && (
        <div className="pm-section">
          <h3>Project Manager Actions</h3>
          <div className="pm-actions-container">
            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="action-btn primary"
            >
              {showRequestForm ? 'Cancel' : 'Send Request'}
            </button>
            <button
              onClick={() => navigate('/pm/task-assignment')}
              className="action-btn task"
            >
              Task Assignment
            </button>
          </div>

          {showRequestForm && (
            <form onSubmit={handleSendRequest} className="request-form">
              <label>Request Type</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
              >
                <option value="ON_HOLD">Put Project On Hold</option>
                <option value="EXTEND_DATE">Extend End Date</option>
              </select>

              {requestType === 'EXTEND_DATE' && (
                <>
                  <label>New End Date</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    required
                  />
                </>
              )}

              <label>Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide a reason for this request"
                required
              />

              <button type="submit" disabled={submitting} className="submit-btn">
                {submitting ? 'Sending...' : 'Send Request to Admin'}
              </button>
            </form>
          )}
        </div>
      )}

      {pendingRequests.length > 0 && (
        <div className="requests-section">
          <h3>Pending Requests</h3>
          {pendingRequests.map(req => (
            <div key={req._id} className="request-item">
              <p><strong>Type:</strong> {req.requestType}</p>
              <p><strong>Reason:</strong> {req.reason}</p>
              {req.newEndDate && <p><strong>Requested New Date:</strong> {new Date(req.newEndDate).toLocaleDateString()}</p>}
              <p><strong>Status:</strong> <span className="pending-badge">{req.requestStatus}</span></p>
            </div>
          ))}
        </div>
      )}

      {user?.role === 'PROJECT_MANAGER' && (
        <div className="assign-section">
          <h3>Assign Employees to Project</h3>
          <div className="employees-checkbox">
            {employees.map(emp => (
              <label key={emp._id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={project.employees?.some(e => e._id === emp._id)}
                  onChange={(e) => {
                    const currentEmployees = project.employees?.map(e => e._id) || [];
                    if (e.target.checked) {
                      handleAssignEmployees([...currentEmployees, emp._id]);
                    } else {
                      handleAssignEmployees(currentEmployees.filter(id => id !== emp._id));
                    }
                  }}
                />
                {emp.name} ({emp.email})
              </label>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => navigate('/dashboard')} className="back-btn">
        Back to Projects
      </button>
    </div>
  );
};
