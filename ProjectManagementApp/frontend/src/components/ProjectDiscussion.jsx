import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    Send,
    Paperclip,
    MoreHorizontal,
    Trash2,
    File,
    Loader2
} from 'lucide-react';
import { discussionAPI, projectAPI, uploadAPI } from '../services/api';

const ProjectDiscussion = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form States
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        // Fetch projects where user is member
        projectAPI.getProjects().then(({ data }) => {
            setProjects(data);
            if (data.length > 0) setSelectedProject(data[0]._id);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchDiscussions();
        }
    }, [selectedProject]);

    const fetchDiscussions = async () => {
        setLoading(true);
        try {
            const { data } = await discussionAPI.getDiscussions(selectedProject);
            setDiscussions(data);
        } catch (err) {
            console.error('Failed to fetch discussions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        try {
            let attachments = [];
            if (file) {
                setUploading(true);
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await uploadAPI.uploadFile(formData);
                attachments.push({
                    name: data.originalname,
                    url: data.fileUrl,
                    type: data.mimetype
                });
                setUploading(false);
            }

            await discussionAPI.createDiscussion(selectedProject, {
                title,
                content,
                attachments
            });

            setTitle('');
            setContent('');
            setFile(null);
            fetchDiscussions();
        } catch (err) {
            console.error('Error posting discussion:', err);
            setUploading(false);
            alert('Failed to post discussion');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this discussion?')) {
            try {
                await discussionAPI.deleteDiscussion(id);
                fetchDiscussions();
            } catch (err) {
                alert('Failed to delete discussion');
            }
        }
    };

    const handleComment = async (id, commentContent) => {
        try {
            await discussionAPI.addComment(id, { content: commentContent });
            fetchDiscussions();
        } catch (err) {
            console.error('Failed to add comment:', err);
        }
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Team Discussions</h1>
                    <p className="text-sm text-muted">Collaborate and share files with your team.</p>
                </div>
                <div className="w-64">
                    <select
                        className="w-full bg-card/50 border border-border rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-primary/50"
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                    >
                        {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
                {/* Discussion List */}
                <div className="lg:col-span-2 overflow-y-auto custom-scrollbar space-y-6 pr-2">
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                    ) : discussions.length === 0 ? (
                        <div className="text-center p-12 text-muted">No discussions yet. Start one!</div>
                    ) : (
                        discussions.map(post => (
                            <div key={post._id} className="glass-card p-6 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                            {post.author?.name?.[0] || '?'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{post.title}</h3>
                                            <p className="text-xs text-muted">
                                                By {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {user._id === post.author?._id && (
                                        <button onClick={() => handleDelete(post._id)} className="text-muted hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                <p className="text-sm mb-4 whitespace-pre-wrap">{post.content}</p>

                                {post.attachments?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {post.attachments.map((att, idx) => (
                                            <a
                                                key={idx}
                                                href={att.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 bg-card/50 px-3 py-2 rounded-lg text-xs hover:bg-white/5 border border-border transition-colors"
                                            >
                                                <File size={14} />
                                                <span className="truncate max-w-[150px]">{att.name}</span>
                                            </a>
                                        ))}
                                    </div>
                                )}

                                <div className="border-t border-border pt-4 mt-4">
                                    <h4 className="text-xs font-bold uppercase text-muted mb-3 flex items-center gap-2">
                                        <MessageSquare size={12} />
                                        Comments ({post.comments?.length || 0})
                                    </h4>

                                    <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                                        {post.comments?.map((comment, idx) => (
                                            <div key={idx} className="bg-background/30 p-3 rounded-lg text-sm">
                                                <div className="flex justify-between mb-1">
                                                    <span className="font-bold text-xs">{comment.author?.name}</span>
                                                    <span className="text-[10px] text-muted">{new Date(comment.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                                <p className="text-muted-foreground">{comment.content}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const val = e.target.elements.comment.value;
                                            if (val.trim()) {
                                                handleComment(post._id, val);
                                                e.target.reset();
                                            }
                                        }}
                                        className="relative"
                                    >
                                        <input
                                            name="comment"
                                            placeholder="Write a comment..."
                                            className="w-full bg-background/50 border border-border rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-primary/50"
                                        />
                                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform">
                                            <Send size={16} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* New Discussion Form */}
                <div className="glass-card p-6 h-fit sticky top-0">
                    <h3 className="font-bold text-lg mb-4">Start Discussion</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            required
                            placeholder="Topic Title"
                            className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            required
                            placeholder="What's on your mind?"
                            className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 min-h-[150px]"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <div className="flex items-center justify-between border border-border border-dashed rounded-xl p-3">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <label className="cursor-pointer bg-card hover:bg-white/10 p-2 rounded-lg transition-colors">
                                    <Paperclip size={18} />
                                    <input type="file" className="hidden" onChange={handleFileChange} />
                                </label>
                                {file && <span className="text-xs text-muted truncate">{file.name}</span>}
                            </div>
                        </div>

                        <button
                            disabled={uploading}
                            className="w-full bg-primary text-black font-black py-3 rounded-xl shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                            POST MESSAGE
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectDiscussion;
