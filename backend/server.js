const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Add this line to import fs module
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

// Set mongoose options to fix deprecation warnings
mongoose.set('strictQuery', true);

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// Basic middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
console.log('Mounting API routes...');
app.use('/api', (req, res, next) => {
  console.log('API request received:', {
    method: req.method,
    url: req.url,
    path: req.path
  });
  next();
}, apiRoutes);
console.log('API routes mounted. Available routes:', 
  Object.keys(apiRoutes.stack || []).map(r => r.route?.path).filter(Boolean)
);

// Mount auth routes
app.use('/api/auth', authRoutes);

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Connect to MongoDB and initialize server
const startServer = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    mongoose.set('debug', true); // Enable mongoose debug mode

    // Define the MongoDB URI
    const MONGODB_URI = 'mongodb://127.0.0.1:27017/inventor';
    console.log('MongoDB URI:', MONGODB_URI);

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('Successfully connected to MongoDB');
    console.log('Connected to database:', mongoose.connection.db.databaseName);

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Initialize Category collection if it doesn't exist
    const categoryExists = collections.some(c => c.name === 'categories');
    if (!categoryExists) {
      console.log('Creating categories collection...');
      await mongoose.connection.db.createCollection('categories');
      console.log('Categories collection created successfully');
    }

    // Add catch-all route handler for debugging
    app.use((req, res, next) => {
      console.log('404 Not Found:', {
        method: req.method,
        url: req.url,
        path: req.path,
        params: req.params,
        query: req.query,
        body: req.body
      });
      next();
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Server error:', err);
      res.status(500).json({ message: err.message });
    });

    // Start the server
    const PORT = 5001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Start the server
startServer();
