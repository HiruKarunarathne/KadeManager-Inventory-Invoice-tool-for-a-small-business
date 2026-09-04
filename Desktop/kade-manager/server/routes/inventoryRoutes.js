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
const roleCheck = require('../middleware/roleCheck');

// All inventory routes require authentication
router.use(protect);

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', roleCheck(['owner']), createProduct);
router.put('/:id', roleCheck(['owner']), updateProduct);
router.delete('/:id', roleCheck(['owner']), deleteProduct);

module.exports = router;
