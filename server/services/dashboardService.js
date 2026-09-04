// services/dashboardService.js
// Business logic for dashboard/sales summary — OWNER ONLY.
// Member 1 owns this file.

const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

/**
 * Sales summary: total revenue, invoice count, and daily breakdown.
 * This is owner-only data — enforced at the route level via roleCheck.
 *
 * @param {string} period - 'today' | 'week' | 'month' (default: 'month')
 */
const getSalesSummary = async (period = 'month') => {
  const now = new Date();
  let startDate;

  if (period === 'today') {
    startDate = new Date(now.setHours(0, 0, 0, 0));
  } else if (period === 'week') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
  } else {
    startDate = new Date(now);
    startDate.setDate(1); // First day of current month
    startDate.setHours(0, 0, 0, 0);
  }

  const invoices = await Invoice.find({ createdAt: { $gte: startDate } });

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const invoiceCount = invoices.length;

  // Daily breakdown
  const dailyMap = {};
  invoices.forEach((inv) => {
    const day = inv.createdAt.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    if (!dailyMap[day]) dailyMap[day] = { date: day, revenue: 0, count: 0 };
    dailyMap[day].revenue += inv.total;
    dailyMap[day].count += 1;
  });
  const dailyBreakdown = Object.values(dailyMap).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return { totalRevenue, invoiceCount, period, dailyBreakdown };
};

/**
 * Dashboard stats visible to ALL logged-in users (owner + staff)
 */
const getSharedStats = async () => {
  const totalProducts = await Product.countDocuments();
  const lowStockProducts = await Product.find({
    $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
  }).select('name quantity unit lowStockThreshold');

  // Total invoices today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const invoicesToday = await Invoice.countDocuments({ createdAt: { $gte: todayStart } });

  return { totalProducts, lowStockCount: lowStockProducts.length, lowStockProducts, invoicesToday };
};

module.exports = { getSalesSummary, getSharedStats };
