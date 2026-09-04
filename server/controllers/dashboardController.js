// controllers/dashboardController.js
// Handles HTTP request/response cycle for dashboard endpoints.
// Member 1 owns this file.

const asyncWrapper = require('../middleware/asyncWrapper');
const dashboardService = require('../services/dashboardService');

/**
 * GET /api/dashboard/stats
 * Both roles — returns summary cards (revenue gated for owner only)
 */
const getDashboardStats = asyncWrapper(async (req, res) => {
  const stats = await dashboardService.getDashboardStats(req.user.role);
  res.status(200).json({ success: true, data: { stats } });
});

/**
 * GET /api/dashboard/stats — legacy alias
 */
const getSharedStats = getDashboardStats;

/**
 * GET /api/dashboard/summary (owner only)
 * Sales revenue + invoice counts with daily breakdown
 */
const getSalesSummary = asyncWrapper(async (req, res) => {
  const summary = await dashboardService.getSalesSummary(req.query.period);
  res.status(200).json({ success: true, data: { summary } });
});

/**
 * GET /api/dashboard/low-stock
 * Both roles — products at or below lowStockThreshold
 */
const getLowStock = asyncWrapper(async (req, res) => {
  const alerts = await dashboardService.getLowStockAlerts();
  res.status(200).json({
    success: true,
    data: { alerts, count: alerts.length },
  });
});

/**
 * GET /api/dashboard/recent-invoices
 * Both roles — last N invoices for quick view (totals hidden from staff)
 */
const getRecentInvoices = asyncWrapper(async (req, res) => {
  const invoices = await dashboardService.getRecentInvoices(req.query.limit, req.user.role);
  res.status(200).json({ success: true, data: { invoices } });
});

module.exports = {
  getDashboardStats,
  getSharedStats,
  getSalesSummary,
  getLowStock,
  getRecentInvoices,
};
