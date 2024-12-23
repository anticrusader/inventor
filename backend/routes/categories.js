const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ status: 'active' }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
});

// Add a new category
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({
      name,
      description,
      status: 'active'
    });
    await category.save();
    res.json({ success: true, category });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ success: false, message: 'Error adding category' });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, status },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Error updating category' });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Error deleting category' });
  }
});

// Initialize default categories
const initializeCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      const defaultCategories = [
        { name: 'Electronics', description: 'Electronic devices and accessories' },
        { name: 'Clothing', description: 'Apparel and fashion items' },
        { name: 'Books', description: 'Books and publications' },
        { name: 'Home & Garden', description: 'Home decor and gardening items' },
        { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' }
      ];

      for (const cat of defaultCategories) {
        const category = new Category(cat);
        await category.save();
      }
      console.log('Default categories initialized');
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
};

// Initialize categories when the server starts
initializeCategories();

module.exports = router;
