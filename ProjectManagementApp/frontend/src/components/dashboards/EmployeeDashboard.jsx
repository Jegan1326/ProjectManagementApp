import React, { useState, useEffect } from 'react';
import {
    CheckSquare,
    Clock,
    AlertCircle,
    ArrowUpRight,
    Loader2,
    Play
} from 'lucide-react';
import { taskAPI } from '../../services/api';

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

const EmployeeDashboard = ({ user, tasks = [] }) => {
    // const [tasks, setTasks] = useState([]); // Removed
    // const [loading, setLoading] = useState(true); // Removed

    // useEffect(() => { ... }); // Removed

    // if (loading) ... // Removed

    const pendingTasks = tasks.filter(t => t.status === 'To Do');

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-1">My Dashboard</h1>
                    <p className="text-sm text-muted">Good day, {user.name}. Ready to work?</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-primary text-black font-bold px-6 py-2.5 rounded-xl text-sm shadow-neon hover:scale-105 transition-all flex items-center gap-2">
                        <Play size={18} />
                        START TIMER
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatusCard title="My Pending Tasks" value={pendingTasks.length} change="Due Soon" trend="down" icon={CheckSquare} color="blue" />
                <StatusCard title="Hours Logged" value="32.5" change="This Week" trend="up" icon={Clock} color="purple" />
                <StatusCard title="Open Issues" value="1" change="Assigned to me" trend="down" icon={AlertCircle} color="red" />
            </div>

            <div className="glass-card p-8">
                <h3 className="font-semibold text-xl mb-4">My Priority Tasks</h3>
                {pendingTasks.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {pendingTasks.slice(0, 5).map(task => (
                            <div key={task._id} className="p-4 rounded-xl bg-card border border-border flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-sm">{task.title}</h4>
                                    <p className="text-xs text-muted">{new Date(task.dueDate).toLocaleDateString()}</p>
                                </div>
                                <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded-md uppercase font-bold">{task.priority}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted text-sm">No pending tasks. Great job!</p>
                )}
            </div>
        </div>
    );
};

export default EmployeeDashboard;
