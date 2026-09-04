// ═══════════════════════════════════════════════════════
//  DASHBOARD ROUTES  —  Member 1 owns this file
// ═══════════════════════════════════════════════════════
const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getSalesSummary,
  getLowStock,
  getRecentInvoices,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const { asyncWrapper } = require('../middleware/asyncWrapper');

router.use(protect);

// GET /api/dashboard/stats           — both roles (summary cards, revenue omitted for staff)
router.get('/stats', asyncWrapper(getDashboardStats));

// GET /api/dashboard/summary         — owner only (sales revenue data)
router.get('/summary', roleCheck(['owner']), asyncWrapper(getSalesSummary));

// GET /api/dashboard/low-stock       — both roles
router.get('/low-stock', asyncWrapper(getLowStock));

// GET /api/dashboard/recent-invoices — both roles, optional ?limit=5
router.get('/recent-invoices', asyncWrapper(getRecentInvoices));

module.exports = router;
