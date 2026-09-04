// src/pages/InvoiceHistoryPage.jsx
// Displays all past invoices — accessible to both owner and staff.
// Member 4 owns this page.

import { useState, useEffect } from 'react';
import { getAllInvoices } from '../api/invoiceApi';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';

const InvoiceHistoryPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null); // invoice _id currently expanded

  useEffect(() => {
    getAllInvoices()
      .then((res) => setInvoices(res.data.data))
      .catch((err) =>
        setError(err.response?.data?.message || 'Failed to load invoices')
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader message="Loading invoice history..." />;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Invoice History</h1>
        <p className="page-subtitle">{invoices.length} invoice(s) found</p>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {invoices.length === 0 ? (
        <p className="empty-state">No invoices yet. Create your first invoice!</p>
      ) : (
        <div className="invoice-list">
          {invoices.map((inv) => (
            <div key={inv._id} className="invoice-card">
              <div
                className="invoice-card__header"
                onClick={() => setExpanded(expanded === inv._id ? null : inv._id)}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <strong>{inv.customerName}</strong>
                  <span className="invoice-date">
                    {new Date(inv.createdAt).toLocaleString('en-LK', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
                <div className="invoice-card__meta">
                  <span className="invoice-total-badge">
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
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inv.items.map((item, i) => (
                        <tr key={i}>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>LKR {item.unitPrice.toLocaleString()}</td>
                          <td>LKR {item.subtotal.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
