const jwt = require('jsonwebtoken');
const User = require('../models/User');

const IsAuth = async (req, res, next) => {
  const token = req.cookies.AniFlexToken;

  if (!token) {
    return res.status(401).json({ message: " token is missing" });
  }

  try {
    const secretKey = process.env.TOKEN_SECRET; // Use TOKEN_SECRET
    if (!secretKey) {
      throw new Error('Secret key is not defined in environment variables');
    }

    const decoded = jwt.verify(token, secretKey);

    // Check if this is an old MongoDB token (non-numeric ID)
    if (decoded.id && isNaN(decoded.id)) {
      // Old MongoDB ObjectId format - force re-login
      console.log('Old MongoDB token detected, requiring re-login');
      return res.status(401).json({
        message: "Session expired. Please log in again.",
        requiresRelogin: true
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Token verification error:', error); // Detailed error logging
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = IsAuth;