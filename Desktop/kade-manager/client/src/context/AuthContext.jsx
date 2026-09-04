import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser } from '../api/authApi';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on first load
  useEffect(() => {
    const savedToken = localStorage.getItem('km_token');
    const savedUser = localStorage.getItem('km_user');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      } catch (err) {
        console.error('Failed to parse saved user credentials', err);
        localStorage.removeItem('km_token');
        localStorage.removeItem('km_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginUser({ email, password });
    const { user: userData, token: jwtToken } = data;

    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('km_token', jwtToken);
    localStorage.setItem('km_user', JSON.stringify(userData));
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    return userData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('km_token');
    localStorage.removeItem('km_user');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }, []);

  const hasRole = useCallback(
    (allowedRoles) => {
      if (!user) return false;
      if (Array.isArray(allowedRoles)) {
        return allowedRoles.includes(user.role);
      }
      return user.role === allowedRoles;
    },
    [user]
  );

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
