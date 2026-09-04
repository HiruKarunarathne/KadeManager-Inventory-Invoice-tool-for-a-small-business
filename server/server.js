// server.js — Entry point for Kade Manager backend
// Perera Stores — single-shop inventory & invoicing system

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// --- Route imports ---
const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// --- Connect to MongoDB ---
connectDB();

const app = express();

// --- Global Middleware ---
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// --- Health Check (no auth required) ---
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🛒 Kade Manager API is running',
    shop: 'Perera Stores',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// --- Centralized Error Handler (must be last middleware) ---
// This ensures one failed request never crashes the server.
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
