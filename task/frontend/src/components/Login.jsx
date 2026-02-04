import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Fetching from your local backend
      const response = await fetch('http://localhost:5000/api/users');
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const users = await response.json();
      
      // DEBUGGING: Check your F12 Console. If 'password' is missing here, login will fail.
      console.log("Users fetched from DB:", users);

      if (users.length === 0) {
        setError('No users found in database.');
        return;
      }

      // 1. Check if the first user even has a password field
      if (users[0] && !users[0].hasOwnProperty('password')) {
        setError('Backend Error: Password field is hidden. Update your User Route with .select("+password")');
        return;
      }

      // 2. Perform the match
      const foundUser = users.find(u => 
        u.username?.trim().toLowerCase() === username.trim().toLowerCase() && 
        u.password?.toString() === password.toString()
      );

      if (foundUser) {
        onLogin(foundUser);
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError('Connection failed. Is the backend running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans text-slate-200">
      <div className="bg-[#1e293b] p-10 rounded-3xl border border-slate-800 w-full max-w-md shadow-2xl transition-all hover:border-slate-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg shadow-blue-900/40">
            T
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Login</h1>
          <p className="text-slate-400 mt-2 text-sm">Enter credentials from your Atlas database</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl mb-6 text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
              Username
            </label>
            <input 
              type="text" 
              className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
          <p className="text-slate-600 text-[10px] tracking-widest uppercase">
            System Online • Secure Connection
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;