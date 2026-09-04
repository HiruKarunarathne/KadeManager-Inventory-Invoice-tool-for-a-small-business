import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-amber-600 text-white'
        : 'text-gray-700 hover:bg-amber-50 hover:text-amber-800'
    }`;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo & Shop Name */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl" role="img" aria-label="store">🏪</span>
            <div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">Kade Manager</span>
              <span className="text-xs block text-amber-700 font-semibold">Perera Stores</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/dashboard" className={navLinkStyle}>
              Dashboard
            </NavLink>
            <NavLink to="/inventory" className={navLinkStyle}>
              Inventory
            </NavLink>
            <NavLink to="/invoices/new" className={navLinkStyle}>
              New Invoice
            </NavLink>
            <NavLink to="/invoices" className={navLinkStyle}>
              Invoice History
            </NavLink>
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <span
                className={`inline-block text-xs uppercase px-2 py-0.5 rounded-full font-bold ${
                  role === 'owner'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 border border-red-200 text-xs font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors focus:outline-none"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-gray-100 space-x-2">
          <NavLink to="/dashboard" className={navLinkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/inventory" className={navLinkStyle}>
            Inventory
          </NavLink>
          <NavLink to="/invoices/new" className={navLinkStyle}>
            New Invoice
          </NavLink>
          <NavLink to="/invoices" className={navLinkStyle}>
            History
          </NavLink>
        </div>
      </div>
    </header>
  );
}
