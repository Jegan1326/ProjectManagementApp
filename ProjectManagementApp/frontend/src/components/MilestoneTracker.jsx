import React, { useState, useEffect } from 'react';
import {
    Flag,
    Calendar,
    ChevronRight,
    Plus,
    CheckCircle2,
    Clock,
    AlertCircle,
    Loader2,
    X
} from 'lucide-react';
import { milestoneAPI, projectAPI } from '../services/api';

const MilestoneCard = ({ milestone }) => {
    const statusColors = {
        'DRAFT': 'bg-glass-card border-border text-muted',
        'SUBMITTED': 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
        'APPROVED': 'bg-primary/10 border-primary/20 text-primary',
        'REJECTED': 'bg-red-500/10 border-red-500/20 text-red-500'
    };

    return (
        <div className="glass-card p-6 flex flex-col gap-4 group hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${statusColors[milestone.status]}`}>
                    <Flag size={20} />
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${statusColors[milestone.status]}`}>
                    {milestone.status}
                </span>
            </div>

            <div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{milestone.name}</h3>
                <p className="text-xs text-muted line-clamp-2 leading-relaxed">{milestone.description}</p>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted">
                    <span>Progress</span>
                    <span>{milestone.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-card rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary shadow-neon transition-all duration-1000"
                        style={{ width: `${milestone.progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-tighter">
                    <Calendar size={14} />
                    <span>Due {new Date(milestone.dueDate).toLocaleDateString()}</span>
                </div>
                <button className="text-primary hover:text-white transition-colors">
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

const MilestoneTracker = () => {
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', dueDate: '', progress: 0 });
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');

    const fetchData = async () => {
        try {
            const { data: projData } = await projectAPI.getProjects();
            setProjects(projData);
            if (projData.length > 0) {
                const projId = projData[0]._id;
                setSelectedProject(projId);
                const { data: mileData } = await milestoneAPI.getProjectMilestones(projId);
                setMilestones(mileData);
            }
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
            await milestoneAPI.createMilestone({ ...formData, project: selectedProject });
            setShowModal(false);
            setFormData({ name: '', description: '', dueDate: '', progress: 0 });
            fetchData();
        } catch (err) {
            console.error('Failed to create milestone:', err);
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
                    <h1 className="text-3xl font-bold mb-2">Milestone Tracker</h1>
                    <p className="text-sm text-muted">Track major project goals and delivery phases.</p>
                </div>
                <div className="flex gap-3">
                    <select
                        className="bg-card border border-border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary/50"
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                    >
                        {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-primary text-black font-black px-6 py-2.5 rounded-xl text-sm shadow-neon hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        ADD MILESTONE
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {milestones.map((m) => (
                    <MilestoneCard key={m._id} milestone={m} />
                ))}
            </div>

            {milestones.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-20 glass-card">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                        <Flag size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No milestones yet</h2>
                    <p className="text-muted text-sm max-w-xs mb-8">Start by defining project phases and key delivery dates.</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all"
                    >
                        Define First Milestone
                    </button>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="glass-card w-full max-w-lg p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Add New Milestone</h2>
                            <button onClick={() => setShowModal(false)} className="text-muted hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted tracking-widest">Milestone Name</label>
                                <input
                                    autoFocus
                                    required
                                    className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                    placeholder="e.g., MVP Launch, Beta Testing"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted tracking-widest">Description</label>
                                <textarea
                                    className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 min-h-[80px]"
                                    placeholder="Define the scope of this milestone..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted tracking-widest">Due Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted tracking-widest">Initial Progress %</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                        value={formData.progress}
                                        onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-black font-black py-4 rounded-xl shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                SAVE MILESTONE
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MilestoneTracker;
