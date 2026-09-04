const express = require('express');
const router = express.Router();
const { createInvoice, getInvoices, getInvoice } = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');

// All invoice routes require authentication (both owner and staff can operate)
router.use(protect);

router.post('/', createInvoice);
router.get('/', getInvoices);
router.get('/:id', getInvoice);

module.exports = router;
