import React, { useState, useEffect } from 'react';
import {
    Users,
    Briefcase,
    CheckCircle,
    AlertCircle,
    ArrowUpRight,
    Loader2,
    Plus
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

const ManagerDashboard = ({ user, projects = [], onCreateProject }) => {
    // const [projects, setProjects] = useState([]); // Removed
    // const [loading, setLoading] = useState(true); // Removed

    // useEffect(() => { ... }); // Removed

    // if (loading) ... // Removed

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Manager Dashboard</h1>
                    <p className="text-sm text-muted">Overview of your team's performance.</p>
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
                <StatusCard title="My Projects" value={projects.length} change="Active" trend="up" icon={Briefcase} color="blue" />
                <StatusCard title="Team Members" value="5" change="Fully Staffed" trend="up" icon={Users} color="green" />
                <StatusCard title="Pending Approvals" value="3" change="Needs Review" trend="down" icon={AlertCircle} color="yellow" />
                <StatusCard title="Milestones Met" value="8" change="On Track" trend="up" icon={CheckCircle} color="purple" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-6">
                    <h3 className="font-bold mb-4">Team Workload</h3>
                    <div className="space-y-4">
                        {['Alice', 'Bob', 'Charlie'].map(member => (
                            <div key={member} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span>{member}</span>
                                    <span className="text-muted">85% Utilized</span>
                                </div>
                                <div className="h-2 bg-card rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[85%]"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="glass-card p-6">
                    <h3 className="font-bold mb-4">Pending Timesheets</h3>
                    <div className="text-sm text-muted">No pending approvals required.</div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
