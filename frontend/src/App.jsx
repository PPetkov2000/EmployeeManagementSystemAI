import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './components/AuthProvider';
import TopNavigation from './components/TopNavigation';

const Login = lazy(() => import('./components/pages/Login'));
const Register = lazy(() => import('./components/pages/Register'));
const ForgotPassword = lazy(() => import('./components/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/pages/ResetPassword'));
const ChangePassword = lazy(() => import('./components/pages/ChangePassword'));
const VerifyEmail = lazy(() => import('./components/pages/VerifyEmail'));
const Dashboard = lazy(() => import('./components/pages/Dashboard'));
const UserList = lazy(() => import('./components/pages/UserList'));
const UserDetails = lazy(() => import('./components/pages/UserDetails'));
const CreateUser = lazy(() => import('./components/pages/CreateUser'));
const EditUser = lazy(() => import('./components/pages/EditUser'));
const VacationRequests = lazy(() => import('./components/pages/VacationRequests'));
const VacationRequestDetails = lazy(() => import('./components/pages/VacationRequestDetails'));
const MyVacationRequests = lazy(() => import('./components/pages/MyVacationRequests'));

const queryClient = new QueryClient();

const PrivateRoute = ({ children, requiredRole }) => {
  const authState = useAuth();
  if (authState?.user === undefined) return <Navigate to="/login" />;
  if (requiredRole && authState?.user?.role !== requiredRole) return <Navigate to="/dashboard" />;
  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <TopNavigation />
          <div className="container mx-auto">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />

                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/users" element={<PrivateRoute requiredRole="admin"><UserList /></PrivateRoute>} />
                <Route path="/users/:id" element={<PrivateRoute requiredRole="admin"><UserDetails /></PrivateRoute>} />
                <Route path="/users/:id/edit" element={<PrivateRoute requiredRole="admin"><EditUser /></PrivateRoute>} />
                <Route path="/users/create-user" element={<PrivateRoute requiredRole="admin"><CreateUser /></PrivateRoute>} />
                <Route path="/vacation-requests" element={<PrivateRoute requiredRole="manager"><VacationRequests /></PrivateRoute>} />
                <Route path="/vacation-requests/:id" element={<PrivateRoute><VacationRequestDetails /></PrivateRoute>} />
                <Route path="/my-vacation-requests" element={<PrivateRoute><MyVacationRequests /></PrivateRoute>} />

                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Suspense>
          </div>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
