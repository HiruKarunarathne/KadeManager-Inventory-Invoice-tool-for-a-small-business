const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for a given user ID
 * @param {string} id - MongoDB user _id
 * @returns {string} JWT token
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * Register a new user (staff or owner).
 * NOTE: Only an owner can create another user — enforce this in the route layer.
 */
const registerUser = async ({ name, email, password, role = 'staff' }) => {
  // Check if email already taken
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const error = new Error('A user with this email already exists');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ name, email, password, role });
  const token = signToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Authenticate a user by email and password.
 */
const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  // Explicitly select password (it's excluded by default in the schema)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Get all staff users (owner-only action)
 */
const getAllStaff = async () => {
  return User.find({ role: 'staff' }).select('-password').sort({ createdAt: -1 });
};

/**
 * Delete a staff user by ID (owner-only action)
 */
const deleteStaffUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  if (user.role === 'owner') {
    const error = new Error('Cannot delete the owner account');
    error.statusCode = 403;
    throw error;
  }
  await user.deleteOne();
  return { message: 'Staff user deleted' };
};

module.exports = { registerUser, loginUser, getAllStaff, deleteStaffUser };
