const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await mongoose.connection.db.collection('products').find().toArray();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get total products count
router.get('/count', async (req, res) => {
  try {
    const count = await mongoose.connection.db.collection('products').countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error getting products count:', error);
    res.status(500).json({ message: 'Error getting products count', error: error.message });
  }
});

// Add a new product
router.post('/', async (req, res) => {
  try {
    const product = {
      ...req.body,
      createdAt: new Date()
    };
    const result = await mongoose.connection.db.collection('products').insertOne(product);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

module.exports = router;
