// src/components/invoice/InvoiceConfirmation.jsx
// Confirmation screen shown upon successful invoice creation.
// Member 3 owns this component.

import { useNavigate } from 'react-router-dom';

const InvoiceConfirmation = ({ invoice, onReset }) => {
  const navigate = useNavigate();

  if (!invoice) return null;

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-success)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '650px',
        margin: '0 auto',
        boxShadow: 'var(--shadow)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', lineHeight: 1, marginBottom: '0.5rem' }}>✅</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)' }}>
          Invoice Created Successfully!
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Perera Stores — Sale Recorded
        </p>
      </div>

      <div
        style={{
          background: 'var(--color-surface-2)',
          borderRadius: 'var(--radius)',
          padding: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          border: '1px solid var(--color-border)',
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Invoice Number
          </span>
          <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-accent)' }}>
            {invoice.invoiceNumber || 'INV-####'}
          </p>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Customer
          </span>
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>
            {invoice.customerName || 'Walk-in Customer'}
          </p>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Date & Time
          </span>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            {new Date(invoice.createdAt || Date.now()).toLocaleString('en-LK', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Billed By
          </span>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            {invoice.createdBy?.name || 'Staff Member'}
          </p>
        </div>
      </div>

      {invoice.items && invoice.items.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table data-table--compact">
            <thead>
              <tr>
                <th>Item</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Price (LKR)</th>
                <th style={{ textAlign: 'right' }}>Total (LKR)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((it, idx) => (
                <tr key={idx}>
                  <td>{it.productName}</td>
                  <td style={{ textAlign: 'center' }}>{it.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{it.unitPrice.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                    {(it.lineTotal || it.subtotal || it.unitPrice * it.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: 'var(--radius)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Total Amount Paid:</span>
        <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-success)' }}>
          LKR {Number(invoice.total).toLocaleString()}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-primary" onClick={onReset}>
          + Create Another Invoice
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate('/invoices')}
        >
          View Invoice History
        </button>
      </div>
    </div>
  );
};

export default InvoiceConfirmation;
