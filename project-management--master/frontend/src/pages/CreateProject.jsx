import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { projectAPI, userAPI } from '../services/api';
import '../styles/createproject.css';

export const CreateProject = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projectManagers, setProjectManagers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectManager: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    fetchProjectManagers();
  }, [user]);

  const fetchProjectManagers = async () => {
    try {
      const response = await userAPI.getUsersByRole('PROJECT_MANAGER');
      setProjectManagers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load project managers');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await projectAPI.createProject(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="create-project-container">
        <p className="permission-denied">Only ADMIN can create projects.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="create-project-container"><p>Loading...</p></div>;
  }

  return (
    <div className="create-project-container">
      <h1>Create New Project</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
        />
        
        <label>Project Manager</label>
        <select
          name="projectManager"
          value={formData.projectManager}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Project Manager --</option>
          {projectManagers.map(pm => (
            <option key={pm._id} value={pm._id}>
              {pm.name} ({pm.email})
            </option>
          ))}
        </select>

        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />

        <label>End Date</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Project'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};
