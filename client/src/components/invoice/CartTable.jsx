// src/components/invoice/CartTable.jsx
// Displays items currently added to the invoice cart.
// Shows unambiguous quantity with units (e.g. "0.5 kg", "2 pcs") and precise currency totals.
// Member 3 owns this component.

const formatCurrency = (amount) => {
  const num = Number(amount || 0);
  return num.toLocaleString('en-LK', {
    minimumFractionDigits: num % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  });
};

const CartTable = ({ items, onRemoveItem }) => {
  const grandTotal = Math.round(
    items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) * 100
  ) / 100;

  if (items.length === 0) {
    return (
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px dashed var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
        }}
      >
        <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🛒</p>
        <p>Your cart is empty. Select products above to build this invoice.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius)' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th style={{ textAlign: 'right' }}>Rate (LKR)</th>
              <th style={{ textAlign: 'center' }}>Quantity</th>
              <th style={{ textAlign: 'right' }}>Line Total (LKR)</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const lineTotal = Math.round(item.unitPrice * item.quantity * 100) / 100;
              const isMeasured = item.unitType === 'measured';

              return (
                <tr key={item.productId}>
                  <td>
                    <strong>{item.productName}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                      {isMeasured ? '⚖️ Measured by weight/volume' : '📦 Whole unit package'}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {formatCurrency(item.unitPrice)}
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                      per {item.unit || 'unit'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        background: isMeasured ? 'rgba(56, 189, 248, 0.15)' : 'var(--color-surface-2)',
                        color: isMeasured ? 'var(--color-accent)' : 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        display: 'inline-block',
                      }}
                    >
                      {item.quantity} {item.unit || ''}
                    </span>
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      fontWeight: 600,
                      color: 'var(--color-accent)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatCurrency(lineTotal)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => onRemoveItem(item.productId)}
                      title="Remove item"
                      aria-label={`Remove ${item.productName}`}
                      style={{ padding: '0.2rem 0.5rem' }}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="invoice-total">
        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginRight: '1rem' }}>
          Grand Total:
        </span>
        <span>LKR {formatCurrency(grandTotal)}</span>
      </div>
    </div>
  );
};

export default CartTable;
