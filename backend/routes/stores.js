const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get all stores
router.get('/', async (req, res) => {
  try {
    const stores = await mongoose.connection.db.collection('stores').find().toArray();
    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Error fetching stores', error: error.message });
  }
});

// Get total stores count
router.get('/count', async (req, res) => {
  try {
    const count = await mongoose.connection.db.collection('stores').countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error getting stores count:', error);
    res.status(500).json({ message: 'Error getting stores count', error: error.message });
  }
});

// Add a new store
router.post('/', async (req, res) => {
  try {
    const store = {
      ...req.body,
      createdAt: new Date()
    };
    const result = await mongoose.connection.db.collection('stores').insertOne(store);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating store:', error);
    res.status(500).json({ message: 'Error creating store', error: error.message });
  }
});

module.exports = router;
