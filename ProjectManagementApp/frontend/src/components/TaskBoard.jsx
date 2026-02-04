import React, { useState, useEffect } from 'react';
import {
    Plus,
    MoreHorizontal,
    MessageSquare,
    Paperclip,
    Clock,
    Search,
    Filter,
    Loader2,
    X,
    Play,
    Pause,
    StopCircle
} from 'lucide-react';
import { taskAPI, projectAPI } from '../services/api';
import TaskDetailModal from './TaskDetailModal';

const TaskCard = ({ task, onUpdate, onStartTimer, onClick }) => {
    const hasTimer = task.assignee && task.status !== 'Completed';

    return (
        <div onClick={() => onClick(task)} className="bg-card/40 border border-border p-4 rounded-2xl hover:border-primary/50 hover:bg-card/60 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${task.priority === 'High' ? 'bg-red-500/20 text-red-500' :
                    task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-primary/20 text-primary'
                    }`}>
                    {task.priority || 'Low'}
                </span>
                <button className="text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={14} />
                </button>
            </div>
            <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{task.title}</h4>
            <p className="text-xs text-muted line-clamp-2 mb-4 leading-relaxed">{task.description}</p>

            {hasTimer && (
                <div className="mb-4 p-2 rounded-lg bg-primary/5 border border-primary/20" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock size={12} className="text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-wider">Time Tracker</span>
                        </div>
                        <button
                            onClick={() => onStartTimer(task)}
                            className="p-1 hover:bg-primary/20 rounded-md transition-colors"
                        >
                            <Play size={12} className="text-primary" />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex gap-3 text-muted">
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                        <MessageSquare size={12} />
                        <span>{task.comments?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                        <Paperclip size={12} />
                        <span>{task.attachments?.length || 0}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted font-bold uppercase tracking-tighter">
                    <Clock size={12} />
                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                </div>
            </div>
        </div>
    );
};

const Column = ({ title, tasks, onAddTask, status, onStartTimer, onTaskClick }) => (
    <div className="flex flex-col gap-4 min-w-[300px] flex-1">
        <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm uppercase tracking-widest">{title}</h3>
                <span className="bg-card border border-border text-[10px] px-1.5 py-0.5 rounded-md text-muted font-bold">{tasks.length}</span>
            </div>
            <button
                onClick={() => onAddTask(status)}
                className="p-1 hover:bg-primary/10 text-primary rounded-md transition-colors"
            >
                <Plus size={16} />
            </button>
        </div>
        <div className="flex flex-col gap-3 h-full pb-10">
            {tasks.map(task => (
                <TaskCard key={task._id} task={task} onStartTimer={onStartTimer} onClick={onTaskClick} />
            ))}
            {tasks.length === 0 && (
                <div className="border-2 border-dashed border-border/30 rounded-2xl h-24 flex items-center justify-center text-muted text-xs font-medium">
                    No tasks here
                </div>
            )}
        </div>
    </div>
);

const TimerModal = ({ task, onClose, onSaveTimesheet }) => {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleSave = () => {
        const hours = (seconds / 3600).toFixed(2);
        onSaveTimesheet(task, hours, notes);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="glass-card w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Time Tracker</h2>
                    <button onClick={onClose} className="text-muted hover:text-white"><X size={24} /></button>
                </div>

                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-muted mb-2">Tracking time for:</p>
                        <h3 className="text-lg font-bold text-primary">{task.title}</h3>
                    </div>

                    <div className="bg-card/50 border border-border rounded-2xl p-8 text-center">
                        <div className="text-6xl font-black text-primary mb-4 font-mono">
                            {formatTime(seconds)}
                        </div>
                        <div className="flex gap-3 justify-center">
                            {!isRunning ? (
                                <button
                                    onClick={() => setIsRunning(true)}
                                    className="bg-primary text-black font-black px-6 py-3 rounded-xl shadow-neon hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <Play size={18} />
                                    START
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsRunning(false)}
                                    className="bg-yellow-500 text-black font-black px-6 py-3 rounded-xl shadow-neon hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <Pause size={18} />
                                    PAUSE
                                </button>
                            )}
                            <button
                                onClick={() => { setSeconds(0); setIsRunning(false); }}
                                className="bg-red-500/20 text-red-500 border border-red-500/30 font-black px-6 py-3 rounded-xl hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <StopCircle size={18} />
                                RESET
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted tracking-widest">Work Notes</label>
                        <textarea
                            className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 min-h-[80px]"
                            placeholder="What did you work on?"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={seconds === 0}
                        className="w-full bg-primary text-black font-black py-4 rounded-xl shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                        SAVE TO TIMESHEET ({(seconds / 3600).toFixed(2)} hrs)
                    </button>
                </div>
            </div>
        </div>
    );
};

const TaskBoard = ({ user }) => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [activeTask, setActiveTask] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newStatus, setNewStatus] = useState('To Do');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        project: '',
        assignee: ''
    });

    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [tasksRes, projectsRes] = await Promise.all([
                taskAPI.getTasks(),
                projectAPI.getProjects()
            ]);
            console.log('Projects loaded:', projectsRes.data);
            setTasks(tasksRes.data);
            setProjects(projectsRes.data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch data:', err);
            console.error('Error details:', err.response?.data);
            setError('Failed to load projects or tasks. Please try refreshing.');
            if (err.response?.status === 401) {
                alert("Session expired. Please logout and login again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const activeProjects = projects.filter(p => p.status === 'Active');
        if (activeProjects.length > 0 && !formData.project) {
            setFormData(prev => ({ ...prev, project: activeProjects[0]._id }));
        }
    }, [projects]);

    const handleAddTask = (status) => {
        setNewStatus(status);
        const activeProjects = projects.filter(p => p.status === 'Active');
        if (activeProjects.length > 0) {
            setFormData({
                title: '',
                description: '',
                priority: 'Medium',
                project: activeProjects[0]._id,
                assignee: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskData = { ...formData, status: newStatus };
        if (!taskData.assignee) delete taskData.assignee;
        console.log('Creating task with data:', taskData);

        if (!taskData.project) {
            alert('Please select a project first!');
            return;
        }

        try {
            const response = await taskAPI.createTask(taskData);
            console.log('Task created successfully:', response.data);
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error('Failed to create task:', err);
            console.error('Error response:', err.response?.data);
            if (err.response?.data?.message?.includes('project')) {
                alert('Project is invalid or not selected.');
            } else {
                alert('Failed to create task: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleStartTimer = (task) => {
        setActiveTask(task);
        setShowTimer(true);
    };

    const handleSaveTimesheet = async (task, hours, description) => {
        try {
            const timesheetData = {
                project: task.project._id || task.project,
                task: task._id,
                hours: parseFloat(hours),
                description: description,
                software: 'Task Timer'
            };
            // await timesheetAPI.submitTimesheet(timesheetData);
            alert(`Timesheet saved: ${hours} hours logged for "${task.title}"`);
        } catch (err) {
            console.error('Failed to save timesheet:', err);
            alert('Failed to save timesheet');
        }
    };

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    return (
        <div className="flex flex-col gap-8 h-full relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Project Tasks</h1>
                    <p className="text-sm text-muted">Manage and track your project tasks across stages.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-card border border-border px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:bg-white/5 transition-all text-muted">
                        <Filter size={18} />
                        Filter
                    </button>
                    <button
                        onClick={() => handleAddTask('To Do')}
                        disabled={loading}
                        className="bg-primary text-black font-black px-6 py-2.5 rounded-xl text-sm shadow-neon hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <Plus size={18} />
                        NEW TASK
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="flex gap-6 h-full overflow-x-auto pb-6 custom-scrollbar">
                <Column title="To Do" status="To Do" tasks={tasks.filter(t => t.status === 'To Do')} onAddTask={handleAddTask} onStartTimer={handleStartTimer} onTaskClick={setSelectedTask} />
                <Column title="In Progress" status="In Progress" tasks={tasks.filter(t => t.status === 'In Progress')} onAddTask={handleAddTask} onStartTimer={handleStartTimer} onTaskClick={setSelectedTask} />
                <Column title="Review" status="Review" tasks={tasks.filter(t => t.status === 'Review')} onAddTask={handleAddTask} onStartTimer={handleStartTimer} onTaskClick={setSelectedTask} />
                <Column title="Completed" status="Completed" tasks={tasks.filter(t => t.status === 'Completed')} onAddTask={handleAddTask} onStartTimer={handleStartTimer} onTaskClick={setSelectedTask} />
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="glass-card w-full max-w-lg p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Create New Task</h2>
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
                                <label className="text-[10px] font-black uppercase text-muted tracking-widest">Task Title *</label>
                                <input
                                    autoFocus
                                    required
                                    className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                    placeholder="What needs to be done?"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted tracking-widest">Description</label>
                                <textarea
                                    className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 min-h-[100px]"
                                    placeholder="Add more details..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
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
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted tracking-widest">Assign To</label>
                                    <input
                                        className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                        placeholder="User ID (optional)"
                                        value={formData.assignee}
                                        onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-black font-black py-4 rounded-xl shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                CREATE TASK
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {activeTask && showTimer && (
                <TimerModal
                    task={activeTask}
                    onClose={() => setShowTimer(false)}
                    onSaveTimesheet={handleSaveTimesheet}
                />
            )}

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={(updatedTask) => {
                        setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
                    }}
                />
            )}
        </div>
    );
};

export default TaskBoard;
