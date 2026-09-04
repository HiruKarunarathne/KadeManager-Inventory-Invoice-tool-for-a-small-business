const invoiceService = require('../services/invoiceService');

/**
 * POST /api/invoices
 * Both roles
 */
const createInvoice = async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.body, req.user._id);
  res.status(201).json({
    success: true,
    message: 'Invoice created successfully',
    data: { invoice },
  });
};

/**
 * GET /api/invoices
 * Owner sees all; staff sees only their own
 * Supports ?page=&limit= query params
 */
const getInvoices = async (req, res) => {
  const result = await invoiceService.getAllInvoices({
    userId: req.user._id,
    role: req.user.role,
    page: req.query.page,
    limit: req.query.limit,
  });
  res.status(200).json({ success: true, data: result });
};

/**
 * GET /api/invoices/:id
 * Both roles (staff limited to their own — service handles auth check if needed)
 */
const getInvoice = async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id);
  res.status(200).json({ success: true, data: { invoice } });
};

module.exports = { createInvoice, getInvoices, getInvoice };
