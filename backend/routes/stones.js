const express = require('express');
const router = express.Router();
const Stone = require('../models/Stone');

// Get all stones
router.get('/', async (req, res) => {
  try {
    const stones = await Stone.find().sort({ createdAt: -1 });
    res.json(stones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new stone
router.post('/', async (req, res) => {
  const stone = new Stone({
    name: req.body.name
  });

  try {
    const newStone = await stone.save();
    res.status(201).json(newStone);
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
