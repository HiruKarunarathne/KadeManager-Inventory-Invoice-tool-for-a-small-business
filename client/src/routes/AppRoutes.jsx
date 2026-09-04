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

    {/* Protected: OWNER ONLY */}
    <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
      <Route path="/dashboard" element={<DashboardPage />} />
    </Route>

    {/* Protected: owner + staff */}
    <Route element={<ProtectedRoute allowedRoles={['owner', 'staff']} />}>
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/invoices/new" element={<NewInvoicePage />} />
      <Route path="/invoices" element={<InvoiceHistoryPage />} />
    </Route>

    {/* Catch-all: /inventory is accessible to all roles */}
    <Route path="*" element={<Navigate to="/inventory" replace />} />
  </Routes>
);

export default AppRoutes;
