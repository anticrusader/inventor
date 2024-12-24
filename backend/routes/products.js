const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('stone', 'name')
      .populate('vendor', 'fname lname')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('stone', 'name')
      .populate('vendor', 'fname lname');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Get total products count
router.get('/count', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error getting products count:', error);
    res.status(500).json({ message: 'Error getting products count', error: error.message });
  }
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/products';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});

// Add a new product
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
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

    const product = new Product(productData);
    const savedProduct = await product.save();
    
    // Populate the references before sending response
    const populatedProduct = await Product.findById(savedProduct._id)
      .populate('stone', 'name')
      .populate('vendor', 'fname lname');

    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});

// Update a product
router.patch('/:id', upload.array('images', 5), async (req, res) => {
  try {
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
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
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
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// Generate SKU for vendor
router.post('/generate-sku', async (req, res) => {
  try {
    const { vendorId } = req.body;
    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    const vendor = await mongoose.model('Vendor').findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
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
    res.json({ sku: newSku });
  } catch (error) {
    console.error('Error generating SKU:', error);
    res.status(500).json({ message: 'Error generating SKU', error: error.message });
  }
});

module.exports = router;
