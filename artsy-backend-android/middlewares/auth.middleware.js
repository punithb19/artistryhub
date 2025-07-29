const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const User = require('../models/user');

const authenticateToken = async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Add validation for token payload
    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'User no longer exists' });

    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Error:', err);
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;

