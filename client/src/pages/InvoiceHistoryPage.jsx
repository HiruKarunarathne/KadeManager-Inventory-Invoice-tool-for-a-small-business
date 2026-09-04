// src/pages/InvoiceHistoryPage.jsx
// Displays all past invoices with search, filtering, line-item details, inline customer editing, and voiding.
// Member 4 owns this page. Member 3 integrates VoidInvoiceButton.

import { useState, useEffect, useMemo } from 'react';
import { getAllInvoices, updateInvoiceCustomerName } from '../api/invoiceApi';
import VoidInvoiceButton from '../components/invoice/VoidInvoiceButton';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';

const InvoiceHistoryPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [expanded, setExpanded] = useState(null); // invoice _id currently expanded

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'voided'

  // Inline editing of customer name
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [savingName, setSavingName] = useState(false);

  const loadInvoices = () => {
    setLoading(true);
    setError(null);
    getAllInvoices()
      .then((res) => {
        const payload = res.data?.data;
        // Gracefully support array directly or nested { invoices: [...] }
        const list = Array.isArray(payload)
          ? payload
          : (payload?.invoices || res.data?.invoices || []);
        setInvoices(list);
      })
      .catch((err) =>
        setError(err.response?.data?.message || 'Failed to load invoices')
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleVoidSuccess = (voidedInvoice) => {
    setSuccessMsg(`Invoice ${voidedInvoice.invoiceNumber || 'INV'} has been voided and stock restored.`);
    setInvoices((prev) =>
      prev.map((inv) => (inv._id === voidedInvoice._id ? { ...inv, ...voidedInvoice, status: 'voided' } : inv))
    );
  };

  const startEditCustomer = (e, inv) => {
    e.stopPropagation();
    setEditingId(inv._id);
    setEditingName(inv.customerName || '');
  };

  const cancelEditCustomer = (e) => {
    if (e) e.stopPropagation();
    setEditingId(null);
    setEditingName('');
  };

  const saveEditCustomer = async (e, id) => {
    e.stopPropagation();
    if (!editingName.trim()) return;
    setSavingName(true);
    try {
      const res = await updateInvoiceCustomerName(id, editingName.trim());
      const updated = res.data?.data || res.data;
      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === id ? { ...inv, customerName: updated.customerName || editingName.trim() } : inv
        )
      );
      setSuccessMsg('Customer name updated successfully.');
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update customer name');
    } finally {
      setSavingName(false);
    }
  };

  // Filtered invoices based on search & status
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // Status filter
      if (statusFilter !== 'all' && inv.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const numberMatch = (inv.invoiceNumber || '').toLowerCase().includes(query);
        const nameMatch = (inv.customerName || '').toLowerCase().includes(query);
        const itemMatch = (inv.items || []).some((item) =>
          (item.productName || '').toLowerCase().includes(query)
        );
        return numberMatch || nameMatch || itemMatch;
      }
      return true;
    });
  }, [invoices, statusFilter, searchQuery]);

  if (loading) return <Loader message="Loading invoice history..." />;

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Invoice History</h1>
          <p className="page-subtitle">
            {invoices.length} invoice(s) recorded {statusFilter !== 'all' || searchQuery ? `(${filteredInvoices.length} matching filter)` : ''}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={loadInvoices}
          title="Refresh invoice list"
        >
          🔄 Refresh
        </button>
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
            marginBottom: '1rem',
          }}
        >
          <span>✅ {successMsg}</span>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            style={{ background: 'none', border: 'none', color: 'var(--color-success)', cursor: 'pointer', fontSize: '1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: '1 1 260px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search by invoice #, customer, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.55rem 0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({invoices.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'completed' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed ({invoices.filter((i) => i.status === 'completed').length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'voided' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('voided')}
          >
            Voided ({invoices.filter((i) => i.status === 'voided').length})
          </button>
        </div>
      </div>

      {invoices.length === 0 ? (
        <p className="empty-state">No invoices yet. Create your first invoice in the New Invoice module!</p>
      ) : filteredInvoices.length === 0 ? (
        <div className="empty-state">
          <p>No invoices match your search/filter criteria.</p>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            style={{ marginTop: '0.75rem' }}
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="invoice-list">
          {filteredInvoices.map((inv) => {
            const isVoided = inv.status === 'voided';
            const totalAmount = inv.total != null ? inv.total : (inv.totalAmount || 0);
            const isEditingThis = editingId === inv._id;

            return (
              <div
                key={inv._id}
                className="invoice-card"
                style={{
                  opacity: isVoided ? 0.8 : 1,
                  borderColor: isVoided ? 'rgba(239, 68, 68, 0.35)' : undefined,
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  className="invoice-card__header"
                  onClick={() => setExpanded(expanded === inv._id ? null : inv._id)}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: isVoided ? 'var(--color-danger)' : 'var(--color-accent)',
                          fontSize: '0.95rem',
                          fontFamily: 'monospace',
                        }}
                      >
                        {inv.invoiceNumber || 'INV-####'}
                      </span>

                      {/* Customer Name or Inline Edit Field */}
                      {isEditingThis ? (
                        <div
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEditCustomer(e, inv._id);
                              if (e.key === 'Escape') cancelEditCustomer(e);
                            }}
                            className="input-field"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.85rem', width: '150px' }}
                            autoFocus
                            disabled={savingName}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={(e) => saveEditCustomer(e, inv._id)}
                            disabled={savingName}
                          >
                            {savingName ? '...' : '✓'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                            onClick={cancelEditCustomer}
                            disabled={savingName}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <strong style={{ fontSize: '0.95rem' }}>{inv.customerName || 'Walk-in Customer'}</strong>
                          <button
                            type="button"
                            onClick={(e) => startEditCustomer(e, inv)}
                            title="Edit customer name"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--color-text-muted)',
                              cursor: 'pointer',
                              padding: '0 0.2rem',
                              fontSize: '0.75rem',
                              opacity: 0.6,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.6)}
                          >
                            ✏️
                          </button>
                        </span>
                      )}

                      {isVoided && (
                        <span
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: 'var(--color-danger)',
                            padding: '0.15rem 0.55rem',
                            borderRadius: '999px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          Voided
                        </span>
                      )}
                    </div>

                    <span className="invoice-date" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {inv.createdAt
                        ? new Date(inv.createdAt).toLocaleString('en-LK', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })
                        : 'Unknown date'}
                    </span>
                  </div>

                  <div className="invoice-card__meta" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span
                      className="invoice-total-badge"
                      style={{
                        textDecoration: isVoided ? 'line-through' : 'none',
                        color: isVoided ? 'var(--color-text-muted)' : 'var(--color-success)',
                        fontWeight: 700,
                      }}
                    >
                      LKR {Number(totalAmount).toLocaleString()}
                    </span>
                    <span className="invoice-by" style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      by {inv.createdBy?.name || 'Staff'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {expanded === inv._id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Expandable line items */}
                {expanded === inv._id && (
                  <div className="invoice-card__items" style={{ padding: '1rem 1.25rem' }}>
                    {inv.notes && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                        Notes: {inv.notes}
                      </p>
                    )}

                    <table className="data-table data-table--compact">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th style={{ textAlign: 'right' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(inv.items || []).map((item, i) => {
                          const linePrice = item.unitPrice != null ? item.unitPrice : 0;
                          const lineTot = item.lineTotal != null
                            ? item.lineTotal
                            : (item.subtotal != null ? item.subtotal : (item.total || linePrice * item.quantity));

                          return (
                            <tr key={i}>
                              <td>{item.productName || item.name || 'Item'}</td>
                              <td>
                                {item.quantity}{' '}
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                  {item.unit || ''}
                                </span>
                              </td>
                              <td>LKR {Number(linePrice).toLocaleString()}</td>
                              <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                LKR {Number(lineTot).toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'right', fontWeight: 700 }}>
                            Invoice Total:
                          </td>
                          <td
                            style={{
                              textAlign: 'right',
                              fontWeight: 700,
                              color: isVoided ? 'var(--color-danger)' : 'var(--color-success)',
                            }}
                          >
                            LKR {Number(totalAmount).toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    {/* Void button action row (Owner only) */}
                    {!isVoided && (
                      <div
                        style={{
                          marginTop: '1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid var(--color-border)',
                        }}
                      >
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          {(inv.items || []).length} line item(s)
                        </span>
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
