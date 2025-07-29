const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticateToken = require('../middlewares/auth.middleware');

// Get favorite artists
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('favoriteArtists');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, favoriteArtists: user.favoriteArtists });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Add an artist to favorites
router.post('/favorites', authenticateToken, async (req, res) => {
  try {
    const { artistId } = req.body;
    if (!artistId) {
      return res.status(400).json({ success: false, message: 'Artist ID is required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.addToFavorites(artistId);
    res.status(200).json({ success: true, favoriteArtists: user.favoriteArtists });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Remove an artist from favorites
router.delete('/favorites/:artistId', authenticateToken, async (req, res) => {
  try {
    const { artistId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.removeFromFavorites(artistId);
    res.status(200).json({ success: true, favoriteArtists: user.favoriteArtists });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
