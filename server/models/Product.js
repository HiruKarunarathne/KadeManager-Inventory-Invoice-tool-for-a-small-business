// models/Product.js
// Mongoose schema for Perera Stores inventory items
// Member 2 owns the inventory module end-to-end

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      // e.g. 'Dry Goods', 'Beverages', 'Dairy', 'Cleaning', 'Snacks'
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true,
      // e.g. 'kg', 'g', 'L', 'ml', 'pcs', 'pack'
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required (LKR)'],
      min: [0, 'Price cannot be negative'],
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [0, 'Low stock threshold cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual: is this product low on stock?
productSchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.lowStockThreshold;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
