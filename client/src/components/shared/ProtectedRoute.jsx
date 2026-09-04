// src/components/shared/ProtectedRoute.jsx
// Wraps routes that require authentication and optional role gating.
// Member 4 owns this file.
//
// Usage:
//   <ProtectedRoute>                          — any logged-in user
//   <ProtectedRoute allowedRoles={['owner']}  — owner only
//   <ProtectedRoute allowedRoles={['owner','staff']} — either role

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

/**
 * @param {string[]} [allowedRoles] - If omitted, any authenticated user may pass.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // While restoring session from localStorage, show a loader
  if (loading) return <Loader fullScreen />;

  // Not logged in — redirect to login page
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but role not permitted
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
