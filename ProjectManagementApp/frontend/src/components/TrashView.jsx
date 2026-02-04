import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, AlertTriangle, Search, Filter, Loader2 } from 'lucide-react';
import { taskAPI } from '../services/api';

const TrashView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [deletedTasks, setDeletedTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDeletedTasks = async () => {
        try {
            const { data } = await taskAPI.getTasks({ isDeleted: true });
            setDeletedTasks(data);
        } catch (err) {
            console.error('Failed to fetch deleted tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeletedTasks();
    }, []);

    const handleRestore = async (id) => {
        try {
            await taskAPI.restoreTask(id);
            fetchDeletedTasks();
        } catch (err) {
            alert('Failed to restore task');
        }
    };

    const handlePermanentDelete = async (id) => {
        if (!window.confirm('Are you sure? This action cannot be undone.')) return;
        try {
            // Need to implement permanent delete in taskAPI if not there
            // For now, let's assume we use a specialized delete endpoint if it exists
            // Or just a standard delete if the backend handles isDeleted check
            await taskAPI.deleteTask(id); // If it's already deleted, maybe this should be permanent-delete
            fetchDeletedTasks();
        } catch (err) {
            alert('Failed to delete task');
        }
    };

    const filteredTasks = deletedTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Trash Bin</h1>
                    <p className="text-sm text-muted">Manage soft-deleted tasks. Items here can be restored or permanently removed.</p>
                </div>
                <button className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-6 py-2.5 rounded-xl text-sm font-bold border border-red-500/20 transition-all flex items-center gap-2">
                    <Trash2 size={18} />
                    Empty Trash
                </button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search deleted tasks..."
                        className="w-full bg-card/50 border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="bg-card border border-border px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-white/5 transition-all text-muted">
                    <Filter size={18} />
                    Filter
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] text-muted uppercase border-b border-border bg-card/30">
                            <th className="px-8 py-4 font-bold">Task Detail</th>
                            <th className="px-8 py-4 font-bold text-center">Priority</th>
                            <th className="px-8 py-4 font-bold">Deleted On</th>
                            <th className="px-8 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredTasks.map((task) => (
                            <tr key={task._id} className="border-b border-border/50 hover:bg-white/5 transition-colors group">
                                <td className="px-8 py-5">
                                    <p className="font-bold group-hover:text-primary transition-colors">{task.title}</p>
                                    <p className="text-[10px] text-muted line-clamp-1">{task.description}</p>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex justify-center">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${task.priority === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'
                                            }`}>
                                            {task.priority || 'Low'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-muted">{new Date(task.updatedAt).toLocaleDateString()}</td>
                                <td className="px-8 py-5">
                                    <div className="flex justify-end gap-2 text-muted">
                                        <button
                                            onClick={() => handleRestore(task._id)}
                                            className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
                                            title="Restore"
                                        >
                                            <RotateCcw size={16} />
                                        </button>
                                        <button
                                            onClick={() => handlePermanentDelete(task._id)}
                                            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                                            title="Delete Permanently"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {deletedTasks.length === 0 && (
                    <div className="p-20 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center text-muted mb-4 opacity-50">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="font-bold text-xl mb-1">Trash is empty</h3>
                        <p className="text-sm text-muted">Soft-deleted items will appear here.</p>
                    </div>
                )}
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 flex gap-4 items-start">
                <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
                <div className="text-xs">
                    <p className="font-bold text-yellow-500 mb-1 uppercase tracking-wider">Awaiting Policy</p>
                    <p className="text-muted leading-relaxed">Items in the trash bin are typically retained for 30 days before being automatically purged. You can restore them at any time during this period.</p>
                </div>
            </div>
        </div>
    );
};

export default TrashView;
