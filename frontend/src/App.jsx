import './styles/global.css';
import './styles/layout.css';
import './styles/forms.css';
import './styles/charts.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { useEffect } from 'react';

import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DataEntry from './pages/DataEntry';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/user-dashboard"
          element={<ProtectedRoute requiredRole="user" component={<UserDashboard />} />}
        />
        <Route
          path="/admin-dashboard"
          element={<ProtectedRoute requiredRole="admin" component={<AdminDashboard />} />}
        />
        <Route
          path="/data-entry"
          element={<ProtectedRoute requiredRole="user" component={<DataEntry />} />}
        />
        <Route path="/" element={isAuthenticated ? <Navigate to="/user-dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
