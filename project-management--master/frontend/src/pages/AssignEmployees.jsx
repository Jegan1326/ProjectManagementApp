import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { projectAPI } from '../services/api';
import '../styles/assignemployees.css';

const HARDCODED_EMPLOYEES = [
  { id: 'emp1', name: 'EMP1' },
  { id: 'emp2', name: 'EMP2' },
  { id: 'emp3', name: 'EMP3' },
  { id: 'emp4', name: 'EMP4' },
];

export const AssignEmployees = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignLoading, setAssignLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getProjectsByPM(user?.role);
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedEmployees(selectedOptions);
  };

  const handleAssign = async () => {
    if (!selectedProject) {
      setError('Please select a project');
      return;
    }

    setAssignLoading(true);
    setError('');
    setSuccess('');

    try {
      await projectAPI.assignEmployees(selectedProject, selectedEmployees);
      setSuccess('Employees assigned successfully!');
      setSelectedEmployees([]);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to assign employees');
    } finally {
      setAssignLoading(false);
    }
  };

  if (user?.role !== 'PROJECT_MANAGER') {
    return null;
  }

  return (
    <div className="assign-employees-container">
      <h2>Assign Employees to Project</h2>
      
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="form-group">
        <label>Select Project</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">-- Select Project --</option>
          {projects.map(project => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Select Employees (Ctrl+Click to select multiple)</label>
        <select
          multiple
          value={selectedEmployees}
          onChange={handleEmployeeSelect}
          className="employees-select"
        >
          {HARDCODED_EMPLOYEES.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAssign}
        disabled={assignLoading || !selectedProject}
        className="assign-btn"
      >
        {assignLoading ? 'Assigning...' : 'Assign Employees'}
      </button>
    </div>
  );
};
