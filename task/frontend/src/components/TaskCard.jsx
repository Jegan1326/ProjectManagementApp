import React from 'react';

const TaskCard = ({ task, onDelete, onToggleStatus, isAdmin }) => {
  // Color coding for Priority levels
  const priorityStyles = {
    High: "text-red-400 bg-red-400/10 border-red-400/20",
    Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
  };

  // Visual indicators for Status tracking
  const statusStyles = {
    "Todo": "border-slate-500 text-slate-400",
    "In Progress": "border-accentBlue text-accentBlue shadow-[0_0_10px_rgba(59,130,246,0.2)]",
    "Done": "border-green-500 text-green-500"
  };

  return (
    <div className="bg-darkCard border border-border p-6 rounded-2xl hover:border-accentBlue/40 transition-all duration-300 group flex flex-col h-full relative">
      {/* Top Row: Priority and Admin Actions */}
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>

        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task._id);
            }}
            className="text-slate-600 hover:text-red-500 transition-colors p-1"
            title="Delete Task"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Title & Description */}
      <h4 className="text-white font-bold text-lg mb-2 group-hover:text-accentBlue transition-colors">
        {task.title}
      </h4>
      <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
        {task.description || "No description provided."}
      </p>

      {/* Assigned Teammate Info */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 border border-slate-600">
          {task.assignedTo ? task.assignedTo.charAt(0) : '?'}
        </div>
        <span className="text-[11px] text-slate-500">
          {task.assignedTo || 'Unassigned'}
        </span>
      </div>

      {/* Bottom Row: Status Toggle and Due Date */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        {/* MODIFIED BUTTON: Disabled for Admin */}
        <button
          disabled={isAdmin} // Stops the click entirely if Admin
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(task._id, task.status);
          }}
          className={`text-[11px] font-bold border px-3 py-1 rounded-lg transition-all 
            ${isAdmin ? 'cursor-default opacity-80' : 'active:scale-95 hover:bg-slate-800'} 
            ${statusStyles[task.status]}`}
        >
          {task.status}
        </button>

        <div className="flex items-center text-[11px] text-slate-500 font-medium whitespace-nowrap gap-2">
          <span className="mr-0.5">📅</span>
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB') : 'NO DATE'}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;