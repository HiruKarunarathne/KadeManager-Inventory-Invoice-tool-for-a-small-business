// services/invoiceService.js
// Business logic for invoice creation and retrieval at Perera Stores.
// Member 3 owns this file.

const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

/**
 * Create a new invoice.
 * Validates stock availability and deducts quantity from inventory.
 *
 * @param {string[]} items - Array of { productId, quantity }
 * @param {string} customerName
 * @param {string} createdBy - User ID of the staff/owner creating the invoice
 */
const createInvoice = async ({ customerName, items, createdBy }) => {
  if (!items || items.length === 0) {
    const err = new Error('Invoice must contain at least one item');
    err.statusCode = 400;
    throw err;
  }

  let total = 0;
  const invoiceItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      const err = new Error(`Product with ID ${item.productId} not found`);
      err.statusCode = 404;
      throw err;
    }
    if (product.quantity < item.quantity) {
      const err = new Error(
        `Insufficient stock for "${product.name}". Available: ${product.quantity} ${product.unit}`
      );
      err.statusCode = 400;
      throw err;
    }

    const subtotal = product.unitPrice * item.quantity;
    total += subtotal;

    invoiceItems.push({
      product: product._id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.unitPrice,
      subtotal,
    });

    // Deduct stock
    product.quantity -= item.quantity;
    await product.save();
  }

  const invoice = await Invoice.create({
    customerName: customerName || 'Walk-in Customer',
    items: invoiceItems,
    total,
    createdBy,
  });

  return await invoice.populate('createdBy', 'name role');
};

/**
 * Get all invoices (newest first)
 */
const getAllInvoices = async () => {
  return await Invoice.find()
    .populate('createdBy', 'name role')
    .sort({ createdAt: -1 });
};

/**
 * Get a single invoice by ID
 */
const getInvoiceById = async (id) => {
  const invoice = await Invoice.findById(id).populate('createdBy', 'name role');
  if (!invoice) {
    const err = new Error('Invoice not found');
    err.statusCode = 404;
    throw err;
  }
  return invoice;
};

module.exports = { createInvoice, getAllInvoices, getInvoiceById };
