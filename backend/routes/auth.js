const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // Assuming you have a sendEmail function in utils/sendEmail.js

// Temporary route to reset password
router.post('/reset-password', async (req, res) => {
  try {
    const username = 'umair';
    const newPassword = '123456';
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Temporary route to create a test user
router.post('/create-test-user', async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username: 'umair' });
    if (existingUser) {
      return res.json({ 
        success: true, 
        message: 'Test user already exists',
        user: {
          username: existingUser.username,
          email: existingUser.email
        }
      });
    }

    // Create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Umair@Akram', salt);

    const user = new User({
      username: 'umair',
      email: 'umair@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    await user.save();
    console.log('Test user created successfully');

    res.json({ 
      success: true, 
      message: 'Test user created successfully',
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating test user' 
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt - Request body:', { username, password: '***' });

    if (!username || !password) {
      console.log('Missing credentials - Username or password not provided');
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Debug: Log the query we're about to make
    console.log('Searching for user with username:', username);
    
    const user = await User.findOne({ username });
    
    // Debug: Log what we found
    console.log('Database query result:', user ? 'User found' : 'User not found');
    if (user) {
      console.log('User details:', {
        id: user._id,
        username: user.username,
        hasPassword: !!user.password
      });
    }

    if (!user) {
      console.log('User not found in database:', username);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Debug: Log password comparison
    console.log('Comparing passwords for user:', username);
    console.log('Stored password hash:', user.password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch for user:', username);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    console.log('Generating JWT token for user:', username);
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', username);
    res.json({ 
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  try {
    req.session = null;
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

// Add user route
router.post('/add-user', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username,
      password: hashedPassword,
      email: email || 'anticrusader@gmail.com'
    });

    await user.save();

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user creation'
    });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      password: hashedPassword,
      email: 'anticrusader@gmail.com'
    });

    await user.save();

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update email
router.post('/update-email', async (req, res) => {
  try {
    const { userId, email } = req.body;
    console.log('Updating email for user:', userId);

    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        message: 'User ID and email are required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update email
    user.email = email;
    await user.save();

    console.log('Email updated successfully for user:', userId);
    res.json({
      success: true,
      message: 'Email updated successfully'
    });
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating email'
    });
  }
});

// Change password
router.post('/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Received forgot password request for email:', email);

    if (!email) {
      console.log('Email is missing in request');
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(404).json({
        success: false,
        message: 'No user found with this email'
      });
    }
    console.log('Found user:', user._id);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    try {
      await user.save();
      console.log('Reset token saved for user');
    } catch (saveError) {
      console.error('Error saving reset token:', saveError);
      throw saveError;
    }

    // Create reset URL
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    console.log('Generated reset URL:', resetUrl);

    // Send email
    const mailOptions = {
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h1>You have requested a password reset</h1>
        <p>Please click on the following link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `
    };

    try {
      console.log('Attempting to send email...');
      await sendEmail(mailOptions);
      console.log('Email sent successfully');
      
      res.json({
        success: true,
        message: 'Password reset link sent to email'
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      throw emailError;
    }
  } catch (error) {
    console.error('Full error details:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending password reset email'
    });
  }
});

// Reset password with token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by token and check if token is expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password has been reset'
    });
  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
});

module.exports = router;
