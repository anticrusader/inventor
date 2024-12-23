const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await mongoose.connection.db.collection('categories').find().toArray();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// Get total categories count
router.get('/count', async (req, res) => {
  try {
    const count = await mongoose.connection.db.collection('categories').countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error getting categories count:', error);
    res.status(500).json({ message: 'Error getting categories count', error: error.message });
  }
});

// Add a new category
router.post('/', async (req, res) => {
  try {
    const category = {
      ...req.body,
      createdAt: new Date()
    };
    const result = await mongoose.connection.db.collection('categories').insertOne(category);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
});

module.exports = router;
