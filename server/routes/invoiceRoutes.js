// ═══════════════════════════════════════════════════════
//  INVOICE ROUTES  —  Member 3 owns this file
// ═══════════════════════════════════════════════════════
const express = require('express');
const router = express.Router();
const { createInvoice, getInvoices, getInvoice } = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');
const { asyncWrapper } = require('../middleware/asyncWrapper');

// All routes require authentication; both roles have access
router.use(protect);

// POST /api/invoices       — create new invoice (both roles)
// GET  /api/invoices       — owner sees all; staff sees their own
router.route('/')
  .post(asyncWrapper(createInvoice))
  .get(asyncWrapper(getInvoices));

// GET  /api/invoices/:id
router.get('/:id', asyncWrapper(getInvoice));

module.exports = router;
