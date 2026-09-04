// controllers/inventoryController.js
// Handles HTTP req/res for inventory endpoints.
// Member 2 owns this file.

const inventoryService = require('../services/inventoryService');

const respond = (res, statusCode, data) => res.status(statusCode).json(data);

/** GET /api/inventory */
const getAllProducts = async (req, res, next) => {
  try {
    const products = await inventoryService.getAllProducts(req.query);
    respond(res, 200, { success: true, message: 'Products retrieved', data: products });
  } catch (err) {
    next(err);
  }
};

/** GET /api/inventory/low-stock */
const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await inventoryService.getLowStockProducts();
    respond(res, 200, { success: true, message: 'Low stock products retrieved', data: products });
  } catch (err) {
    next(err);
  }
};

/** GET /api/inventory/:id */
const getProductById = async (req, res, next) => {
  try {
    const product = await inventoryService.getProductById(req.params.id);
    respond(res, 200, { success: true, message: 'Product retrieved', data: product });
  } catch (err) {
    next(err);
  }
};

/** POST /api/inventory */
const createProduct = async (req, res, next) => {
  try {
    const product = await inventoryService.createProduct(req.body);
    respond(res, 201, { success: true, message: 'Product created', data: product });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/inventory/:id */
const updateProduct = async (req, res, next) => {
  try {
    const product = await inventoryService.updateProduct(req.params.id, req.body);
    respond(res, 200, { success: true, message: 'Product updated', data: product });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/inventory/:id — owner only */
const deleteProduct = async (req, res, next) => {
  try {
    const result = await inventoryService.deleteProduct(req.params.id);
    respond(res, 200, { success: true, message: result.message, data: null });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getLowStockProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
