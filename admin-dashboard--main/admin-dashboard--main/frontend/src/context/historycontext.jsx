import { createContext, useContext, useState, useEffect } from "react";

export const HistoryContext = createContext();

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within HistoryProvider");
  }
  return context;
};

export const HistoryProvider = ({ children }) => {
  const [taskHistory, setTaskHistory] = useState([]);
  const [userHistory, setUserHistory] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedTaskHistory = localStorage.getItem("taskHistory");
    const storedUserHistory = localStorage.getItem("userHistory");
    
    if (storedTaskHistory) setTaskHistory(JSON.parse(storedTaskHistory));
    if (storedUserHistory) setUserHistory(JSON.parse(storedUserHistory));
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem("taskHistory", JSON.stringify(taskHistory));
  }, [taskHistory]);

  useEffect(() => {
    localStorage.setItem("userHistory", JSON.stringify(userHistory));
  }, [userHistory]);

  const addTaskHistory = (action, taskTitle, details, userId, userName) => {
    const record = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      taskTitle,
      details,
      userId,
      userName,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    setTaskHistory([record, ...taskHistory]);
  };

  const addUserHistory = (action, userName, userRole, details, userId) => {
    const record = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      userName,
      userRole,
      details,
      userId,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    setUserHistory([record, ...userHistory]);
  };

  const clearTaskHistory = () => {
    setTaskHistory([]);
  };

  const clearUserHistory = () => {
    setUserHistory([]);
  };

  const value = {
    taskHistory,
    userHistory,
    addTaskHistory,
    addUserHistory,
    clearTaskHistory,
    clearUserHistory,
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};
