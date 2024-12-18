import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
  addProduct: async (formData) => {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to server. Please check if the server is running.');
    }
    
    return axios.post(`${API_URL}/products`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 45000
    });
  },
  
  // Stores
  getStores: () => axiosInstance.get('/stores'),
  addStore: (store) => axiosInstance.post('/stores', store),
  addStoreOrder: (storeId, orderAmount) => 
    axiosInstance.post(`/stores/${storeId}/order`, { orderAmount })
};

export default api;
