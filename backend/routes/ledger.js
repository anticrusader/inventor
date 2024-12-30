// backend/routes/ledger.js
const express = require('express');
const router = express.Router();
const Ledger = require('../models/Ledger');

// Add new ledger entry
router.post('/', async (req, res) => {
  try {
    const ledger = new Ledger(req.body);
    await ledger.save();
    res.status(201).json(ledger);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all ledger entries with optional filters
router.get('/', async (req, res) => {
  try {
    const { name, date } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (date) {
      query.date = {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      };
    }

    const entries = await Ledger.find(query).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Update ledger entry
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedEntry = await Ledger.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!updatedEntry) {
        return res.status(404).json({ message: 'Ledger entry not found' });
      }
      
      res.json(updatedEntry);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete ledger entry
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedEntry = await Ledger.findByIdAndDelete(id);
      
      if (!deletedEntry) {
        return res.status(404).json({ message: 'Ledger entry not found' });
      }
      
      res.json({ message: 'Ledger entry deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;