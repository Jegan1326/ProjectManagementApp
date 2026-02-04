import React, { useState, useEffect } from 'react';
import {
    Users,
    Trash2,
    Shield,
    Search,
    Loader2,
    Briefcase
} from 'lucide-react';
import { userAPI } from '../services/api';

const UserManagement = ({ currentUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await userAPI.getUsers();
                setUsers(data);
            } catch (err) {
                console.error('Failed to load users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await userAPI.deleteUser(id);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    return (
        <div className="flex flex-col h-full gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-1">User Management</h1>
                    <p className="text-sm text-muted">Manage system access and roles.</p>
                </div>
            </div>

            <div className="glass-card p-6 flex items-center gap-4">
                <Search className="text-muted" size={20} />
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar pb-4">
                {filteredUsers.map(user => (
                    <div key={user._id} className="glass-card p-6 relative group hover:border-primary/50 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{user.name}</h3>
                                    <p className="text-xs text-muted">{user.email}</p>
                                </div>
                            </div>
                            {user.role === 'Admin' ? (
                                <Shield size={16} className="text-yellow-500" />
                            ) : user.role === 'Client' ? (
                                <Briefcase size={16} className="text-purple-500" />
                            ) : (
                                <Users size={16} className="text-blue-500" />
                            )}
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${user.role === 'Admin' ? 'bg-yellow-500/10 text-yellow-500' :
                                    user.role === 'Client' ? 'bg-purple-500/10 text-purple-500' :
                                        'bg-blue-500/10 text-blue-500'
                                }`}>
                                {user.role}
                            </span>

                            {/* Only Admins can delete others, but not themselves */}
                            {currentUser.role === 'Admin' && user._id !== currentUser._id && (
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserManagement;
