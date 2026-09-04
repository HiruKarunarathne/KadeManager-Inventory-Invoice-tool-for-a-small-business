// routes/invoiceRoutes.js
// Invoice endpoints
// Member 3 owns this module end-to-end
//
// RBAC summary:
//   POST (create invoice) → owner + staff
//   GET  (history)        → owner + staff
//   GET  /:id             → owner + staff

const express = require('express');
const router = express.Router();
const { createInvoice, getAllInvoices, getInvoiceById } = require('../controllers/invoiceController');
const protect = require('../middleware/auth');

// All invoice routes require authentication
router.use(protect);

router.post('/', createInvoice);
router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);

module.exports = router;
