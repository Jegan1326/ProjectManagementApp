import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Navbar } from './components/Navbar';
import { Login } from './pages/LoginPage';
import { Register } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { CreateProject } from './pages/CreateProject';
import { ProjectDetail } from './pages/ProjectDetail';
import { AdminRequests } from './pages/AdminRequests';
import { AdminDashboard } from './pages/AdminDashboard';
import { TaskAssignment } from './pages/TaskAssignment';
import './styles/app.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <div>
                  <Navbar />
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/create-project" element={<CreateProject />} />
                    <Route path="/project/:id" element={<ProjectDetail />} />
                    <Route path="/admin/requests" element={<AdminRequests />} />
                    <Route path="/pm/projects" element={<Dashboard />} />
                    <Route path="/pm/task-assignment" element={<TaskAssignment />} />
                    <Route path="/employee/projects" element={<Dashboard />} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
