import React from 'react';

const Navbar = ({ onNewTask, user }) => {
  return (
    <nav className="h-20 border-b border-border flex items-center justify-between px-8 bg-darkBg/50 backdrop-blur-md sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex items-center bg-slate-800/40 rounded-2xl px-4 py-2 w-96 border border-border focus-within:border-accentBlue/50 transition-all">
        <span className="text-slate-500 mr-2">🔍</span>
        <input 
          type="text" 
          placeholder="Search tasks..." 
          className="bg-transparent border-none outline-none text-sm text-slate-300 w-full placeholder:text-slate-600"
        />
      </div>
      
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <button className="text-slate-400 hover:text-white transition-colors relative">
          <span className="text-xl">🔔</span>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-darkBg"></span>
        </button>

        {/* Conditional "New Task" Button: Only shows if onNewTask prop is passed (Admin) */}
        {onNewTask ? (
          <button 
            onClick={onNewTask}
            className="bg-accentBlue hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 transition-all active:scale-95"
          >
            + New Task
          </button>
        ) : (
          <div className="px-4 py-2 bg-slate-800/30 rounded-xl border border-border">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Teammate View
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;