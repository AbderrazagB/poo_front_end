import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Adjust as needed
});

// Add a request interceptor to include JWT token if available
api.interceptors.request.use(
  (config) => {
    // Do not add Authorization header for login or signup
    if (
      config.url.endsWith('/auth/v1/sign-in') ||
      config.url.endsWith('/auth/v1/sign-up')
    ) {
      return config;
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api; 