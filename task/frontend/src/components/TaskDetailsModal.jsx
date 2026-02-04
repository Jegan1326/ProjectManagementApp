import React, { useState } from 'react';

const TaskDetailsModal = ({ task, isOpen, onClose, onUpdate, isAdmin, currentUser }) => {
  const [newSubTask, setNewSubTask] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newAttachmentName, setNewAttachmentName] = useState("");
  const [newAttachmentUrl, setNewAttachmentUrl] = useState("");
  const [activeTab, setActiveTab] = useState('Comments');

  if (!isOpen || !task) return null;

  // Destructure with defaults to ensure .map() never breaks
  const { subTasks = [], comments = [], history = [], attachments = [] } = task;

  const completedCount = subTasks.filter(st => st.completed).length;
  const progress = subTasks.length > 0 ? Math.round((completedCount / subTasks.length) * 100) : 0;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentData = {
      text: newComment,
      user: currentUser?.username || "Teammate",
      timestamp: new Date().toISOString()
    };

    await onUpdate(task._id, {
      comments: [...comments, commentData],
      history: [...history, { action: `${currentUser?.username} commented`, timestamp: new Date() }]
    });
    setNewComment("");
  };

  const toggleSubTask = (index) => {
    if (isAdmin) return; // Restrict Admin
    const updated = subTasks.map((st, i) => i === index ? { ...st, completed: !st.completed } : st);
    onUpdate(task._id, { subTasks: updated });
  };

  const handleAddSubTask = (e) => {
    e.preventDefault();
    // if (isAdmin) return; // REMOVED: Admin should be able to ADD tasks, just not complete them.
    if (!newSubTask.trim()) return;
    onUpdate(task._id, {
      subTasks: [...subTasks, { text: newSubTask, completed: false }]
    });
    setNewSubTask("");
  };

  const handleStatusChange = (e) => {
    onUpdate(task._id, { status: e.target.value });
  };

  // Status colors helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'Todo': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'In Progress': return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'Review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const handleAddAttachment = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', currentUser?.username || "Teammate");

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${task._id}/attachments`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const updatedTask = await response.json();
        onUpdate(task._id, { attachments: updatedTask.attachments, history: updatedTask.history });
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#1e293b] w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-800 shadow-2xl flex flex-col">

        {/* Header */}
        <div className="p-8 pb-4 border-b border-slate-800/50">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              {/* Status Badge / Dropdown */}
              {!isAdmin ? (
                <select
                  value={task.status}
                  onChange={handleStatusChange}
                  className={`text-[10px] font-bold px-3 py-1 rounded-lg uppercase border appearance-none cursor-pointer outline-none bg-[#0f172a] ${getStatusColor(task.status)}`}
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
              ) : (
                <span className={`text-[10px] font-bold px-3 py-1 rounded-lg uppercase border ${getStatusColor(task.status)}`}>{task.status}</span>
              )}

              <span className="text-slate-500 text-xs italic">@{task.assignedTo}</span>
              <span className="text-slate-500 text-xs italic">@{task.assignedTo}</span>
            </div>
            <div className="flex items-center gap-4">
              {task.isReassigned && (
                <div className="bg-red-600 items-center justify-center flex px-3 py-1 rounded-lg shadow-lg shadow-red-500/20">
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">Reassigned</span>
                </div>
              )}
              {task.dueDate && (
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Due</span>
                  <span className={`text-xs font-medium ${new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'text-red-400' : 'text-slate-300'}`}>
                    {new Date(task.dueDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
              )}
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-all text-xl">✕</button>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">{task.title}</h2>

          <div className="flex gap-6">
            {['Comments', 'Attachments', 'Checklist', 'History'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-6">

          {/* COMMENTS SECTION */}
          {activeTab === 'Comments' && (
            <div className="flex flex-col h-full min-h-[400px]">
              <div className="flex-1 space-y-6 mb-6 overflow-y-auto pr-2">
                {comments.length > 0 ? comments.map((c, i) => (
                  <div key={i} className={`flex gap-3 ${c.user === currentUser?.username ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar Placeholder */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${c.user === currentUser?.username ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                      {c.user.charAt(0).toUpperCase()}
                    </div>

                    <div className={`flex flex-col ${c.user === currentUser?.username ? 'items-end' : 'items-start'} max-w-[80%]`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-slate-400">{c.user === currentUser?.username ? 'You' : c.user}</span>
                        <span className="text-[10px] text-slate-600">{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${c.user === currentUser?.username ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}`}>
                        {c.text}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2 opacity-50">
                    <span className="text-4xl">💬</span>
                    <span className="text-xs italic">Start the conversation...</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-3 sticky bottom-0 bg-[#1e293b] pt-4 border-t border-slate-800/50">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                  placeholder="Type your message..."
                />
                <button type="submit" disabled={!newComment.trim()} className="bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </form>
            </div>
          )}

          {/* ATTACHMENTS SECTION */}
          {activeTab === 'Attachments' && (
            <div className="space-y-6">
              <div className="space-y-3">
                {attachments.length > 0 ? attachments.map((att, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#0f172a]/60 p-4 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                        🖇️
                      </div>
                      <div>
                        <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline font-medium block">{att.name}</a>
                        <span className="text-[10px] text-slate-500 uppercase">{att.uploadedBy}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-600">{new Date(att.timestamp).toLocaleDateString()}</span>
                  </div>
                )) : (
                  <div className="text-center py-10 text-slate-600 italic text-xs">No attachments yet.</div>
                )}
              </div>

              <div className="bg-[#0f172a] p-4 rounded-2xl border border-dashed border-slate-700 mt-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Upload New File</h4>

                {/* Hidden File Input */}
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleAddAttachment(e.target.files[0]);
                  }}
                />

                {/* Custom Upload Button */}
                <label
                  htmlFor="file-upload"
                  className="w-full flex items-center justify-center bg-blue-600 py-3 rounded-xl text-xs font-bold text-white hover:bg-blue-500 transition-all cursor-pointer gap-2"
                >
                  <span>☁️</span> Upload File
                </label>
              </div>
            </div>
          )}

          {/* CHECKLIST SECTION */}
          {activeTab === 'Checklist' && (
            <div className="space-y-6">
              <div className="bg-[#0f172a]/40 p-5 rounded-2xl border border-slate-800/50">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-2"><span>Progress</span><span>{progress}%</span></div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="space-y-3">
                {subTasks.map((st, i) => (
                  <div key={i} onClick={() => toggleSubTask(i)} className="flex items-center bg-[#0f172a]/60 p-4 rounded-xl border border-slate-800 cursor-pointer hover:border-blue-500/30 transition-all group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center mr-4 ${st.completed ? 'bg-green-500 border-green-500' : 'border-slate-700 group-hover:border-slate-500'}`}>
                      {st.completed && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <span className={`text-sm ${st.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{st.text}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddSubTask} className="flex gap-2 bg-[#0f172a] p-2 rounded-2xl border border-dashed border-slate-700 mt-4">
                <input value={newSubTask} onChange={(e) => setNewSubTask(e.target.value)} className="flex-1 bg-transparent px-4 text-sm text-white outline-none" placeholder="Add requirement..." />
                <button type="submit" className="bg-blue-600 px-4 py-2 rounded-xl text-xs font-bold text-white hover:bg-blue-500">Add</button>
              </form>
            </div>
          )}

          {/* HISTORY SECTION */}
          {activeTab === 'History' && (
            <div className="space-y-4 border-l border-slate-800 ml-2 pl-6">
              {history.slice().reverse().map((h, i) => (
                <div key={i} className="relative mb-6">
                  <div className="absolute -left-[30px] top-1 w-2 h-2 rounded-full bg-blue-500" />
                  <p className="text-xs text-slate-300 font-medium">{h.action}</p>
                  <p className="text-[10px] text-slate-500 uppercase mt-1">{new Date(h.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;