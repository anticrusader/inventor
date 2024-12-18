import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(request => {
  console.log('Starting Request:', {
    method: request.method,
    url: request.url,
    baseURL: request.baseURL,
    headers: request.headers
  });
  return request;
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
    throw error;
  }
);

// Test the server connection
const testConnection = async () => {
  try {
    const response = await axios.get('http://localhost:5001/test', { 
      withCredentials: true 
    });
    console.log('Server test successful:', response.data);
    return true;
  } catch (error) {
    console.error('Server test failed:', error.message);
    return false;
  }
};

const api = {
  // Test connection
  testConnection,
  
  // Dashboard
  getDashboardStats: async () => {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to server. Please check if the server is running.');
    }
    return axiosInstance.get('/dashboard/stats');
  },
  
  // Products
  getProducts: () => axiosInstance.get('/products'),
  getProduct: async (id) => {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to server. Please check if the server is running.');
    }
    return axiosInstance.get(`/products/${id}`);
  },
  addProduct: async (formData) => {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to server. Please check if the server is running.');
    }
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 45000
    };
    
    return axiosInstance.post('/products', formData, config);
  },
  updateProduct: async (id, formData) => {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to server. Please check if the server is running.');
    }
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 45000
    };

    return axiosInstance.put(`/products/${id}`, formData, config);
  },
  deleteProduct: async (id) => {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to server. Please check if the server is running.');
    }
    return axiosInstance.delete(`/products/${id}`);
  },

  // Categories
  getCategories: async () => {
    try {
      console.log('Making request to /categories endpoint');
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to server. Please check if the server is running.');
      }
      console.log('Server connection verified, fetching categories...');
      const response = await axiosInstance.get('/categories');
      console.log('Categories response:', response);
      return response.data;
    } catch (error) {
      console.error('Failed to get categories:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },
  
  addCategory: async (category) => {
    try {
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to server. Please check if the server is running.');
      }
      const response = await axiosInstance.post('/categories', category);
      return response.data;
    } catch (error) {
      console.error('Failed to add category:', error.message);
      throw error;
    }
  },
  
  updateCategory: async (id, category) => {
    try {
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to server. Please check if the server is running.');
      }
      const response = await axiosInstance.put(`/categories/${id}`, category);
      return response.data;
    } catch (error) {
      console.error('Failed to update category:', error.message);
      throw error;
    }
  },
  
  deleteCategory: async (id) => {
    try {
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to server. Please check if the server is running.');
      }
      const response = await axiosInstance.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete category:', error.message);
      throw error;
    }
  },

  // Stores
  getStores: async () => {
    try {
      const response = await axiosInstance.get('/stores');
      return response.data;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  },

  addStore: async (store) => {
    try {
      const response = await axiosInstance.post('/stores', store);
      return response.data;
    } catch (error) {
      console.error('Error adding store:', error);
      throw error;
    }
  },

  updateStore: async (id, store) => {
    try {
      const response = await axiosInstance.put(`/stores/${id}`, store);
      return response.data;
    } catch (error) {
      console.error('Error updating store:', error);
      throw error;
    }
  },

  deleteStore: async (id) => {
    try {
      const response = await axiosInstance.delete(`/stores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting store:', error);
      throw error;
    }
  },
};

export default api;
