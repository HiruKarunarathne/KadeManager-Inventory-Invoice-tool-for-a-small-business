import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../api/authApi';

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while verifying token on mount

  // On app load, try to rehydrate from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const cachedUser = localStorage.getItem('user');
    if (token && cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  /**
   * Call this after a successful login API response.
   * @param {{ token: string, user: object }} authData
   */
  const login = useCallback(({ token, user: userData }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};

export default AuthContext;
