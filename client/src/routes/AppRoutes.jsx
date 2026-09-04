import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Navbar from '../components/shared/Navbar';
import Loader from '../components/shared/Loader';
import layoutStyles from './AppRoutes.module.css';

// Pages
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
 *   /login                   — public (redirects to / if already logged in)
 *   /                        — protected (both roles) → DashboardPage
 *   /inventory               — protected (both roles) → InventoryPage
 *   /invoices/new            — protected (both roles) → NewInvoicePage
 *   /invoices                — protected (both roles) → InvoiceHistoryPage
 *   /about                   — protected (both roles) → AboutPage
 *
 * Role-gating within pages is done at the component level, not the route level,
 * because both roles can reach these pages — only certain *content* is hidden.
 */
const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;

  return (
    <BrowserRouter>
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
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="invoices/new" element={<NewInvoicePage />} />
            <Route path="invoices" element={<InvoiceHistoryPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

/** Layout component that renders Navbar + child page via <Outlet> */
const AppLayout = () => (
  <div className={layoutStyles.layout}>
    <Navbar />
    <main className={layoutStyles.main}>
      <Outlet />
    </main>
  </div>
);

export default AppRoutes;
