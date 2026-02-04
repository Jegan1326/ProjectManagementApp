import { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "./historycontext";

export const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within TaskProvider");
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [trash, setTrash] = useState([]);
  const historyContext = useContext(createContext());

  // Load from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedTrash = localStorage.getItem("trash");
    
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedTrash) setTrash(JSON.parse(storedTrash));
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("trash", JSON.stringify(trash));
  }, [trash]);

  const addTask = (formData) => {
    const newTask = {
      _id: Math.random().toString(36).substr(2, 9),
      ...formData,
      deleted: false,
    };
    setTasks([...tasks, newTask]);
    
    // Log to history
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const historyData = JSON.parse(localStorage.getItem("taskHistory") || "[]");
      historyData.unshift({
        id: Math.random().toString(36).substr(2, 9),
        action: "Created",
        taskTitle: formData.title,
        details: `Task created with status: ${formData.status}`,
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
      localStorage.setItem("taskHistory", JSON.stringify(historyData));
    } catch (e) {
      console.log("History logging skipped");
    }
    
    return newTask;
  };

  const editTask = (taskId, formData) => {
    const oldTask = tasks.find(t => t._id === taskId);
    setTasks(tasks.map(t => t._id === taskId ? { ...t, ...formData } : t));
    
    // Log to history
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const historyData = JSON.parse(localStorage.getItem("taskHistory") || "[]");
      historyData.unshift({
        id: Math.random().toString(36).substr(2, 9),
        action: "Updated",
        taskTitle: oldTask?.title,
        details: `Task updated: ${JSON.stringify(formData).slice(0, 50)}...`,
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
      localStorage.setItem("taskHistory", JSON.stringify(historyData));
    } catch (e) {
      console.log("History logging skipped");
    }
  };

  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t._id === taskId);
    if (taskToDelete) {
      setTasks(tasks.filter(t => t._id !== taskId));
      setTrash([...trash, { ...taskToDelete, deleted: true }]);
      
      // Log to history
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const historyData = JSON.parse(localStorage.getItem("taskHistory") || "[]");
        historyData.unshift({
          id: Math.random().toString(36).substr(2, 9),
          action: "Deleted",
          taskTitle: taskToDelete.title,
          details: "Task moved to trash",
          userId: user.id,
          userName: user.name,
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        });
        localStorage.setItem("taskHistory", JSON.stringify(historyData));
      } catch (e) {
        console.log("History logging skipped");
      }
    }
  };

  const restoreTask = (taskId) => {
    const taskToRestore = trash.find(t => t._id === taskId);
    if (taskToRestore) {
      setTrash(trash.filter(t => t._id !== taskId));
      setTasks([...tasks, { ...taskToRestore, deleted: false }]);
      
      // Log to history
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const historyData = JSON.parse(localStorage.getItem("taskHistory") || "[]");
        historyData.unshift({
          id: Math.random().toString(36).substr(2, 9),
          action: "Restored",
          taskTitle: taskToRestore.title,
          details: "Task restored from trash",
          userId: user.id,
          userName: user.name,
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        });
        localStorage.setItem("taskHistory", JSON.stringify(historyData));
      } catch (e) {
        console.log("History logging skipped");
      }
    }
  };

  const permanentlyDeleteTask = (taskId) => {
    const taskToDelete = trash.find(t => t._id === taskId);
    setTrash(trash.filter(t => t._id !== taskId));
    
    // Log to history
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const historyData = JSON.parse(localStorage.getItem("taskHistory") || "[]");
      historyData.unshift({
        id: Math.random().toString(36).substr(2, 9),
        action: "Permanently Deleted",
        taskTitle: taskToDelete?.title,
        details: "Task permanently deleted from trash",
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
      localStorage.setItem("taskHistory", JSON.stringify(historyData));
    } catch (e) {
      console.log("History logging skipped");
    }
  };

  const completeTask = (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    setTasks(tasks.map(t => t._id === taskId ? { ...t, status: 'completed' } : t));
    
    // Log to history
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const historyData = JSON.parse(localStorage.getItem("taskHistory") || "[]");
      historyData.unshift({
        id: Math.random().toString(36).substr(2, 9),
        action: "Completed",
        taskTitle: task?.title,
        details: "Task marked as completed",
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
      localStorage.setItem("taskHistory", JSON.stringify(historyData));
    } catch (e) {
      console.log("History logging skipped");
    }
  };

  const assignTask = (taskId, assignee) => {
    const task = tasks.find(t => t._id === taskId);
    setTasks(tasks.map(t => t._id === taskId ? { ...t, assignedTo: assignee } : t));
    
    // Log to history
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const historyData = JSON.parse(localStorage.getItem("taskHistory") || "[]");
      historyData.unshift({
        id: Math.random().toString(36).substr(2, 9),
        action: "Assigned",
        taskTitle: task?.title,
        details: `Task assigned to ${assignee}`,
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
      localStorage.setItem("taskHistory", JSON.stringify(historyData));
    } catch (e) {
      console.log("History logging skipped");
    }
  };

  const value = {
    tasks,
    trash,
    addTask,
    editTask,
    deleteTask,
    restoreTask,
    permanentlyDeleteTask,
    completeTask,
    assignTask,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
