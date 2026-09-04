// src/pages/NewInvoicePage.jsx
// Create a new sales invoice — accessible to both Owner and Staff.
// Member 3 owns this page.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/inventoryApi';
import { createInvoice } from '../api/invoiceApi';
import ProductPicker from '../components/invoice/ProductPicker';
import CartTable from '../components/invoice/CartTable';
import InvoiceConfirmation from '../components/invoice/InvoiceConfirmation';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';

const NewInvoicePage = () => {
  const navigate = useNavigate();

  // State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [inlineMsg, setInlineMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [cartItems, setCartItems] = useState([]);

  // Result state
  const [createdInvoice, setCreatedInvoice] = useState(null);

  // Load products for dropdown
  const loadProductList = () => {
    setLoadingProducts(true);
    getProducts()
      .then((res) => {
        setProducts(res.data.data || []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load inventory products');
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  };

  useEffect(() => {
    loadProductList();
  }, []);

  /**
   * Add to Cart handler with duplicate merging:
   * If product is already in cart, increment quantity rather than creating duplicate row.
   */
  const handleAddToCart = (itemToAdd) => {
    setError(null);
    setInlineMsg(null);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (it) => it.productId === itemToAdd.productId
      );

      if (existingIndex > -1) {
        // Product exists: merge and update quantity
        const existing = prevItems[existingIndex];
        const combinedQty = Math.round((existing.quantity + itemToAdd.quantity) * 100) / 100;

        // Verify combined quantity does not exceed product's available inventory
        if (combinedQty > itemToAdd.availableStock) {
          setError(
            `Cannot add ${itemToAdd.quantity} ${itemToAdd.unit || ''} more "${itemToAdd.productName}". Available stock is ${itemToAdd.availableStock} ${itemToAdd.unit || ''}, and you already have ${existing.quantity} in cart.`
          );
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...existing,
          quantity: combinedQty,
        };
        setInlineMsg(`Updated "${itemToAdd.productName}" quantity to ${combinedQty} ${itemToAdd.unit || ''}`);
        return updated;
      }

      // New product: add row to cart
      setInlineMsg(`Added ${itemToAdd.quantity} ${itemToAdd.unit || ''} of "${itemToAdd.productName}" to cart`);
      return [...prevItems, itemToAdd];
    });
  };

  /**
   * Remove item from cart
   */
  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((it) => it.productId !== productId));
    setInlineMsg(null);
  };

  /**
   * Submit invoice creation
   */
  const handleSubmitInvoice = async (e) => {
    e.preventDefault();
    setError(null);
    setInlineMsg(null);

    if (cartItems.length === 0) {
      setError('Please add at least one product to the cart before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName: customerName.trim() || 'Walk-in Customer',
        items: cartItems.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
        })),
      };

      const res = await createInvoice(payload);
      const savedInvoice = res.data.data;

      // On success: show confirmation, clear cart, refresh product stock
      setCreatedInvoice(savedInvoice);
      setCartItems([]);
      setCustomerName('');
      loadProductList(); // update local stock numbers
    } catch (err) {
      // On failure: show specific server error, PRESERVE cart contents
      setError(
        err.response?.data?.message || 'Failed to create invoice. Please check stock levels.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Reset confirmation to create another invoice
   */
  const handleReset = () => {
    setCreatedInvoice(null);
    setCartItems([]);
    setCustomerName('');
    setError(null);
    setInlineMsg(null);
  };

  if (loadingProducts) {
    return <Loader message="Loading shop inventory..." />;
  }

  // If invoice was created, display confirmation view
  if (createdInvoice) {
    return (
      <div className="page">
        <InvoiceConfirmation invoice={createdInvoice} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Create New Invoice</h1>
          <p className="page-subtitle">Perera Stores Point of Sale (POS)</p>
        </div>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate('/invoices')}
        >
          View Invoice History
        </button>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {inlineMsg && (
        <div
          style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid var(--color-accent)',
            borderRadius: 'var(--radius)',
            padding: '0.6rem 1rem',
            fontSize: '0.85rem',
            color: 'var(--color-accent)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>ℹ️ {inlineMsg}</span>
          <button
            type="button"
            onClick={() => setInlineMsg(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-accent)',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmitInvoice} className="invoice-form">
        {/* Customer Name input */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
          }}
        >
          <div className="form-group">
            <label htmlFor="customer-name-input">Customer Name (Optional)</label>
            <input
              id="customer-name-input"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Walk-in Customer"
              maxLength={100}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Leave blank to record as "Walk-in Customer"
            </span>
          </div>
        </div>

        {/* Product Picker */}
        <ProductPicker
          products={products}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
        />

        {/* Cart Table */}
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
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Cart Items</h2>
          <CartTable items={cartItems} onRemoveItem={handleRemoveFromCart} />
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setCartItems([])}
            disabled={cartItems.length === 0 || submitting}
          >
            Clear Cart
          </button>
          <button
            id="create-invoice-btn"
            type="submit"
            className="btn btn-primary"
            disabled={cartItems.length === 0 || submitting}
            style={{ minWidth: '160px' }}
          >
            {submitting ? 'Creating Invoice...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewInvoicePage;
