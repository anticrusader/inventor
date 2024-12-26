const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Enable pre-flight requests for all routes
app.options('*', cors());

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Origin'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Add headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Root route to verify server is running
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Test route (place this before other routes to test API connectivity)
app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'API is working!' });
});

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const stoneRoutes = require('./routes/stones');
const vendorRoutes = require('./routes/vendors');
const profileRoutes = require('./routes/profile');

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stones', stoneRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/profile', profileRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    console.log('Environment:', process.env.NODE_ENV);
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: err.message 
  });
});

// Handle 404 errors for API routes
app.use('/api/*', (req, res) => {
  console.log('API 404 Not Found:', req.method, req.originalUrl);
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../build');
  console.log('Serving static files from:', buildPath);
  app.use(express.static(buildPath));

  // Handle React routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 10000;
console.log('Starting server on port:', PORT);
console.log('Node environment:', process.env.NODE_ENV);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- / (GET)');
  console.log('- /api/test (GET)');
  console.log('- /api/auth/login (POST)');
  console.log('- /api/auth/register (POST)');
});
