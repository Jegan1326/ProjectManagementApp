import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (name, email, password, role) =>
    api.post('/auth/register', { name, email, password, role }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

export const userAPI = {
  getAllUsers: () => api.get('/users/all'),
  getUsersByRole: (role) => api.get(`/users/role/${role}`),
};

export const projectAPI = {
  createProject: (data) => api.post('/projects', data),
  getAllProjects: () => api.get('/projects'),
  getProjectsByPM: (id) => api.get(`/projects/pm/${id}`),
  getProjectsByEmployee: (id) => api.get(`/projects/employee/${id}`),
  assignEmployees: (id, employees) => api.post(`/projects/${id}/assign-employees`, { employees }),
  sendRequest: (id, requestType, reason, newEndDate) =>
    api.post(`/projects/${id}/send-request`, { requestType, reason, newEndDate }),
  approveRequest: (id, requestId, action) =>
    api.post(`/projects/${id}/approve-request/${requestId}`, { action }),
  completeProject: (id) => api.post(`/projects/${id}/complete`),
  archiveProject: (id) => api.post(`/projects/${id}/archive`),
  deleteProject: (id) => api.post(`/projects/${id}/delete`),
  updateProjectStatus: (id, status) =>
    api.put(`/projects/${id}/status`, { status }),
  updateProjectDates: (id, startDate, endDate) =>
    api.put(`/projects/${id}/dates`, { startDate, endDate }),
};

export default api;
