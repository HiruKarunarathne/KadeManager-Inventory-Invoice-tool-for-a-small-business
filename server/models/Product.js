const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: ['Grocery', 'Beverage', 'Dairy', 'Bakery', 'Household', 'Personal Care', 'Snacks', 'Other'],
        message: 'Invalid category',
      },
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true,
      enum: {
        values: ['kg', 'g', 'L', 'ml', 'pcs', 'pack', 'bottle', 'tin', 'box'],
        message: 'Invalid unit',
      },
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Price cannot be negative'],
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, 'Threshold cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Virtual: check if stock is low
ProductSchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.lowStockThreshold;
});

ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
