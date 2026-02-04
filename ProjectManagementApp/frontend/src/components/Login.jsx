import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('password123');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await authAPI.login({ email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            onLoginSuccess(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <div className="w-full max-w-md z-10">
                <div className="glass-card p-10 backdrop-blur-3xl border-white/10 shadow-2xl relative">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-black shadow-neon mb-6">
                            <span className="text-2xl font-black">PM</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-muted text-sm uppercase tracking-widest font-bold">Project Management Suite</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-card/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all focus:bg-card"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-card/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all focus:bg-card"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-black font-black py-4 rounded-2xl shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
                            SIGN IN
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-xs text-muted font-medium">
                            Don't have an account? <span className="text-primary cursor-pointer hover:underline font-bold">Contact Admin</span>
                        </p>
                    </div>

                    {/* Footer decoration */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary/20 blur-sm rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default Login;
