// controllers/authController.js
// Handles HTTP req/res for auth endpoints. Delegates all logic to authService.

const authService = require('../services/authService');

// Standard response helper
const respond = (res, statusCode, data) => res.status(statusCode).json(data);

/**
 * POST /api/auth/login
 * Public — no auth required
 */
const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    respond(res, 200, { success: true, message: 'Login successful', data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/register
 * Protected — owner only (owner can add new staff)
 */
const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    respond(res, 201, { success: true, message: 'User registered successfully', data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Protected — returns the logged-in user's profile
 */
const getMe = async (req, res) => {
  respond(res, 200, {
    success: true,
    message: 'User profile retrieved',
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

/**
 * GET /api/auth/users
 * Protected — owner only (view all staff accounts)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    respond(res, 200, { success: true, message: 'Users retrieved', data: users });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/auth/users/:id
 * Protected — owner only (remove a staff account)
 */
const deleteUser = async (req, res, next) => {
  try {
    const result = await authService.deleteUser(req.params.id);
    respond(res, 200, { success: true, message: result.message, data: null });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, register, getMe, getAllUsers, deleteUser };
