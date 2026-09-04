// services/invoiceService.js
// Business logic for invoice creation, retrieval, voiding, and stock management.
// Member 3 owns this file.

const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

/**
 * Generate the next sequential invoice number in the format "INV-0001".
 */
const getNextInvoiceNumber = async () => {
  const lastInvoice = await Invoice.findOne({}, { invoiceNumber: 1 })
    .sort({ createdAt: -1 })
    .lean();

  let nextNum = 1;
  if (lastInvoice && lastInvoice.invoiceNumber) {
    const match = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
    if (match) {
      nextNum = parseInt(match[1], 10) + 1;
    }
  }

  return `INV-${String(nextNum).padStart(4, '0')}`;
};

/**
 * Create a new invoice.
 * Validates stock availability for ALL items in a first pass before deducting anything.
 * If any item has insufficient stock, an error is thrown and zero stock is deducted.
 *
 * @param {Object} params
 * @param {Array<{ productId: string, quantity: number }>} params.items
 * @param {string} [params.customerName]
 * @param {string} params.createdBy - User ID of the staff/owner creating the invoice
 */
const createInvoice = async ({ items, customerName, createdBy }) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    const err = new Error('Invoice must contain at least one item');
    err.statusCode = 400;
    throw err;
  }

  // --- PASS 1: Validate all items and stock levels atomically ---
  const stockShortages = [];
  const fetchedProducts = [];

  for (const item of items) {
    if (!item.productId) {
      const err = new Error('Each item must contain a valid productId');
      err.statusCode = 400;
      throw err;
    }

    const rawQty = Number(item.quantity);
    if (!rawQty || rawQty <= 0 || isNaN(rawQty)) {
      const err = new Error('Item quantity must be a positive number greater than 0');
      err.statusCode = 400;
      throw err;
    }

    const product = await Product.findById(item.productId);
    if (!product) {
      const err = new Error(`Product with ID ${item.productId} not found`);
      err.statusCode = 404;
      throw err;
    }

    const unitType = product.unitType || 'countable';
    let validatedQty;

    if (unitType === 'countable') {
      if (!Number.isInteger(rawQty)) {
        const err = new Error(`Quantity for "${product.name}" must be a whole number`);
        err.statusCode = 400;
        throw err;
      }
      validatedQty = rawQty;
    } else {
      // Measured products allow decimals rounded to 2 decimal places (e.g. 0.5, 1.25)
      validatedQty = Math.round(rawQty * 100) / 100;
      if (validatedQty <= 0) {
        const err = new Error(`Quantity for "${product.name}" must be at least 0.01 ${product.unit}`);
        err.statusCode = 400;
        throw err;
      }
    }

    if (product.quantity < validatedQty) {
      stockShortages.push(
        `"${product.name}" (requested: ${validatedQty} ${product.unit}, available: ${product.quantity} ${product.unit})`
      );
    }

    fetchedProducts.push({ product, quantity: validatedQty });
  }

  // If any product lacks sufficient stock, halt and deduct NOTHING
  if (stockShortages.length > 0) {
    const err = new Error(`Insufficient stock for: ${stockShortages.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  // --- PASS 2: Deduct stock and build line item snapshots ---
  let total = 0;
  const invoiceItems = [];

  for (const { product, quantity } of fetchedProducts) {
    const lineTotal = Math.round(product.unitPrice * quantity * 100) / 100;
    total = Math.round((total + lineTotal) * 100) / 100;

    // Snapshot details into invoice item
    invoiceItems.push({
      productId: product._id,
      productName: product.name,
      unit: product.unit,
      unitType: product.unitType || 'countable',
      quantity,
      unitPrice: product.unitPrice,
      lineTotal,
    });

    // Deduct stock (rounding to 2 decimals for measured quantities to prevent float drift)
    product.quantity = Math.round((product.quantity - quantity) * 100) / 100;
    await product.save();
  }

  // Auto-generate next sequential invoice number
  const invoiceNumber = await getNextInvoiceNumber();

  // Persist invoice
  const invoice = await Invoice.create({
    invoiceNumber,
    customerName: customerName && customerName.trim() ? customerName.trim() : 'Walk-in Customer',
    items: invoiceItems,
    total,
    status: 'completed',
    createdBy,
  });

  return await invoice.populate('createdBy', 'name email role');
};

/**
 * Get all invoices (newest first)
 */
const getAllInvoices = async (filters = {}) => {
  return await Invoice.find(filters)
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 });
};

/**
 * Get a single invoice by ID
 */
const getInvoiceById = async (id) => {
  const invoice = await Invoice.findById(id)
    .populate('createdBy', 'name email role')
    .populate('items.productId');

  if (!invoice) {
    const err = new Error('Invoice not found');
    err.statusCode = 404;
    throw err;
  }

  return invoice;
};

/**
 * Update customer name on an invoice.
 * Harmless metadata field editable by owner or staff.
 */
const updateCustomerName = async (id, customerName) => {
  const invoice = await Invoice.findById(id);
  if (!invoice) {
    const err = new Error('Invoice not found');
    err.statusCode = 404;
    throw err;
  }

  invoice.customerName = customerName && customerName.trim() ? customerName.trim() : 'Walk-in Customer';
  await invoice.save();

  return await invoice.populate('createdBy', 'name email role');
};

/**
 * Void an invoice (Delete operation) and restore stock.
 * Reject if already voided.
 *
 * @param {string} id - Invoice ID
 * @param {string} userId - User ID initiating the void
 */
const voidInvoice = async (id, userId) => {
  const invoice = await Invoice.findById(id);
  if (!invoice) {
    const err = new Error('Invoice not found');
    err.statusCode = 404;
    throw err;
  }

  if (invoice.status === 'voided') {
    const err = new Error('Invoice is already voided');
    err.statusCode = 400;
    throw err;
  }

  // Restore inventory stock for each line item
  for (const item of invoice.items) {
    if (item.productId) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.quantity = Math.round((product.quantity + item.quantity) * 100) / 100;
        await product.save();
      }
    }
  }

  invoice.status = 'voided';
  await invoice.save();

  return await invoice.populate('createdBy', 'name email role');
};

/**
 * Update invoice status.
 * Only transitions from 'completed' to 'voided' are permitted.
 */
const updateInvoiceStatus = async (id, newStatus, userId) => {
  if (newStatus !== 'voided') {
    const err = new Error('Invalid status transition. Invoices can only be transitioned from completed to voided.');
    err.statusCode = 400;
    throw err;
  }
  return await voidInvoice(id, userId);
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateCustomerName,
  voidInvoice,
  updateInvoiceStatus,
  getNextInvoiceNumber,
};
