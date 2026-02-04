import React, { useState } from 'react';
import { User, Lock, Mail, Save, Loader2 } from 'lucide-react';
import { userAPI } from '../services/api';

const Settings = ({ user, onUpdateUser }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            const { data } = await userAPI.updateProfile({
                name: formData.name,
                email: formData.email,
                ...(formData.password ? { password: formData.password } : {})
            });

            // Update local user state in App
            if (onUpdateUser) {
                // Keep the token, just update user data
                const currentUser = JSON.parse(localStorage.getItem('user'));
                const newUser = { ...currentUser, ...data };
                localStorage.setItem('user', JSON.stringify(newUser));
                onUpdateUser(newUser);
            }

            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

            <div className="glass-card p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary text-2xl font-bold border-4 border-background shadow-neon">
                            {user.name.charAt(0)}
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted tracking-wider">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                            <input
                                type="text"
                                className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted tracking-wider">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                            <input
                                type="email"
                                className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Lock size={18} />
                            Change Password
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted tracking-wider">New Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                    placeholder="Leave blank to keep current"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted tracking-wider">Confirm Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
                                    placeholder="Confirm new password"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-black font-bold py-4 rounded-xl shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            SAVE CHANGES
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
