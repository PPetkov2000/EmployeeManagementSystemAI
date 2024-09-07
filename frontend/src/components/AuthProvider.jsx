import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Api from '../utils/Api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const response = await Api.checkAuth();
        setUser(response.data.user);
      } catch (error) {
        console.error('Authentication check failed', error);
        setUser(null);
        if (error.message === 'Network Error') {
          toast.error('Network Error: Please check your internet connection.');
        } else {
          localStorage.removeItem('auth-token');
          toast.error(error?.response?.data?.message || error.message);
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!['/register', '/login', '/forgot-password', '/reset-password', '/verify-email'].includes(location.pathname)) {
      checkAuth();
    }
  }, [navigate, location.pathname]);

  const register = async (userData) => {
    try {
      const response = await Api.register(userData);
      setUser(response.data.user);
      localStorage.setItem('auth-token', response.data.token);
      toast.success('Registered successfully!');
      // toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Registration failed');
    }
  };

  const login = async (credentials) => {
    try {
      const response = await Api.login(credentials);
      setUser(response.data.user);
      localStorage.setItem('auth-token', response.data.token);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await Api.logout();
      setUser(null);
      localStorage.removeItem('auth-token');
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};