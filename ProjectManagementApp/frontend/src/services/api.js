import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('API Request:', config.method.toUpperCase(), config.url, 'Token:', token ? 'Present' : 'Missing');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.config.url, 'Status:', response.status);
        return response;
    },
    (error) => {
        console.error('API Error:', error.config?.url, 'Status:', error.response?.status, 'Message:', error.response?.data?.message);
        if (error.response?.status === 401) {
            console.warn('Unauthorized - token may be invalid or expired');
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const projectAPI = {
    getProjects: () => api.get('/projects'),
    getProject: (id) => api.get(`/projects/${id}`),
    createProject: (data) => api.post('/projects', data),
    updateProject: (id, data) => api.put(`/projects/${id}`, data),
    deleteProject: (id) => api.delete(`/projects/${id}`),
    submitRequest: (id, data) => api.post(`/projects/${id}/request`, data),
    getTemplates: () => api.get('/projects/templates/all'),
    createFromTemplate: (id, data) => api.post(`/projects/template/${id}/use`, data),
};

export const taskAPI = {
    getTasks: (params) => api.get('/tasks', { params }),
    createTask: (data) => api.post('/tasks', data),
    updateTask: (id, data) => api.put(`/tasks/${id}`, data),
    deleteTask: (id) => api.delete(`/tasks/${id}`),
    restoreTask: (id) => api.put(`/tasks/${id}/restore`),
    addComment: (id, data) => api.post(`/tasks/${id}/comment`, data),
};

export const milestoneAPI = {
    getProjectMilestones: (projectId) => api.get(`/milestones/project/${projectId}`),
    createMilestone: (data) => api.post('/milestones', data),
    updateMilestone: (id, data) => api.put(`/milestones/${id}`, data),
    approveMilestone: (id, data) => api.put(`/milestones/${id}/approve`, data),
};

export const timesheetAPI = {
    submitTimesheet: (data) => api.post('/timesheets', data),
    getMyTimesheets: () => api.get('/timesheets/my'),
    getAllTimesheets: () => api.get('/timesheets'),
    updateStatus: (id, data) => api.put(`/timesheets/${id}/status`, data),
};

export const issueAPI = {
    getIssues: (params) => api.get('/issues', { params }),
    createIssue: (data) => api.post('/issues', data),
    updateIssue: (id, data) => api.put(`/issues/${id}`, data),
    deleteIssue: (id) => api.delete(`/issues/${id}`),
};

export const discussionAPI = {
    getDiscussions: (projectId) => api.get(`/projects/${projectId}/discussions`),
    createDiscussion: (projectId, data) => api.post(`/projects/${projectId}/discussions`, data),
    deleteDiscussion: (id) => api.delete(`/discussions/${id}`),
    addComment: (id, data) => api.post(`/discussions/${id}/comments`, data),
};

export const uploadAPI = {
    uploadFile: (formData) => api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export const documentAPI = {
    getDocuments: (projectId) => api.get(`/projects/${projectId}/documents`),
    createDocument: (projectId, data) => api.post(`/projects/${projectId}/documents`, data),
    deleteDocument: (id) => api.delete(`/documents/${id}`),
    uploadVersion: (id, data) => api.post(`/documents/${id}/version`, data),
};

export const reportAPI = {
    getDashboardStats: () => api.get('/reports/dashboard'),
    getProjectProgress: () => api.get('/reports/projects'),
};

export const notificationAPI = {
    getNotifications: () => api.get('/notifications'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
};

export const userAPI = {
    getUsers: () => api.get('/users'),
    updateProfile: (data) => api.put('/users/profile', data),
    deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;
