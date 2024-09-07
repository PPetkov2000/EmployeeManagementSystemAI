import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './components/AuthProvider';
import TopNavigation from './components/TopNavigation';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import ChangePassword from './components/pages/ChangePassword';
import VerifyEmail from './components/pages/VerifyEmail';
import Dashboard from './components/pages/Dashboard';
import EmployeeList from './components/pages/EmployeeList';
import EmployeeDetails from './components/pages/EmployeeDetails';
import CreateEmployee from './components/pages/CreateEmployee';
import VacationRequests from './components/pages/VacationRequests';
import VacationRequestDetails from './components/pages/VacationRequestDetails';
import MyVacationRequests from './components/pages/MyVacationRequests';

const queryClient = new QueryClient();

const PrivateRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  if (user === undefined) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" />;
  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <TopNavigation />
          <div className="container mx-auto">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />

              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/employees" element={<PrivateRoute requiredRole="admin"><EmployeeList /></PrivateRoute>} />
              <Route path="/employees/:id" element={<PrivateRoute requiredRole="admin"><EmployeeDetails /></PrivateRoute>} />
              <Route path="/create-employee" element={<PrivateRoute requiredRole="admin"><CreateEmployee /></PrivateRoute>} />
              <Route path="/vacation-requests" element={<PrivateRoute requiredRole="manager"><VacationRequests /></PrivateRoute>} />
              <Route path="/vacation-requests/:id" element={<PrivateRoute><VacationRequestDetails /></PrivateRoute>} />
              <Route path="/my-vacation-requests" element={<PrivateRoute><MyVacationRequests /></PrivateRoute>} />

              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
