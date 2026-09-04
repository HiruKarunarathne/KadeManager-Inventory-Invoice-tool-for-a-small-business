// src/routes/AppRoutes.jsx
// Central router — maps paths to pages with role-protected wrappers.

import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Navbar from '../components/shared/Navbar';
import Loader from '../components/shared/Loader';

import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import InventoryPage from '../pages/InventoryPage';
import NewInvoicePage from '../pages/NewInvoicePage';
import InvoiceHistoryPage from '../pages/InvoiceHistoryPage';
import AboutPage from '../pages/AboutPage';

/**
 * AppRoutes — central routing definition.
 *
 * Route structure:
 *   /login        — public (redirects to / if already logged in)
 *   /             — protected → DashboardPage
 *   /inventory    — protected → InventoryPage
 *   /invoices/new — protected → NewInvoicePage
 *   /invoices     — protected → InvoiceHistoryPage
 *   /about        — protected → AboutPage
 *
 * Role-gating within pages is done at the component level, not the route level,
 * because both roles can reach these pages — only certain *content* is hidden.
 */
const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />

      {/* Protected — any authenticated user */}
      <Route element={<ProtectedRoute />}>
        {/* Navbar wraps all protected pages via layout outlet pattern */}
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="invoices/new" element={<NewInvoicePage />} />
          <Route path="invoices" element={<InvoiceHistoryPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Route>

      {/* Catch-all: redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

/** Layout component that renders Navbar + child page via <Outlet> */
const AppLayout = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
  </div>
);

export default AppRoutes;
