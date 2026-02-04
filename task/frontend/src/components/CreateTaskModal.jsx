import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const CreateTaskModal = ({ isOpen, onClose, onAddTask, teammates = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.assignedTo) return alert("Please assign this task to a teammate.");

    onAddTask(formData);

    // Reset form
    setFormData({ title: '', description: '', priority: 'Medium', dueDate: '', assignedTo: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#1e293b] w-full max-w-lg p-8 rounded-3xl border border-slate-800 shadow-2xl transition-all">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Create New Task</h2>
            <p className="text-slate-500 text-xs mt-1">Assign responsibilities to your team</p>
          </div>
          <button onClick={onClose} className="bg-slate-800 text-slate-400 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Task Title</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3.5 text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-700"
              placeholder="e.g., Fix Navigation Bug"
            />
          </div>

          {/* Assignment */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Assign To</label>
            <div className="relative">
              <select
                required
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3.5 text-white outline-none appearance-none cursor-pointer font-medium focus:border-blue-500 transition-all"
              >
                <option value="" disabled>Choose a team member...</option>
                {teammates
                  .filter(u => u.role !== 'admin')
                  .map(user => (
                    <option key={user._id} value={user.username}>
                      {user.username}
                    </option>
                  ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3.5 text-white focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            {/* Due Date */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Due Date</label>
              <DatePicker
                selected={formData.dueDate ? new Date(formData.dueDate) : null}
                onChange={(date) => setFormData({ ...formData, dueDate: date ? date.toISOString() : '' })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={5}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3.5 text-white focus:border-blue-500 outline-none cursor-pointer"
                placeholderText="Select date and time"
                calendarClassName="dark-calendar"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3.5 text-white focus:border-blue-500 outline-none h-28 resize-none placeholder:text-slate-700"
              placeholder="What needs to be done?"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-3 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/30 transition-all active:scale-95">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;