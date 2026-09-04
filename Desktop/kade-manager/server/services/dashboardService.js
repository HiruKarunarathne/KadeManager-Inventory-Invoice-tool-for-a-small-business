const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

/**
 * Returns key dashboard metrics:
 * - Total revenue (all time)
 * - Today's revenue
 * - Total invoices
 * - Low stock product count
 * - Top 5 selling products by quantity
 */
const getDashboardStats = async () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [totalRevenueResult, todayRevenueResult, totalInvoices, lowStockCount, topProducts] =
    await Promise.all([
      Invoice.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Invoice.aggregate([
        { $match: { createdAt: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Invoice.countDocuments(),
      Product.countDocuments({ $expr: { $lte: ['$quantity', '$lowStockThreshold'] } }),
      Invoice.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            name: { $first: '$items.name' },
            totalSold: { $sum: '$items.quantity' },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
      ]),
    ]);

  return {
    totalRevenue: totalRevenueResult[0]?.total ?? 0,
    todayRevenue: todayRevenueResult[0]?.total ?? 0,
    totalInvoices,
    lowStockCount,
    topProducts,
  };
};

module.exports = { getDashboardStats };
