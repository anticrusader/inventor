import axios from 'axios';
import config from '../config';

const axiosInstance = axios.create({
  baseURL: `${config.API_URL}/api`,
  timeout: 30000,
  withCredentials: true,
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
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      error.response = {
        data: {
          message: 'Unable to connect to the server. Please check your internet connection and try again.'
        }
      };
    }
    
    throw error;
  }
);

const authService = {
  login: async (credentials) => {
    try {
      console.log('Attempting login with URL:', `${config.API_URL}/api/auth/login`);
      const response = await axiosInstance.post('/auth/login', credentials);
      console.log('Login response:', response);
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post('/auth/logout');
      localStorage.removeItem('user');
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
};

export default authService;
