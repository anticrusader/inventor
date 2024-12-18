const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Store = require('../models/Store');
const Category = require('../models/Category');

// Add logging middleware
router.use((req, res, next) => {
  console.log('API Request:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    path: req.path,
    params: req.params,
    query: req.query,
    body: req.body
  });
  next();
});

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
    const timestamp = Date.now();
    const randomNum = Math.round(Math.random() * 1E9);
    const filename = `${timestamp}-${randomNum}${path.extname(file.originalname)}`;
    cb(null, filename);
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

// Get single product
router.get('/products/:id', async (req, res) => {
  try {
    console.log('Fetching product:', req.params.id);
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      console.log('Product not found:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Found product:', product);
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
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
    console.log('Creating new product');
    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    // Convert string numbers to actual numbers
    const productData = {
      ...req.body,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      images: req.files ? req.files.map(file => file.filename) : [],
      status: req.body.status || 'active'
    };

    console.log('Product data before save:', productData);

    // Create new product
    const product = new Product(productData);
    console.log('Product model instance:', product);
    console.log('About to save product to database');
    console.log('Database connection state:', mongoose.connection.readyState);
    console.log('Database name:', mongoose.connection.name);
    
    try {
      await product.save();
      console.log('Product saved successfully. Database:', mongoose.connection.name, 'Collection:', product.collection.name);
    } catch (saveError) {
      console.error('Error during save operation:', saveError);
      console.error('Validation errors:', saveError.errors);
      throw saveError;
    }
    
    console.log('Product created successfully:', product);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Full error details:', JSON.stringify(error, null, 2));
    
    // Delete uploaded files if product creation fails
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(uploadDir, file.filename);
        fs.unlink(filePath, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    
    res.status(500).json({ 
      message: 'Error creating product', 
      error: error.message,
      details: error.errors || error 
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

// Update product
router.put('/products/:id', upload.array('images', 5), async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = { ...req.body };
    console.log('Updating product:', productId);
    console.log('Update data:', updateData);
    console.log('Files:', req.files);
    
    // Get the old product
    const oldProduct = await Product.findById(productId);
    if (!oldProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Parse existing images
    let existingImages = [];
    try {
      existingImages = JSON.parse(req.body.existingImages || '[]');
      console.log('Parsed existing images:', existingImages);
    } catch (error) {
      console.error('Error parsing existingImages:', error);
      return res.status(400).json({ message: 'Invalid existingImages format' });
    }

    // Delete removed images
    const removedImages = oldProduct.images.filter(img => !existingImages.includes(img));
    console.log('Removing images:', removedImages);
    for (const img of removedImages) {
      const imagePath = path.join(uploadDir, img);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log('Deleted image:', img);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // Add new uploaded images
    const newImages = req.files ? req.files.map(file => file.filename) : [];
    console.log('New images:', newImages);

    // Set the final images array
    updateData.images = [...existingImages, ...newImages];
    console.log('Final images array:', updateData.images);

    // Convert numeric fields
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.quantity) updateData.quantity = Number(updateData.quantity);
    
    // Update timestamp
    updateData.updatedAt = new Date();

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      throw new Error('Failed to update product');
    }

    console.log('Product updated successfully:', updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Clean up any newly uploaded files if update fails
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(uploadDir, file.filename);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Cleaned up new file:', file.filename);
          }
        } catch (deleteError) {
          console.error('Error cleaning up file:', deleteError);
        }
      });
    }
    
    res.status(500).json({ 
      message: 'Error updating product', 
      error: error.message,
      details: error.errors || {} 
    });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    console.log('Deleting product:', req.params.id);
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      console.log('Product not found:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete all associated image files
    if (product.images && product.images.length > 0) {
      console.log('Deleting associated images:', product.images);
      for (const img of product.images) {
        const imagePath = path.join(uploadDir, img);
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log('Successfully deleted image:', img);
          } else {
            console.log('Image file not found:', imagePath);
          }
        } catch (error) {
          console.error('Error deleting image file:', error);
          // Continue with deletion even if image removal fails
        }
      }
    }

    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) {
      throw new Error('Failed to delete product from database');
    }
    
    console.log('Product deleted successfully:', req.params.id);
    res.json({ message: 'Product deleted successfully', productId: req.params.id });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      message: 'Error deleting product', 
      error: error.message,
      productId: req.params.id 
    });
  }
});

// Categories routes
router.get('/categories', async (req, res) => {
  try {
    console.log('GET /categories endpoint hit');
    let count = await Category.countDocuments();
    console.log('Found categories count:', count);

    // Create default categories if none exist
    if (count === 0) {
      console.log('Creating default categories...');
      const defaultCategories = [
        { name: 'Ring', description: 'Ring jewelry', status: 'active' },
        { name: 'Necklace', description: 'Necklace jewelry', status: 'active' },
        { name: 'Bracelet', description: 'Bracelet jewelry', status: 'active' },
        { name: 'Earring', description: 'Earring jewelry', status: 'active' }
      ];
      await Category.insertMany(defaultCategories);
      console.log('Default categories created');
    }

    const categories = await Category.find().sort('name');
    console.log('Returning categories:', categories);
    res.json(categories);
  } catch (error) {
    console.error('Error in GET /categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    console.log('Creating new category:', req.body);
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({ message: 'Error creating category', error: error.message });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({ message: 'Error updating category', error: error.message });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
});

// Add some default categories if none exist
const initializeCategories = async () => {
  try {
    console.log('Checking for existing categories...');
    const count = await Category.countDocuments();
    console.log(`Found ${count} existing categories`);

    if (count === 0) {
      console.log('No categories found. Creating default categories...');
      const defaultCategories = [
        { 
          name: 'ring', 
          description: 'Ring jewelry',
          status: 'active'
        },
        { 
          name: 'necklace', 
          description: 'Necklace jewelry',
          status: 'active'
        },
        { 
          name: 'bracelet', 
          description: 'Bracelet jewelry',
          status: 'active'
        },
        { 
          name: 'earring', 
          description: 'Earring jewelry',
          status: 'active'
        },
        { 
          name: 'pendant', 
          description: 'Pendant jewelry',
          status: 'active'
        }
      ];

      const result = await Category.insertMany(defaultCategories);
      console.log(`Successfully created ${result.length} default categories`);
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
    // Try to provide more specific error information
    if (error.code === 11000) {
      console.error('Duplicate category found:', error.keyValue);
    }
  }
};

// Make sure to call initialization when the router is loaded
(async () => {
  try {
    console.log('Starting category initialization...');
    await initializeCategories();
    console.log('Category initialization completed');
  } catch (error) {
    console.error('Failed to initialize categories:', error);
  }
})();

module.exports = router;
