const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: ['https://inventor-dv3d.onrender.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

app.use(cors(corsOptions));

// Connect to MongoDB with detailed logging
console.log('Attempting to connect to MongoDB...');
const dbURI = process.env.MONGODB_URI;
console.log('MongoDB URI:', dbURI ? 'URI is set' : 'URI is missing');

// Ensure the URI points to the 'inventor' database
const uri = dbURI.includes('inventor') ? dbURI : `${dbURI}/inventor`;
console.log('Using database:', uri.split('/').pop().split('?')[0]);

mongoose.connect(uri)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    // Test the connection by counting users
    const User = require('./models/User');
    return User.find().exec();
  })
  .then(users => {
    console.log(`Number of users in database: ${users.length}`);
    console.log('Users found:', users.map(u => ({ username: u.username, email: u.email })));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code
    });
  });

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const productRoutes = require('./routes/products'); // Add product routes
const categoryRoutes = require('./routes/categories'); // Add category routes

// Mount API routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes); // Mount product routes
app.use('/api/categories', categoryRoutes); // Mount category routes

// API test route
app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Test route works!' });
});

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, 'build');
  console.log('Build path:', buildPath);
  
  // Check if build directory exists
  const fs = require('fs');
  if (fs.existsSync(buildPath)) {
    console.log('Build directory exists');
    // Serve static files from the React build directory
    app.use(express.static(buildPath));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });
  } else {
    console.error('Build directory does not exist:', buildPath);
  }
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

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Available routes:');
  console.log('- GET /api/test');
  console.log('- GET /api/products');
  console.log('- GET /api/categories');
  console.log('- POST /auth/login');
});
