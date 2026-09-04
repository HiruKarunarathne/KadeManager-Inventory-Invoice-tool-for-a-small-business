// src/components/invoice/VoidInvoiceButton.jsx
// Owner-only button to void an invoice and restore stock to inventory.
// Member 3 owns this component.

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { voidInvoice } from '../../api/invoiceApi';

const VoidInvoiceButton = ({ invoiceId, invoiceStatus, onVoidSuccess, onVoidError }) => {
  const { isOwner } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // RBAC check: Staff role must NOT even see this action
  if (!isOwner()) {
    return null;
  }

  // If invoice is already voided, render status badge
  if (invoiceStatus === 'voided') {
    return (
      <span
        style={{
          background: 'rgba(239, 68, 68, 0.15)',
          color: 'var(--color-danger)',
          padding: '0.25rem 0.6rem',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        Voided
      </span>
    );
  }

  const handleVoid = async () => {
    setLoading(true);
    try {
      const res = await voidInvoice(invoiceId);
      setShowConfirm(false);
      if (onVoidSuccess) {
        onVoidSuccess(res.data.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to void invoice';
      if (onVoidError) {
        onVoidError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-warning)' }}>
          Restore stock & void?
        </span>
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={handleVoid}
          disabled={loading}
        >
          {loading ? 'Voiding...' : 'Yes, Void'}
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => setShowConfirm(false)}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="btn btn-sm btn-outline"
      style={{
        borderColor: 'var(--color-danger)',
        color: 'var(--color-danger)',
        fontSize: '0.8rem',
      }}
      onClick={() => setShowConfirm(true)}
    >
      Void Invoice
    </button>
  );
};

export default VoidInvoiceButton;
