import React, { lazy, Suspense } from 'react';
import { useAuth } from '../AuthProvider';

const ManagerDashboard = lazy(() => import('./ManagerDashboard'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const UserDashboard = lazy(() => import('./UserDashboard'));

const Dashboard = () => {
  const authState = useAuth();

  if (!authState?.user) {
    return <div className="text-center text-2xl font-bold my-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:max-w-4xl">
      <h1 className="text-center text-2xl font-bold my-6">Welcome to your Dashboard ({authState.user.role})</h1>
      <p>Email: {authState.user.email}</p>
      <Suspense fallback={<div>Loading...</div>}>
        {authState.user.role === 'user' && <UserDashboard />}
        {authState.user.role === 'admin' && <AdminDashboard />}
        {authState.user.role === 'manager' && <ManagerDashboard />}
      </Suspense>
    </div>
  );
};

export default Dashboard;
