import React, { useState, useEffect } from 'react';
import { Mail, HelpCircle, LogOut, Sun, Bell, Globe, RefreshCcw, CheckCircle, AlertCircle } from 'lucide-react';
import Sidebar from './Sidebar';
import { notificationAPI, taskAPI, userAPI } from '../services/api';

const Layout = ({ children, currentView, onNavigate, user, onLogout }) => {
    const [notifications, setNotifications] = useState([]);
    const [recentTasks, setRecentTasks] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notifRes, taskRes, userRes] = await Promise.all([
                    notificationAPI.getNotifications(),
                    taskAPI.getTasks(),
                    userAPI.getUsers()
                ]);
                setNotifications(notifRes.data.slice(0, 5));
                setRecentTasks(taskRes.data.slice(0, 5));
                setTeamMembers(userRes.data.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch sidebar data", error);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="flex h-screen bg-background text-white overflow-hidden">
            <Sidebar currentView={currentView} onNavigate={onNavigate} user={user} />
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-border px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('Overview')}>Dashboards</span>
                        <span>/</span>
                        <span className="text-white">{currentView}</span>
                    </div>
                    <div className="flex items-center gap-6 text-muted">
                        <div className="flex items-center gap-4 border-r border-border pr-6">
                            <button className="hover:text-primary transition-colors"><Sun size={18} /></button>
                            <button className="hover:text-primary transition-colors"><RefreshCcw size={18} /></button>
                            <button className="hover:text-primary transition-colors relative">
                                <Bell size={18} />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                            </button>
                            <button className="hover:text-primary transition-colors"><Globe size={18} /></button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
                                <p className="text-[10px] text-muted mt-1 uppercase font-black tracking-tighter">{user?.role}</p>
                            </div>
                            <button
                                onClick={onLogout}
                                className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:border-red-500/50 hover:text-red-500 transition-all group"
                                title="Logout"
                            >
                                <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </div>
            </main>
            <aside className="w-72 border-l border-border bg-sidebar hidden xl:block p-6 overflow-y-auto">
                <div className="space-y-8">
                    <div>
                        <h3 className="font-semibold mb-4">Notifications</h3>
                        <div className="space-y-4">
                            {notifications.length === 0 ? (
                                <p className="text-xs text-muted">No new notifications</p>
                            ) : (
                                notifications.map((n, i) => (
                                    <div key={n._id || i} className="flex gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center border border-border">
                                            <Bell size={14} className="text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white/90 line-clamp-2 text-xs">{n.message}</p>
                                            <p className="text-[10px] text-muted">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Recent Tasks</h3>
                        <div className="space-y-4 border-l border-border ml-2 pl-4">
                            {recentTasks.length === 0 ? (
                                <p className="text-xs text-muted pl-2">No recent tasks</p>
                            ) : (
                                recentTasks.map((task, i) => (
                                    <div key={task._id || i} className="relative py-1">
                                        <div className={`absolute -left-[21px] top-2 w-2 h-2 rounded-full shadow-neon ${task.status === 'Completed' ? 'bg-green-500' : 'bg-primary'}`}></div>
                                        <p className="text-sm text-white/90 truncate">{task.title}</p>
                                        <p className="text-[10px] text-muted">
                                            {task.status} • {new Date(task.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 flex justify-between items-center">
                            Team Members
                        </h3>
                        <div className="space-y-1">
                            {teamMembers.map((member, i) => (
                                <div
                                    key={member._id || i}
                                    className={`flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-card text-muted hover:text-white`}
                                >
                                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-[10px] text-white overflow-hidden">
                                        {member.avatar ? (
                                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{member.name?.charAt(0)}</span>
                                        )}
                                    </div>
                                    <span className="text-xs font-medium flex-1 truncate">{member.name}</span>
                                    <div className="flex gap-2 text-muted hover:text-white cursor-pointer">
                                        <Mail size={12} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Layout;
