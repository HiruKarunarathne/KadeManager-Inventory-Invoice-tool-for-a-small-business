const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Only owners can view dashboard analytics
router.get('/stats', protect, roleCheck(['owner']), getStats);

module.exports = router;
