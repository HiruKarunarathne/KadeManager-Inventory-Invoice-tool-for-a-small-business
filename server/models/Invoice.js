// models/Invoice.js
// Mongoose schema for sales invoices at Perera Stores
// Member 3 owns the invoice module end-to-end

const mongoose = require('mongoose');

// Sub-schema for each line item in an invoice
const invoiceItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    productName: {
      // Snapshot of name at time of sale (in case product is edited later)
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Item quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unitPrice: {
      // Snapshot of price at time of sale
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      trim: true,
      default: 'Walk-in Customer',
    },
    items: {
      type: [invoiceItemSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Invoice must have at least one item',
      },
    },
    total: {
      type: Number,
      required: [true, 'Invoice total is required'],
      min: [0, 'Total cannot be negative'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Invoice must have a creator'],
    },
  },
  {
    timestamps: true, // createdAt is the sale timestamp
  }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
