// controllers/invoiceController.js
// Handles HTTP request/response cycle for invoice endpoints.
// Member 3 owns this file.

const invoiceService = require('../services/invoiceService');

const respond = (res, statusCode, data) => res.status(statusCode).json(data);

/**
 * POST /api/invoices
 * Create a new invoice (owner + staff)
 */
const createInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.createInvoice(req.body, req.user._id);
    respond(res, 201, {
      success: true,
      message: 'Invoice created successfully',
      data: invoice,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/invoices
 * Get all invoices; owner sees all, staff sees only their own.
 * Supports ?page=&limit= query params
 */
const getAllInvoices = async (req, res, next) => {
  try {
    const result = await invoiceService.getAllInvoices({
      userId: req.user._id,
      role: req.user.role,
      page: req.query.page,
      limit: req.query.limit,
    });
    respond(res, 200, {
      success: true,
      message: 'Invoices retrieved successfully',
      data: result.invoices,
      invoices: result.invoices,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Alias for Dashboard-style imports
const getInvoices = getAllInvoices;

/**
 * GET /api/invoices/:id
 * Get single invoice details (owner + staff)
 */
const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    respond(res, 200, {
      success: true,
      message: 'Invoice retrieved successfully',
      data: invoice,
    });
  } catch (err) {
    next(err);
  }
};

// Alias
const getInvoice = getInvoiceById;

/**
 * PATCH /api/invoices/:id/void
 * Void an invoice and restore stock to inventory (owner only)
 */
const voidInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.voidInvoice(req.params.id, req.user._id);
    respond(res, 200, {
      success: true,
      message: `Invoice ${invoice.invoiceNumber} voided and product stock restored`,
      data: invoice,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/invoices/:id/customer
 * Update customer name on an invoice (owner + staff)
 */
const updateCustomerName = async (req, res, next) => {
  try {
    const { customerName, name } = req.body;
    const invoice = await invoiceService.updateCustomerName(
      req.params.id,
      customerName || name
    );
    respond(res, 200, {
      success: true,
      message: 'Customer name updated successfully',
      data: invoice,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoices,
  getInvoiceById,
  getInvoice,
  voidInvoice,
  updateCustomerName,
};
