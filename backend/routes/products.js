const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Stone = require('../models/Stone');
const Vendor = require('../models/Vendor');
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Get all products
// router.get('/', async (req, res) => {
//   try {
//     console.log('Fetching all products...');
//     const products = await Product.find()
//       .populate('stone', 'name')
//       .populate('vendor', 'fname lname')
//       .sort({ createdAt: -1 });
    
//     console.log(`Found ${products.length} products`);
//     res.json({ success: true, data: products });
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error fetching products', 
//       error: error.message 
//     });
//   }
// });
// router.get('/', async (req, res) => {
//   try {
//     const products = await Product.find().populate('category');
//     console.log('Products fetched:', products); // Add logging
//     res.json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error); // Add error logging
//     res.status(500).json({ message: error.message });
//   }
// });
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name') // Populate category with name field
      .populate('stone', 'name') // Populate stone fields
      .populate('vendor', 'fname') // Populate vendor fields
      .sort({ createdAt: -1 });
    
    console.log('Products fetched:', products); // Add logging
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    console.log(`Fetching product with ID: ${req.params.id}`);
    const product = await Product.findById(req.params.id)
      .populate('stone', 'name')
      .populate('vendor', 'fname lname');
    
    if (product) {
      console.log('Product found:', product._id);
      res.json({ success: true, data: product });
    } else {
      console.log('Product not found');
      res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching product', 
      error: error.message 
    });
  }
});

// Get total products count
router.get('/count', async (req, res) => {
  try {
    console.log('Getting products count...');
    const count = await Product.countDocuments();
    console.log(`Total products: ${count}`);
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error getting products count:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error getting products count', 
      error: error.message 
    });
  }
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Invalid file type');
      error.code = 'INVALID_FILE_TYPE';
      return cb(error, false);
    }
    cb(null, true);
  }
});

// Add a new product
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    console.log('Creating new product with data:', req.body);
    
    // Create product object
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      quantity: parseInt(req.body.quantity),
      category: req.body.category,
      weight: parseFloat(req.body.weight),
      stone: req.body.stone,
      vendor: req.body.vendor,
      status: req.body.status || 'active',
      sku: req.body.sku,
      images: req.files ? req.files.map(file => file.filename) : []
    };

    // Convert string IDs to ObjectIds
    if (productData.stone) {
      productData.stone = mongoose.Types.ObjectId(productData.stone);
    }
    if (productData.vendor) {
      productData.vendor = mongoose.Types.ObjectId(productData.vendor);
    }

    const product = new Product(productData);
    await product.save();
    
    console.log('Product created successfully:', product._id);
    res.status(201).json({ 
      success: true, 
      message: 'Product created successfully', 
      data: product 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    // Clean up uploaded files if product creation fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Error creating product', 
      error: error.message 
    });
  }
});

// Update a product
router.patch('/:id', upload.array('images', 5), async (req, res) => {
  try {
    console.log(`Updating product with ID: ${req.params.id}`);
    
    // Create product object
    const updates = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      quantity: parseInt(req.body.quantity),
      category: req.body.category,
      weight: parseFloat(req.body.weight),
      stone: req.body.stone,
      vendor: req.body.vendor,
      status: req.body.status,
      sku: req.body.sku
    };

    // Convert string IDs to ObjectIds
    if (updates.stone) {
      updates.stone = mongoose.Types.ObjectId(updates.stone);
    }
    if (updates.vendor) {
      updates.vendor = mongoose.Types.ObjectId(updates.vendor);
    }

    // Handle existing images
    if (req.body.existingImages) {
      const existingImages = JSON.parse(req.body.existingImages);
      updates.images = existingImages;
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);
      updates.images = updates.images ? [...updates.images, ...newImages] : newImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('stone', 'name')
      .populate('vendor', 'fname lname');

    if (!updatedProduct) {
      console.log('Product not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    console.log('Product updated successfully:', updatedProduct._id);
    res.json({ 
      success: true, 
      message: 'Product updated successfully', 
      data: updatedProduct 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    // Clean up uploaded files if product update fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Error updating product', 
      error: error.message 
    });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    console.log(`Deleting product with ID: ${req.params.id}`);
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Delete associated images
    if (product.images && product.images.length > 0) {
      product.images.forEach(image => {
        const imagePath = path.join('uploads/products', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    console.log('Product deleted successfully');
    res.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting product', 
      error: error.message 
    });
  }
});

// Generate SKU for vendor
router.post('/generate-sku', async (req, res) => {
  try {
    console.log('Generating SKU for vendor...');
    const { vendorId } = req.body;
    if (!vendorId) {
      console.log('Vendor ID is required');
      return res.status(400).json({ 
        success: false, 
        message: 'Vendor ID is required' 
      });
    }

    const vendor = await mongoose.model('Vendor').findById(vendorId);
    if (!vendor) {
      console.log('Vendor not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Vendor not found' 
      });
    }

    const vendorPrefix = (vendor.fname.slice(0, 2)).toLowerCase();
    
    // Find the highest item code for this vendor
    const highestProduct = await Product
      .findOne({ sku: new RegExp(`^${vendorPrefix}\\d{4}$`) })
      .sort({ sku: -1 });
    
    let itemCode = '0001';
    if (highestProduct && highestProduct.sku) {
      const currentCode = parseInt(highestProduct.sku.slice(-4));
      itemCode = String(currentCode + 1).padStart(4, '0');
    }
    
    const newSku = `${vendorPrefix}${itemCode}`;
    console.log('SKU generated successfully:', newSku);
    res.json({ 
      success: true, 
      sku: newSku 
    });
  } catch (error) {
    console.error('Error generating SKU:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating SKU', 
      error: error.message 
    });
  }
});

module.exports = router;
