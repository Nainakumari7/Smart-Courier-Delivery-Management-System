import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/gateway',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 & normalize errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      let message = error.response.data?.message || error.response.data?.error;
      
      // Handle Gateway errors (502, 503, 504) which happen when microservices are still starting up
      if (!message) {
        if (error.response.status === 502 || error.response.status === 503 || error.response.status === 504) {
          message = 'Backend services are currently starting up or unavailable. Please wait a moment and try again.';
        } else {
          message = `Request failed (${error.response.status})`;
        }
      }
      
      return Promise.reject({ message, status: error.response.status, data: error.response.data });
    }
    if (error.request) {
      return Promise.reject({ message: 'Network error — please check your connection and ensure the backend is running.' });
    }
    return Promise.reject({ message: error.message || 'An unexpected error occurred.' });
  }
);

export default axiosInstance;
