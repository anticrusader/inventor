const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const Store = require('../models/Store');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024 // 4MB max file size
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'Active' });
    const deactiveProducts = await Product.countDocuments({ status: 'Deactive' });
    
    const stores = await Store.find();
    const totalStores = stores.length;
    const totalOrders = stores.reduce((acc, store) => acc + store.orders, 0);
    const totalSales = stores.reduce((acc, store) => acc + store.totalSales, 0);

    // Calculate store percentages for pie chart
    const storeStats = await Promise.all(stores.map(async (store) => {
      const storeProducts = await Product.countDocuments({ store: store._id });
      return {
        name: store.name,
        value: (store.orders / totalOrders * 100).toFixed(0),
        products: storeProducts
      };
    }));

    // Get weekly order data
    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const today = new Date();
    const weeklyOrders = await Promise.all(weekDays.map(async (day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (today.getDay() - index));
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const dailyProducts = await Product.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });

      return {
        name: day,
        value: dailyProducts * 1000, // Simulating value in dollars
        barValue: dailyProducts * 800 // Slightly lower for bar chart
      };
    }));

    res.json({
      stats: {
        totalProducts,
        activeProducts,
        deactiveProducts,
        totalStores,
        totalOrders,
        totalSales
      },
      storeStats,
      weeklyOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    console.log('Fetching all products...');
    const products = await Product.find().sort({ createdAt: -1 });
    console.log(`Found ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add new product
router.post('/products', upload.array('images', 5), async (req, res) => {
  try {
    console.log('Received product data:', req.body);
    console.log('Received files:', req.files);

    // Convert string numbers to actual numbers
    const productData = {
      ...req.body,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      images: req.files ? req.files.map(file => file.filename) : [],
      status: req.body.status || 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Processed product data:', productData);

    // Validate required fields
    const requiredFields = ['name', 'price', 'quantity', 'category', 'description'];
    const missingFields = requiredFields.filter(field => !productData[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Create and save product
    const product = new Product(productData);
    console.log('Saving product to database...');
    const savedProduct = await product.save();
    console.log('Product saved successfully:', savedProduct);
    
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error saving product:', error);
    
    // Delete uploaded files if product save fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    
    res.status(500).json({ 
      message: 'An error occurred while saving the product. Please try again.' 
    });
  }
});

// Add new store
router.post('/stores', async (req, res) => {
  try {
    const store = new Store(req.body);
    await store.save();
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all stores
router.get('/stores', async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update store orders and sales
router.post('/stores/:id/order', async (req, res) => {
  try {
    const { orderAmount } = req.body;
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    store.orders += 1;
    store.totalSales += orderAmount;
    await store.save();
    
    res.json(store);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
