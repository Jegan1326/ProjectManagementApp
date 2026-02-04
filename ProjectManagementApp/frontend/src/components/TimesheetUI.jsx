import React, { useState, useEffect } from 'react';
import {
    Clock,
    CheckCircle,
    XCircle,
    Send,
    FileText,
    Calendar,
    Loader2,
    Plus,
    X,
    Filter
} from 'lucide-react';
import { timesheetAPI, projectAPI, taskAPI } from '../services/api';

const TimesheetUI = ({ user }) => {
    // Admins/Managers default to Approvals, Employees (Team Member) to Submit
    const initialTab = user.role === 'Team Member' ? 'Submit' : 'Approvals';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [timesheets, setTimesheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({
        project: '',
        task: '',
        hours: '',
        software: '',
        description: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: projData } = await projectAPI.getProjects();
            setProjects(projData);

            if (user.role === 'Team Member') {
                const { data: myData } = await timesheetAPI.getMyTimesheets();
                setTimesheets(myData);
            } else {
                const { data: allData } = await timesheetAPI.getAllTimesheets();
                setTimesheets(allData);
            }
        } catch (err) {
            console.error('Failed to fetch timesheets:', err);
            if (err.response?.status === 401) {
                alert("Session expired. Please logout and login again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    useEffect(() => {
        if (formData.project) {
            taskAPI.getTasks({ project: formData.project }).then(({ data }) => setTasks(data));
        }
    }, [formData.project]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await timesheetAPI.submitTimesheet(formData);
            setFormData({ project: '', task: '', hours: '', software: '', description: '' });
            fetchData();
            alert('Timesheet submitted successfully!');
        } catch (err) {
            alert('Failed to submit timesheet: ' + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await timesheetAPI.updateStatus(id, { status });
            fetchData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading && timesheets.length === 0) return (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Timesheet Management</h1>
                    <p className="text-sm text-muted">Log your hours and manage project time tracking.</p>
                </div>
            </div>

            <div className="flex gap-1 p-1 bg-card/30 rounded-2xl w-fit border border-border">
                {[
                    // Only Team Members can submit timesheets
                    user.role === 'Team Member' && 'Submit',
                    'History',
                    (user.role !== 'Team Member' && 'Approvals')
                ].filter(Boolean).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-black shadow-neon' : 'text-muted hover:text-white'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === 'Submit' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="glass-card p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Clock className="text-primary" />
                                Log New Hours
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-muted tracking-widest">Project</label>
                                        <select
                                            required
                                            className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                            value={formData.project}
                                            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                                        >
                                            <option value="">Select Project</option>
                                            {projects.filter(p => p.status === 'Active').length > 0 ? (
                                                projects
                                                    .filter(p => p.status === 'Active')
                                                    .map(p => <option key={p._id} value={p._id}>{p.name}</option>)
                                            ) : (
                                                <option value="" disabled>No active projects available</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-muted tracking-widest">Task</label>
                                        <select
                                            required
                                            disabled={!formData.project}
                                            className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 disabled:opacity-50"
                                            value={formData.task}
                                            onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                                        >
                                            <option value="">Select Task</option>
                                            {tasks.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-muted tracking-widest">Hours</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                            placeholder="e.g. 4.5"
                                            value={formData.hours}
                                            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-muted tracking-widest">Software Used</label>
                                        <input
                                            className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                            placeholder="e.g. VS Code, Figma"
                                            value={formData.software}
                                            onChange={(e) => setFormData({ ...formData, software: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted tracking-widest">Work Description</label>
                                    <textarea
                                        required
                                        className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 min-h-[100px]"
                                        placeholder="What did you work on?"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <button
                                    disabled={submitting}
                                    className="w-full bg-primary text-black font-black py-4 rounded-xl shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                    SUBMIT TIMESHEET
                                </button>
                            </form>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="glass-card p-6 bg-primary/5 border-primary/20">
                                <h4 className="font-bold text-sm mb-4 uppercase tracking-widest text-primary">Quick Stats</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-background/50 p-4 rounded-2xl border border-border">
                                        <p className="text-[10px] font-bold text-muted uppercase">This Week</p>
                                        <p className="text-2xl font-black">38.5h</p>
                                    </div>
                                    <div className="bg-background/50 p-4 rounded-2xl border border-border">
                                        <p className="text-[10px] font-bold text-muted uppercase">Pending</p>
                                        <p className="text-2xl font-black text-yellow-500">12h</p>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-card p-6">
                                <h4 className="font-bold text-sm mb-4 uppercase tracking-widest text-muted">Active Requirements</h4>
                                <ul className="space-y-4 text-xs text-muted">
                                    <li className="flex gap-3 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                                        <span>Log hours daily for better accuracy.</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                                        <span>Mention specific tasks linked to projects.</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                                        <span>Submissions after Friday 6 PM require manual override.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {(activeTab === 'History' || activeTab === 'Approvals') && (
                    <div className="glass-card overflow-hidden animate-in fade-in duration-500">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-card/30 text-[10px] text-muted uppercase font-black tracking-widest border-b border-border">
                                    <th className="px-6 py-4">User / Project</th>
                                    <th className="px-6 py-4">Task / Software</th>
                                    <th className="px-6 py-4 text-center">Hours</th>
                                    <th className="px-6 py-4">Status</th>
                                    {activeTab === 'Approvals' && <th className="px-6 py-4 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {timesheets.map((entry) => (
                                    <tr key={entry._id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-sm">{entry.user?.name || 'Unknown'}</p>
                                            <p className="text-[10px] text-muted">{entry.project?.name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium">{entry.task?.title || entry.description}</p>
                                            <p className="text-[10px] text-primary uppercase font-bold">{entry.software}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-lg font-black">{entry.hours || entry.duration}</span>
                                            <span className="text-[10px] ml-1 font-bold text-muted">hrs</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase border ${entry.status === 'Approved' ? 'bg-primary/10 border-primary/20 text-primary' :
                                                entry.status === 'Rejected' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                    'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                                                }`}>
                                                {entry.status}
                                            </span>
                                        </td>
                                        {activeTab === 'Approvals' && (
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(entry._id, 'Rejected')}
                                                        className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-all"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(entry._id, 'Approved')}
                                                        className="p-2 hover:bg-primary/20 text-primary rounded-lg transition-all"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {timesheets.length === 0 && (
                            <div className="p-20 text-center flex flex-col items-center">
                                <Clock size={48} className="text-muted mb-4 opacity-50" />
                                <h3 className="text-xl font-bold mb-1">No records found</h3>
                                <p className="text-muted text-sm">You haven't logged any hours yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimesheetUI;
