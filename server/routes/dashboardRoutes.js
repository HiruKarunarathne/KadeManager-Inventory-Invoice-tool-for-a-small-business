// routes/dashboardRoutes.js
// Dashboard/stats endpoints
// Member 1 owns this module end-to-end
//
// RBAC summary:
//   GET /stats           → owner + staff (shared overview)
//   GET /summary         → OWNER ONLY   (revenue & detailed breakdown)
//   GET /low-stock       → owner + staff
//   GET /recent-invoices → owner + staff

const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getSalesSummary,
  getLowStock,
  getRecentInvoices,
} = require('../controllers/dashboardController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(protect);

// GET /api/dashboard/stats — all users (revenue gated by role in service)
router.get('/stats', getDashboardStats);

// GET /api/dashboard/summary — OWNER ONLY (sales revenue data)
router.get('/summary', roleCheck(['owner']), getSalesSummary);

// GET /api/dashboard/sales — OWNER ONLY (legacy alias)
router.get('/sales', roleCheck(['owner']), getSalesSummary);

// GET /api/dashboard/low-stock — both roles
router.get('/low-stock', getLowStock);

// GET /api/dashboard/recent-invoices — both roles, optional ?limit=5
router.get('/recent-invoices', getRecentInvoices);

module.exports = router;
