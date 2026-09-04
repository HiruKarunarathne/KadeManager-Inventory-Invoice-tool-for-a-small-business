// routes/authRoutes.js
// Auth endpoints — login, register (owner-only), profile, user management

const express = require('express');
const router = express.Router();
const { login, register, getMe, getAllUsers, deleteUser } = require('../controllers/authController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// POST /api/auth/login — public
router.post('/login', login);

// POST /api/auth/register — owner only (add new staff)
router.post('/register', protect, roleCheck(['owner']), register);

// GET /api/auth/me — any logged-in user
router.get('/me', protect, getMe);

// GET /api/auth/users — owner only (manage staff)
router.get('/users', protect, roleCheck(['owner']), getAllUsers);

// DELETE /api/auth/users/:id — owner only
router.delete('/users/:id', protect, roleCheck(['owner']), deleteUser);

module.exports = router;
