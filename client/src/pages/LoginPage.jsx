// src/pages/LoginPage.jsx
// Public page — no auth required

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/authApi';
import ErrorBanner from '../components/shared/ErrorBanner';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginApi(form);
      login(res.data.data); // { token, user }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>🛒</span>
          <h1 className={styles.title}>Kade Manager</h1>
          <p className={styles.subtitle}>Perera Stores — Staff Login</p>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              value={form.email}
              onChange={handleChange}
              placeholder="you@pererastores.lk"
              required
              autoFocus
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.input}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className={styles.btn}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className={styles.hint}>
          Demo: <code>owner@pererastores.lk</code> / <code>owner123</code>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
