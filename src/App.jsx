import React, { useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Directory } from './pages/Directory';
import { TaskTracker } from './pages/TaskTracker';
import { Profile } from './pages/Profile';
import { HRManagement } from './pages/HRManagement';
import { HRAssets } from './pages/HRAssets';
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { MyLeads } from './pages/employee/MyLeads';
import { MyLeaves } from './pages/employee/MyLeaves';
function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#login');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#login');
      window.scrollTo(0, 0);
    };
    
    // Add default URL if none
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#login');
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const getRole = () => {
    try {
      const saved = localStorage.getItem('capinoria_user');
      return saved ? JSON.parse(saved).roleLevel : null;
    } catch { return null; }
  };
  const role = getRole();

  // Simple routing
  let CurrentView = Login;
  switch (currentHash) {
    case '#dashboard':
      CurrentView = role === 'Employee' ? EmployeeDashboard : Dashboard;
      break;
    case '#directory':
      CurrentView = Directory;
      break;
    case '#tracker':
      CurrentView = role === 'Employee' ? MyLeads : TaskTracker;
      break;
    case '#profile':
      CurrentView = Profile;
      break;
    case '#hrmanagement':
      CurrentView = role === 'Employee' ? EmployeeDashboard : HRManagement;
      break;
    case '#hr-assets':
      CurrentView = role === 'Employee' ? EmployeeDashboard : HRAssets;
      break;
    case '#employee-dashboard':
      CurrentView = EmployeeDashboard;
      break;
    case '#employee-leads':
      CurrentView = MyLeads;
      break;
    case '#employee-leaves':
      CurrentView = MyLeaves;
      break;
    case '#logout':
      // Clear session logic would go here
      window.location.hash = '#login';
      CurrentView = Login;
      break;
    case '#login':
    default:
      CurrentView = Login;
  }

  return <CurrentView />;
}

export default App;
