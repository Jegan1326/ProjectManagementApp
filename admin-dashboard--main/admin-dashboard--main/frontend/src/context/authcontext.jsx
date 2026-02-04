import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedRole && storedToken) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData, userRole, token) => {
    setUser(userData);
    setRole(userRole);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userRole);
    localStorage.setItem("token", token);
    
    // Log user login to history
    try {
      const userHistory = JSON.parse(localStorage.getItem("userHistory") || "[]");
      userHistory.unshift({
        id: Math.random().toString(36).substr(2, 9),
        action: "Login",
        userName: userData.name,
        userRole: userRole,
        details: `${userData.name} logged in as ${userRole}`,
        userId: userData.id,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
      localStorage.setItem("userHistory", JSON.stringify(userHistory));
    } catch (e) {
      console.log("History logging skipped");
    }
  };

  const logout = () => {
    const currentUser = user?.name || "User";
    
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    
    // Log user logout to history
    try {
      const userHistory = JSON.parse(localStorage.getItem("userHistory") || "[]");
      userHistory.unshift({
        id: Math.random().toString(36).substr(2, 9),
        action: "Logout",
        userName: currentUser,
        userRole: role,
        details: `${currentUser} logged out`,
        userId: user?.id,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
      localStorage.setItem("userHistory", JSON.stringify(userHistory));
    } catch (e) {
      console.log("History logging skipped");
    }
  };

  const value = {
    user,
    role,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
