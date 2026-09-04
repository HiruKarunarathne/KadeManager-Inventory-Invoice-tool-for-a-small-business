// src/context/AuthContext.jsx
// Stores the logged-in user's profile (including role) in React context.
// Persists session to localStorage so a refresh doesn't log the user out.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * AuthContext — stores the logged-in user and their role.
 *
 * Shape of `user`:
 *   { id, name, email, role: 'owner' | 'staff' }
 *
 * Usage:
 *   const { user, login, logout, loading } = useAuth();
 *   if (user.role === 'owner') { ... }
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // { id, name, email, role }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true while restoring session

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('kade_token') || localStorage.getItem('token');
    const storedUser = localStorage.getItem('kade_user') || localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  /**
   * Call this after a successful login API response.
   * @param {{ token: string, user: { id, name, email, role } }} authData
   */
  const login = useCallback(({ token: newToken, user: userData }) => {
    // Store under both key names for cross-member compatibility
    localStorage.setItem('kade_token', newToken);
    localStorage.setItem('kade_user', JSON.stringify(userData));
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('kade_token');
    localStorage.removeItem('kade_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const isOwner = () => user?.role === 'owner';
  const isStaff = () => user?.role === 'staff';
  const hasRole = (allowedRoles) => {
    if (!user) return false;
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(user.role);
    }
    return user.role === allowedRoles;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isOwner, isStaff, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — use this in any component instead of importing AuthContext directly
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
};

export default AuthContext;
