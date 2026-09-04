const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

/**
 * Full dashboard statistics with role-based filtering
 * ─ Total active products (All roles)
 * ─ Low-stock count and alert list (All roles)
 * ─ Today's invoice count (All roles)
 * ─ Sales revenue figures (Owner only)
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
 * Sales summary for the dashboard (legacy owner-only endpoint)
 */
const getSalesSummary = async () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayResult, monthResult, allTimeResult] = await Promise.all([
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
    today: {
      revenue: todayResult[0]?.total ?? 0,
      invoices: todayResult[0]?.count ?? 0,
    },
    thisMonth: {
      revenue: monthResult[0]?.total ?? 0,
      invoices: monthResult[0]?.count ?? 0,
    },
    allTime: {
      revenue: allTimeResult[0]?.total ?? 0,
      invoices: allTimeResult[0]?.count ?? 0,
    },
  };
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
  getLowStockAlerts,
  getRecentInvoices,
};
