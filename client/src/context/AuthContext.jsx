// src/context/AuthContext.jsx
// Stores the logged-in user's profile (including role) in React context.
// Persists session to localStorage so a refresh doesn't log the user out.

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // { id, name, email, role }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true while restoring session

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('kade_token');
    const storedUser = localStorage.getItem('kade_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Call this after a successful login API response.
   * @param {{ token: string, user: { id, name, email, role } }} authData
   */
  const login = (authData) => {
    localStorage.setItem('kade_token', authData.token);
    localStorage.setItem('kade_user', JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
  };

  const logout = () => {
    localStorage.removeItem('kade_token');
    localStorage.removeItem('kade_user');
    setToken(null);
    setUser(null);
  };

  const isOwner = () => user?.role === 'owner';
  const isStaff = () => user?.role === 'staff';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isOwner, isStaff }}>
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
