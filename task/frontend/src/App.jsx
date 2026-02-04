import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import CreateTaskModal from './components/CreateTaskModal';
import TaskCard from './components/TaskCard';
import TaskDetailsModal from './components/TaskDetailsModal';
import Login from './components/Login';
import { useTasks } from './hooks/useTasks';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [teammates, setTeammates] = useState([]);

  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks();

  // DERIVED STATE: This line is vital. It finds the LIVE task data every time 'tasks' updates.
  const selectedTask = tasks.find(t => t._id === selectedTaskId);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setTeammates(data);
      } catch (error) {
        console.error("Failed to fetch teammates:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedTaskId(null);
  };

  const filteredTasks = currentUser?.role === "admin"
    ? tasks
    : tasks.filter(task => task.assignedTo === currentUser?.username);

  if (!currentUser) return <Login onLogin={(user) => setCurrentUser(user)} />;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex font-sans">
      <Sidebar user={currentUser} onLogout={handleLogout} />

      <div className="flex-1 ml-64">
        <Navbar
          user={currentUser}
          onNewTask={currentUser.role === "admin" ? () => setIsModalOpen(true) : null}
        />

        <main className="p-8">
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                {currentUser.role === "admin" ? "Project Dashboard" : "My Tasks"}
              </h1>
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map(task => (
                <div
                  key={task._id}
                  onClick={() => setSelectedTaskId(task._id)}
                  className="cursor-pointer transition-all hover:-translate-y-1"
                >
                  <TaskCard
                    task={task}
                    isAdmin={currentUser.role === "admin"}
                    onDelete={deleteTask}
                    onToggleStatus={updateTask} // Also missing? No, updateTask is used in details. Let's add it here if needed or check TaskCard.
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {currentUser.role === "admin" && (
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTask={addTask}
          teammates={teammates}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask} // Passing the refreshed task object
          isOpen={!!selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={updateTask}
          isAdmin={currentUser.role === "admin"}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default App;