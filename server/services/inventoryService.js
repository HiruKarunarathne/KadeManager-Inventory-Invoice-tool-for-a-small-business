// services/inventoryService.js
// Business logic for inventory management at Perera Stores.
// Member 2 owns this file.

const Product = require('../models/Product');

/**
 * Fetch all products with search and filtering
 */
const getAllProducts = async (query = {}) => {
  const { search, category, lowStock } = query;
  const filter = { isActive: true };

  if (search) filter.name = { $regex: search, $options: 'i' };
  if (category) filter.category = category;

  const products = await Product.find(filter).sort({ name: 1 });

  if (lowStock === 'true' || lowStock === true) {
    return products.filter((p) => p.quantity <= p.lowStockThreshold);
  }

  return products;
};

/**
 * Get a single product by ID
 */
const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product || !product.isActive) {
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
  return await Product.create(data);
};

/**
 * Update a product
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
 * Soft-delete a product — OWNER ONLY (enforced at route level via roleCheck)
 */
const deleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return { message: `Product "${product.name}" removed` };
};

/**
 * Get all low-stock products (quantity <= lowStockThreshold)
 */
const getLowStockProducts = async () => {
  const products = await Product.find({ isActive: true });
  return products.filter((p) => p.quantity <= p.lowStockThreshold);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
};
