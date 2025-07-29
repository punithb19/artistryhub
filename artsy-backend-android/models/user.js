const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoriteArtists: [{
    artistId: { type: String, required: true },
    addedDate: { type: Date, default: Date.now }
  }], 
  avatarUrl: { type: String }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);

  if (this.isModified('email')) {
    this.avatarUrl = generateGravatarUrl(this.email);
  }
  next();
});

userSchema.methods.addToFavorites = function(artistId) {
    if (!this.favoriteArtists.some(f => f.artistId === artistId)) {
      this.favoriteArtists.push({ 
        artistId: artistId,
        addedDate: new Date()
      });
    }
    return this.save();
  };

  userSchema.methods.removeFromFavorites = function(artistId) {
    this.favoriteArtists = this.favoriteArtists.filter(f => f.artistId !== artistId);
    return this.save();
  };

function generateGravatarUrl(email, size = 200) {
    const processedEmail = email.trim().toLowerCase(); // Ensure email is lowercase and trimmed
    const hash = crypto.createHash('sha1').update(processedEmail).digest('hex'); // Generate SHA1 hash
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`; // Return Gravatar URL
  }

module.exports = mongoose.model('User', userSchema);
