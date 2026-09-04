// middleware/auth.js
// JWT authentication middleware.
// Verifies the Bearer token from the Authorization header and attaches req.user.
// Any route that requires a logged-in user must use this middleware.

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncWrapper = require('./asyncWrapper');

const protect = asyncWrapper(async (req, res, next) => {
  let token;

  // Extract token from Authorization header: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const err = new Error('Not authorized — no token provided');
    err.statusCode = 401;
    return next(err);
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Attach user to request (without password field)
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    const err = new Error('User belonging to this token no longer exists');
    err.statusCode = 401;
    return next(err);
  }

  req.user = user;
  next();
});

module.exports = protect;
