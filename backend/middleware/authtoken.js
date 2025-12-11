const jwt = require('jsonwebtoken');

const IsAdmin = (req, res, next) => {
    const token = req.cookies.AniFlexToken;

    if (!token) {
        console.log('Authentication failed: No token provided.');
        return res.status(401).json({ message: "Authentication token is missing" });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.log('Authentication failed: Token expired.');
                return res.status(401).json({ message: 'Token has expired. Please log in again.' });
            }
            console.log('Authentication failed: Invalid token.');
            return res.status(403).json({ message: 'Invalid token' });
        }

        const User = req.user
        if (User.role !== 'admin') {
            console.log(User)
            console.log(`Access denied: User role '${User.role}' is not authorized.`);
            return res.status(403).json({ message: "You are not authorized to access this resource" });
        }

        console.log('Admin access granted:', user); // Optional debug
        next();
    });
};

module.exports = IsAdmin;
