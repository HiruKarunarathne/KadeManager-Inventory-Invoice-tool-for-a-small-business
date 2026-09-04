// src/routes/AppRoutes.jsx
// Central router — maps paths to pages with role-protected wrappers.

import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';

import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import InventoryPage from '../pages/InventoryPage';
import NewInvoicePage from '../pages/NewInvoicePage';
import InvoiceHistoryPage from '../pages/InvoiceHistoryPage';

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<LoginPage />} />

    {/* Protected: any logged-in user (owner OR staff) */}
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/invoices/new" element={<NewInvoicePage />} />
      <Route path="/invoices" element={<InvoiceHistoryPage />} />
    </Route>

    {/* Catch-all: redirect to dashboard */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
