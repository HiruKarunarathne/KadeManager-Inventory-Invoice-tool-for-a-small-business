// src/pages/InvoiceHistoryPage.jsx
// Displays all past invoices — accessible to both owner and staff.
// Member 4 owns this page. Member 3 integrates VoidInvoiceButton.

import { useState, useEffect } from 'react';
import { getAllInvoices } from '../api/invoiceApi';
import VoidInvoiceButton from '../components/invoice/VoidInvoiceButton';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';

const InvoiceHistoryPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [expanded, setExpanded] = useState(null); // invoice _id currently expanded

  const loadInvoices = () => {
    setLoading(true);
    getAllInvoices()
      .then((res) => setInvoices(res.data.data || []))
      .catch((err) =>
        setError(err.response?.data?.message || 'Failed to load invoices')
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleVoidSuccess = (voidedInvoice) => {
    setSuccessMsg(`Invoice ${voidedInvoice.invoiceNumber} has been voided and stock restored.`);
    setInvoices((prev) =>
      prev.map((inv) => (inv._id === voidedInvoice._id ? voidedInvoice : inv))
    );
  };

  if (loading) return <Loader message="Loading invoice history..." />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Invoice History</h1>
          <p className="page-subtitle">{invoices.length} invoice(s) recorded</p>
        </div>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {successMsg && (
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            borderRadius: 'var(--radius)',
            padding: '0.75rem 1rem',
            fontSize: '0.9rem',
            color: 'var(--color-success)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>✅ {successMsg}</span>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            style={{ background: 'none', border: 'none', color: 'var(--color-success)', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {invoices.length === 0 ? (
        <p className="empty-state">No invoices yet. Create your first invoice!</p>
      ) : (
        <div className="invoice-list">
          {invoices.map((inv) => {
            const isVoided = inv.status === 'voided';

            return (
              <div
                key={inv._id}
                className="invoice-card"
                style={{
                  opacity: isVoided ? 0.75 : 1,
                  borderColor: isVoided ? 'rgba(239, 68, 68, 0.3)' : undefined,
                }}
              >
                <div
                  className="invoice-card__header"
                  onClick={() => setExpanded(expanded === inv._id ? null : inv._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: isVoided ? 'var(--color-danger)' : 'var(--color-accent)',
                          fontSize: '0.9rem',
                        }}
                      >
                        {inv.invoiceNumber || 'INV-####'}
                      </span>
                      <strong>{inv.customerName}</strong>
                      {isVoided && (
                        <span
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: 'var(--color-danger)',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '999px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}
                        >
                          Voided
                        </span>
                      )}
                    </div>
                    <span className="invoice-date">
                      {new Date(inv.createdAt).toLocaleString('en-LK', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>

                  <div className="invoice-card__meta">
                    <span
                      className="invoice-total-badge"
                      style={{
                        textDecoration: isVoided ? 'line-through' : 'none',
                        color: isVoided ? 'var(--color-text-muted)' : 'var(--color-success)',
                      }}
                    >
                      LKR {inv.total.toLocaleString()}
                    </span>
                    <span className="invoice-by">by {inv.createdBy?.name}</span>
                    <span>{expanded === inv._id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expandable line items */}
                {expanded === inv._id && (
                  <div className="invoice-card__items">
                    <table className="data-table data-table--compact">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inv.items.map((item, i) => (
                          <tr key={i}>
                            <td>{item.productName}</td>
                            <td>{item.quantity}</td>
                            <td>LKR {item.unitPrice.toLocaleString()}</td>
                            <td>
                              LKR{' '}
                              {(
                                item.lineTotal ||
                                item.subtotal ||
                                item.unitPrice * item.quantity
                              ).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Void button action row (Owner only) */}
                    {!isVoided && (
                      <div
                        style={{
                          marginTop: '1rem',
                          display: 'flex',
                          justifyContent: 'flex-end',
                          paddingTop: '0.5rem',
                          borderTop: '1px solid var(--color-border)',
                        }}
                      >
                        <VoidInvoiceButton
                          invoiceId={inv._id}
                          invoiceStatus={inv.status}
                          onVoidSuccess={handleVoidSuccess}
                          onVoidError={(msg) => setError(msg)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InvoiceHistoryPage;
