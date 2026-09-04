// routes/invoiceRoutes.js
// Invoice endpoints for Perera Stores
// Member 3 owns this module end-to-end
//
// RBAC summary:
//   POST   /api/invoices              → owner + staff
//   GET    /api/invoices              → owner + staff
//   GET    /api/invoices/:id          → owner + staff
//   PATCH  /api/invoices/:id/void     → OWNER ONLY (enforced by roleCheck(['owner']))
//   PATCH  /api/invoices/:id/customer → owner + staff

const express = require('express');
const router = express.Router();
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  voidInvoice,
  updateCustomerName,
} = require('../controllers/invoiceController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All invoice routes require authentication
router.use(protect);

router.post('/', createInvoice);
router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);
router.patch('/:id/void', roleCheck(['owner']), voidInvoice);
router.patch('/:id/customer', updateCustomerName);

module.exports = router;
