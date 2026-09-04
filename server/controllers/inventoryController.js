// controllers/inventoryController.js
// Handles HTTP req/res for inventory endpoints.
// Member 2 owns this file.

const asyncWrapper = require('../middleware/asyncWrapper');
const inventoryService = require('../services/inventoryService');

/**
 * Validates product payload for required fields and numeric constraints
 */
const validateProductPayload = (body, isUpdate = false) => {
  const name = body.name !== undefined ? String(body.name).trim() : undefined;
  const category = body.category !== undefined ? String(body.category).trim() : undefined;
  const price = body.price !== undefined ? body.price : body.unitPrice;
  const stockQuantity = body.stockQuantity !== undefined ? body.stockQuantity : body.quantity;

  // 1. Required field checks on creation
  if (!isUpdate) {
    if (!name) return 'Validation Error: "name" is required';
    if (!category) return 'Validation Error: "category" is required';
    if (price === undefined || price === null || price === '') return 'Validation Error: "price" is required';
    if (stockQuantity === undefined || stockQuantity === null || stockQuantity === '') {
      return 'Validation Error: "stockQuantity" is required';
    }
  }

  // 2. Format & value range checks
  if (name !== undefined && !name) return 'Validation Error: "name" cannot be empty';
  if (category !== undefined && !category) return 'Validation Error: "category" cannot be empty';

  if (price !== undefined) {
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) return 'Validation Error: "price" must be greater than 0';
  }

  if (stockQuantity !== undefined) {
    const numStock = Number(stockQuantity);
    if (isNaN(numStock) || numStock < 0) return 'Validation Error: "stockQuantity" cannot be negative (must be >= 0)';
  }

  return null;
};

/**
 * Normalize payload so both price/unitPrice and stockQuantity/quantity work with Mongoose
 */
const formatProductData = (body) => {
  const data = { ...body };
  if (body.name !== undefined) data.name = String(body.name).trim();
  if (body.category !== undefined) data.category = String(body.category).trim();
  if (body.unit !== undefined) data.unit = String(body.unit).trim();
  if (body.unitType !== undefined) data.unitType = String(body.unitType).trim();

  const price = body.price !== undefined ? body.price : body.unitPrice;
  if (price !== undefined) data.unitPrice = Number(price);

  const stock = body.stockQuantity !== undefined ? body.stockQuantity : body.quantity;
  if (stock !== undefined) data.quantity = Number(stock);

  return data;
};

/** GET /api/inventory */
const getAllProducts = asyncWrapper(async (req, res) => {
  const products = await inventoryService.getAllProducts(req.query);
  res.status(200).json({
    success: true,
    message: 'Products retrieved',
    data: products,
    products,
    count: products.length,
  });
});

/** GET /api/inventory/low-stock */
const getLowStockProducts = asyncWrapper(async (req, res) => {
  const products = await inventoryService.getLowStockProducts();
  res.status(200).json({
    success: true,
    message: 'Low stock products retrieved',
    data: products,
    products,
    count: products.length,
  });
});

/** GET /api/inventory/:id */
const getProductById = asyncWrapper(async (req, res) => {
  const product = await inventoryService.getProductById(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Product retrieved',
    data: product,
    product,
  });
});

/** POST /api/inventory */
const createProduct = asyncWrapper(async (req, res) => {
  const validationError = validateProductPayload(req.body, false);
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  const productData = formatProductData(req.body);
  const product = await inventoryService.createProduct(productData);
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
    product,
  });
});

/** PUT /api/inventory/:id */
const updateProduct = asyncWrapper(async (req, res) => {
  const validationError = validateProductPayload(req.body, true);
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  const productData = formatProductData(req.body);
  const product = await inventoryService.updateProduct(req.params.id, productData);
  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product,
    product,
  });
});

/** DELETE /api/inventory/:id — owner only */
const deleteProduct = asyncWrapper(async (req, res) => {
  const result = await inventoryService.deleteProduct(req.params.id);
  res.status(200).json({
    success: true,
    message: result.message,
    data: result,
  });
});

module.exports = {
  getAllProducts,
  getProducts: getAllProducts,
  getLowStockProducts,
  getProductById,
  getProduct: getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
