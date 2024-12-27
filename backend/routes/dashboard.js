const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
// const Order = require('../models/Order'); // Commented out as not used currently
const Store = require('../models/Store');
const User = require('../models/User');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();

    // Return mock data for now
    const stats = {
      totalProducts: 0,
      activeProducts: 0,
      deactiveProducts: 0,
      totalStores: 0,
      totalOrders: 0, // Mock data for total orders
      totalSales: 0,  // Mock data for total sales
      totalUsers
    };

    const weeklyOrders = [
      { name: 'MON', value: 0, barValue: 0 },
      { name: 'TUE', value: 0, barValue: 0 },
      { name: 'WED', value: 0, barValue: 0 },
      { name: 'THU', value: 0, barValue: 0 },
      { name: 'FRI', value: 0, barValue: 0 },
      { name: 'SAT', value: 0, barValue: 0 },
      { name: 'SUN', value: 0, barValue: 0 }
    ];

    const storeStats = [];

    res.json({
      success: true,
      stats,
      weeklyOrders,
      storeStats
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
});

module.exports = router;
