// src/components/invoice/ProductPicker.jsx
// Allows selecting a product and quantity with live stock checks.
// Member 3 owns this component.

import { useState } from 'react';

const ProductPicker = ({ products, cartItems, onAddToCart }) => {
  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState('');

  const selectedProduct = products.find((p) => p._id === selectedId);

  // Check how many of this product are already in the cart
  const inCartItem = cartItems.find((item) => item.productId === selectedId);
  const qtyInCart = inCartItem ? inCartItem.quantity : 0;
  const availableStock = selectedProduct ? selectedProduct.quantity - qtyInCart : 0;

  const handleProductChange = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    setValidationError('');
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    const num = Number(val);
    setQuantity(val);

    if (!val || num <= 0 || !Number.isInteger(num)) {
      setValidationError('Please enter a valid whole number (at least 1)');
      return;
    }

    if (selectedProduct && num > availableStock) {
      setValidationError(
        `Only ${availableStock} ${selectedProduct.unit} available (${qtyInCart} already in cart)`
      );
      return;
    }

    setValidationError('');
  };

  const handleAdd = (e) => {
    e.preventDefault();

    const num = Number(quantity);
    if (!selectedProduct) {
      setValidationError('Please select a product');
      return;
    }

    if (!num || num <= 0 || !Number.isInteger(num)) {
      setValidationError('Quantity must be a positive whole number');
      return;
    }

    if (num > availableStock) {
      setValidationError(
        `Cannot add ${num}. Only ${availableStock} ${selectedProduct.unit} remaining in stock.`
      );
      return;
    }

    onAddToCart({
      productId: selectedProduct._id,
      productName: selectedProduct.name,
      unitPrice: selectedProduct.unitPrice,
      unit: selectedProduct.unit,
      availableStock: selectedProduct.quantity,
      quantity: num,
    });

    // Reset picker
    setSelectedId('');
    setQuantity(1);
    setValidationError('');
  };

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Select Products</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'flex-start',
        }}
      >
        <div className="form-group">
          <label htmlFor="product-select">Product</label>
          <select
            id="product-select"
            value={selectedId}
            onChange={handleProductChange}
          >
            <option value="">— Choose a product —</option>
            {products.map((p) => {
              const inCart = cartItems.find((i) => i.productId === p._id);
              const remaining = p.quantity - (inCart ? inCart.quantity : 0);
              const isOutOfStock = remaining <= 0;

              return (
                <option key={p._id} value={p._id} disabled={isOutOfStock}>
                  {p.name} — LKR {p.unitPrice.toLocaleString()}/{p.unit}{' '}
                  {isOutOfStock ? '(Out of stock)' : `(${remaining} left)`}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="product-qty">Quantity</label>
          <input
            id="product-qty"
            type="number"
            min="1"
            max={selectedProduct ? availableStock : 9999}
            value={quantity}
            onChange={handleQuantityChange}
            disabled={!selectedProduct || availableStock <= 0}
            placeholder="1"
          />
        </div>

        <div style={{ alignSelf: 'flex-end', paddingTop: '0.4rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={
              !selectedProduct ||
              availableStock <= 0 ||
              Boolean(validationError) ||
              Number(quantity) <= 0
            }
            style={{ width: '100%', height: '42px' }}
          >
            + Add to Cart
          </button>
        </div>
      </div>

      {selectedProduct && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            paddingTop: '0.25rem',
          }}
        >
          <span>
            Unit Price: <strong style={{ color: 'var(--color-text)' }}>LKR {selectedProduct.unitPrice.toLocaleString()}</strong>
          </span>
          <span>
            Available in Shop:{' '}
            <strong
              style={{
                color:
                  availableStock <= (selectedProduct.lowStockThreshold || 5)
                    ? 'var(--color-warning)'
                    : 'var(--color-success)',
              }}
            >
              {availableStock} {selectedProduct.unit}
            </strong>
          </span>
        </div>
      )}

      {validationError && (
        <div
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-danger)',
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius)',
          }}
        >
          ⚠️ {validationError}
        </div>
      )}
    </div>
  );
};

export default ProductPicker;
