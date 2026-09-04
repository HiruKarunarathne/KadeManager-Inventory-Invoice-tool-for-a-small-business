// ═══════════════════════════════════════════════════════
//  INVOICE COMPONENTS  —  Member 3 owns this folder
// ═══════════════════════════════════════════════════════

/**
 * InvoiceDetailModal — Shows full invoice details in a modal/drawer.
 * TODO Member 3: Implement this component and import it into InvoiceHistoryPage.jsx
 *
 * Props:
 *   @param {object|null} invoice  - invoice object to display
 *   @param {boolean}     isOpen   - controls visibility
 *   @param {Function}    onClose  - called on close
 */
const InvoiceDetailModal = ({ invoice, isOpen, onClose }) => {
  if (!isOpen || !invoice) return null;

  return (
    <div style={{ padding: '1rem', color: '#94a3b8' }}>
      🚧 InvoiceDetailModal — Member 3, implement me!
      <pre style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
        {JSON.stringify(invoice, null, 2)}
      </pre>
    </div>
  );
};

export default InvoiceDetailModal;
