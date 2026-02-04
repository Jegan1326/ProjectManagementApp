import { useState, useEffect } from 'react';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async (taskData) => {
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create task");
      }

      setTasks([data, ...tasks]);
      return true; // Success
    } catch (err) {
      console.error("Failed to create task:", err);
      alert(err.message);
      return false; // Failure
    }
  };

  const updateTask = async (id, updatedFields) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      const updatedTask = await res.json();

      // CRITICAL: This line forces the UI (and progress bar) to update
      setTasks(prev => prev.map(t => t._id === id ? updatedTask : t));
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t._id !== id));
  };

  return { tasks, loading, addTask, updateTask, deleteTask };
};