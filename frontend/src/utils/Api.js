import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const Api = {
  register: (userData) => axiosInstance.post(`${API_URL}/auth/register`, userData),
  login: (credentials) => axiosInstance.post(`${API_URL}/auth/login`, credentials),
  logout: () => axiosInstance.post('/auth/logout'),
  forgotPassword: (email) => axiosInstance.post(`${API_URL}/auth/forgot-password`, { email }),
  resetPassword: (token, newPassword) => axiosInstance.post(`${API_URL}/auth/reset-password/:token?`, { token, newPassword }),
  changePassword: (oldPassword, newPassword) => axiosInstance.post(`${API_URL}/auth/change-password`, { oldPassword, newPassword }),
  verifyEmail: (token) => axiosInstance.get(`${API_URL}/auth/verify-email/${token}`),
  checkAuth: () => axiosInstance.get('/auth/check'),

  getUsers: () => axiosInstance.get(`${API_URL}/users`),
  getUser: (id) => axiosInstance.get(`${API_URL}/users/${id}`),
  createUser: (userData) => axiosInstance.post(`${API_URL}/users`, userData),
  updateUser: (id, userData) => axiosInstance.put(`${API_URL}/users/${id}`, userData),
  deleteUser: (id) => axiosInstance.delete(`${API_URL}/users/${id}`),
  getUserStats: (id) => axiosInstance.get(`${API_URL}/users/${id}/stats`),

  getUserPerformance: (id) => axiosInstance.get(`${API_URL}/user-performance/${id}`),
  createUserPerformance: (performanceData) => axiosInstance.post(`${API_URL}/user-performance`, performanceData),
  updateUserPerformance: (id, performanceData) => axiosInstance.put(`${API_URL}/user-performance/${id}`, performanceData),
  deleteUserPerformance: (id) => axiosInstance.delete(`${API_URL}/user-performance/${id}`),

  requestVacation: (vacationData) => axiosInstance.post(`${API_URL}/vacations`, vacationData),
  getVacationRequests: () => axiosInstance.get(`${API_URL}/vacations`),
  updateVacationRequest: (id, status) => axiosInstance.put(`${API_URL}/vacations/${id}`, { status }),
  getVacationRequestsByUserId: (id) => axiosInstance.get(`${API_URL}/vacations/user/${id}`),
  getVacationRequestDetails: (id) => axiosInstance.get(`${API_URL}/vacations/${id}`),
};

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('auth-token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(`Request to ${error.request.responseURL} failed with status ${error.response?.status}`);
    return Promise.reject(error);
  }
);

export default Api;