const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
// const Order = require('../models/Order'); // Temporarily commented out
const Store = require('../models/Store');
const User = require('../models/User');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total users count
    // const totalUsers = await User.countDocuments();

    const [
      totalProducts,
      activeProducts,
      deactiveProducts,
      totalStores,
      // totalOrders,
      // totalSales,
      totalUsers
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ status: 'inactive' }),
      Store.countDocuments(),
      // Order.countDocuments(),
      // Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      User.countDocuments()
    ]);

    // Return mock data for now
    const stats = {
      totalProducts,
      activeProducts,
      deactiveProducts,
      totalStores,
      totalOrders: 0, // Temporarily set to 0
      totalSales: 0,  // Temporarily set to 0
      totalUsers
    };

    // const weeklyOrders = [
    //   { name: 'MON', value: 0, barValue: 0 },
    //   { name: 'TUE', value: 0, barValue: 0 },
    //   { name: 'WED', value: 0, barValue: 0 },
    //   { name: 'THU', value: 0, barValue: 0 },
    //   { name: 'FRI', value: 0, barValue: 0 },
    //   { name: 'SAT', value: 0, barValue: 0 },
    //   { name: 'SUN', value: 0, barValue: 0 }
    // ];

    // const storeStats = [];

    res.json({
      success: true,
      stats,
      // weeklyOrders,
      // storeStats
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
