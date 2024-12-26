const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration based on environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://inventor-dv3d.onrender.com'
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const stoneRoutes = require('./routes/stones');
const vendorRoutes = require('./routes/vendors');
const profileRoutes = require('./routes/profile');

// Test route to verify API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stones', stoneRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/profile', profileRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Environment:', process.env.NODE_ENV);
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: err.message 
  });
});

// Handle 404 errors
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 10000;
console.log('Starting server on port:', PORT);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- /api/auth/login (POST)');
  console.log('- /api/auth/register (POST)');
  console.log('- /api/test (GET)');
});
