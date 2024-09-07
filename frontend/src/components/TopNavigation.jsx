import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const TopNavigation = () => {
  const authState = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold">Auth System</Link>
        <div className="space-x-4">
          {!authState?.user ? (
            <>
              <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
              <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
              <Link to="/forgot-password" className="text-white hover:text-gray-300">Forgot Password</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-white hover:text-gray-300">Dashboard</Link>
              <Link to="/my-vacation-requests" className="text-white hover:text-gray-300">My Vacation Requests</Link>
              {authState?.user?.role === 'admin' && (
                <>
                  <Link to="/admin-dashboard" className="text-white hover:text-gray-300">Admin Dashboard</Link>
                  <Link to="/employees" className="text-white hover:text-gray-300">Employees</Link>
                  <Link to="/create-employee" className="text-white hover:text-gray-300">Create Employee</Link>
                </>
              )}
              {authState?.user?.role === 'manager' && (
                <>
                  <Link to="/manager-dashboard" className="text-white hover:text-gray-300">Manager Dashboard</Link>
                  <Link to="/vacation-requests" className="text-white hover:text-gray-300">Vacation Requests</Link>
                </>
              )}
              <Link to="/change-password" className="text-white hover:text-gray-300">Change Password</Link>
              <button onClick={authState.logout} className="text-white hover:text-gray-300">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;