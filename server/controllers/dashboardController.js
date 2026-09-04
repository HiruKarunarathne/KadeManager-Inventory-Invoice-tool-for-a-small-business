// controllers/dashboardController.js
// Handles HTTP req/res for dashboard/stats endpoints.
// Member 1 owns this file.

const dashboardService = require('../services/dashboardService');

const respond = (res, statusCode, data) => res.status(statusCode).json(data);

/**
 * GET /api/dashboard/stats
 * Accessible by ALL authenticated users — shared overview stats
 */
const getSharedStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getSharedStats();
    respond(res, 200, { success: true, message: 'Dashboard stats retrieved', data: stats });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/sales
 * OWNER ONLY — full sales summary with revenue breakdown
 * Query param: ?period=today|week|month (default: month)
 */
const getSalesSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getSalesSummary(req.query.period);
    respond(res, 200, { success: true, message: 'Sales summary retrieved', data: summary });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSharedStats, getSalesSummary };
