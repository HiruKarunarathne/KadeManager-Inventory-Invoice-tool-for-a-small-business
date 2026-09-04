const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

const createInvoice = async ({ customerName, items, createdBy }) => {
  // Validate stock and compute totals
  const enrichedItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      const err = new Error(`Product with id ${item.productId} not found`);
      err.statusCode = 404;
      throw err;
    }
    if (product.quantity < item.quantity) {
      const err = new Error(
        `Insufficient stock for "${product.name}". Available: ${product.quantity}`
      );
      err.statusCode = 400;
      throw err;
    }

    const lineTotal = item.quantity * product.unitPrice;
    totalAmount += lineTotal;

    enrichedItems.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      unitPrice: product.unitPrice,
      total: lineTotal,
    });

    // Deduct stock
    product.quantity -= item.quantity;
    await product.save();
  }

  return Invoice.create({ customerName, items: enrichedItems, totalAmount, createdBy });
};

const getAllInvoices = async () =>
  Invoice.find().populate('createdBy', 'name email').sort({ createdAt: -1 });

const getInvoiceById = async (id) => {
  const invoice = await Invoice.findById(id).populate('createdBy', 'name email');
  if (!invoice) {
    const err = new Error('Invoice not found');
    err.statusCode = 404;
    throw err;
  }
  return invoice;
};

module.exports = { createInvoice, getAllInvoices, getInvoiceById };
