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
      console.log('Fetching categories...');
      const response = await axiosInstance.get('/categories');
      console.log('Categories response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  addCategory: async (category) => {
    try {
      const response = await axiosInstance.post('/categories', category);
      return response.data;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },
  
  updateCategory: async (id, category) => {
    try {
      const response = await axiosInstance.put(`/categories/${id}`, category);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },
  
  deleteCategory: async (id) => {
    try {
      const response = await axiosInstance.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
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

  // Stones
  async getStones() {
    try {
      const response = await axiosInstance.get('/stones');
      return response.data;
    } catch (error) {
      console.error('Error getting stones:', error);
      throw error;
    }
  },
  async addStone(stone) {
    try {
      const response = await axiosInstance.post('/stones', stone);
      return response.data;
    } catch (error) {
      console.error('Error adding stone:', error);
      throw error;
    }
  },

  // Vendors
  async getVendors() {
    try {
      const response = await axiosInstance.get('/vendors');
      return response.data;
    } catch (error) {
      console.error('Error getting vendors:', error);
      throw error;
    }
  },
  async addVendor(vendor) {
    try {
      const response = await axiosInstance.post('/vendors', vendor);
      return response.data;
    } catch (error) {
      console.error('Error adding vendor:', error);
      throw error;
    }
  },
  generateSKU: (vendorId) => {
    return axios.post(`${API_URL}/products/generate-sku`, { vendorId });
  },
    // Ledger methods
    getLedgerEntries: async (params) => {
      const response = await axiosInstance.get('/ledger', { params });
      return response.data;
    },
    
    addLedgerEntry: async (data) => {
      const response = await axiosInstance.post('/ledger', data);
      return response.data;
    },
    updateLedgerEntry: async (id, data) => {
      try {
        const response = await axiosInstance.put(`/ledger/${id}`, data);
        return response.data;
      } catch (error) {
        console.error('Error updating ledger entry:', error);
        throw error;
      }
    },
    deleteLedgerEntry: async (id) => {
      try {
        const response = await axiosInstance.delete(`/ledger/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting ledger entry:', error);
        throw error;
      }
    },
    getLedgerEntries: () => axiosInstance.get('/ledger'),
addLedgerEntry: (entry) => axiosInstance.post('/ledger', entry),
transformLedgerData: () => axiosInstance.get('/ledger/transform'),
};

export default api;
