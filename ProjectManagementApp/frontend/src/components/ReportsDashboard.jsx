import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle,
    Loader2,
    Calendar,
    Briefcase,
    Download,
    Filter
} from 'lucide-react';
import { reportAPI } from '../services/api';
import { downloadCSV } from '../utils/exportUtils';

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="glass-card p-6 flex items-start justify-between relative overflow-hidden group hover:scale-[1.02] transition-all">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon size={60} />
        </div>
        <div>
            <p className="text-muted text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-black mb-1">{value}</h3>
            {subtext && <p className="text-xs text-muted font-medium">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-20 text-white shadow-neon`}>
            <Icon size={24} />
        </div>
    </div>
);

const ReportsDashboard = ({ user }) => {
    const [stats, setStats] = useState(null);
    const [projectProgress, setProjectProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, projectsRes] = await Promise.all([
                    reportAPI.getDashboardStats(),
                    reportAPI.getProjectProgress()
                ]);
                setStats(statsRes.data);
                setProjectProgress(projectsRes.data);
            } catch (err) {
                console.error('Failed to load reports:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    return (
        <div className="flex flex-col gap-8 h-full overflow-y-auto custom-scrollbar pb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Reports & Analytics</h1>
                    <p className="text-sm text-muted">Track your project performance and metrics.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => downloadCSV(projectProgress, 'project_report.csv')}
                        className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-bold px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-2"
                    >
                        <Download size={16} />
                        EXPORT CSV
                    </button>
                    <div className="bg-card border border-border rounded-xl px-3 py-1 flex items-center gap-2 text-sm text-muted">
                        <Filter size={14} />
                        <span>Last 30 Days</span>
                    </div>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Projects"
                    value={stats?.projects?.total || 0}
                    subtext={`${stats?.projects?.active} Active, ${stats?.projects?.completed} Completed`}
                    icon={Briefcase}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Task Completion"
                    value={`${stats?.tasks?.rate || 0}%`}
                    subtext={`${stats?.tasks?.completed}/${stats?.tasks?.total} Tasks Done`}
                    icon={CheckCircle2}
                    color="bg-green-500"
                />
                <StatCard
                    title="Hours Logged"
                    value={stats?.hours?.total || 0}
                    subtext="Total Billable Hours"
                    icon={Clock}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Pending Issues"
                    value={stats?.issues?.pending || 0}
                    subtext={`${stats?.issues?.total} Total Issues Reported`}
                    icon={AlertCircle}
                    color="bg-red-500"
                />
            </div>

            {/* Project Progress Section */}
            <div className="glass-card p-8">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="text-primary" size={20} />
                    <h2 className="text-xl font-bold">Project Progress</h2>
                </div>

                <div className="space-y-6">
                    {projectProgress.map(project => (
                        <div key={project._id} className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold">{project.name}</span>
                                <span className="font-mono text-muted">{project.progress}%</span>
                            </div>
                            <div className="h-3 bg-card border border-border rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${project.progress === 100 ? 'bg-green-500' :
                                        project.progress > 50 ? 'bg-primary' : 'bg-yellow-500'
                                        }`}
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-muted font-bold uppercase tracking-wider">
                                <span>Status: {project.status}</span>
                                <span>Tasks: {project.completedTasks} / {project.totalTasks}</span>
                            </div>
                        </div>
                    ))}
                    {projectProgress.length === 0 && (
                        <p className="text-muted text-center py-4">No projects data available.</p>
                    )}
                </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 min-h-[300px] flex flex-col items-center justify-center text-center">
                    <PieChart className="text-muted mb-4 opacity-20" size={48} />
                    <h3 className="font-bold text-lg mb-2">Task Distribution</h3>
                    <p className="text-sm text-muted">Visual breakdown of tasks by priority coming soon.</p>
                </div>
                <div className="glass-card p-6 min-h-[300px] flex flex-col items-center justify-center text-center">
                    <TrendingUp className="text-muted mb-4 opacity-20" size={48} />
                    <h3 className="font-bold text-lg mb-2">Productivity Trends</h3>
                    <p className="text-sm text-muted">Weekly activity charts coming soon.</p>
                </div>
            </div>
        </div>
    );
};

export default ReportsDashboard;
