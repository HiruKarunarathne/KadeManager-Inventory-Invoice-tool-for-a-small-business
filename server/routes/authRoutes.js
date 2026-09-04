// routes/authRoutes.js
// Auth endpoints for Perera Stores

const express = require('express');
const router = express.Router();
const {
  login,
  register,
  getMe,
  getAllUsers,
  getStaff,
  deleteUser,
  deleteStaff,
} = require('../controllers/authController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const asyncWrapper = require('../middleware/asyncWrapper');

// POST /api/auth/login — public
router.post('/login', asyncWrapper(login));

// GET /api/auth/me — any logged-in user
router.get('/me', protect, asyncWrapper(getMe));

// POST /api/auth/register — owner only (add new staff)
router.post('/register', protect, roleCheck(['owner']), asyncWrapper(register));

// GET /api/auth/users — owner only (manage all accounts)
router.get('/users', protect, roleCheck(['owner']), asyncWrapper(getAllUsers));

// DELETE /api/auth/users/:id — owner only
router.delete('/users/:id', protect, roleCheck(['owner']), asyncWrapper(deleteUser));

// GET /api/auth/staff — owner only (alias: only staff role)
router.get('/staff', protect, roleCheck(['owner']), asyncWrapper(getStaff));

// DELETE /api/auth/staff/:id — owner only
router.delete('/staff/:id', protect, roleCheck(['owner']), asyncWrapper(deleteStaff));

module.exports = router;
