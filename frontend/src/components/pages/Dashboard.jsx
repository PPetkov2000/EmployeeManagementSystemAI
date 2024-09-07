import React, { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

const ManagerDashboard = lazy(() => import('./ManagerDashboard'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const UserDashboard = lazy(() => import('./UserDashboard'));

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <h1>Welcome to your Dashboard</h1>
        <p>Email: {user.email}</p>
        <button onClick={() => navigate('/change-password')}>Change Password</button>
        <button onClick={handleLogout}>Logout</button>
        {user.role === 'user' && <UserDashboard />}
        {user.role === 'admin' && <AdminDashboard />}
        {user.role === 'manager' && <ManagerDashboard />}
      </div>
    </Suspense>
  );
};

export default Dashboard;
