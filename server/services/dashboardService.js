// services/dashboardService.js
// Business logic for dashboard/sales summary.
// Member 1 owns this file.

const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

/**
 * Full dashboard statistics with role-based filtering.
 * ─ Total active products (All roles)
 * ─ Low-stock count and alert list (All roles)
 * ─ Today's invoice count (All roles)
 * ─ Sales revenue figures (Owner only)
 *
 * @param {string} userRole - 'owner' or 'staff'
 */
const getDashboardStats = async (userRole) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Product & stock counts
  const [totalProducts, activeProducts, todayInvoicesCount] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Product.find({ isActive: true }).select('name category unit quantity lowStockThreshold unitPrice'),
    Invoice.countDocuments({ createdAt: { $gte: startOfDay } }),
  ]);

  const lowStockAlerts = activeProducts.filter((p) => p.quantity <= p.lowStockThreshold);
  const adequatelyStocked = totalProducts - lowStockAlerts.length;

  const baseStats = {
    totalProducts,
    lowStockCount: lowStockAlerts.length,
    adequatelyStocked,
    todayInvoicesCount,
    lowStockAlerts,
  };

  // 2. Financial totals: ONLY compute and attach for owner
  if (userRole === 'owner') {
    const [todayAgg, monthAgg, allTimeAgg] = await Promise.all([
      Invoice.aggregate([
        { $match: { createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),
      Invoice.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),
      Invoice.aggregate([
        { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),
    ]);

    return {
      ...baseStats,
      sales: {
        today: {
          revenue: todayAgg[0]?.total ?? 0,
          invoices: todayAgg[0]?.count ?? 0,
        },
        thisMonth: {
          revenue: monthAgg[0]?.total ?? 0,
          invoices: monthAgg[0]?.count ?? 0,
        },
        allTime: {
          revenue: allTimeAgg[0]?.total ?? 0,
          invoices: allTimeAgg[0]?.count ?? 0,
        },
      },
    };
  }

  // Staff gets stock and invoice activity without revenue figures
  return baseStats;
};

/**
 * Sales summary: total revenue and invoice count, owner-only.
 */
const getSalesSummary = async (period = 'month') => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let startDate;
  if (period === 'today') {
    startDate = startOfDay;
  } else if (period === 'week') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
  } else {
    startDate = startOfMonth;
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
 * Dashboard stats visible to ALL logged-in users (owner + staff) — legacy alias
 */
const getSharedStats = async () => {
  const totalProducts = await Product.countDocuments({ isActive: true });
  const lowStockProducts = await Product.find({ isActive: true }).then((products) =>
    products.filter((p) => p.quantity <= p.lowStockThreshold)
  );

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const invoicesToday = await Invoice.countDocuments({ createdAt: { $gte: todayStart } });

  return { totalProducts, lowStockCount: lowStockProducts.length, lowStockProducts, invoicesToday };
};

/**
 * Low-stock alerts — visible to both roles
 */
const getLowStockAlerts = async () => {
  const products = await Product.find({ isActive: true });
  return products.filter((p) => p.quantity <= p.lowStockThreshold);
};

/**
 * Recent invoices for a quick-view widget
 * Role-aware: excludes financial figures for staff
 */
const getRecentInvoices = async (limit = 5, userRole = 'owner') => {
  const invoices = await Invoice.find()
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  if (userRole !== 'owner') {
    return invoices.map((inv) => ({
      _id: inv._id,
      invoiceNumber: inv.invoiceNumber,
      customerName: inv.customerName,
      createdAt: inv.createdAt,
      itemCount: inv.items ? inv.items.reduce((sum, item) => sum + item.quantity, 0) : 0,
      createdBy: inv.createdBy,
    }));
  }

  return invoices;
};

module.exports = {
  getDashboardStats,
  getSalesSummary,
  getSharedStats,
  getLowStockAlerts,
  getRecentInvoices,
};
