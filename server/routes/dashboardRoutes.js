// routes/dashboardRoutes.js
// Dashboard/stats endpoints
// Member 1 owns this module end-to-end
//
// RBAC summary:
//   GET /stats  → owner + staff (shared overview)
//   GET /sales  → OWNER ONLY   (revenue & detailed breakdown)

const express = require('express');
const router = express.Router();
const { getSharedStats, getSalesSummary } = require('../controllers/dashboardController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(protect);

router.get('/stats', getSharedStats);                             // all users
router.get('/sales', roleCheck(['owner']), getSalesSummary);     // OWNER ONLY

module.exports = router;
