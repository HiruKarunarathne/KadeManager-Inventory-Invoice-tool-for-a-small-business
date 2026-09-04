const asyncWrapper = require('../middleware/asyncWrapper');
const invoiceService = require('../services/invoiceService');

const createInvoice = asyncWrapper(async (req, res) => {
  const { customerName, items } = req.body;
  const invoice = await invoiceService.createInvoice({
    customerName,
    items,
    createdBy: req.user._id,
  });
  res.status(201).json({ message: 'Invoice created', invoice });
});

const getInvoices = asyncWrapper(async (req, res) => {
  const invoices = await invoiceService.getAllInvoices();
  res.status(200).json({ count: invoices.length, invoices });
});

const getInvoice = asyncWrapper(async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id);
  res.status(200).json({ invoice });
});

module.exports = { createInvoice, getInvoices, getInvoice };
