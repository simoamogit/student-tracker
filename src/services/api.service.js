import axios from 'axios';

// Base API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API service methods
const ApiService = {
  // Generic methods
  get(url, config = {}) {
    return apiClient.get(url, config);
  },
  
  post(url, data = {}, config = {}) {
    return apiClient.post(url, data, config);
  },
  
  put(url, data = {}, config = {}) {
    return apiClient.put(url, data, config);
  },
  
  delete(url, config = {}) {
    return apiClient.delete(url, config);
  },
  
  // Set auth header
  setAuthHeader(token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  // Remove auth header
  removeAuthHeader() {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default ApiService;
