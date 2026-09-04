// src/components/invoice/ProductPicker.jsx
// Allows selecting a product and quantity with live stock checks.
// Handles both 'measured' (weight/volume with decimals) and 'countable' (whole numbers).
// Member 3 owns this component.

import { useState } from 'react';

const ProductPicker = ({ products, cartItems, onAddToCart }) => {
  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [validationError, setValidationError] = useState('');

  const selectedProduct = products.find((p) => p._id === selectedId);
  const isMeasured = selectedProduct?.unitType === 'measured';

  // Check how many of this product are already in the cart
  const inCartItem = cartItems.find((item) => item.productId === selectedId);
  const qtyInCart = inCartItem ? inCartItem.quantity : 0;
  const availableStock = selectedProduct
    ? Math.max(0, Math.round((selectedProduct.quantity - qtyInCart) * 100) / 100)
    : 0;

  const handleProductChange = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    setValidationError('');
    setQuantity(id ? '1' : '');
  };

  const validateQuantityValue = (val, product) => {
    if (!product) return 'Please select a product';
    if (!val || val.trim() === '') return 'Please enter a quantity';

    const num = Number(val);
    if (isNaN(num) || num <= 0) {
      return 'Quantity must be greater than 0';
    }

    if (product.unitType === 'countable') {
      if (!Number.isInteger(num)) {
        return `Quantity for "${product.name}" must be a whole number`;
      }
    } else {
      // Measured goods: minimum 0.01
      const rounded = Math.round(num * 100) / 100;
      if (rounded <= 0) {
        return `Quantity for "${product.name}" must be at least 0.01 ${product.unit}`;
      }
    }

    if (num > availableStock) {
      return `Only ${availableStock} ${product.unit} available (${qtyInCart} already in cart)`;
    }

    return '';
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    setQuantity(val);

    if (selectedProduct) {
      const err = validateQuantityValue(val, selectedProduct);
      setValidationError(err);
    }
  };

  // Prevent typing decimal point for countable products
  const handleKeyDown = (e) => {
    if (!isMeasured && (e.key === '.' || e.key === ',' || e.key === 'e' || e.key === 'E')) {
      e.preventDefault();
      setValidationError(`Quantity for "${selectedProduct?.name || 'this item'}" must be a whole number`);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      setValidationError('Please select a product');
      return;
    }

    const err = validateQuantityValue(quantity, selectedProduct);
    if (err) {
      setValidationError(err);
      return;
    }

    const rawNum = Number(quantity);
    const finalQty = isMeasured
      ? Math.round(rawNum * 100) / 100
      : rawNum;

    onAddToCart({
      productId: selectedProduct._id,
      productName: selectedProduct.name,
      unitPrice: selectedProduct.unitPrice,
      unit: selectedProduct.unit,
      unitType: selectedProduct.unitType || 'countable',
      availableStock: selectedProduct.quantity,
      quantity: finalQty,
    });

    // Reset picker
    setSelectedId('');
    setQuantity('');
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Select Products</h3>
        {selectedProduct && (
          <span
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              background: isMeasured ? 'rgba(56, 189, 248, 0.15)' : 'var(--color-surface-2)',
              color: isMeasured ? 'var(--color-accent)' : 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
            }}
          >
            {isMeasured ? '⚖️ Measured (by weight/volume)' : '📦 Countable (whole units)'}
          </span>
        )}
      </div>

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
              const remaining = Math.round((p.quantity - (inCart ? inCart.quantity : 0)) * 100) / 100;
              const isOutOfStock = remaining <= 0;

              return (
                <option key={p._id} value={p._id} disabled={isOutOfStock}>
                  {p.name} — LKR {p.unitPrice.toLocaleString()} per {p.unit}{' '}
                  {isOutOfStock ? '(Out of stock)' : `(${remaining} ${p.unit} left)`}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="product-qty">
            Quantity {selectedProduct ? `(${selectedProduct.unit})` : ''}
          </label>
          <input
            id="product-qty"
            type="number"
            min={isMeasured ? '0.01' : '1'}
            step={isMeasured ? '0.01' : '1'}
            max={selectedProduct ? availableStock : 9999}
            value={quantity}
            onChange={handleQuantityChange}
            onKeyDown={handleKeyDown}
            disabled={!selectedProduct || availableStock <= 0}
            placeholder={isMeasured ? 'e.g. 0.5' : 'e.g. 1'}
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
              !quantity ||
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
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span>
            Unit Price:{' '}
            <strong style={{ color: 'var(--color-text)' }}>
              LKR {selectedProduct.unitPrice.toLocaleString()} per {selectedProduct.unit}
            </strong>
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
