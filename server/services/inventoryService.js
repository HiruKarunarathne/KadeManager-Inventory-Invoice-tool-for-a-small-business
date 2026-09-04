// services/inventoryService.js
// Business logic for inventory management at Perera Stores.
// Member 2 owns this file.

const Product = require('../models/Product');

/**
 * Fetch all products (optionally filtered by category)
 */
const getAllProducts = async (filters = {}) => {
  const query = {};
  if (filters.category) query.category = filters.category;
  return await Product.find(query).sort({ name: 1 });
};

/**
 * Get a single product by ID
 */
const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

/**
 * Create a new product
 */
const createProduct = async (data) => {
  const { name, category, unit, quantity, unitPrice, lowStockThreshold } = data;
  if (!name || !category || !unit || unitPrice == null) {
    const err = new Error('name, category, unit, and unitPrice are required');
    err.statusCode = 400;
    throw err;
  }
  return await Product.create({ name, category, unit, quantity, unitPrice, lowStockThreshold });
};

/**
 * Update a product (owner and staff can both update)
 */
const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

/**
 * Delete a product — OWNER ONLY (enforced at route level via roleCheck)
 */
const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return { message: 'Product deleted successfully' };
};

/**
 * Get all low-stock products (quantity <= lowStockThreshold)
 */
const getLowStockProducts = async () => {
  // Use aggregation to compare quantity vs threshold field
  return await Product.find({ $expr: { $lte: ['$quantity', '$lowStockThreshold'] } });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
};
