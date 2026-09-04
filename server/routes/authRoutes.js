const express = require('express');
const router = express.Router();
const { login, register, getMe, getStaff, deleteStaff } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const { asyncWrapper } = require('../middleware/asyncWrapper');

// Public
router.post('/login', asyncWrapper(login));

// Protected — any authenticated user
router.get('/me', protect, asyncWrapper(getMe));

// Protected — owner only
router.post('/register', protect, roleCheck(['owner']), asyncWrapper(register));
router.get('/staff', protect, roleCheck(['owner']), asyncWrapper(getStaff));
router.delete('/staff/:id', protect, roleCheck(['owner']), asyncWrapper(deleteStaff));

module.exports = router;
