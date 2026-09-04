const inventoryService = require('../services/inventoryService');

/**
 * GET /api/inventory
 * Both roles — optional ?category=&lowStock=true filters
 */
const getProducts = async (req, res) => {
  const products = await inventoryService.getAllProducts(req.query);
  res.status(200).json({
    success: true,
    data: { products, count: products.length },
  });
};

/**
 * GET /api/inventory/:id
 * Both roles
 */
const getProduct = async (req, res) => {
  const product = await inventoryService.getProductById(req.params.id);
  res.status(200).json({ success: true, data: { product } });
};

/**
 * POST /api/inventory
 * Both roles (staff can add, not delete)
 */
const createProduct = async (req, res) => {
  const product = await inventoryService.createProduct(req.body);
  res.status(201).json({
    success: true,
    message: 'Product added to inventory',
    data: { product },
  });
};

/**
 * PUT /api/inventory/:id
 * Both roles
 */
const updateProduct = async (req, res) => {
  const product = await inventoryService.updateProduct(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Product updated',
    data: { product },
  });
};

/**
 * DELETE /api/inventory/:id
 * Owner only (enforced via roleCheck in route)
 */
const deleteProduct = async (req, res) => {
  const result = await inventoryService.deleteProduct(req.params.id);
  res.status(200).json({
    success: true,
    message: result.message,
  });
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
