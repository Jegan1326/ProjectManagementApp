import React, { useState } from 'react';
import { X, MessageSquare, Send, Paperclip, Clock, Calendar } from 'lucide-react';
import { taskAPI } from '../services/api';

const TaskDetailModal = ({ task, onClose, onUpdate }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(task.comments || []);
    const [submitting, setSubmitting] = useState(false);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setSubmitting(true);
        try {
            const { data } = await taskAPI.addComment(task._id, { text: comment });
            setComments(data.comments);
            setComment('');
            if (onUpdate) onUpdate(data);
        } catch (err) {
            console.error('Failed to add comment:', err);
            alert('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="glass-card w-full max-w-2xl h-[80vh] flex flex-col p-0 animate-in fade-in zoom-in duration-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${task.priority === 'High' ? 'bg-red-500/20 text-red-500' :
                                    task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                        'bg-primary/20 text-primary'
                                }`}>
                                {task.priority}
                            </span>
                            <span className="text-[10px] text-muted font-bold uppercase">{task.status}</span>
                        </div>
                        <h2 className="text-2xl font-bold">{task.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <div className="grid grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="col-span-2 space-y-8">
                            <div>
                                <h3 className="text-xs font-black uppercase text-muted tracking-widest mb-2">Description</h3>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
                            </div>

                            <div>
                                <h3 className="text-xs font-black uppercase text-muted tracking-widest mb-4 flex items-center gap-2">
                                    <MessageSquare size={14} />
                                    Activity & Comments
                                </h3>

                                <div className="space-y-4 mb-6">
                                    {comments.length === 0 ? (
                                        <p className="text-sm text-muted italic">No comments yet.</p>
                                    ) : (
                                        comments.map((c, i) => (
                                            <div key={i} className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                                                    {c.user?.name?.[0] || '?'}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-xs">{c.user?.name || 'Unknown'}</span>
                                                        <span className="text-[10px] text-muted">{new Date(c.timestamp).toLocaleString()}</span>
                                                    </div>
                                                    <div className="bg-card/50 p-3 rounded-lg text-sm border border-border">
                                                        {c.text}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <form onSubmit={handleAddComment} className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <input
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Write a comment..."
                                            className="w-full bg-card/50 border border-border rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none focus:border-primary/50"
                                        />
                                        <button
                                            type="submit"
                                            disabled={submitting || !comment.trim()}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform disabled:opacity-50"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <span className="text-[10px] text-muted font-bold uppercase block mb-1">Assignee</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-black">
                                            {task.assignee?.name?.[0] || '?'}
                                        </div>
                                        <span className="text-sm font-medium">{task.assignee?.name || 'Unassigned'}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[10px] text-muted font-bold uppercase block mb-1">Due Date</span>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={14} className="text-muted" />
                                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date set'}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[10px] text-muted font-bold uppercase block mb-1">Project</span>
                                    <p className="text-sm font-medium truncate">{task.project?.name || 'Unknown Project'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
