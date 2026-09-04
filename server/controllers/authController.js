const authService = require('../services/authService');

/**
 * POST /api/auth/login
 * Public — no auth required
 */
const login = async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
};

/**
 * POST /api/auth/register
 * Protected — owner only (enforced via roleCheck in route)
 */
const register = async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
};

/**
 * GET /api/auth/me
 * Protected — returns logged-in user's profile
 */
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    },
  });
};

/**
 * GET /api/auth/staff
 * Protected — owner only
 */
const getStaff = async (req, res) => {
  const staff = await authService.getAllStaff();
  res.status(200).json({
    success: true,
    data: { staff },
  });
};

/**
 * DELETE /api/auth/staff/:id
 * Protected — owner only
 */
const deleteStaff = async (req, res) => {
  const result = await authService.deleteStaffUser(req.params.id);
  res.status(200).json({
    success: true,
    message: result.message,
  });
};

module.exports = { login, register, getMe, getStaff, deleteStaff };
