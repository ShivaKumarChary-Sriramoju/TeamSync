import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Workspaces from './pages/Workspaces';
import WorkspaceSettings from './pages/WorkspaceSettings';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) return <div className="flex h-screen items-center justify-center font-mono text-sm text-text-muted">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={isAuthenticated ? <Workspaces /> : <Navigate to="/login" />} />
        <Route path="/workspaces/:id/settings" element={isAuthenticated ? <WorkspaceSettings /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
