import React, { useState, useEffect } from 'react';
import {
    FileText,
    File,
    Trash2,
    Download,
    Filter,
    Search,
    Plus,
    Upload
} from 'lucide-react';
import { documentAPI, projectAPI, uploadAPI } from '../services/api';

const DocumentManager = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        projectAPI.getProjects().then(({ data }) => {
            setProjects(data);
            if (data.length > 0) setSelectedProject(data[0]._id);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchDocuments();
        }
    }, [selectedProject]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const { data } = await documentAPI.getDocuments(selectedProject);
            setDocuments(data);
        } catch (err) {
            console.error('Failed to fetch documents:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Upload file itself
            const formData = new FormData();
            formData.append('file', file);
            const uploadRes = await uploadAPI.uploadFile(formData);
            const { fileUrl, originalname, mimetype, size } = uploadRes.data;

            // 2. Create document record
            await documentAPI.createDocument(selectedProject, {
                name: originalname,
                originalName: originalname,
                fileUrl,
                fileType: mimetype,
                size
            });

            fetchDocuments();
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await documentAPI.deleteDocument(id);
            setDocuments(documents.filter(d => d._id !== id));
        } catch (err) {
            alert('Failed to delete document');
        }
    };

    const handleUploadVersion = async (docId, file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            await documentAPI.uploadVersion(docId, formData);
            alert('New version uploaded!');
            // Refresh
            const { data } = await documentAPI.getDocuments(selectedProject);
            setDocuments(data);
        } catch (err) {
            console.error(err);
            alert('Failed to upload version');
        }
    };

    const getFileIcon = (mimeType) => {
        if (mimeType.includes('image')) return <FileImage className="text-purple-400" size={24} />;
        if (mimeType.includes('pdf')) return <FileText className="text-red-400" size={24} />;
        if (mimeType.includes('code') || mimeType.includes('javascript') || mimeType.includes('html')) return <FileCode className="text-blue-400" size={24} />;
        return <File className="text-gray-400" size={24} />;
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const filteredDocs = documents.filter(doc => {
        const matchesFilter = filter === 'All' ||
            (filter === 'Images' && doc.fileType.includes('image')) ||
            (filter === 'Documents' && doc.fileType.includes('pdf'));
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Documents</h1>
                    <p className="text-sm text-muted">Central repository for all your project files.</p>
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

            {/* Actions Bar */}
            <div className="flex justify-between items-center bg-card/30 p-4 rounded-2xl border border-border">
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                        <input
                            placeholder="Search files..."
                            className="bg-background/50 border border-border rounded-xl py-2 pl-9 pr-4 text-sm w-64 focus:outline-none focus:border-primary/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 text-sm bg-background/50 p-1 rounded-xl border border-border">
                        {['All', 'Images', 'Documents'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg transition-colors ${filter === f ? 'bg-primary text-black font-bold' : 'text-muted hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <label className={`
                    bg-primary text-black font-black px-6 py-2.5 rounded-xl text-sm shadow-neon 
                    hover:scale-105 transition-all flex items-center gap-2 cursor-pointer
                    ${uploading ? 'opacity-50 pointer-events-none' : ''}
                `}>
                    {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                    UPLOAD FILE
                </label>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={40} /></div>
                ) : filteredDocs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted">
                        <File className="w-12 h-12 mb-4 opacity-20" />
                        <p>No documents found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredDocs.map(doc => (
                            <div key={doc._id} className="glass-card p-4 group hover:bg-card/80 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-background/50 p-3 rounded-xl">
                                        {getFileIcon(doc.fileType)}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={doc.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 hover:bg-white/10 rounded-lg text-muted hover:text-primary"
                                            title="Download"
                                        >
                                            <Download size={16} />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(doc._id)}
                                            className="p-1.5 hover:bg-white/10 rounded-lg text-muted hover:text-red-500"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-bold text-sm mb-1 truncate" title={doc.name}>{doc.name}</h3>
                                <div className="flex justify-between items-end text-xs text-muted">
                                    <div>
                                        <p>{formatSize(doc.size)}</p>
                                        <p>{new Date(doc.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className="bg-white/5 px-2 py-0.5 rounded text-[10px]">v{doc.version}</span>
                                </div>
                                <div className="mt-3 pt-3 border-t border-border/50 text-[10px] text-muted flex items-center gap-1">
                                    <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {doc.uploader?.name?.[0]}
                                    </span>
                                    Uploaded by {doc.uploader?.name}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentManager;
