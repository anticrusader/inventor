import axios from 'axios';
import config from '../config';

const axiosInstance = axios.create({
  baseURL: config.API_URL,
  timeout: 30000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(request => {
  console.log('Starting Request:', {
    method: request.method,
    url: request.url,
    baseURL: request.baseURL,
    headers: request.headers,
    data: request.data
  });
  return request;
}, error => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    console.error('Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    return Promise.reject(error);
  }
);

const authService = {
  login: async (credentials) => {
    try {
      console.log('Attempting login with credentials:', credentials);
      const response = await axiosInstance.post('/auth/login', credentials);
      console.log('Login response:', response);
      
      // Return the response.data directly, which contains success, token, and user
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }
};

export default authService;
