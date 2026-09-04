// routes/inventoryRoutes.js
// Inventory (product) endpoints
// Member 2 owns this module end-to-end
//
// RBAC summary:
//   GET  (all products, single, low-stock) → owner + staff
//   POST (create)                          → owner + staff
//   PUT  (update)                          → owner + staff
//   DELETE                                 → OWNER ONLY

const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getLowStockProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/inventoryController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All inventory routes require authentication
router.use(protect);

router.get('/low-stock', getLowStockProducts);   // must be before /:id
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', roleCheck(['owner']), deleteProduct); // ← OWNER ONLY

module.exports = router;
