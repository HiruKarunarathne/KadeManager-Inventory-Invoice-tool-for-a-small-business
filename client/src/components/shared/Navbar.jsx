import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

/**
 * Navbar — shared top navigation.
 * Member 4 owns this component.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.logo}>🛒</span>
        <span className={styles.shopName}>Perera Stores</span>
      </div>

      <ul className={styles.navLinks}>
        <li>
          <Link to="/" className={isActive('/') ? styles.active : ''}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/inventory" className={isActive('/inventory') ? styles.active : ''}>
            Inventory
          </Link>
        </li>
        <li>
          <Link to="/invoices/new" className={isActive('/invoices/new') ? styles.active : ''}>
            New Invoice
          </Link>
        </li>
        <li>
          <Link to="/invoices" className={isActive('/invoices') ? styles.active : ''}>
            Invoice History
          </Link>
        </li>
        <li>
          <Link to="/about" className={isActive('/about') ? styles.active : ''}>
            About / Story
          </Link>
        </li>
      </ul>

      <div className={styles.userSection}>
        <span className={styles.userInfo}>
          <span className={styles.userName}>{user?.name}</span>
          <span className={`${styles.roleBadge} ${styles[user?.role]}`}>
            {user?.role}
          </span>
        </span>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
