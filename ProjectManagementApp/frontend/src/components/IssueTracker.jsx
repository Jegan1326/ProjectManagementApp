import React, { useState, useEffect } from 'react';
import {
    AlertCircle,
    CheckCircle,
    Plus,
    Filter,
    Search,
    Loader2,
    X,
    MoreHorizontal
} from 'lucide-react';
import { issueAPI, projectAPI } from '../services/api';

const IssueTracker = ({ user }) => {
    const [issues, setIssues] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        project: '',
        severity: 'Medium',
        priority: 'Medium'
    });

    const fetchData = async () => {
        try {
            const [issuesRes, projectsRes] = await Promise.all([
                issueAPI.getIssues(),
                projectAPI.getProjects()
            ]);
            setIssues(issuesRes.data);
            setProjects(projectsRes.data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await issueAPI.createIssue(formData);
            setShowModal(false);
            setFormData({ title: '', description: '', project: '', severity: 'Medium', priority: 'Medium' });
            fetchData();
        } catch (err) {
            alert('Failed to create issue');
        }
    };

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Issue Tracking</h1>
                    <p className="text-sm text-muted">Report and track project issues and bugs.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-black font-black px-6 py-2.5 rounded-xl text-sm shadow-neon hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus size={18} />
                    REPORT ISSUE
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map(issue => (
                    <div key={issue._id} className="glass-card p-6 border-l-4 border-l-primary hover:scale-[1.02] transition-transform">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${issue.severity === 'Critical' ? 'bg-red-500/20 text-red-500' :
                                    issue.severity === 'High' ? 'bg-orange-500/20 text-orange-500' :
                                        'bg-blue-500/20 text-blue-500'
                                }`}>
                                {issue.severity}
                            </span>
                            <span className="text-[10px] text-muted font-bold uppercase">{issue.status}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{issue.title}</h3>
                        <p className="text-sm text-muted mb-4 line-clamp-2">{issue.description}</p>
                        <div className="flex justify-between items-center text-xs text-muted font-medium border-t border-border pt-4">
                            <span>{issue.project?.name}</span>
                            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="glass-card w-full max-w-lg p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Report Issue</h2>
                            <button onClick={() => setShowModal(false)} className="text-muted hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted tracking-widest">Project *</label>
                                <select
                                    required
                                    className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                    value={formData.project}
                                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                                >
                                    <option value="">Select Project</option>
                                    {projects.filter(p => p.status === 'Active').map(p => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted tracking-widest">Issue Title *</label>
                                <input
                                    required
                                    className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted tracking-widest">Severity</label>
                                    <select
                                        className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                        value={formData.severity}
                                        onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted tracking-widest">Priority</label>
                                    <select
                                        className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted tracking-widest">Description</label>
                                <textarea
                                    className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 min-h-[100px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <button className="w-full bg-primary text-black font-black py-4 rounded-xl shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all">
                                SUBMIT ISSUE
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IssueTracker;
