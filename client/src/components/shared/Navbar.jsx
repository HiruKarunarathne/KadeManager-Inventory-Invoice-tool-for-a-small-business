// src/components/shared/Navbar.jsx
// Top navigation bar — shows shop name, user info, and nav links.
// Member 4 owns this file.

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isOwner } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🛒</span>
        <span className="navbar-title">Perera Stores</span>
      </div>

      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/invoices/new">New Invoice</Link>
        <Link to="/invoices">Invoice History</Link>
      </div>

      <div className="navbar-user">
        <span className="user-badge user-badge--{user?.role}">
          {user?.name} ({user?.role})
        </span>
        <button className="btn btn-outline" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
