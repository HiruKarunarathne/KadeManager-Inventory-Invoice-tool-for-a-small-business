// ═══════════════════════════════════════════════════════
//  INVENTORY COMPONENTS  —  Member 2 owns this folder
// ═══════════════════════════════════════════════════════

/**
 * ProductFormModal — Modal for adding/editing a product.
 * TODO Member 2: Implement this component and import it into InventoryPage.jsx
 *
 * Props:
 *   @param {object|null} product  - null for add, product object for edit
 *   @param {boolean}     isOpen   - controls modal visibility
 *   @param {Function}    onClose  - called when modal closes
 *   @param {Function}    onSaved  - called with the saved product after create/update
 */
const ProductFormModal = ({ product, isOpen, onClose, onSaved }) => {
  // TODO: implement form with fields: name, category, unit, quantity, unitPrice, lowStockThreshold
  if (!isOpen) return null;

  return (
    <div style={{ padding: '1rem', color: '#94a3b8' }}>
      🚧 ProductFormModal — Member 2, implement me!
    </div>
  );
};

export default ProductFormModal;
