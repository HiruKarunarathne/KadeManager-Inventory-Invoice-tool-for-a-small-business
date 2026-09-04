// src/components/invoice/CartTable.jsx
// Displays items currently added to the invoice cart.
// Member 3 owns this component.

const CartTable = ({ items, onRemoveItem }) => {
  const grandTotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

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
              <th style={{ textAlign: 'right' }}>Price (LKR)</th>
              <th style={{ textAlign: 'center' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Total (LKR)</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const lineTotal = item.unitPrice * item.quantity;
              return (
                <tr key={item.productId}>
                  <td>
                    <strong>{item.productName}</strong>
                    {item.unit && (
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.75rem',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        Unit: {item.unit}
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {item.unitPrice.toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        background: 'var(--color-surface-2)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontWeight: 600,
                      }}
                    >
                      {item.quantity}
                    </span>
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      fontWeight: 600,
                      color: 'var(--color-accent)',
                    }}
                  >
                    {lineTotal.toLocaleString()}
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
        <span>LKR {grandTotal.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default CartTable;
