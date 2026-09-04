// src/pages/InvoiceHistoryPage.jsx
// Displays all past invoices — accessible to both owner and staff.
// Member 4 owns this page.

import { useState, useEffect, useCallback } from 'react';
import { getAllInvoices } from '../api/invoiceApi';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';

const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' });

const InvoiceHistoryPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null); // invoice _id currently expanded
  const [search, setSearch] = useState('');

  const fetchInvoices = useCallback(() => {
    setLoading(true);
    setError(null);
    getAllInvoices()
      .then((res) => setInvoices(res.data.data))
      .catch((err) =>
        // Prioritize the clean `message` field — the backend's `error` field
        // may contain a raw stack trace in development mode and should never
        // be shown directly to the user.
        setError(err.response?.data?.message || 'Could not load invoice history.')
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filtered = invoices.filter((inv) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      inv.customerName?.toLowerCase().includes(q) ||
      inv._id?.toLowerCase().includes(q)
    );
  });

  if (loading) return <Loader message="Loading invoice history..." />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Invoice History</h1>
          <p className="page-subtitle">Browse every sale recorded at Perera Stores</p>
        </div>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} onRetry={fetchInvoices} />

      {!error && (
        <>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by customer name or invoice ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="btn btn-outline btn-sm" onClick={() => setSearch('')}>
                Clear
              </button>
            )}
          </div>

          <p className="results-count">
            {filtered.length} of {invoices.length} invoice(s)
            {search && ` matching "${search}"`}
          </p>
        </>
      )}

      {invoices.length === 0 && !error ? (
        <div className="empty-state-box">
          <span className="empty-icon">🧾</span>
          <p className="empty-title">No invoices yet</p>
          <p className="empty-body">New sales will show up here once they're created.</p>
        </div>
      ) : filtered.length === 0 && !error ? (
        <div className="empty-state-box">
          <span className="empty-icon">🔍</span>
          <p className="empty-title">No invoices found</p>
          <p className="empty-body">Try a different customer name or invoice ID.</p>
        </div>
      ) : (
        <div className="invoice-list">
          {filtered.map((inv) => (
            <div key={inv._id} className="invoice-card">
              <div
                className="invoice-card__header"
                onClick={() => setExpanded(expanded === inv._id ? null : inv._id)}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <strong>{inv.customerName}</strong>
                  <span className="invoice-id">#{inv._id.slice(-6).toUpperCase()}</span>
                  <span className="invoice-date">{formatDate(inv.createdAt)}</span>
                </div>
                <div className="invoice-card__meta">
                  <span className="invoice-total-badge">
                    LKR {inv.total.toLocaleString()}
                  </span>
                  <span className="invoice-by">by {inv.createdBy?.name || 'Unknown'}</span>
                  <span className="expand-icon">{expanded === inv._id ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Expandable line items */}
              {expanded === inv._id && (
                <div className="invoice-card__items">
                  <div className="table-scroll">
                    <table className="data-table data-table--compact">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inv.items.map((item, i) => {
                          const unitPrice = item.unitPrice ?? 0;
                          const subtotal = item.subtotal ?? item.lineTotal ?? unitPrice * item.quantity;
                          return (
                            <tr key={i}>
                              <td>{item.productName}</td>
                              <td>{item.quantity}</td>
                              <td>LKR {unitPrice.toLocaleString()}</td>
                              <td>LKR {subtotal.toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="invoice-detail-footer">
                    <span>Created by: {inv.createdBy?.name || 'Unknown'}</span>
                    <span>Total: LKR {inv.total.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceHistoryPage;
