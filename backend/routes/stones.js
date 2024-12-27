const express = require('express');
const router = express.Router();
const Stone = require('../models/Stone');

// Get all stones
router.get('/', async (req, res) => {
  try {
    const stones = await Stone.find().sort({ name: 1 });
    res.json(stones);
  } catch (error) {
    console.error('Error fetching stones:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add a new stone
router.post('/', async (req, res) => {
  try {
    const stone = new Stone(req.body);
    const savedStone = await stone.save();
    res.status(201).json(savedStone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update stone status
router.patch('/:id/status', async (req, res) => {
  try {
    const stone = await Stone.findById(req.params.id);
    if (!stone) {
      return res.status(404).json({ message: 'Stone not found' });
    }
    stone.status = req.body.status;
    const updatedStone = await stone.save();
    res.json(updatedStone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
