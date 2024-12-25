import axios from 'axios';
import config from '../config';

const axiosInstance = axios.create({
  baseURL: config.API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const authService = {
  login: async (credentials) => {
    try {
      console.log('Attempting login with URL:', `${config.API_URL}/auth/login`);
      const response = await axiosInstance.post('/auth/login', credentials);
      console.log('Login response:', response);
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
  }
};

export default authService;
