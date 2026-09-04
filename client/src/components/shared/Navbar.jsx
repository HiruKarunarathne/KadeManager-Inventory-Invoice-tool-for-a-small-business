// src/components/shared/Navbar.jsx
// Top navigation bar — role-aware, mobile-friendly, NavLink active states.
// Member 4 owns this file.

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const linkClass = ({ isActive }) =>
  isActive ? 'nav-link nav-link--active' : 'nav-link';

const Navbar = () => {
  const { user, logout, isOwner } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <span className="navbar-logo">🛒</span>
        <div className="navbar-brand-text">
          <span className="navbar-title">Kade Manager</span>
          <span className="navbar-subtitle">Perera Stores</span>
        </div>
      </div>

      {/* Desktop nav links */}
      <div className="navbar-links">
        {isOwner() && (
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        )}
        <NavLink to="/inventory" className={linkClass}>Inventory</NavLink>
        <NavLink to="/invoices/new" className={linkClass}>New Invoice</NavLink>
        <NavLink to="/invoices" end className={linkClass}>Invoice History</NavLink>
      </div>

      {/* Desktop user info + logout */}
      <div className="navbar-user">
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className={`user-role-badge user-role-badge--${user?.role}`}>
            {user?.role === 'owner' ? 'Owner' : 'Staff'}
          </span>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Mobile: hamburger */}
      <button
        className={`navbar-hamburger${menuOpen ? ' navbar-hamburger--open' : ''}`}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile: dropdown menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          {isOwner() && (
            <NavLink to="/dashboard" className={linkClass} onClick={closeMenu}>
              Dashboard
            </NavLink>
          )}
          <NavLink to="/inventory" className={linkClass} onClick={closeMenu}>
            Inventory
          </NavLink>
          <NavLink to="/invoices/new" className={linkClass} onClick={closeMenu}>
            New Invoice
          </NavLink>
          <NavLink to="/invoices" end className={linkClass} onClick={closeMenu}>
            Invoice History
          </NavLink>
          <div className="mobile-divider" />
          <div className="mobile-user-row">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className={`user-role-badge user-role-badge--${user?.role}`}>
                {user?.role === 'owner' ? 'Owner' : 'Staff'}
              </span>
            </div>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
