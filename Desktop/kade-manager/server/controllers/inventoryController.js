const asyncWrapper = require('../middleware/asyncWrapper');
const inventoryService = require('../services/inventoryService');

const getProducts = asyncWrapper(async (req, res) => {
  const products = await inventoryService.getAllProducts(req.query);
  res.status(200).json({ count: products.length, products });
});

const getProduct = asyncWrapper(async (req, res) => {
  const product = await inventoryService.getProductById(req.params.id);
  res.status(200).json({ product });
});

const createProduct = asyncWrapper(async (req, res) => {
  const product = await inventoryService.createProduct(req.body);
  res.status(201).json({ message: 'Product created', product });
});

const updateProduct = asyncWrapper(async (req, res) => {
  const product = await inventoryService.updateProduct(req.params.id, req.body);
  res.status(200).json({ message: 'Product updated', product });
});

const deleteProduct = asyncWrapper(async (req, res) => {
  await inventoryService.deleteProduct(req.params.id);
  res.status(200).json({ message: 'Product deleted successfully' });
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
