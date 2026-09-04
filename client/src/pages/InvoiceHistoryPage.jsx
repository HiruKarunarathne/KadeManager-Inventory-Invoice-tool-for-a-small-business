// ═══════════════════════════════════════════════════════
//  INVOICE HISTORY PAGE  —  Member 4 owns this file
// ═══════════════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getInvoices } from '../api/invoiceApi';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';
import styles from './InvoiceHistoryPage.module.css';

const InvoiceHistoryPage = () => {
  const location = useLocation();
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg] = useState(location.state?.created ? `✅ Invoice ${location.state.created} created!` : null);

  const fetchInvoices = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getInvoices({ page, limit: 15 });
      const { invoices: list, ...pages } = res.data.data;
      setInvoices(list);
      setPagination(pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  if (loading) return <Loader message="Loading invoices..." />;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🧾 Invoice History</h1>

      {successMsg && <div className={styles.successBanner}>{successMsg}</div>}
      <ErrorBanner message={error} onClose={() => setError(null)} />

      <p className={styles.meta}>{pagination.total} invoice{pagination.total !== 1 ? 's' : ''} total</p>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total (LKR)</th>
              <th>Created By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td className={styles.invNum}>{inv.invoiceNumber}</td>
                <td>{inv.customerName}</td>
                <td>{inv.items.length} item{inv.items.length !== 1 ? 's' : ''}</td>
                <td className={styles.total}>{inv.total.toLocaleString()}</td>
                <td>{inv.createdBy?.name ?? '—'}</td>
                <td>{new Date(inv.createdAt).toLocaleDateString('en-LK')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && (
          <p className={styles.emptyState}>No invoices found.</p>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === pagination.page ? styles.active : ''}`}
              onClick={() => fetchInvoices(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceHistoryPage;
