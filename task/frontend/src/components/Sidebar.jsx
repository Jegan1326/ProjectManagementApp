import React from 'react';

const Sidebar = ({ user, onLogout, activeTab, setActiveTab }) => {
  // 1. Safety Check: If user is missing, don't crash the app
  if (!user) return <div className="w-64 bg-[#1e293b] h-screen border-r border-slate-800"></div>;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'tasks', label: 'My Tasks', icon: '📋' },
    { id: 'team', label: 'Team Members', icon: '👥' },
  ];

  return (
    <aside className="w-64 bg-[#1e293b] text-slate-300 fixed h-full p-6 flex flex-col justify-between border-r border-slate-800 shadow-xl">
      <div>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20">
            T
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Taskly</h2>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* User Section - The part that was likely crashing */}
      <div className="pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-6 px-2">
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}`} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full border-2 border-slate-700"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user.username || 'User'}</p>
            <p className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">{user.role || 'Member'}</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;