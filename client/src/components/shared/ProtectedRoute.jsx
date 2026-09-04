import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

/**
 * ProtectedRoute — guards routes by authentication and role.
 *
 * Usage examples:
 *   <Route element={<ProtectedRoute />}>                          // any logged-in user
 *   <Route element={<ProtectedRoute allowedRoles={['owner']} />}> // owner only
 *
 * @param {string[]} [allowedRoles] - If omitted, any authenticated user may pass.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User is logged in but doesn't have the right role — send to dashboard
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
