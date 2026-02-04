import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import DashboardOverview from './components/DashboardOverview';
import TaskBoard from './components/TaskBoard';
import TimesheetUI from './components/TimesheetUI';
import MilestoneTracker from './components/MilestoneTracker';
import IssueTracker from './components/IssueTracker';
import ProjectDiscussion from './components/ProjectDiscussion';
import DocumentManager from './components/DocumentManager';
import ReportsDashboard from './components/ReportsDashboard';
import ClientDashboard from './components/ClientDashboard';
import Settings from './components/Settings';
import UserManagement from './components/UserManagement';
import TrashView from './components/TrashView';
import Login from './components/Login';
import ProjectList from './components/ProjectList';

function App() {
  const [currentView, setCurrentView] = useState('Overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  const renderView = () => {
    // Client Portal Routing
    if (user.role === 'Client') {
      switch (currentView) {
        case 'Documents': return <DocumentManager user={user} />;
        case 'Discussions': return <ProjectDiscussion user={user} />;
        default: return <ClientDashboard user={user} />;
      }
    }

    // Admin/Employee Routing
    switch (currentView) {
      case 'Overview': return <DashboardOverview user={user} />;
      case 'Projects': return <ProjectList user={user} />;
      case 'Tasks': return <TaskBoard user={user} />;
      case 'Timesheets': return <TimesheetUI user={user} />;
      case 'Milestones': return <MilestoneTracker user={user} />;
      case 'Issues': return <IssueTracker user={user} />;
      case 'Documents': return <DocumentManager user={user} />;
      case 'Reports': return <ReportsDashboard user={user} />;
      case 'Discussions': return <ProjectDiscussion user={user} />;
      case 'Settings': return <Settings user={user} onUpdateUser={setUser} />;
      case 'Customers': return <UserManagement currentUser={user} />;
      case 'Trash': return <TrashView user={user} />;
      default: return <DashboardOverview user={user} />;
    }
  };

  return (
    <Layout
      currentView={currentView}
      onNavigate={setCurrentView}
      user={user}
      onLogout={handleLogout}
    >
      {renderView()}
    </Layout>
  );
}

export default App;
