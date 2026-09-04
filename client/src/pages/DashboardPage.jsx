// ═══════════════════════════════════════════════════════
//  DASHBOARD PAGE  —  Member 1: Dashboard & Problem Framing
// ═══════════════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats, getRecentInvoices } from '../api/dashboardApi';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, recentRes] = await Promise.all([
          getDashboardStats(),
          getRecentInvoices(5),
        ]);

        setStats(statsRes.data.data.stats);
        setRecent(recentRes.data.data.invoices);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.role]);

  if (loading) return <Loader message="Loading Perera Stores dashboard..." />;

  const isOwner = user?.role === 'owner';
  const lowStockAlerts = stats?.lowStockAlerts || [];
  const lowStockCount = stats?.lowStockCount ?? 0;
  const totalProducts = stats?.totalProducts ?? 0;
  const todayInvoices = stats?.todayInvoicesCount ?? 0;

  // Stock health percentage
  const stockHealthPct = totalProducts > 0 
    ? Math.round(((totalProducts - lowStockCount) / totalProducts) * 100) 
    : 100;

  return (
    <div className={styles.page}>
      {/* ── Header & Greeting ─────────────────────────────────── */}
      <header className={styles.header}>
        <div>
          <div className={styles.shopBadge}>
            <span className={styles.kadeIcon}>🏪</span>
            <span>Perera Stores • Single Shop Hub</span>
          </div>
          <h1 className={styles.title}>
            Operational Dashboard
            <span className={styles.subtitle}>
              Ayubowan, {user.name}! You are logged in as{' '}
              <strong className={styles.roleHighlight}>{user.role.toUpperCase()}</strong>.
            </span>
          </h1>
        </div>

        <div className={styles.quickLinks}>
          <Link to="/invoices/new" className={styles.primaryActionBtn}>
            + New Invoice (POS)
          </Link>
          <Link to="/about" className={styles.secondaryActionBtn}>
            📖 Problem & Story
          </Link>
        </div>
      </header>

      <ErrorBanner message={error} onClose={() => setError(null)} />

      {/* ── 4 KEY SUMMARY CARDS ────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Overview Metrics</h2>
          <span className={styles.badgeInfo}>
            {isOwner ? '🔐 Full Financial & Stock Access' : '🛡️ Stock & Operations View (Revenue Private)'}
          </span>
        </div>

        <div className={styles.statsGrid}>
          {/* Card 1: Total Products */}
          <div className={`${styles.statCard} ${styles.blueCard}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📦</span>
              <span className={styles.cardTag}>Catalog</span>
            </div>
            <p className={styles.statLabel}>Total Products</p>
            <p className={styles.statValue}>{totalProducts}</p>
            <p className={styles.statSub}>Active items available for sale</p>
          </div>

          {/* Card 2: Low-Stock Count */}
          <div className={`${styles.statCard} ${lowStockCount > 0 ? styles.amberCard : styles.greenCard}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>⚠️</span>
              {lowStockCount > 0 && <span className={styles.cardTagAlert}>{lowStockCount} Need Restock</span>}
            </div>
            <p className={styles.statLabel}>Low-Stock Items</p>
            <p className={styles.statValue}>{lowStockCount}</p>
            <p className={styles.statSub}>
              {lowStockCount > 0 ? 'Items below threshold' : 'All items well stocked'}
            </p>
          </div>

          {/* Card 3: Today's Invoices */}
          <div className={`${styles.statCard} ${styles.indigoCard}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🧾</span>
              <span className={styles.cardTag}>Daily</span>
            </div>
            <p className={styles.statLabel}>Today's Invoices</p>
            <p className={styles.statValue}>{todayInvoices}</p>
            <p className={styles.statSub}>Transactions billed today</p>
          </div>

          {/* Card 4: ROLE GATED (Owner: Sales Total | Staff: Stock Health) */}
          {isOwner ? (
            <div className={`${styles.statCard} ${styles.emeraldCard}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>💰</span>
                <span className={styles.cardTagOwner}>Owner Only</span>
              </div>
              <p className={styles.statLabel}>Today's Total Sales</p>
              <p className={styles.statValue}>
                LKR {(stats?.sales?.today?.revenue ?? 0).toLocaleString()}
              </p>
              <p className={styles.statSub}>
                From {stats?.sales?.today?.invoices ?? 0} billing records
              </p>
            </div>
          ) : (
            <div className={`${styles.statCard} ${styles.tealCard}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>🛡️</span>
                <span className={styles.cardTagStaff}>Staff View</span>
              </div>
              <p className={styles.statLabel}>Stock Health</p>
              <p className={styles.statValue}>{stockHealthPct}% Healthy</p>
              <p className={styles.statSub}>
                {stats?.adequatelyStocked ?? 0} of {totalProducts} items stocked • Revenue owner-gated
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── OWNER REVENUE EXPANSION (Owner Only) ──────────────── */}
      {isOwner && stats?.sales && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>📈 Financial Performance (Owner Confidential)</h2>
          </div>
          <div className={styles.revenueGrid}>
            <div className={styles.revenueSubCard}>
              <span className={styles.revLabel}>This Month</span>
              <span className={styles.revAmount}>
                LKR {stats.sales.thisMonth.revenue.toLocaleString()}
              </span>
              <span className={styles.revCount}>{stats.sales.thisMonth.invoices} invoices</span>
            </div>
            <div className={styles.revenueSubCard}>
              <span className={styles.revLabel}>All-Time Lifetime Sales</span>
              <span className={styles.revAmount}>
                LKR {stats.sales.allTime.revenue.toLocaleString()}
              </span>
              <span className={styles.revCount}>{stats.sales.allTime.invoices} total invoices</span>
            </div>
          </div>
        </section>
      )}

      {/* ── LOW-STOCK ALERT LIST / BANNER ─────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            🚨 Stock Inventory Warnings
            {lowStockCount > 0 && (
              <span className={styles.alertCountBadge}>{lowStockCount} items low</span>
            )}
          </h2>
          <Link to="/inventory" className={styles.textLink}>
            Manage in Inventory →
          </Link>
        </div>

        {lowStockCount === 0 ? (
          <div className={styles.healthyBanner}>
            <span className={styles.bannerCheck}>✅</span>
            <div>
              <strong>Inventory in Good Standing</strong>
              <p>Every product in Perera Stores currently exceeds its low-stock safety threshold.</p>
            </div>
          </div>
        ) : (
          <div className={styles.alertBannerContainer}>
            <div className={styles.warningNotice}>
              <span className={styles.warningIcon}>⚠️</span>
              <div>
                <strong>Restock Alert for Perera Stores:</strong> The following items are running
                critically low. Please notify suppliers or restock shelves before running out.
              </div>
            </div>

            <div className={styles.alertGrid}>
              {lowStockAlerts.map((prod) => (
                <div key={prod._id} className={styles.alertItemCard}>
                  <div className={styles.alertItemMain}>
                    <span className={styles.itemCategory}>{prod.category}</span>
                    <h3 className={styles.alertItemName}>{prod.name}</h3>
                  </div>
                  <div className={styles.alertItemStock}>
                    <div className={styles.stockMeter}>
                      <span className={styles.stockLevelText}>
                        Current: <strong>{prod.quantity} {prod.unit}</strong>
                      </span>
                      <span className={styles.thresholdText}>
                        Threshold: {prod.lowStockThreshold} {prod.unit}
                      </span>
                    </div>
                    <span className={styles.urgencyBadge}>
                      {prod.quantity === 0 ? 'OUT OF STOCK' : 'LOW STOCK'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── RECENT INVOICES (Role-Aware) ───────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🧾 Recent Invoices</h2>
          <Link to="/invoices" className={styles.textLink}>
            View All Invoices →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className={styles.emptyStateCard}>
            <p className={styles.emptyState}>
              No invoices created yet today. Click "New Invoice" to start billing.
            </p>
            <Link to="/invoices/new" className={styles.miniBtn}>
              + Create First Invoice
            </Link>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.invoiceTable}>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer Name</th>
                  <th>Billed Date</th>
                  {isOwner ? (
                    <th className={styles.alignRight}>Total (LKR)</th>
                  ) : (
                    <th className={styles.alignRight}>Item Count</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {recent.map((inv) => (
                  <tr key={inv._id}>
                    <td>
                      <span className={styles.invNumberBadge}>{inv.invoiceNumber}</span>
                    </td>
                    <td className={styles.customerCol}>
                      <strong>{inv.customerName || 'Walk-in Customer'}</strong>
                    </td>
                    <td className={styles.dateCol}>
                      {new Date(inv.createdAt).toLocaleString('en-LK', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    {isOwner ? (
                      <td className={`${styles.alignRight} ${styles.priceCol}`}>
                        LKR {(inv.total ?? 0).toLocaleString()}
                      </td>
                    ) : (
                      <td className={`${styles.alignRight} ${styles.staffItemCol}`}>
                        {inv.itemCount !== undefined ? `${inv.itemCount} items` : 'Recorded'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
