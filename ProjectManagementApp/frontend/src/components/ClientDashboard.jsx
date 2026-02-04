import React, { useState, useEffect } from 'react';
import {
    Layout,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Loader2,
    ChevronRight,
    Flag
} from 'lucide-react';
import { projectAPI } from '../services/api';

const ClientDashboard = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await projectAPI.getProjects();
                setProjects(data);
                if (data.length > 0) setSelectedProject(data[0]);
            } catch (err) {
                console.error('Failed to load projects');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    if (projects.length === 0) return (
        <div className="flex-1 flex flex-col items-center justify-center text-muted">
            <Layout size={48} className="mb-4 opacity-20" />
            <p>No projects assigned to you yet.</p>
        </div>
    );

    return (
        <div className="flex flex-col h-full gap-8 overflow-y-auto custom-scrollbar">
            <div>
                <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
                <p className="text-sm text-muted">Track the progress of your projects below.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Projects List */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted px-1">Your Projects</h3>
                    {projects.map(project => (
                        <div
                            key={project._id}
                            onClick={() => setSelectedProject(project)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedProject?._id === project._id
                                    ? 'bg-primary/20 border-primary shadow-neon'
                                    : 'bg-card border-border hover:bg-card/70'
                                }`}
                        >
                            <h4 className="font-bold mb-1">{project.name}</h4>
                            <div className="flex justify-between items-center text-xs text-muted">
                                <span>{new Date(project.startDate).toLocaleDateString()}</span>
                                <span className={`px-2 py-0.5 rounded-md ${project.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                                        project.status === 'Active' ? 'bg-primary/20 text-primary' : 'bg-card'
                                    }`}>{project.status}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Project Details */}
                {selectedProject && (
                    <div className="lg:col-span-2 glass-card p-6 space-y-8 animate-in fade-in slide-in-from-right duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{selectedProject.name}</h2>
                                <p className="text-muted text-sm">{selectedProject.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Target Date</p>
                                <p className="font-bold flex items-center justify-end gap-2">
                                    <Calendar size={16} className="text-primary" />
                                    {new Date(selectedProject.endDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Milestones / Progress */}
                        {/* Note: In a real app we'd fetch specific milestones or progress stats here. 
                            For now, we'll assume the project object has basic stats or we use static placeholders 
                            if not populated. To make it dynamic, we'd need to fetch project details.
                        */}
                        <div>
                            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                                <Flag size={18} className="text-primary" />
                                Key Milestones
                            </h3>
                            <div className="space-y-3">
                                {(selectedProject.milestones || []).length > 0 ? (
                                    selectedProject.milestones.map((ms, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-background/30 rounded-xl border border-border">
                                            <CheckCircle2 size={16} className={ms.status === 'Completed' ? 'text-green-500' : 'text-muted'} />
                                            <span className="text-sm font-medium flex-1">{ms.title}</span>
                                            <span className="text-xs text-muted">{ms.dueDate ? new Date(ms.dueDate).toLocaleDateString() : ''}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted">No milestones visible.</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity / Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-background/30 rounded-xl border border-border">
                                <div className="flex items-center gap-2 text-muted mb-2">
                                    <Clock size={16} />
                                    <span className="text-xs font-bold uppercase">Status</span>
                                </div>
                                <p className="text-lg font-black text-primary">{selectedProject.status}</p>
                            </div>
                            <div className="p-4 bg-background/30 rounded-xl border border-border">
                                <div className="flex items-center gap-2 text-muted mb-2">
                                    <FileText size={16} />
                                    <span className="text-xs font-bold uppercase">Documents</span>
                                </div>
                                <p className="text-lg font-black text-primary">Access via Sidebar</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;
