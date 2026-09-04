const asyncWrapper = require('../middleware/asyncWrapper');
const dashboardService = require('../services/dashboardService');

const getStats = asyncWrapper(async (req, res) => {
  const stats = await dashboardService.getDashboardStats();
  res.status(200).json({ stats });
});

module.exports = { getStats };
