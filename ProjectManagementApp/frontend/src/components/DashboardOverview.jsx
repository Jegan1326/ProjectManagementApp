import React, { useState, useEffect } from 'react';
import AdminDashboard from './dashboards/AdminDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import ClientDashboard from './ClientDashboard';
import { projectAPI, taskAPI, reportAPI, userAPI, timesheetAPI } from '../services/api';
import { X, Loader2 } from 'lucide-react';

const DashboardOverview = ({ user }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Active',
        templateId: '',
        isTemplate: false
    });
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [stats, setStats] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [myTimesheets, setMyTimesheets] = useState([]);

    const fetchData = async () => {
        try {
            const { data: projData } = await projectAPI.getProjects();
            setProjects(projData);
            const { data: taskData } = await taskAPI.getTasks();
            setTasks(taskData);
            const { data: tmplData } = await projectAPI.getTemplates();
            setTemplates(tmplData);

            // new data for dashboard
            try {
                const { data: statsData } = await reportAPI.getDashboardStats();
                setStats(statsData);
            } catch (e) { console.error("Stats error", e); }

            try {
                const { data: usersData } = await userAPI.getUsers();
                setAllUsers(usersData);
            } catch (e) { console.error("Users error", e); }

            if (user.role === 'Employee') {
                try {
                    const { data: tsData } = await timesheetAPI.getMyTimesheets();
                    setMyTimesheets(tsData);
                } catch (e) { console.error("Timesheet error", e); }
            }
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openCreateModal = () => {
        setEditingProject(null);
        setFormData({ name: '', description: '', startDate: '', endDate: '', status: 'Active', templateId: '', isTemplate: false });
        setShowModal(true);
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        setFormData({
            name: project.name,
            description: project.description || '',
            startDate: project.startDate ? project.startDate.split('T')[0] : '',
            endDate: project.endDate ? project.endDate.split('T')[0] : '',
            status: project.status || 'Active',
            templateId: '',
            isTemplate: project.isTemplate || false
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProject) {
                await projectAPI.updateProject(editingProject._id, formData);
            } else if (formData.templateId) {
                await projectAPI.createFromTemplate(formData.templateId, formData);
            } else {
                await projectAPI.createProject(formData);
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            alert(`Failed to save project: ${err.response?.data?.message || err.message}`);
        }
    };

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    // Render Dashboard based on Role
    let DashboardComponent;
    switch (user?.role) {
        case 'Super Admin':
        case 'Project Admin':
            DashboardComponent = AdminDashboard;
            break;
        case 'Project Manager':
            DashboardComponent = ManagerDashboard;
            break;
        case 'Team Member':
            DashboardComponent = EmployeeDashboard;
            break;
        case 'Client':
            DashboardComponent = ClientDashboard;
            break;
        default:
            DashboardComponent = AdminDashboard;
    }

    return (
        <div className="relative h-full">
            <DashboardComponent
                user={user}
                projects={projects}
                tasks={tasks}
                stats={stats}
                allUsers={allUsers}
                myTimesheets={myTimesheets}
                // Only pass create/edit if Admin
                onCreateProject={user.role === 'Project Manager' ? undefined : openCreateModal}
                onEditProject={user.role === 'Project Manager' ? undefined : openEditModal}
            />

            {/* Create/Edit Project Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute right-4 top-4 text-muted hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6">{editingProject ? 'Edit Project' : 'Create New Project'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!editingProject && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted tracking-widest">Template (Optional)</label>
                                    <select
                                        className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                        onChange={(e) => {
                                            const tId = e.target.value;
                                            setFormData(prev => ({ ...prev, templateId: tId }));
                                        }}
                                        value={formData.templateId || ''}
                                    >
                                        <option value="">-- None --</option>
                                        {templates.map(t => (
                                            <option key={t._id} value={t._id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted tracking-widest">Project Name</label>
                                <input
                                    autoFocus
                                    required
                                    className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                    placeholder="e.g., Q4 Marketing Campaign"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted tracking-widest">Description</label>
                                <textarea
                                    className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 min-h-[80px]"
                                    placeholder="Briefly describe the project goals..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted tracking-widest">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted tracking-widest">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted tracking-widest">Status</label>
                                <select
                                    className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isTemplate"
                                    className="w-4 h-4 rounded border-border bg-card/50"
                                    checked={formData.isTemplate || false}
                                    onChange={e => setFormData({ ...formData, isTemplate: e.target.checked })}
                                />
                                <label htmlFor="isTemplate" className="text-sm text-muted cursor-pointer">Save as Template</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-black font-black py-4 rounded-xl shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {editingProject ? 'SAVE CHANGES' : 'CREATE PROJECT'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardOverview;