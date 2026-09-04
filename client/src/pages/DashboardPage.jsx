// src/pages/DashboardPage.jsx
// Member 1 owns this page.
//
// ROLE GATING EXAMPLE:
//   - Shared stats card (totalProducts, lowStock, invoicesToday) → all users
//   - Sales summary card (revenue, daily breakdown) → OWNER ONLY, hidden from staff

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSharedStats, getSalesSummary } from '../api/dashboardApi';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';

const DashboardPage = () => {
  const { user, isOwner } = useAuth();

  const [stats, setStats] = useState(null);
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const statsRes = await getSharedStats();
        setStats(statsRes.data.data);

        // Only fetch sales data if user is owner
        if (isOwner()) {
          const salesRes = await getSalesSummary(period);
          setSales(salesRes.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.name}!</p>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {/* ── Shared stats — visible to ALL users ── */}
      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div>
            <p className="stat-label">Total Products</p>
            <p className="stat-value">{stats?.totalProducts ?? '—'}</p>
          </div>
        </div>

        <div className="stat-card stat-card--warning">
          <span className="stat-icon">⚠️</span>
          <div>
            <p className="stat-label">Low Stock Items</p>
            <p className="stat-value">{stats?.lowStockCount ?? '—'}</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🧾</span>
          <div>
            <p className="stat-label">Invoices Today</p>
            <p className="stat-value">{stats?.invoicesToday ?? '—'}</p>
          </div>
        </div>
      </section>

      {/* ── Sales summary — OWNER ONLY ── */}
      {isOwner() ? (
        <section className="sales-section">
          <div className="section-header">
            <h2>Sales Summary</h2>
            <select
              id="period-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="period-select"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="sales-cards">
            <div className="stat-card stat-card--primary">
              <span className="stat-icon">💰</span>
              <div>
                <p className="stat-label">Total Revenue</p>
                <p className="stat-value">LKR {sales?.totalRevenue?.toLocaleString() ?? '—'}</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📋</span>
              <div>
                <p className="stat-label">Total Invoices</p>
                <p className="stat-value">{sales?.invoiceCount ?? '—'}</p>
              </div>
            </div>
          </div>

          {/* TODO [Member 1]: Add a chart here (e.g. recharts) for dailyBreakdown */}
          <div className="daily-breakdown">
            <h3>Daily Breakdown</h3>
            {sales?.dailyBreakdown?.length === 0 && (
              <p className="empty-state">No sales in this period.</p>
            )}
            <ul className="breakdown-list">
              {sales?.dailyBreakdown?.map((day) => (
                <li key={day.date} className="breakdown-item">
                  <span>{day.date}</span>
                  <span>{day.count} invoices</span>
                  <span>LKR {day.revenue.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        /* Staff sees a friendly note instead of the sales section */
        <div className="info-banner">
          <span>📊</span>
          <p>Sales summary is visible to the shop owner only.</p>
        </div>
      )}

      {/* Low stock alert list — all users */}
      {stats?.lowStockProducts?.length > 0 && (
        <section className="low-stock-section">
          <h2>⚠️ Low Stock Alerts</h2>
          <ul className="low-stock-list">
            {stats.lowStockProducts.map((p) => (
              <li key={p._id} className="low-stock-item">
                <strong>{p.name}</strong> — {p.quantity} {p.unit} remaining
                (threshold: {p.lowStockThreshold})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default DashboardPage;
