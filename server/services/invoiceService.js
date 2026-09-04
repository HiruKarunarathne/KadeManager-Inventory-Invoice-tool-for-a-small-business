const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

/**
 * Create a new invoice and decrement stock for each item
 */
const createInvoice = async ({ customerName, items, notes }, userId) => {
  // Validate and enrich items from DB
  let total = 0;
  const enrichedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      const error = new Error(`Product not found: ${item.product}`);
      error.statusCode = 404;
      throw error;
    }
    if (product.quantity < item.quantity) {
      const error = new Error(
        `Insufficient stock for "${product.name}". Available: ${product.quantity}, requested: ${item.quantity}`
      );
      error.statusCode = 400;
      throw error;
    }

    const subtotal = product.unitPrice * item.quantity;
    total += subtotal;

    enrichedItems.push({
      product: product._id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.unitPrice,
      subtotal,
    });

    // Decrement stock
    await Product.findByIdAndUpdate(product._id, {
      $inc: { quantity: -item.quantity },
    });
  }

  const invoice = await Invoice.create({
    customerName: customerName || 'Walk-in Customer',
    items: enrichedItems,
    total,
    notes,
    createdBy: userId,
  });

  return invoice.populate('createdBy', 'name email');
};

/**
 * Get all invoices (owner) or invoices created by this user (staff)
 */
const getAllInvoices = async ({ userId, role, page = 1, limit = 20 }) => {
  const query = role === 'owner' ? {} : { createdBy: userId };
  const skip = (page - 1) * limit;

  const [invoices, total] = await Promise.all([
    Invoice.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Invoice.countDocuments(query),
  ]);

  return { invoices, total, page: Number(page), pages: Math.ceil(total / limit) };
};

/**
 * Get a single invoice by ID
 */
const getInvoiceById = async (id) => {
  const invoice = await Invoice.findById(id).populate('createdBy', 'name email');
  if (!invoice) {
    const error = new Error('Invoice not found');
    error.statusCode = 404;
    throw error;
  }
  return invoice;
};

module.exports = { createInvoice, getAllInvoices, getInvoiceById };
