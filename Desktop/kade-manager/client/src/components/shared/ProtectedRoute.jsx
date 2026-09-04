import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

/**
 * ProtectedRoute: Gated route wrapper with role authorization.
 * @param {Array<string>} allowedRoles - Optional list of allowed roles (e.g. ['owner'])
 * @param {string} redirectTo - Route to redirect unauthenticated users to (default: /login)
 */
export default function ProtectedRoute({ allowedRoles, redirectTo = '/login', children }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <Loader message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If authenticated user lacks required role, redirect to safe default
    return <Navigate to="/inventory" replace />;
  }

  return children ? children : <Outlet />;
}
