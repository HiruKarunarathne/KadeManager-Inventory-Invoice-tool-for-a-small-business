// ═══════════════════════════════════════════════════════
//  INVENTORY ROUTES  —  Member 2 owns this file
// ═══════════════════════════════════════════════════════
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const { asyncWrapper } = require('../middleware/asyncWrapper');

// All routes require authentication
router.use(protect);

// GET  /api/inventory          — both roles, supports ?category=&lowStock=true
// POST /api/inventory          — both roles (staff can add)
router.route('/')
  .get(asyncWrapper(getProducts))
  .post(asyncWrapper(createProduct));

// GET /api/inventory/:id       — both roles
// PUT /api/inventory/:id       — both roles
// DELETE /api/inventory/:id    — owner only
router.route('/:id')
  .get(asyncWrapper(getProduct))
  .put(asyncWrapper(updateProduct))
  .delete(roleCheck(['owner']), asyncWrapper(deleteProduct));

module.exports = router;
