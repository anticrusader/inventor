const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const stoneRoutes = require('./routes/stones');
const vendorRoutes = require('./routes/vendors');
const profileRoutes = require('./routes/profile');

// Connect to MongoDB with retry logic
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventor';
  console.log('Attempting to connect to MongoDB...');
  
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// CORS configuration
app.use(cors({
  origin: 'https://inventor-dv3d.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add OPTIONS handling for all routes
app.options('*', cors());

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stones', stoneRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/profile', profileRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve frontend static files
  app.use(express.static(path.join(__dirname, '../build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const port = process.env.PORT || 5001;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('MongoDB URI:', process.env.MONGODB_URI);
});
