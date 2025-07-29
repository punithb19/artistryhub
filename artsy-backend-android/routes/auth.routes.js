const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');
const cookieOpts = require('../utils/cookieOpts');
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const newUser = new User({
      username,
      email,
      password
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, SECRET_KEY, { expiresIn: '1h' });

    res.cookie('jwt', token, cookieOpts())
      .status(201)
      .json({ success: true, message: 'User registered successfully',userId: newUser._id, username: newUser.username, email: newUser.email, avatarUrl: newUser.avatarUrl });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });

    res.cookie('jwt', token, cookieOpts())
      .status(200)
      .json({ success: true, message: 'Login successful', userId: user._id, username: user.username, email: user.email, avatarUrl: user.avatarUrl });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  res.clearCookie('jwt')
    .status(200)
    .json({ success: true, message: 'Logged out successfully' });
});

// Delete Account Route
router.delete('/delete-account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.clearCookie('jwt');
    res.status(200).json({ success: true, message: 'Account deleted successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get Current User
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -__v');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    res.status(200).json({
      success: true,
      userId: user._id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;


  