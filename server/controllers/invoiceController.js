// controllers/invoiceController.js
// Handles HTTP req/res for invoice endpoints.
// Member 3 owns this file.

const invoiceService = require('../services/invoiceService');

const respond = (res, statusCode, data) => res.status(statusCode).json(data);

/** POST /api/invoices — create a new invoice */
const createInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.createInvoice({
      ...req.body,
      createdBy: req.user._id,
    });
    respond(res, 201, { success: true, message: 'Invoice created', data: invoice });
  } catch (err) {
    next(err);
  }
};

/** GET /api/invoices — all invoices */
const getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    respond(res, 200, { success: true, message: 'Invoices retrieved', data: invoices });
  } catch (err) {
    next(err);
  }
};

/** GET /api/invoices/:id — single invoice */
const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    respond(res, 200, { success: true, message: 'Invoice retrieved', data: invoice });
  } catch (err) {
    next(err);
  }
};

module.exports = { createInvoice, getAllInvoices, getInvoiceById };
