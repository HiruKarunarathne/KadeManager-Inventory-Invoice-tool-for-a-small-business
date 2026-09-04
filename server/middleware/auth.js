// middleware/auth.js
// JWT authentication middleware.
// Verifies the Bearer token from the Authorization header and attaches req.user.
// Any route that requires a logged-in user must use this middleware.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: Verify JWT and attach user to req.user
 * Usage: router.get('/protected', protect, handler)
 */
const protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — no token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (without password field)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — invalid or expired token',
    });
  }
};

module.exports = protect;
