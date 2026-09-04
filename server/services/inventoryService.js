const Product = require('../models/Product');

/**
 * Get all active products with optional filters
 */
const getAllProducts = async ({ category, lowStock } = {}) => {
  const query = { isActive: true };
  if (category) query.category = category;

  const products = await Product.find(query).sort({ name: 1 });

  // If lowStock filter requested, return only products at or below threshold
  if (lowStock === 'true') {
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
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  return product;
};

/**
 * Create a new product
 */
const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

/**
 * Update a product by ID (staff and owner can update)
 */
const updateProduct = async (id, updates) => {
  const product = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  return product;
};

/**
 * Soft-delete a product by ID (owner only — enforced at route level)
 */
const deleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  return { message: `Product "${product.name}" removed` };
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
