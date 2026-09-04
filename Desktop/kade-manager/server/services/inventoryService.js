const Product = require('../models/Product');

const getAllProducts = async (query = {}) => {
  const { search, category, lowStock } = query;
  const filter = {};

  if (search) filter.name = { $regex: search, $options: 'i' };
  if (category) filter.category = category;
  if (lowStock === 'true') filter.$expr = { $lte: ['$quantity', '$lowStockThreshold'] };

  return Product.find(filter).sort({ name: 1 });
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

const createProduct = async (data) => Product.create(data);

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

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
