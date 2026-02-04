import React, { useState, useEffect } from 'react';
import {
    Users,
    Briefcase,
    Activity,
    Server,
    ArrowUpRight,
    Plus,
    Loader2,
    Trash2,
    Pencil
} from 'lucide-react';
import { projectAPI } from '../../services/api';

const StatusCard = ({ title, value, change, trend, icon: Icon, color }) => (
    <div className="glass-card p-6 flex flex-col gap-2 relative overflow-hidden group">
        <div className="flex justify-between items-start z-10">
            <span className="text-muted text-sm font-medium">{title}</span>
            <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-500`}>
                <Icon size={18} />
            </div>
        </div>
        <div className="text-3xl font-bold z-10">{value}</div>
        <div className={`flex items-center gap-1 text-xs z-10 ${trend === 'up' ? 'text-primary' : 'text-red-500'}`}>
            <ArrowUpRight size={14} className={trend === 'down' ? 'rotate-90' : ''} />
            <span>{change} this week</span>
        </div>
        <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-${color}-500/5 rounded-full blur-2xl group-hover:bg-${color}-500/10 transition-all`}></div>
    </div>
);

const AdminDashboard = ({ user, projects = [], onCreateProject, onEditProject }) => {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-1">System Overview</h1>
                    <p className="text-sm text-muted">Admin Console • {user.email}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onCreateProject}
                        className="bg-primary text-black font-bold px-6 py-2.5 rounded-xl text-sm shadow-neon hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        CREATE PROJECT
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatusCard title="Total Users" value="12" change="+2" trend="up" icon={Users} color="blue" />
                <StatusCard title="Total Projects" value={projects.length} change="+1" trend="up" icon={Briefcase} color="purple" />
                <StatusCard title="System Load" value="24%" change="-5%" trend="down" icon={Activity} color="green" />
                <StatusCard title="Server Status" value="Online" change="100% Uptime" trend="up" icon={Server} color="yellow" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8">
                    <h3 className="font-semibold text-xl mb-4">Recent System Logs</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center p-3 border-b border-border/50 text-sm">
                                <span className="text-muted">User logged in from new IP</span>
                                <span className="font-mono text-xs text-muted">10:4{i} AM</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-8">
                    <h3 className="font-semibold text-xl mb-4">Manage Projects</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {projects.length === 0 && <p className="text-muted text-sm">No projects found.</p>}
                        {projects.map(project => (
                            <div key={project._id} className="flex justify-between items-center p-3 bg-background/30 rounded-xl border border-border">
                                <div>
                                    <h4 className="font-bold text-sm">{project.name}</h4>
                                    <p className="text-xs text-muted">
                                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${project.status === 'Active' ? 'bg-green-500' :
                                            project.status === 'Completed' ? 'bg-blue-500' : 'bg-yellow-500'
                                            }`}></span>
                                        {project.status || 'Active'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEditProject(project)}
                                        className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Delete this project?')) {
                                                try {
                                                    await projectAPI.deleteProject(project._id);
                                                    window.location.reload(); // Refresh to see changes
                                                } catch (e) {
                                                    alert('Failed to delete');
                                                }
                                            }
                                        }}
                                        className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
