const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticateToken = require('../middlewares/auth.middleware');
const axios = require('axios');
const { getAuthToken } = require('../utils/artsyToken');

router.get('/favorites', authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('favoriteArtists');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const token   = await getAuthToken();
      const headers = { 'X-Xapp-Token': token };

      const enriched = [];
      for (const { artistId, addedDate } of user.favoriteArtists) {
        try {
          const { data } = await axios.get(
            `http://localhost:3000/api/artist/${artistId}`,
            { headers }
          );
          enriched.push({
            id:        artistId,
            name:      data.name,
            nationality: data.nationality,
            birthday:  data.birthday,
            thumbnail: data.thumbnail,
            addedDate
          });
        } catch (fetchErr) {
          console.warn(`Failed to fetch artist ${artistId}:`, fetchErr.message);
        }
      }

      res.json({ success: true, favorites: enriched });
    } catch (err) {
      console.error('Error in /favorites:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);



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
