const dashboardService = require('../services/dashboardService');

/**
 * GET /api/dashboard/stats
 * Both roles — returns summary cards (revenue gated for owner only)
 */
const getDashboardStats = async (req, res) => {
  const stats = await dashboardService.getDashboardStats(req.user.role);
  res.status(200).json({ success: true, data: { stats } });
};

/**
 * GET /api/dashboard/summary
 * Owner only — sales revenue + invoice counts
 */
const getSalesSummary = async (req, res) => {
  const summary = await dashboardService.getSalesSummary();
  res.status(200).json({ success: true, data: { summary } });
};

/**
 * GET /api/dashboard/low-stock
 * Both roles — products at or below lowStockThreshold
 */
const getLowStock = async (req, res) => {
  const alerts = await dashboardService.getLowStockAlerts();
  res.status(200).json({
    success: true,
    data: { alerts, count: alerts.length },
  });
};

/**
 * GET /api/dashboard/recent-invoices
 * Both roles — last N invoices for quick view (totals hidden from staff)
 */
const getRecentInvoices = async (req, res) => {
  const invoices = await dashboardService.getRecentInvoices(req.query.limit, req.user.role);
  res.status(200).json({ success: true, data: { invoices } });
};

module.exports = {
  getDashboardStats,
  getSalesSummary,
  getLowStock,
  getRecentInvoices,
};
