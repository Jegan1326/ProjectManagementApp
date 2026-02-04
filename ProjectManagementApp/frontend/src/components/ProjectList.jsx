import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Loader2,
    Calendar,
    MoreVertical,
    Edit2,
    Trash2,
    CheckCircle,
    Clock,
    User,
    Folder
} from 'lucide-react';
import { projectAPI } from '../services/api';

const ProjectList = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Active'
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await projectAPI.getProjects();
            setProjects(data);
        } catch (err) {
            console.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await projectAPI.createProject(formData);
            setProjects([...projects, data]);
            setIsCreateModalOpen(false);
            setFormData({ name: '', description: '', startDate: '', endDate: '', status: 'Active' });
        } catch (err) {
            alert('Failed to create project');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await projectAPI.updateProject(currentProject._id, formData);
            setProjects(projects.map(p => p._id === data._id ? data : p));
            setIsEditModalOpen(false);
            setCurrentProject(null);
        } catch (err) {
            alert('Failed to update project');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await projectAPI.deleteProject(id);
            setProjects(projects.filter(p => p._id !== id));
        } catch (err) {
            alert('Failed to delete project');
        }
    };

    const openEditModal = (project) => {
        setCurrentProject(project);
        setFormData({
            name: project.name,
            description: project.description,
            startDate: project.startDate?.split('T')[0] || '',
            endDate: project.endDate?.split('T')[0] || '',
            status: project.status
        });
        setIsEditModalOpen(true);
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(filter.toLowerCase()) ||
        project.description?.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    return (
        <div className="flex flex-col h-full gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Projects</h1>
                    <p className="text-sm text-muted">Manage your projects and track their status.</p>
                </div>
                {(user.role === 'Super Admin' || user.role === 'Project Admin' || user.role === 'Project Manager') && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary text-black font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform shadow-neon"
                    >
                        <Plus size={18} />
                        NEW PROJECT
                    </button>
                )}
            </div>

            <div className="glass-card p-6 flex items-center gap-4">
                <Search className="text-muted" size={20} />
                <input
                    type="text"
                    placeholder="Search projects..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pb-4">
                {filteredProjects.map(project => (
                    <div key={project._id} className="glass-card p-6 relative group hover:border-primary/50 transition-all flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-2">
                                <Folder size={24} />
                            </div>
                            <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${project.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                                    project.status === 'Completed' ? 'bg-blue-500/10 text-blue-500' :
                                        'bg-yellow-500/10 text-yellow-500'
                                }`}>
                                {project.status}
                            </div>
                        </div>

                        <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                        <p className="text-sm text-muted mb-6 flex-1 line-clamp-2">{project.description}</p>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-xs text-muted">
                                <Calendar size={14} />
                                <span>
                                    {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted">
                                <User size={14} />
                                <span>{project.admin?.name || 'Unknown Admin'}</span>
                            </div>
                        </div>

                        {(user.role === 'Super Admin' || user.role === 'Project Admin' || user.role === 'Project Manager') && (
                            <div className="flex items-center gap-2 pt-4 border-t border-border/50 mt-auto">
                                <button
                                    onClick={() => openEditModal(project)}
                                    className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit2 size={14} />
                                    EDIT
                                </button>
                                <button
                                    onClick={() => handleDelete(project._id)}
                                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {(isCreateModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-6">
                            {isCreateModalOpen ? 'Create New Project' : 'Edit Project'}
                        </h2>
                        <form onSubmit={isCreateModalOpen ? handleCreate : handleUpdate} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Project Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-card/50 border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary/50"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Description</label>
                                <textarea
                                    className="w-full bg-card/50 border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary/50 h-24 resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-card/50 border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary/50"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-card/50 border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary/50"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Status</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Active', 'On Hold', 'Completed'].map(status => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status })}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all ${formData.status === status
                                                    ? 'bg-primary text-black shadow-neon'
                                                    : 'bg-card/50 text-muted hover:bg-card'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        setIsEditModalOpen(false);
                                        setFormData({ name: '', description: '', startDate: '', endDate: '', status: 'Active' });
                                    }}
                                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl bg-primary text-black text-sm font-bold shadow-neon hover:scale-[1.02] transition-all"
                                >
                                    {isCreateModalOpen ? 'Create Project' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectList;
