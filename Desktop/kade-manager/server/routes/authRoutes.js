const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// POST /api/auth/register  — owner-only: only owners can create new accounts
router.post('/register', protect, roleCheck(['owner']), register);

// POST /api/auth/login  — public
router.post('/login', login);

// GET /api/auth/me  — any authenticated user
router.get('/me', protect, getMe);

module.exports = router;
