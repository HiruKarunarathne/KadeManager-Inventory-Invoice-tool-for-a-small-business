// models/Invoice.js
// Mongoose schema for sales invoices at Perera Stores
// Member 3 owns the invoice module end-to-end

const mongoose = require('mongoose');

// Sub-schema for each line item in an invoice
const invoiceItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    productName: {
      // Snapshot of name at time of sale (in case product is edited later)
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Item quantity is required'],
      min: [0.01, 'Quantity must be at least 0.01'],
    },
    unit: {
      type: String,
      trim: true,
    },
    unitType: {
      type: String,
      enum: ['measured', 'countable'],
      default: 'countable',
    },
    unitPrice: {
      // Snapshot of price at time of sale
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
    },
    lineTotal: {
      type: Number,
      required: [true, 'Line total is required'],
      min: [0, 'Line total cannot be negative'],
    },
  },
  { _id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual alias: subtotal -> lineTotal (for compatibility with existing UI components)
invoiceItemSchema.virtual('subtotal').get(function () {
  return this.lineTotal;
});

// Virtual alias: product -> productId
invoiceItemSchema.virtual('product').get(function () {
  return this.productId;
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      // auto-generated before save via service layer
    },
    customerName: {
      type: String,
      trim: true,
      default: 'Walk-in Customer',
      maxlength: [100, 'Customer name cannot exceed 100 characters'],
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
    notes: {
      type: String,
      maxlength: [300, 'Notes cannot exceed 300 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['completed', 'voided'],
        message: 'Status must be either completed or voided',
      },
      default: 'completed',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Invoice must have a creator'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
