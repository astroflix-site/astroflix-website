const express = require('express');
const jwt = require('jsonwebtoken');


const authenticateToken = (req, res, next) => {
    console.log('Cookies:', req.cookies); // Debugging line
    const token = req.cookies.AudCastToken;
  
    if (!token) {
        return res.status(401).json({ message: "Authentication token is missing" });
      }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;