const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generates a signed JWT for a given user.
 */
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * Registers a new user and returns a JWT.
 */
const registerUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('A user with that email already exists');
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({ name, email, password, role });
  const token = signToken(user._id);
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
};

/**
 * Authenticates an existing user and returns a JWT.
 */
const loginUser = async ({ email, password }) => {
  // Explicitly select password (select: false on schema)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken(user._id);
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
};

module.exports = { registerUser, loginUser };
